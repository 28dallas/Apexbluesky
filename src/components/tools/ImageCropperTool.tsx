'use client';

import { useState, useRef } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { saveAs } from 'file-saver';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';
import LimitModal from '../LimitModal';
import type { ToolDefinition } from '@/types/tools';

export default function ImageCropperTool({ tool, credits }: { tool: ToolDefinition, credits?: number }) {
    const { user, isPremium, credits: availableCredits } = useAuth();
    const [imgSrc, setImgSrc] = useState('');
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [limitReason, setLimitReason] = useState<string | null>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium,
        credits: availableCredits,
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

            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = async () => {
        if (imgRef.current && crop?.width && crop?.height) {
            const canvas = document.createElement('canvas');
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(
                imgRef.current,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, 'cropped-image.jpg');
                }
            }, 'image/jpeg', 1);
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
                        <label className={styles.label}>Select Image to Crop</label>
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px' }}>
                            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                                <img ref={imgRef} src={imgSrc} style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }} alt="Crop target" />
                            </ReactCrop>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setImgSrc('')}>Start Over</button>
                            <button className="btn-primary" style={{ flex: 2 }} onClick={handleDownload} disabled={!crop || !crop.width}>Crop & Download</button>
                        </div>

                        {credits && (
                            <div className={styles.creditCost}>
                                Cost: <strong>{credits} Credits</strong>
                                {!isPremium && (
                                    <span style={{ display: 'block', marginTop: '0.4rem', opacity: 0.8 }}>
                                        Balance: <strong>{availableCredits}</strong>. Free accounts start at 0 credits. Upgrade to Pro for unlimited access.
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={styles.trustBadge}>
                            <Shield size={16} className={styles.trustIcon} />
                            <span>Privacy Shield: 100% Local Browser Processing. Images never leave your device.</span>
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
