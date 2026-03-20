'use client';

import { useEffect, useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';
import LimitModal from '../LimitModal';
import type { ToolDefinition } from '@/types/tools';

export default function WatermarkTool({
    tool,
    credits,
    guestCreditsRemaining,
    onActionComplete
}: {
    tool: ToolDefinition,
    credits?: number,
    guestCreditsRemaining?: number,
    onActionComplete?: (spent: number) => void
}) {
    const { user, isPremium, credits: availableCredits } = useAuth();
    const [imgSrc, setImgSrc] = useState('');
    const [watermarkText, setWatermarkText] = useState('© ApexBlueSky Tools');
    const [previewUrl, setPreviewUrl] = useState('');
    const [opacity, setOpacity] = useState('0.6');
    const [limitReason, setLimitReason] = useState<string | null>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium,
        credits: availableCredits,
        guestCreditsRemaining: guestCreditsRemaining,
    };

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Limit Checks
            const sizeCheck = checkLimit(userStatus, 'file_size', file.size);
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

            const reader = new FileReader();
            reader.onload = () => setImgSrc(reader.result?.toString() || '');
            reader.readAsDataURL(file);
        }
    };

    const generatePreview = () => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            ctx.font = `bold ${Math.max(30, canvas.width / 15)}px Arial`;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.shadowColor = `rgba(0, 0, 0, ${parseFloat(opacity) + 0.2})`;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;

            ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);

            setPreviewUrl(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = imgSrc;
    };

    useEffect(() => {
        if (imgSrc && watermarkText) {
            generatePreview();
        }
    }, [imgSrc, opacity, watermarkText]);

    const handleDownload = () => {
        if (previewUrl) {
            saveAs(previewUrl, 'watermarked-image.jpg');
            if (credits) onActionComplete?.(credits);
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
                <p className={styles.description}>{tool.description}</p>
            </div>

            <div className={`${styles.card} glass`}>
                {!imgSrc ? (
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Select Image to Watermark</label>
                        <div className={styles.fileDrop}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onSelectFile}
                                className={styles.fileInput}
                            />
                            <div className={styles.fileLabel}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginBottom: '1rem', opacity: 0.7 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>Click to upload image</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className={styles.label}>Watermark Text</label>
                                <input
                                    type="text"
                                    value={watermarkText}
                                    onChange={(e) => setWatermarkText(e.target.value)}
                                    className={styles.textarea}
                                    style={{ height: 'auto', padding: '1rem' }}
                                />
                            </div>
                            <div>
                                <label className={styles.label}>Opacity (0.1 - 1.0)</label>
                                <input
                                    type="range"
                                    min="0.1" max="1" step="0.1"
                                    value={opacity}
                                    onChange={(e) => setOpacity(e.target.value)}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                />
                            </div>
                        </div>

                        {previewUrl && (
                            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px' }}>
                                <img src={previewUrl} style={{ maxHeight: '50vh', maxWidth: '100%', objectFit: 'contain' }} alt="Preview" />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setImgSrc('')}>Start Over</button>
                            <button className="btn-primary" style={{ flex: 2 }} onClick={handleDownload} disabled={!watermarkText}>Watermark & Download</button>
                        </div>

                        {credits && (
                            <div className={styles.creditCost}>
                                Cost: <strong>{credits} Credits</strong>
                                {!isPremium && (
                                    <span style={{ display: 'block', marginTop: '0.4rem', opacity: 0.8 }}>
                                        {user ? (
                                            <>Balance: <strong>{availableCredits}</strong>. Upgrade to Pro for unlimited access.</>
                                        ) : (
                                            <>Trial: <strong>{guestCreditsRemaining} Free Credits</strong> remaining for this tool. <Link href="/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Sign up</Link> to get more.</>
                                        )}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={styles.trustBadge}>
                            <Shield size={16} className={styles.trustIcon} />
                            <span>Privacy Shield: 100% Local Browser Processing. Images are never uploaded.</span>
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
