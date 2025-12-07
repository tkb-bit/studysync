// backend/src/api/upload-file/route.js

import clientPromise from "../../lib/mongodb.js";

import pdf from "pdf-extraction";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from .env - ONLY for storage

cloudinary.config({

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,

  secure: true

});



// Helper function for Cloudflare AI API

async function runCloudflareAIJson(model, inputs) {

  const AI_GATEWAY = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run`;

  const response = await fetch(`${AI_GATEWAY}/${model}`, {

    method: "POST",

    headers: {

      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,

      "Content-Type": "application/json"

    },

    body: JSON.stringify(inputs),

  });

  const jsonResponse = await response.json();

  if (!jsonResponse.success) {

    console.error("Error from Cloudflare AI:", jsonResponse.errors);

    throw new Error(`Cloudflare AI API call failed: ${jsonResponse.errors?.[0]?.message || 'Unknown error'}`);

  }

  return jsonResponse;

}



export default (chroma) => async (req, res) => {

  if (req.method === 'POST') {

    try {

      const file = req.file;

      const category = req.body.category || "general";
      const warnings = [];



      if (!file) {

        return res.status(400).json({ error: "No file provided" });

      }



      const buffer = file.buffer;
    let documentText = "";
    let fileURL = "";

    // Infer mimetype if not provided by multer
    if (!file.mimetype) {
      const extension = file.originalname.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        file.mimetype = 'application/pdf';
      } else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
        file.mimetype = `image/${extension}`;
      } else {
        file.mimetype = 'application/octet-stream';
      }
    }

    // Step 1: Upload the file to Cloudinary for storage to get a reliable URL (skip gracefully if creds missing)
    const hasCloudinaryCreds = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    if (hasCloudinaryCreds) {
      try {
        const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

        const uploadOptions = {

          resource_type: resourceType,

          folder: "studysync_materials",

          use_filename: true,

          unique_filename: false,

        };

        const uploadResult = await new Promise((resolve, reject) => {

          cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {

            if (error) return reject(error); resolve(result);

          }).end(buffer);

        });

        fileURL = uploadResult.secure_url;

        console.log("File successfully stored in Cloudinary at:", fileURL);
      } catch (cloudErr) {
        warnings.push(`Cloudinary upload skipped: ${cloudErr.message}`);
      }
    } else {
      warnings.push('Cloudinary credentials missing; stored file in-memory only.');
    }



    // Step 2: Extract text from the file for the AI

    if (file.mimetype === "application/pdf") {
      try {
        const extractedData = await pdf(buffer);

        documentText = extractedData.text;

        if (!documentText?.trim()) {
          ingestWarning = 'No text detected in PDF (possibly image-only); skipping vector storage';
        }
      } catch (pdfErr) {
        warnings.push(`PDF text extraction failed: ${pdfErr.message}`);
        ingestWarning = 'PDF looks image-only or unreadable; skipping vector storage';
        documentText = '';
      }

    } else if (file.mimetype.startsWith("image/")) {

      console.log("Extracting text from image using Cloudflare AI Vision...");
     

      // ================== FINAL OCR FIX: USING CLOUDFLARE AI ==================

      // This method is confirmed to be on the free tier and works reliably.

      const imageBase64 = buffer.toString('base64');

      const extractionPrompt = `This is an image of a document. Perform OCR and extract all text from this image. Be as precise as possible.`;
     
      try {
        const visionResponse = await runCloudflareAIJson('@cf/llava-hf/llava-1.5-7b-hf', { prompt: extractionPrompt, image: imageBase64 });
     
        documentText = visionResponse.result.response;

        console.log("Successfully extracted text with Cloudflare AI:", documentText);
      } catch (visionErr) {
        warnings.push(`Image OCR skipped: ${visionErr.message}`);
      }

      // =====================================================================

    }



    // Step 3: Save metadata to MongoDB (skip gracefully if env missing)
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || process.env.MONGODB_DB || 'studysync';
    if (mongoUri) {
      try {
        await clientPromise.then(client => client.db(dbName).collection("materials").insertOne({
            fileName: file.originalname, fileURL, contentType: file.mimetype, size: file.size, uploadDate: new Date(), category, aiDescription: documentText
        }));

        console.log("Successfully saved metadata to MongoDB.");
      } catch (mongoErr) {
        warnings.push(`Mongo save skipped: ${mongoErr.message}`);
      }
    } else {
      warnings.push('MONGODB_URI missing; metadata not persisted.');
    }



    // Step 4: Save extracted text to Pinecone for searching
    let ingested = false;
    let ingestWarning = null;
    if (documentText?.trim()) {

      const pineconeApiKey = process.env.PINECONE_API_KEY;

      const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

      if (!pineconeApiKey || !pineconeIndexName) {

        ingestWarning = 'PINECONE_API_KEY or PINECONE_INDEX_NAME not set, skipping vector storage';

      } else {
        try {

          const { Pinecone } = await import('@pinecone-database/pinecone');

          const pinecone = new Pinecone({ apiKey: pineconeApiKey });

          const index = pinecone.Index(pineconeIndexName);

          const chunks = documentText.split("\n").filter(chunk => chunk.trim() !== ""); // Split by line for OCR text

          if (chunks.length > 0) {

            const embeddingResponse = await runCloudflareAIJson('@cf/baai/bge-base-en-v1.5', { text: chunks, input: chunks });

            console.log('Embedding response sample:', JSON.stringify(embeddingResponse?.result?.data?.[0] || embeddingResponse?.result || embeddingResponse).slice(0, 200));

            const rawEmbeddings = (embeddingResponse.result?.data || []).map(d => {
              if (Array.isArray(d)) return d;
              return d.data || d.embedding || d.values || [];
            });

            const targetDim = Number(process.env.PINECONE_DIM) || 1024;

            const normalizeEmbedding = (vec) => {
              if (!Array.isArray(vec)) return null;
              if (vec.length === targetDim) return vec;
              if (vec.length > targetDim) return vec.slice(0, targetDim);
              return vec.concat(Array(targetDim - vec.length).fill(0));
            };

            const embeddings = rawEmbeddings.map(normalizeEmbedding).filter(Boolean);

            // Drop any chunks where we did not get an embedding back
            if (embeddings.some(e => !e || e.length === 0)) {
              ingestWarning = 'Embedding service returned empty vectors; skipped those chunks';
            }

            const ids = chunks.map((_, i) => `${file.originalname}-${Date.now() + i}`);

            const metadatas = chunks.map(chunk => ({ source: file.originalname, fileURL, category: category, text: chunk }));

            const paired = chunks.map((chunk, i) => ({
              id: ids[i],
              embedding: embeddings[i],
              metadata: metadatas[i]
            })).filter(p => Array.isArray(p.embedding) && p.embedding.length > 0);

            if (paired.length === 0) {
              ingestWarning = 'No embeddings returned; skipped vector storage';
            } else {
              const records = paired.map(p => ({
                id: p.id,
                values: p.embedding,
                metadata: p.metadata
              }));

              await index.upsert(records);

              console.log("Successfully saved text chunks to Pinecone.");

              ingested = true;
            }
          }
        } catch (pineconeErr) {
          ingestWarning = pineconeErr.message;
        }

      }

    }




    return res.status(200).json({ success: true, message: `Processed ${file.originalname}`, fileURL, ingested, ingestWarning, warnings });

  } catch (error) {

    console.error("Upload Error:", error);

    return res.status(500).json({ error: "Failed to ingest document", details: error.message });

  }

  } else {

    res.status(405).json({ error: 'Method not allowed' });

  }

}



