import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if backend is deployed
    const backendUrl = process.env.BACKEND_URL;
    console.log('Backend URL from env:', backendUrl);
    if (!backendUrl) {
      return NextResponse.json({ 
        error: 'Backend not deployed. Please deploy the backend server or contact administrator.' 
      }, { status: 503 });
    }

    // Forward to backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('category', category);

    const fullUrl = `${backendUrl}/upload-file`;
    console.log('Fetching backend URL:', fullUrl);
    const response = await fetch(fullUrl, {
      method: 'POST',
      body: backendFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    // Return upload result; ingestion is handled inside the backend upload route
    return NextResponse.json({ ...result });
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json({ error: 'Upload failed - backend connection issue' }, { status: 500 });
  }
}
