import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type PdfTextItem = { str?: string };
type PdfTextContent = { items?: PdfTextItem[] };
type PdfPageProxy = { getTextContent: () => Promise<PdfTextContent> };
type PdfDocumentProxy = { numPages: number; getPage: (pageNumber: number) => Promise<PdfPageProxy> };
type PdfLoadingTask = { promise: Promise<PdfDocumentProxy> };
type PdfJsModule = { getDocument: (src: { data: Uint8Array; disableWorker: boolean }) => PdfLoadingTask };

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

    const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as unknown as PdfJsModule;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data: bytes, disableWorker: true }).promise;

    const pageTexts: string[] = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const strings = (content.items || []).map((it) => (it?.str ?? '').toString()).filter(Boolean);
      const text = strings.join(' ').replace(/\s+/g, ' ').trim();
      if (text) pageTexts.push(text);
    }

    const docx = await import('docx');
    const { Document, Packer, Paragraph, TextRun } = docx;

    const children = pageTexts.length
      ? pageTexts.flatMap((t, i) => ([
        new Paragraph({ children: [new TextRun({ text: `Page ${i + 1}`, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: t })] }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),
      ]))
      : [new Paragraph({ children: [new TextRun({ text: '(No extractable text found in PDF.)' })] })];

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const blob = await Packer.toBlob(doc);
    const arrayBuf = await blob.arrayBuffer();

    return new NextResponse(arrayBuf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="converted.docx"',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message || 'Conversion failed.' }, { status: 500 });
  }
}
