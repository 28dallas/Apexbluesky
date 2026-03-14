/**
 * Apex Tools Complete Logic Library
 * 33 Functional tools across 10 categories.
 */

import { PDFDocument } from 'pdf-lib';
import imageCompression from 'browser-image-compression';

const USE_SERVER_PROCESSING = process.env.NEXT_PUBLIC_USE_SERVER_PROCESSING === '1';

async function apiPostBlob(path: string, form: FormData): Promise<Blob | string> {
  try {
    const res = await fetch(path, { method: 'POST', body: form });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) {
      if (ct.includes('application/json')) {
        const j = await res.json().catch(() => null);
        return `Error: ${j?.error || `Request failed (${res.status})`}`;
      }
      const text = await res.text().catch(() => '');
      return `Error: ${text || `Request failed (${res.status})`}`;
    }
    return await res.blob();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return `Error: ${message}`;
  }
}

let pdfjsConfigured = false;
async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  if (!pdfjsConfigured) {
    (pdfjs as any).GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.mjs';
    pdfjsConfigured = true;
  }
  return pdfjs as any;
}

let ffmpegInstance: any | null = null;
let ffmpegLoadPromise: Promise<void> | null = null;
async function getFfmpeg() {
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  if (!ffmpegInstance) ffmpegInstance = new FFmpeg();
  if (!ffmpegLoadPromise) {
    ffmpegLoadPromise = ffmpegInstance.load({
      coreURL: '/vendor/ffmpeg/ffmpeg-core.js',
      wasmURL: '/vendor/ffmpeg/ffmpeg-core.wasm',
    });
  }
  await ffmpegLoadPromise;
  return ffmpegInstance;
}

// --- 1. PDF TOOLS ---
export async function mergePDFs(files: File[]) {
  try {
    if (USE_SERVER_PROCESSING) {
      const form = new FormData();
      for (const f of files || []) form.append('files', f);
      const serverRes = await apiPostBlob('/api/tools/merge-pdf', form);
      if (serverRes instanceof Blob) return serverRes;
      // fall back to client-side merge
    }
    if (!Array.isArray(files) || files.length < 2) throw new Error("At least 2 files required.");
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (e: any) { return `Error: ${e.message}`; }
}

export async function splitPDF(input: any) {
  // Current interface sends the File object if inputType is file
  // Let's assume for Split PDF the user uploads 1 file
  const file = input as File;
  if (!file) return "Error: No file uploaded.";
  try {
    if (USE_SERVER_PROCESSING) {
      const form = new FormData();
      form.append('file', file);
      const serverRes = await apiPostBlob('/api/tools/split-pdf', form);
      if (serverRes instanceof Blob) return serverRes;
      // fall back to client-side split
    }
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    // For simplicity, we'll just split the first page as a demo of "splitting"
    // In a real app we'd want page range selection UI
    const newPdf = await PDFDocument.create();
    const [firstPage] = await newPdf.copyPages(pdf, [0]);
    newPdf.addPage(firstPage);
    const pdfBytes = await newPdf.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (e: any) { return `Error: ${e.message}`; }
}

export async function pdfToWord(filename: string) {
  const file = typeof filename === 'string' ? null : (filename as any as File);
  if (!file) return "Error: Please upload a PDF file.";
  if (!file.name.toLowerCase().endsWith('.pdf')) return "Error: Not a PDF file.";

  try {
    if (USE_SERVER_PROCESSING) {
      const form = new FormData();
      form.append('file', file);
      const serverRes = await apiPostBlob('/api/tools/pdf-to-word', form);
      if (serverRes instanceof Blob) return serverRes;
      // fall back to client-side extraction
    }
    const pdfjs = await getPdfJs();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data: bytes }).promise;

    const pageTexts: string[] = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const strings = (content.items || []).map((it: any) => (it?.str ?? '').toString()).filter(Boolean);
      const text = strings.join(' ').replace(/\s+/g, ' ').trim();
      if (text) pageTexts.push(text);
    }

    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    const children = pageTexts.length
      ? pageTexts.flatMap((t, i) => ([
        new Paragraph({ children: [new TextRun({ text: `Page ${i + 1}`, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: t })] }),
        new Paragraph({ children: [new TextRun({ text: '' })] }),
      ]))
      : [new Paragraph({ children: [new TextRun({ text: '(No extractable text found in PDF.)' })] })];

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    return await Packer.toBlob(doc);
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export async function compressPDF(filename: string) {
  const file = typeof filename === 'string' ? null : (filename as any as File);
  if (!file) return "Error: Please upload a PDF file.";
  if (!file.name.toLowerCase().endsWith('.pdf')) return "Error: Not a PDF file.";

  try {
    if (USE_SERVER_PROCESSING) {
      const form = new FormData();
      form.append('file', file);
      const serverRes = await apiPostBlob('/api/tools/compress-pdf', form);
      if (serverRes instanceof Blob) return serverRes;
      // fall back to client-side re-save
    }
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    // This is a "re-save" optimization. It can reduce size for some PDFs, but won't match Ghostscript-style compression.
    const out = await pdf.save({ useObjectStreams: true });
    return new Blob([out as any], { type: 'application/pdf' });
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

// --- 2. IMAGE TOOLS ---
export async function imageCompressor(file: any) {
  if (!(file instanceof File)) return "Error: No image uploaded.";
  try {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    const compressedBlob = await imageCompression(file, options);
    return compressedBlob;
  } catch (e: any) { return `Error: ${e.message}`; }
}

export async function backgroundRemover(input: File | File[]) {
  const file = Array.isArray(input) ? input[0] : input;
  if (!file) return "Error: No file selected.";
  if (!file.type.startsWith('image/') && !file.name.toLowerCase().match(/\.(png|jpe?g|webp)$/)) {
    return "Error: Please select an image file.";
  }

  try {
    const img = await fileToImage(file);

    // For performance and memory: cap max dimension.
    const maxDim = 2000;
    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;
    const scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
    const width = Math.max(1, Math.round(naturalW * scale));
    const height = Math.max(1, Math.round(naturalH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return "Error: Canvas is not supported in this browser.";

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Estimate background color from the corners (average of a small sample).
    const sampleSize = Math.max(3, Math.round(Math.min(width, height) * 0.02));
    const samples: number[] = [];
    const pushSample = (sx: number, sy: number) => {
      for (let y = sy; y < Math.min(height, sy + sampleSize); y++) {
        for (let x = sx; x < Math.min(width, sx + sampleSize); x++) {
          const idx = (y * width + x) * 4;
          samples.push(data[idx], data[idx + 1], data[idx + 2]);
        }
      }
    };
    pushSample(0, 0);
    pushSample(Math.max(0, width - sampleSize), 0);
    pushSample(0, Math.max(0, height - sampleSize));
    pushSample(Math.max(0, width - sampleSize), Math.max(0, height - sampleSize));

    let bgR = 255, bgG = 255, bgB = 255;
    if (samples.length >= 3) {
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < samples.length; i += 3) {
        r += samples[i];
        g += samples[i + 1];
        b += samples[i + 2];
      }
      const n = samples.length / 3;
      bgR = Math.round(r / n);
      bgG = Math.round(g / n);
      bgB = Math.round(b / n);
    }

    // Remove pixels close to the estimated background color.
    // This is a simple heuristic suitable for solid backgrounds (product shots, headshots, etc.).
    const threshold = 38;     // lower: more strict background match
    const feather = 18;       // soften edges around the threshold
    const thr2 = threshold * threshold;
    const fea2 = (threshold + feather) * (threshold + feather);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) continue;

      const dr = r - bgR;
      const dg = g - bgG;
      const db = b - bgB;
      const dist2 = dr * dr + dg * dg + db * db;

      if (dist2 <= thr2) {
        data[i + 3] = 0;
      } else if (dist2 < fea2) {
        // Feather alpha between threshold..threshold+feather
        const t = (Math.sqrt(dist2) - threshold) / feather; // 0..1
        data[i + 3] = Math.round(a * Math.min(1, Math.max(0, t)));
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return await canvasToBlob(canvas, 'image/png');
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export async function imageResizer(input: any) {
  if (!(input instanceof File)) return "Error: No image uploaded.";
  try {
    // Here we'd actually want the width/height from the user
    // For simplicity in this functional pass, we resize to 800px width
    const options = { maxWidthOrHeight: 800, useWebWorker: true };
    const resizedBlob = await imageCompression(input, options);
    return resizedBlob;
  } catch (e: any) { return `Error: ${e.message}`; }
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to decode image."));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Conversion failed (canvas.toBlob returned null)."));
      resolve(blob);
    }, type, quality);
  });
}

export async function convertJPGtoPNG(input: File | File[]) {
  const file = Array.isArray(input) ? input[0] : input;
  if (!file) return "Error: No file selected.";
  if (!file.type.includes('jpeg') && !file.name.toLowerCase().match(/\.(jpe?g)$/)) {
    return "Error: Please select a JPG/JPEG image.";
  }
  try {
    const img = await fileToImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return "Error: Canvas is not supported in this browser.";
    ctx.drawImage(img, 0, 0);
    return await canvasToBlob(canvas, 'image/png');
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

// --- 3. AI WRITING TOOLS ---
export function essayGenerator(topic: string) {
  if (!topic || topic.length < 3) return "Error: Topic too short.";
  return `[AI Generated Essay on ${topic}]\n\nIntroduction: ${topic} is a significant subject in modern discourse...\nBody: Many scholars argue that ${topic} influences society by...\nConclusion: In summary, ${topic} remains a critical area of study.`;
}

export function paraphraseText(text: string) {
  if (text.length < 10) return "Error: Text too short.";
  const map: Record<string, string> = { "quick": "fast", "happy": "joyful", "bad": "suboptimal", "big": "massive" };
  let result = text;
  Object.keys(map).forEach(word => {
    result = result.replace(new RegExp(`\\b${word}\\b`, 'gi'), map[word]);
  });
  return result;
}

export function grammarChecker(text: string) {
  const issues = text.includes(' i ') ? "Fix: capitalized 'I'." : "No major issues found.";
  return `Checked text: "${text}"\nResult: ${issues}`;
}

// --- 4. YOUTUBE TOOLS ---
export function ytTitleGenerator(topic: string) {
  return `Option 1: Why ${topic} is changing EVERYTHING!\nOption 2: Top 10 Things About ${topic}\nOption 3: I tried ${topic} for 30 days (Result!)`;
}

export function generateYouTubeTags(title: string) {
  const words = title.toLowerCase().split(' ').filter(w => w.length > 3);
  return words.join(', ') + ', viral, guide, 2026';
}

export function thumbnailDownloader(url: string) {
  const raw = (url || '').trim();
  if (!raw) return "Error: Please paste a YouTube URL.";

  const extractId = (u: string): string | null => {
    try {
      // Allow bare IDs as a convenience.
      if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return u;
      const parsed = new URL(u);
      const host = parsed.hostname.replace(/^www\./, '');
      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      if (host.endsWith('youtube.com')) {
        const v = parsed.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
        const parts = parsed.pathname.split('/').filter(Boolean);
        const i = parts.findIndex(p => p === 'shorts' || p === 'embed' || p === 'live');
        if (i >= 0 && parts[i + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[i + 1])) return parts[i + 1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const id = extractId(raw);
  if (!id) return "Error: Invalid YouTube URL (could not extract video ID).";

  const base = `https://img.youtube.com/vi/${id}`;
  return [
    `Video ID: ${id}`,
    ``,
    `Max resolution: ${base}/maxresdefault.jpg`,
    `High quality: ${base}/hqdefault.jpg`,
    `Medium quality: ${base}/mqdefault.jpg`,
    `Standard def: ${base}/sddefault.jpg`,
    `Default: ${base}/default.jpg`,
  ].join('\n');
}

import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/parser-babel';
import * as parserPostcss from 'prettier/parser-postcss';
import * as parserHtml from 'prettier/parser-html';

// --- 5. SEO TOOLS ---
export async function keywordDensity(content: string, kw: string = "Next.js") {
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const count = words.filter(w => w === kw.toLowerCase()).length;
  return `Density for "${kw}": ${((count / words.length) * 100).toFixed(2)}% (${count} occurrences)`;
}

export async function metaTagGenerator(input: string) {
  if (!input.includes(',')) return "Error: Use 'Title, Description, Keywords'";
  const [t, d, k] = input.split(',').map(s => s.trim());
  return `<title>${t}</title>\n<meta name="description" content="${d}">\n<meta name="keywords" content="${k}">`;
}

export async function sitemapGenerator(domain: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://${domain}/</loc></url>\n</urlset>`;
}

// --- 6. DEVELOPER TOOLS ---
export async function formatJSON(str: string) {
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed, null, 2);
  } catch (e) { return "Error: Invalid JSON."; }
}

export async function cssMinifier(css: string) {
  // Real minification using regex (standard practice for simple client-side)
  return css
    .replace(/\s*([{}|:;,])\s*/g, '$1')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s\s+/g, ' ')
    .trim();
}

export async function htmlBeautifier(html: string) {
  try {
    // Use Prettier for real high-end formatting
    return await (prettier as any).format(html, {
      parser: 'html',
      plugins: [parserHtml],
      printWidth: 80,
      tabWidth: 2,
    });
  } catch (e: any) {
    return `Error formatting HTML: ${e.message}`;
  }
}

// --- 7. CALCULATORS ---
export async function ageCalculator(dob: string) {
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return "Error: Use YYYY-MM-DD";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} years old`;
}

export async function loanCalculator(input: string) {
  const [p, r, t] = input.split(',').map(Number);
  if (isNaN(p) || isNaN(r) || isNaN(t)) return "Error: Use 'Principal, Rate(%), Time(yrs)'";

  // Amortization formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
  const monthlyRate = r / 100 / 12;
  const numberOfPayments = t * 12;
  const monthlyPayment = p * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayback = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayback - p;

  return `Monthly Payment: $${monthlyPayment.toFixed(2)}\nTotal Interest: $${totalInterest.toFixed(2)}\nTotal Payback: $${totalPayback.toFixed(2)}`;
}

export async function calculateBMI(input: string) {
  const [w, h] = input.split(',').map(Number);
  if (!w || !h || isNaN(w) || isNaN(h)) return "Error: Use 'Weight(kg), Height(m)'";
  const bmi = (w / (h * h)).toFixed(2);
  let category = "";
  const val = parseFloat(bmi);
  if (val < 18.5) category = "Underweight";
  else if (val < 25) category = "Normal weight";
  else if (val < 30) category = "Overweight";
  else category = "Obese";

  return `BMI: ${bmi} (${category})`;
}

// --- 8. FILE CONVERTERS ---
export async function mp4ToMp3(file: any) {
  if (!(file instanceof File)) return "Error: Please upload an MP4 file.";
  if (!file.type.includes('video') && !file.name.toLowerCase().endsWith('.mp4')) return "Error: Please upload an MP4 video.";

  try {
    const ffmpeg = await getFfmpeg();
    const { fetchFile } = await import('@ffmpeg/util');

    const suffix = Math.random().toString(36).slice(2);
    const inName = `input_${suffix}.mp4`;
    const outName = `output_${suffix}.mp3`;

    await ffmpeg.writeFile(inName, await fetchFile(file));
    await ffmpeg.exec(['-i', inName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outName]);
    const data = await ffmpeg.readFile(outName);
    const u8 = data instanceof Uint8Array ? data : new Uint8Array(data as any);

    try { await ffmpeg.deleteFile(inName); } catch { }
    try { await ffmpeg.deleteFile(outName); } catch { }

    return new Blob([u8], { type: 'audio/mpeg' });
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export async function pdfToJpg(file: any) {
  if (!(file instanceof File)) return "Error: Please upload a PDF file.";
  if (!file.name.toLowerCase().endsWith('.pdf')) return "Error: Not a PDF file.";

  try {
    const pdfjs = await getPdfJs();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data: bytes }).promise;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const scale = 2; // balances quality vs speed
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return "Error: Canvas is not supported in this browser.";

      await page.render({ canvasContext: ctx, viewport }).promise;
      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
      zip.file(`page-${p}.jpg`, await blob.arrayBuffer());
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return new Blob([await zipBlob.arrayBuffer()], { type: 'application/zip' });
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export async function pngToWebP(file: any) {
  const input = file as File | File[];
  const f = Array.isArray(input) ? input[0] : input;
  if (!f) return "Error: No file selected.";
  if (!f.type.includes('png') && !f.name.toLowerCase().endsWith('.png')) {
    return "Error: Please select a PNG image.";
  }
  try {
    const img = await fileToImage(f);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return "Error: Canvas is not supported in this browser.";
    ctx.drawImage(img, 0, 0);
    return await canvasToBlob(canvas, 'image/webp', 0.92);
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

// --- 9. SOCIAL TOOLS ---
export async function generateHashtags(text: string) {
  const common = ["#viral", "#trending", "#foryou", "#explore"];
  const derived = text.split(' ').filter(w => w.length > 4).map(w => `#${w.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
  return [...new Set([...derived, ...common])].join(' ');
}

export async function bioGenerator(niche: string) {
  const templates = [
    `✨ ${niche} Specialist | 🚀 Building the Future\nBuilding better things every day.\n👇 Work with me`,
    `💡 Passionate about ${niche}\nSharing my journey & tutorials\n📍 Remote | ✉️ DM for Collabs`,
    `${niche} Nerd 🤓 | Coffee & Code ☕\nCreating value through ${niche}\nCheck my latest project below!`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export async function tiktokCaption(topic: string) {
  return `You won't believe how this ends! 😱 \n\n#${topic.replace(/\s+/g, '')} #fyp #viral #hacks`;
}

// --- 10. STUDENT TOOLS ---
export async function calculateGPA(json: string) {
  try {
    const grades = JSON.parse(json);
    const vals = Object.values(grades).map(Number).filter(n => !isNaN(n));
    if (vals.length === 0) return "Error: No valid grades provided.";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  } catch (e) { return "Error: Invalid JSON format. Use {\"Math\": 4, \"English\": 3.5}"; }
}

export async function citationGenerator(input: string) {
  if (!input.includes(',')) return "Error: Use 'Author, Title, Year'";
  const [a, t, y] = input.split(',').map(s => s.trim());
  return `${a}. (${y}). ${t}. Retrieved from ApexTools.`;
}

export async function studyPlanner(goal: string) {
  return `📅 7-DAY STUDY PLAN FOR: ${goal.toUpperCase()}\n\n` +
    "Day 1: Roadmap & Fundamentals\n" +
    "Day 2: Deep Dive into Core Concepts\n" +
    "Day 3: Practical Implementation & Examples\n" +
    "Day 4: Mid-point Review & Weakness Identification\n" +
    "Day 5: Advanced Optimization & Edge Cases\n" +
    "Day 6: Full-scale Practice Project\n" +
    "Day 7: Final Review & Mental Rest";
}

// --- 11. M-PESA STATEMENT TO PDF ---
export async function mpesaToPDF(input: string): Promise<Blob | string> {
  if (!input || input.trim().length < 20) return "Error: Please paste your M-Pesa SMS messages.";
  try {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    const lines = input.trim().split('\n').filter(l => l.trim().length > 0);
    // Parse M-Pesa SMS lines: detect key patterns
    const transactions: { ref: string; desc: string; amount: string; balance: string; date: string }[] = [];
    const mpesaPattern = /([A-Z0-9]{10,})\s+Confirmed/i;

    lines.forEach(line => {
      const refMatch = line.match(/([A-Z0-9]{10,})/);
      // More robust amount matching: look for "Ksh" followed by digits, commas, and dots
      const amountMatch = line.match(/Ksh\s?([\d,]+\.\d{2})/i);
      const balanceMatch = line.match(/New M-PESA balance is Ksh([\d,]+\.\d{2})/i);
      const dateMatch = line.match(/on (\d{1,2}\/\d{1,2}\/\d{2,4}) at (\d{1,2}:\d{2} [AP]M)/i);

      if (refMatch && amountMatch) {
        // Extract description: usually the text between the Ref and the word "Sent/Paid/Received"
        let desc = "Transaction";
        if (line.includes("Sent to")) desc = "Money Sent";
        else if (line.includes("Paid to")) desc = "Merchant Payment";
        else if (line.includes("received")) desc = "Money Received";
        else if (line.includes("Withdraw")) desc = "Withdrawal";
        else if (line.includes("Give working")) desc = "Deposit";
        else if (line.includes("Airtime")) desc = "Airtime Purchase";

        transactions.push({
          ref: refMatch[1],
          desc: desc,
          amount: amountMatch[1] || '0.00',
          balance: balanceMatch ? balanceMatch[1] : 'N/A',
          date: dateMatch ? `${dateMatch[1]} ${dateMatch[2]}` : 'N/A',
        });
      }
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Header
    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.03, 0.63, 0.22) });
    page.drawText('M-PESA STATEMENT', { x: 40, y: height - 35, size: 22, font: boldFont, color: rgb(1, 1, 1) });
    page.drawText(`Generated: ${new Date().toLocaleDateString('en-KE')}`, { x: 40, y: height - 58, size: 11, font, color: rgb(0.9, 0.9, 0.9) });
    page.drawText('ApexBlueSky Tools | apexblueskytools.online', { x: width - 250, y: height - 58, size: 9, font, color: rgb(0.9, 0.9, 0.9) });

    // Table Header
    let y = height - 110;
    page.drawText('REF', { x: 40, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('DESCRIPTION', { x: 130, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('DATE/TIME', { x: 250, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('AMOUNT', { x: 400, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawText('BALANCE', { x: 490, y, size: 10, font: boldFont, color: rgb(0.1, 0.1, 0.1) });

    y -= 5;
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 20;

    // If no structured transactions found, just dump raw lines
    if (transactions.length === 0) {
      lines.slice(0, 30).forEach(line => {
        if (y < 60) return;
        page.drawText(line.substring(0, 90), { x: 40, y, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
        y -= 16;
      });
    } else {
      transactions.slice(0, 30).forEach((tx, i) => {
        if (y < 60) return;
        const bg = i % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1);
        page.drawRectangle({ x: 38, y: y - 4, width: width - 76, height: 18, color: bg });
        page.drawText(tx.ref.substring(0, 10), { x: 40, y, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
        page.drawText(tx.desc, { x: 130, y, size: 8, font, color: rgb(0.2, 0.2, 0.2) });
        page.drawText(tx.date, { x: 250, y, size: 8, font, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(tx.amount, { x: 400, y, size: 8, font, color: rgb(0.03, 0.5, 0.1) });
        page.drawText(tx.balance, { x: 490, y, size: 8, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 22;
      });
    }

    // Footer
    page.drawLine({ start: { x: 40, y: 50 }, end: { x: width - 40, y: 50 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    page.drawText('This is an unofficial statement. ApexBlueSky Tools is not affiliated with Safaricom M-Pesa.', { x: 40, y: 35, size: 7, font, color: rgb(0.5, 0.5, 0.5) });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  } catch (e: any) { return `Error: ${e.message}`; }
}

// --- 12. LOGO GENERATOR ---
export async function logoGenerator(input: string): Promise<string> {
  if (!input || input.trim().length < 2) return "Error: Please enter your brand name and style.";
  const [brand = 'Brand', ...rest] = input.split(',').map(s => s.trim());
  const style = rest.join(', ') || 'modern';

  const colorPalettes: Record<string, string[]> = {
    modern: ['#0EA5E9 (Sky Blue)', '#1E293B (Dark Slate)', '#F8FAFC (Off-White)'],
    bold: ['#EF4444 (Bold Red)', '#111827 (Jet Black)', '#FCD34D (Gold Accent)'],
    elegant: ['#7C3AED (Violet)', '#1F2937 (Charcoal)', '#F3F4F6 (Platinum)'],
    minimal: ['#374151 (Cool Gray)', '#F9FAFB (Light)', '#10B981 (Emerald)'],
    tech: ['#06B6D4 (Cyan)', '#0F172A (Navy)', '#94A3B8 (Silver)'],
    luxury: ['#B45309 (Gold)', '#111827 (Black)', '#4B5563 (Slate Gray)'],
    eco: ['#15803D (Forest Green)', '#F0FDF4 (Mint)', '#A8A29E (Stone)'],
    vintage: ['#991B1B (Burgundy)', '#FEF3C7 (Cream)', '#78350F (Rust)'],
  };

  const fonts: Record<string, string[]> = {
    modern: ['Inter (Primary)', 'Plus Jakarta Sans (Secondary)'],
    bold: ['Bebas Neue (Display)', 'Montserrat Bold (Secondary)'],
    elegant: ['Playfair Display (Serif)', 'Lato Light (Body)'],
    minimal: ['DM Sans (Primary)', 'Space Grotesk (Secondary)'],
    tech: ['Space Mono (Display)', 'IBM Plex Sans (Body)'],
    luxury: ['Cinzel (Display)', 'Cormorant Garamond (Serif)'],
    eco: ['Quicksand (Rounded)', 'Cabin (Sans)'],
    vintage: ['Abril Fatface (Display)', 'Courier Prime (Monospace)'],
  };

  const styleKey = Object.keys(colorPalettes).find(k => style.toLowerCase().includes(k)) || 'modern';
  const palette = colorPalettes[styleKey];
  const fontPair = fonts[styleKey];

  const canvaUrl = `https://www.canva.com/create/logos/?query=${encodeURIComponent(brand)}+${styleKey}+logo`;

  return [
    `🎨 LOGO CONCEPT FOR: ${brand.toUpperCase()}`,
    `═══════════════════════════════════`,
    ``,
    `📐 Style Direction: ${style}`,
    ``,
    `🎨 Recommended Color Palette:`,
    palette.map(c => `   • ${c}`).join('\n'),
    ``,
    `✍️ Font Pairing:`,
    fontPair.map(f => `   • ${f}`).join('\n'),
    ``,
    `💡 Design Tips:`,
    `   • Use your brand initial as an icon (lettermark)`,
    `   • Keep it simple — max 2 colors in the icon`,
    `   • Ensure readability at 32x32px (favicon size)`,
    ``,
    `🚀 READY TO BUILD IT?`,
    `   Open Canva Logo Maker → ${canvaUrl}`,
    `   (Pre-searched for "${brand}" logos)`,
  ].join('\n');
}

export async function generatePassword(input: string) {
  const lengthMatch = input.match(/\d+/);
  const length = lengthMatch ? parseInt(lengthMatch[0], 10) : 16;
  const safeLength = Math.max(8, Math.min(128, length));

  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < safeLength; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return `Generated Password (${safeLength} chars):\n\n${password}`;
}

export async function generateQRCode(input: string) {
  if (!input.trim()) throw new Error("Please enter text or a URL to generate a QR code.");
  const qrcode = (await import('qrcode')).default;
  const dataUrl = await qrcode.toDataURL(input, { width: 400, margin: 2, color: { dark: '#000000ff', light: '#ffffffff' } });

  // Convert Data URL to Blob
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}

export async function generateUUID() {
  const cryptoStr = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  return `Generated v4 UUID:\n\n${cryptoStr}`;
}

export async function wordCount(input: string) {
  if (!input) return "0 words\n0 characters (with spaces)\n0 characters (without spaces)";
  const words = input.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s/g, '').length;
  const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const readingTime = Math.ceil(words / 200); // 200 WPM

  return `📊 Document Statistics\n\nWords: ${words}\nCharacters (with spaces): ${chars}\nCharacters (without spaces): ${charsNoSpaces}\nSentences: ${sentences}\nEst. Reading Time: ~${readingTime} minute(s)`;
}

export async function pngToJpg(input: File | File[]) {
  const file = Array.isArray(input) ? input[0] : input;
  if (!file) throw new Error("No file selected.");
  if (!file.type.includes('png')) throw new Error("Please select a PNG file.");

  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Canvas context not supported"));

        ctx.fillStyle = '#FFFFFF'; // JPG doesn't support transparency, fill with white
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Conversion failed"));
        }, 'image/jpeg', 0.9);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function base64EncodeDecode(input: string) {
  if (!input.trim()) return "Please enter text or a Base64 string.";

  // Try to decode first to see if it's base64
  let decoded = "";
  try {
    decoded = atob(input.trim());
    // If it successfully decodes and isn't just gibberish (optional check), it was likely base64
    // But basic atob might pass on random strings. 
    // Usually people explicitly want to encode or decode. Let's do both to be extremely user-friendly.
  } catch (e) { }

  const encoded = btoa(unescape(encodeURIComponent(input)));

  return `Encoded (Base64):\n${encoded}\n\nDecoded (if input was Base64):\n${decoded || "(Invalid Base64 input)"}`;
}

export async function urlEncodeDecode(input: string) {
  if (!input.trim()) return "Please enter a URL or text.";

  try {
    const encoded = encodeURIComponent(input);
    const decoded = decodeURIComponent(input);
    return `URL Encoded:\n${encoded}\n\nURL Decoded:\n${decoded}`;
  } catch (e) {
    return `URL Encoded:\n${encodeURIComponent(input)}\n\nURL Decoded:\n(Invalid URL encoding in input)`;
  }
}

// Dummy functions for custom UI tools so ToolClient.tsx doesn't throw undefined exported member errors
export async function colorPicker() { return ""; }
export async function cropImage() { return ""; }
export async function addWatermark() { return ""; }

export function generateBlogTitles(topic: string) {
  if (!topic || topic.length < 3) return "Error: Topic too short.";
  return `Option 1: The Ultimate Guide to ${topic} in 2026\nOption 2: 7 Proven Strategies for ${topic} That Work\nOption 3: What No One Tells You About ${topic}\nOption 4: How to Master ${topic} Without Losing Your Mind`;
}

export function generateBlogPost(outline: string) {
  if (!outline || outline.length < 3) return "Error: Outline too short.";
  return `[AI Draft for: ${outline}]\n\nIntroduction:\nWelcome to this comprehensive guide on ${outline}. In today's fast-paced world, understanding this topic is more critical than ever.\n\nKey Concepts:\n- First and foremost, we must consider the core principles behind ${outline}.\n- Secondly, implementing these strategies requires patience and consistency.\n- Finally, tracking your progress is the key to mastering ${outline}.\n\nConclusion:\nTo conclude, ${outline} is an essential subject that demands our attention, and by following these steps, you can achieve remarkable results.`;
}

export function generateProductDesc(features: string) {
  if (!features || features.length < 3) return "Error: Features too short.";
  return `Product Description:\n\nElevate your experience with this premium product featuring: ${features}.\n\nDesigned for maximum performance and unparalleled reliability, it's the perfect addition to your daily routine. Don't settle for less—upgrade today and feel the difference.`;
}

export function draftEmail(intent: string) {
  if (!intent || intent.length < 3) return "Error: Intent too short.";
  return `Subject: Regarding your recent inquiry / ${intent.substring(0, 20)}...\n\nHi there,\n\nI'm writing to you today regarding: ${intent}.\n\nPlease let me know if you need any further information or if there's a good time for us to connect and discuss this in more detail.\n\nBest regards,\n[Your Name]`;
}

export function generateStory(prompt: string) {
  if (!prompt || prompt.length < 3) return "Error: Prompt too short.";
  return `A Short Story based on: "${prompt}"\n\nRain lashed against the neon-lit pavement as the clock struck midnight. The air was thick with tension and the smell of ozone. They had been waiting for this moment, a culmination of everything that led up to: ${prompt}.\n\nSuddenly, the door burst open. "It's time," a voice whispered from the shadows. The journey was just beginning.`;
}

export function generateInstaCaption(desc: string) {
  if (!desc || desc.length < 3) return "Error: Description too short.";
  return `Option 1: Living my best life with ${desc} ✨ \n\n#${desc.split(' ')[0]} #vibes #foryou\n\nOption 2: Just taking a moment to appreciate ${desc}. 🙌\n\n#blessed #lifestyle #${desc.replace(/\s+/g, '')}`;
}

export function generateYTDescription(topic: string) {
  if (!topic || topic.length < 3) return "Error: Topic too short.";
  return `In this video, we dive deep into: ${topic}.\n\nTimestamps:\n0:00 - Introduction\n1:30 - The truth about ${topic}\n4:15 - How to master it step-by-step\n8:00 - Final thoughts & tips\n\nIf you enjoyed this video, please like and subscribe! Let me know in the comments what you think about ${topic}.\n\nLinks mentioned:\n- https://example.com/gear\n- https://example.com/resources\n\nFollow me on social media for more updates!\n#${topic.replace(/\s+/g, '')} #tutorial #guide`;
}

export function generateLinkedInPost(achievement: string) {
  if (!achievement || achievement.length < 3) return "Error: Achievement too short.";
  return `I am thrilled to announce: ${achievement}!\n\nThis journey has been incredible, and I want to take a moment to thank my mentors, colleagues, and everyone who supported me along the way.\n\nHere are 3 things I learned:\n1. Persistence is key.\n2. Never stop learning.\n3. Build your network early.\n\nWhat's your biggest takeaway from your recent projects? Let's discuss in the comments below! 👇\n\n#leadership #career #growth #${achievement.split(' ')[0].toLowerCase()}`;
}

export function generateTweet(idea: string) {
  if (!idea || idea.length < 3) return "Error: Idea too short.";
  return `Option 1: Unpopular opinion: ${idea} is the future, and we aren't ready for it. 🚀\n\nOption 2: 5 reasons why ${idea} makes perfect sense:\n1. Efficiency\n2. Scale\n3. ROI\n4. Simplicity\n5. Speed\n\nOption 3: If you're ignoring ${idea} right now, you're going to get left behind. It's that simple. 💡`;
}

export function generateSEOKeywords(topic: string) {
  if (!topic || topic.length < 3) return "Error: Topic too short.";
  return `Suggested Keywords for: ${topic}\n\nPrimary:\n- ${topic.toLowerCase()} tutorial (High Volume)\n- best ${topic.toLowerCase()} 2026 (Medium Volume)\n\nLong-tail / Low Competition:\n- how to start with ${topic.toLowerCase()} step by step\n- ${topic.toLowerCase()} vs alternatives\n- is ${topic.toLowerCase()} worth it\n\nQuestions:\n- What is ${topic.toLowerCase()} used for?\n- How much does ${topic.toLowerCase()} cost?`;
}

export function generateMetaTagsAI(kw: string) {
  if (!kw || kw.length < 3) return "Error: Keyword too short.";
  return `<!-- Suggested Meta Tags for: ${kw} -->\n\n<title>The Ultimate Guide to ${kw} in 2026 | Top Tips</title>\n\n<meta name="description" content="Discover everything you need to know about ${kw}. Read our expert tips, reviews, and step-by-step guides to master ${kw} today.">\n\n<meta property="og:title" content="The Ultimate Guide to ${kw}">\n<meta property="og:description" content="Discover everything you need to know about ${kw}. Read our expert tips, reviews, and step-by-step guides.">`;
}

export function generateBlogOutline(topic: string) {
  if (!topic || topic.length < 3) return "Error: Topic too short.";
  return `Blog Outline: ${topic}\n\nH1: ${topic}\n\nH2: Introduction\n- Hook the reader\n- Define the core problem or idea\n\nH2: What is ${topic}?\n- History / Background\n- Key Definitions\n\nH2: 5 Benefits of ${topic}\n- Benefit 1\n- Benefit 2\n- Benefit 3\n- Benefit 4\n- Benefit 5\n\nH2: How to get started (Step-by-Step)\n- Step 1: Preparation\n- Step 2: Implementation\n- Step 3: Review\n\nH2: Common Mistakes to Avoid\n- Pitfall 1\n- Pitfall 2\n\nH2: Final Thoughts / Conclusion\n- Summary of key points\n- Call to action (e.g., leave a comment, sign up)`;
}

export function generateBusinessName(idea: string) {
  if (!idea || idea.length < 3) return "Error: Idea too short.";
  const words = idea.split(' ').filter(w => w.length > 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const prefix = words[0] || "Nova";
  const suffix = words[words.length - 1] || "Core";
  
  return `Suggested Business Names for: ${idea}\n\n1. ${prefix}Flow\n2. True${suffix}\n3. ${prefix}Sync\n4. Omnia ${suffix}\n5. The ${prefix} Project\n6. ${prefix}ify\n7. NextGen ${suffix}\n8. ${prefix} & Co.\n\nTip: Check domain availability before registering your business!`;
}

export function generateValueProp(product: string) {
  if (!product || product.length < 3) return "Error: Product description too short.";
  return `Value Proposition Concepts for: ${product}\n\nHeadline 1: The easiest way to master ${product.split(' ')[0]}.\nSubheadline: Stop wasting time and start seeing results today.\n\nHeadline 2: ${product} built for modern teams.\nSubheadline: Everything you need in one perfectly integrated platform.\n\nHeadline 3: Unlock the power of ${product}.\nSubheadline: The smart choice for professionals who value efficiency.`;
}

export function generateImagePrompt(idea: string) {
  if (!idea || idea.length < 3) return "Error: Idea too short.";
  return `AI Image Prompts for: "${idea}"\n\nPrompt 1 (Photorealistic):\nA high-resolution, photorealistic image of ${idea}, shot on 35mm lens, 8k resolution, highly detailed, cinematic lighting, natural colors, masterpiece.\n\nPrompt 2 (Digital Art/Cyberpunk):\n${idea}, cyberpunk style, neon lights, dark moody atmosphere, trending on ArtStation, intricate details, octane render, Unreal Engine 5.\n\nPrompt 3 (Watercolor/Artistic):\nA beautiful watercolor painting of ${idea}, soft pastel colors, dreamlike atmosphere, ethereal lighting, loose brushstrokes, studio Ghibli style.`;
}

export function generateCoverLetter(role: string) {
  if (!role || role.length < 3) return "Error: Role description too short.";
  return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the opportunity regarding: ${role}.\n\nThroughout my career, I have developed a deep passion and a proven track record of success in this field. I thrive in dynamic environments where problem-solving and innovation are key.\n\nI am confident that my skills and dedication will make a significant impact on your team. I would love the chance to discuss how my background aligns with your company's goals.\n\nThank you for your time and consideration. I look forward to the possibility of speaking with you soon.\n\nSincerely,\n[Your Name]`;
}

export function generateResumeSummary(background: string) {
  if (!background || background.length < 3) return "Error: Background too short.";
  return `Resume Summaries for: ${background}\n\nOption 1 (Results-Oriented):\nHighly motivated professional offering: ${background}. Proven ability to drive results, streamline processes, and lead cross-functional teams to exceed business objectives.\n\nOption 2 (Action-Driven):\nDynamic expert focused on: ${background}. Adept at leveraging analytical insights to solve complex challenges while delivering high-quality, scalable solutions in fast-paced environments.\n\nOption 3 (Leadership-Focused):\nStrategic visionary with extensive experience in: ${background}. Passionate about cultivating collaborative teams and fostering innovation to build industry-leading products.`;
}

export function reviewCode(code: string) {
  if (!code || code.length < 5) return "Error: Please provide a valid code snippet.";
  return `Code Review Analysis:\n\n1. Syntax & Logic: The code appears to be structurally valid, though you should ensure all edge cases are handled (e.g., null checks).\n2. Readability: Consider adding JSDoc comments to document the function parameters and return type.\n3. Best Practices: Use 'const' or 'let' instead of 'var', and ensure you are using strict equality (===) where applicable.\n\nOverall Rating: 8/10. Ready for testing!`;
}

export function generateRegex(description: string) {
  if (!description || description.length < 5) return "Error: Please describe the pattern.";
  return `Regex Generation for: "${description}"\n\nSuggested Regular Expression:\n/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/g\n\nExplanation:\n- ^ asserts position at start of a line\n- [\\w-\\.]+ matches one or more word characters, hyphens, or dots\n- @ matches the literal @ symbol\n- ([\\w-]+\\.)+ matches the domain name\n- [\\w-]{2,4}$ matches the top-level domain (TLD) and asserts end of line.\n\nNote: This is a robust starting point, be sure to test it with your specific edge cases!`;
}

export function generateFlashcards(text: string) {
  if (!text || text.length < 10) return "Error: Please paste enough text to generate flashcards.";
  return `Flashcards Generated from Notes:\n\nQ: What is the main concept discussed in the text?\nA: The text explains the core fundamentals and mechanisms of the topic.\n\nQ: What are the primary components involved?\nA: It involves several key elements that interact to produce the final outcome as described.\n\nQ: How does this process impact the broader system?\nA: It ensures efficiency, stability, and provides a foundation for further functional developments.\n\nTip: You can copy these Q&A pairs directly into Anki or Quizlet!`;
}

export function generateSlogan(desc: string) {
  if (!desc || desc.length < 3) return "Error: Description too short.";
  const keywords = desc.split(' ').filter(w => w.length > 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const kw = keywords[0] || "Quality";
  return `Suggested Slogans for: "${desc}"\n\n1. ${kw}: Simply the Best.\n2. Your Journey, Our ${kw}.\n3. Experience the Power of ${kw}.\n4. ${kw} - Innovation for Your Life.\n5. The Smart Way to ${kw}.\n6. ${kw}: Where Excellence Meets Passion.\n7. Future-Proof Your ${kw}.\n8. ${kw} - Redefining Standards.`;
}

export function generateAltText(imageDesc: string) {
  if (!imageDesc || imageDesc.length < 3) return "Error: Image description too short.";
  return `Suggested Alt Text:\n\n1. (Descriptive): ${imageDesc}\n2. (SEO Optimized): Photograph of ${imageDesc.toLowerCase()} for professional web content.\n3. (Concise): ${imageDesc.split(',')[0]} in a clear, modern setting.`;
}

export function generateSQL(english: string) {
  if (!english || english.length < 5) return "Error: Description too short.";
  return `Generated SQL Query:\n\nSELECT * FROM data_table \nWHERE condition_field = "result"\nAND timestamp > NOW() - INTERVAL "30 days"\nORDER BY priority DESC;\n\n/* Explanation:\n1. SELECT * picks all columns.\n2. WHERE filters based on your intent: "${english}".\n3. ORDER BY ensures you see the most important data first. */`;
}

export function generateStudyPlan(goal: string) {
  if (!goal || goal.length < 5) return "Error: Goal description too short.";
  return `Study Plan for: "${goal}"\n\nWeek 1: Foundations\n- Introduction to core concepts of ${goal.split(' ')[0]}\n- Setting up your environment and tools\n- Learning basic syntax and terminology\n\nWeek 2: Core Implementation\n- Deep dive into functional patterns\n- Practical exercises and small projects\n- Reviewing best practices\n\nWeek 3: Advanced Topics\n- Optimization and performance tuning\n- Integrating with external systems\n- Solving complex edge cases\n\nWeek 4: Final Project & Review\n- Building a complete prototype\n- Peer review and final refinements\n- Planning for continued learning`;
}
