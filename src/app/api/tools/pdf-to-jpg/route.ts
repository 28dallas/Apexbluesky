import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  // Rendering PDFs to raster images on the server usually requires a canvas implementation
  // (native deps) or an external service. On Vercel, prefer the in-browser PDF.js converter.
  return NextResponse.json(
    { error: 'Server-side PDF to JPG is not supported on Vercel. Use the browser-based converter.' },
    { status: 501 },
  );
}

