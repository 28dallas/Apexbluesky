import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function mustExist(p) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing required file: ${p}`);
  }
}

function copyPdfJsWorker() {
  const src = path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs');
  const dest = path.join(projectRoot, 'public', 'vendor', 'pdfjs', 'pdf.worker.min.mjs');
  mustExist(src);
  copyFile(src, dest);
}

function copyFfmpegCore() {
  const base = path.join(projectRoot, 'node_modules', '@ffmpeg', 'core', 'dist');
  // @ffmpeg/core ships the same filenames under both esm/ and umd/.
  const srcJs = path.join(base, 'umd', 'ffmpeg-core.js');
  const srcWasm = path.join(base, 'umd', 'ffmpeg-core.wasm');
  const destDir = path.join(projectRoot, 'public', 'vendor', 'ffmpeg');
  mustExist(srcJs);
  mustExist(srcWasm);
  ensureDir(destDir);
  copyFile(srcJs, path.join(destDir, 'ffmpeg-core.js'));
  copyFile(srcWasm, path.join(destDir, 'ffmpeg-core.wasm'));
}

try {
  copyPdfJsWorker();
  copyFfmpegCore();
  // Keep output minimal; npm will show "postinstall" anyway if needed.
} catch (err) {
  console.error(String(err?.message || err));
  process.exitCode = 1;
}

