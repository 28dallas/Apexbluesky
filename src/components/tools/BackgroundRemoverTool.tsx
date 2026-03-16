'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Eraser, RotateCcw, Download, Image as ImageIcon, Wand2 } from 'lucide-react';
import { backgroundRemover } from '@/lib/tools';

export default function BackgroundRemoverTool({ tool, id }: { tool: any, id: string }) {
    const [image, setImage] = useState<File | null>(null);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const [isErasing, setIsErasing] = useState(true);
    const originalImageRef = useRef<HTMLImageElement | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Initial Processing
    const handleInitialProcess = async () => {
        if (!image) return;
        setLoading(true);
        try {
            const res = await backgroundRemover(image);
            if (res instanceof Blob) {
                // Keep original image for restore brush
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        originalImageRef.current = img;
                        setProcessedBlob(res);
                        renderToCanvas(res);
                    };
                    img.src = e.target?.result as string;
                };
                reader.readAsDataURL(image);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const renderToCanvas = (blob: Blob) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = URL.createObjectURL(blob);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDrawing) draw(e);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const draw = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        if (isErasing) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, brushSize, 0, Math.PI * 2);
            ctx.fill();
        } else if (originalImageRef.current) {
            // Restore logic: draw from original image using a circular clip
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, brushSize, 0, Math.PI * 2);
            ctx.clip();
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            if (blob) saveAs(blob, `background_removed_${Date.now()}.png`);
        }, 'image/png');
    };

    return (
        <div className={styles.wrapper}>
            <Link href="/" className={styles.backLink}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Dashboard
            </Link>

            <div className={styles.header}>
                <div className={styles.icon}>{tool.icon}</div>
                <h1 className={styles.title}>{tool.title}</h1>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{tool.description}</p>
            </div>

            <div className={`${styles.card} glass`}>
                {!processedBlob ? (
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Upload Image</label>
                        <div className={styles.fileBox}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className={styles.fileInput}
                                id="bg-upload"
                            />
                            <label htmlFor="bg-upload" className={styles.fileLabel}>
                                {image ? image.name : 'Click to select or drag photo'}
                            </label>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleInitialProcess}
                            disabled={!image || loading}
                            style={{ marginTop: '20px' }}
                        >
                            {loading ? 'AI Removing Background...' : 'AI Remove Background'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => setIsErasing(true)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: isErasing ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    display: 'flex', gap: '8px', alignItems: 'center', border: 'none', color: 'white', cursor: 'pointer',
                                    fontWeight: isErasing ? 'bold' : 'normal'
                                }}
                            >
                                <Eraser size={18} /> Eraser
                            </button>
                            <button
                                onClick={() => setIsErasing(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: !isErasing ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    display: 'flex', gap: '8px', alignItems: 'center', border: 'none', color: 'white', cursor: 'pointer',
                                    fontWeight: !isErasing ? 'bold' : 'normal'
                                }}
                            >
                                <Wand2 size={18} /> Restore
                            </button>

                            <div style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem' }}>Brush Size:</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                    style={{ flex: 1 }}
                                />
                            </div>

                            <button
                                onClick={() => setProcessedBlob(null)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.1)',
                                    display: 'flex', gap: '8px', alignItems: 'center', border: 'none', color: 'white', cursor: 'pointer'
                                }}
                            >
                                <RotateCcw size={18} /> Reset
                            </button>
                        </div>

                        <div style={{
                            position: 'relative',
                            background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uPBAp8hpZGhhUGTQCbq4oGBAcpDR8EwnP7E6fgUCoYp8AA0MScN7ZCHpAAAAABJRU5ErkJggg==")',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'crosshair',
                            maxWidth: '100%',
                            margin: '0 auto'
                        }}>
                            <canvas
                                ref={canvasRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                style={{ display: 'block', maxWidth: '100%' }}
                            />
                        </div>

                        <button className="btn-primary" onClick={handleDownload} style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                            <Download size={20} /> Download Transparent PNG
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
