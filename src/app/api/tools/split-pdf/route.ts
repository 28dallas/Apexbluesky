import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';

function parseRange(range: string | null, maxPages: number): number[] {
  if (!range) return [0];
  const trimmed = range.trim();
  if (!trimmed) return [0];

  // 1-based pages in user input.
  // Supports "3" or "1-5" or "1,3,5-7".
  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
  const pages = new Set<number>();
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = Math.max(1, Number(m[1]));
      const b = Math.min(maxPages, Number(m[2]));
      for (let p = Math.min(a, b); p <= Math.max(a, b); p++) pages.add(p - 1);
      continue;
    }
    const n = Number(part);
    if (Number.isFinite(n) && n >= 1 && n <= maxPages) pages.add(n - 1);
  }
  const arr = Array.from(pages).sort((x, y) => x - y);
  return arr.length ? arr : [0];
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const range = (form.get('range') as string | null) ?? null;
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Upload a PDF file as "file".' }, { status: 400 });
    }

    const name = file.name || '';
    if (!name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Not a PDF file.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const indices = parseRange(range, pdf.getPageCount());

    const outPdf = await PDFDocument.create();
    const copied = await outPdf.copyPages(pdf, indices);
    copied.forEach((p) => outPdf.addPage(p));
    const out = await outPdf.save({ useObjectStreams: true });
    const body = Buffer.from(out);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="split.pdf"',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message || 'Split failed.' }, { status: 500 });
  }
}
