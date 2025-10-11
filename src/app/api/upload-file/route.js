import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('category', category);

    const response = await fetch(`${backendUrl}/upload-file`, {
      method: 'POST',
      body: backendFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
