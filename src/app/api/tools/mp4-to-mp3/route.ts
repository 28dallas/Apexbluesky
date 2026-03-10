import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  // Vercel serverless functions don't include an ffmpeg binary, and native modules are not available.
  // Use the in-browser ffmpeg.wasm implementation instead.
  return NextResponse.json(
    { error: 'Server-side MP4 to MP3 is not supported on Vercel. Use the browser-based converter.' },
    { status: 501 },
  );
}

