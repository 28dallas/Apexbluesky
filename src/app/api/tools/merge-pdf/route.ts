import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);
    if (files.length < 2) {
      return NextResponse.json({ error: 'At least 2 PDF files are required.' }, { status: 400 });
    }

    const merged = await PDFDocument.create();
    for (const file of files) {
      const name = file.name || '';
      if (!name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json({ error: `Not a PDF file: ${name || '(unknown)'}` }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const out = await merged.save({ useObjectStreams: true });
    const body = Buffer.from(out);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message || 'Merge failed.' }, { status: 500 });
  }
}
