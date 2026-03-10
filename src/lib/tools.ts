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
