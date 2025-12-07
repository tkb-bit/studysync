// backend/src/api/ingest/route.js

import pdf from "pdf-extraction";

export default (chroma, runCloudflareAI) => async (req, res) => {
  if (req.method === 'POST') {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // --- 0. Ensure Chroma is reachable; otherwise skip vector ingestion gracefully ---
      let chromaHealthy = false;
      try {
        await chroma?.heartbeat();
        chromaHealthy = true;
      } catch (hbErr) {
        console.warn("Chroma unavailable, skipping ingestion:", hbErr?.message || hbErr);
      }

      // --- 1. Check File Type ---
      if (file.mimetype !== 'application/pdf') {
        // If not a PDF, skip ingestion and return success
        return res.status(200).json({ 
          success: true, 
          message: `Skipped ingestion for non-PDF file: ${file.originalname}` 
        });
      }

      // --- 2. Load and Parse PDF Document ---
      const buffer = file.buffer;
      const extractedData = await pdf(buffer);
      const documentText = extractedData.text;

      // --- 3. If Chroma is healthy, get or create collection; otherwise short-circuit success ---
      if (!chromaHealthy) {
        return res.status(200).json({
          success: true,
          message: `Ingestion skipped because Chroma vector store is unavailable. Stored file ${file.originalname} without vectors.`
        });
      }

      const collection = await chroma.getOrCreateCollection({
        name: "studysync_materials",
        metadata: { "hnsw:space": "cosine" },
      });

      // --- 4. Split Text and Generate Embeddings ---
      const chunks = documentText.split("\n\n").filter(chunk => chunk.trim() !== "");
      let idCounter = Date.now();

      for (const chunk of chunks) {
        const embeddingResponse = await runCloudflareAI('@cf/baai/bge-base-en-v1.5', { text: [chunk] });
        const embedding = embeddingResponse.result.data[0];

        // --- 5. Store in Chroma DB ---
        await collection.add({
          ids: [`${file.originalname}-${idCounter++}`],
          embeddings: [embedding],
          metadatas: [{ source: file.originalname, content: chunk }],
          documents: [chunk],
        });
      }

      return res.status(200).json({ success: true, message: `Successfully ingested ${file.originalname}` });

    } catch (error) {
      console.error("Ingestion Error Details:", error.message, error.stack);
      return res.status(500).json({ error: "Failed to ingest document", details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
