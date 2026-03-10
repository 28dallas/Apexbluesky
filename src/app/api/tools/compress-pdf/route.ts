import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Upload a PDF file as "file".' }, { status: 400 });
    }
    const name = file.name || '';
    if (!name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Not a PDF file.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const out = await pdf.save({ useObjectStreams: true });
    const body = Buffer.from(out);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="compressed.pdf"',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message || 'Compression failed.' }, { status: 500 });
  }
}
