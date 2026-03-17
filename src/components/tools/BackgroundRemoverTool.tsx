'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Download, UploadCloud, Shield } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';
import LimitModal from '../LimitModal';

export default function BackgroundRemoverTool({ tool, id, credits }: { tool: any, id: string, credits?: number }) {
    const { user, isPremium } = useAuth();
    const [image, setImage] = useState<File | null>(null);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [limitReason, setLimitReason] = useState<string | null>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium
    };

    useEffect(() => {
        if (image) {
            const url = URL.createObjectURL(image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [image]);

    useEffect(() => {
        if (processedBlob) {
            const url = URL.createObjectURL(processedBlob);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [processedBlob]);

    const handleInitialProcess = async () => {
        if (!image) return;

        // Limit Checks
        const sizeCheck = checkLimit(userStatus, 'file_size', image.size);
        if (!sizeCheck.allowed) {
            setLimitReason(sizeCheck.reason!);
            return;
        }

        if (credits) {
            const creditCheck = checkLimit(userStatus, 'credits', credits);
            if (!creditCheck.allowed) {
                setLimitReason(creditCheck.reason!);
                return;
            }
        }

        setLoading(true);
        setProcessedBlob(null);
        setProgress('Initializing AI Model...');

        try {
            const blob = await removeBackground(image, {
                progress: (key: string, current: number, total: number) => {
                    if (key.includes('fetch')) {
                        const pct = Math.round((current / total) * 100);
                        setProgress(`Downloading AI Model... ${pct}%`);
                    } else if (key.includes('compute')) {
                        setProgress('Removing Background...');
                    }
                }
            });
            setProcessedBlob(blob);
            setProgress('');
        } catch (e: any) {
            console.error('Background removal failed:', e);
            setProgress(`Error: ${e.message || 'Failed to remove background'}`);
        }
        setLoading(false);
    };

    const handleDownload = () => {
        if (processedBlob) {
            saveAs(processedBlob, `bg_removed_${image?.name || 'image'}.png`);
        }
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
                                <UploadCloud size={32} style={{ marginBottom: '10px', opacity: 0.7 }} />
                                {image ? image.name : 'Click to select or drag photo'}
                            </label>
                        </div>

                        {previewUrl && (
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px' }} />
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleInitialProcess}
                            disabled={!image || loading}
                            style={{ width: '100%', marginTop: '20px' }}
                        >
                            {loading ? progress : 'AI Remove Background'}
                        </button>

                        {credits && (
                            <div className={styles.creditCost}>
                                Cost: <strong>{credits} Credits</strong>
                            </div>
                        )}

                        <div className={styles.trustBadge}>
                            <Shield size={16} className={styles.trustIcon} />
                            <span>Privacy Shield: 100% Local Browser Processing. Your data never leaves your device.</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{
                            position: 'relative',
                            background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uPBAp8hpZGhhUGTQCbq4oGBAcpDR8EwnP7E6fgUCoYp8AA0MScN7ZCHpAAAAABJRU5ErkJggg==")',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            maxWidth: '100%',
                            margin: '0 auto',
                            textAlign: 'center'
                        }}>
                            {previewUrl && (
                                <img src={previewUrl} alt="Processed" style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }} />
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={() => { setProcessedBlob(null); setImage(null); }}
                                className="btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Start Over
                            </button>
                            <button className="btn-primary" onClick={handleDownload} style={{ flex: 2, display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                <Download size={20} /> Download Transparent PNG
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <LimitModal
                isOpen={!!limitReason}
                onClose={() => setLimitReason(null)}
                reason={limitReason || ''}
            />
        </div>
    );
}
