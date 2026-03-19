'use client';

import { useState, useRef } from 'react';
import styles from './ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';

export interface ToolField {
    id: string;
    label: string;
    type: 'number' | 'text' | 'select' | 'range' | 'textarea';
    placeholder?: string;
    defaultValue?: string | number;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    step?: number;
}

interface ToolInterfaceProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    inputPlaceholder: string;
    buttonText: string;
    onAction: (input: any) => Promise<string | number | Blob | null>;
    onLimitReached?: (reason: string) => void;
    initialValue?: string;
    inputType?: 'text' | 'file' | 'files' | 'form';
    accept?: string;
    fields?: ToolField[];
    category?: string;
    isAI?: boolean;
    disclaimer?: string;
    credits?: number;
}

export default function ToolInterface({
    id,
    title,
    description,
    icon,
    inputPlaceholder,
    buttonText,
    onAction,
    onLimitReached,
    initialValue = '',
    inputType = 'text',
    accept = '*/*',
    fields = [],
    isAI = false,
    disclaimer,
    credits
}: ToolInterfaceProps) {
    const { user, isPremium } = useAuth();
    const [textInput, setTextInput] = useState(initialValue);
    const [fileInput, setFileInput] = useState<File | File[] | null>(null);
    const [formInput, setFormInput] = useState<Record<string, any>>(() => {
        const initialForm: Record<string, any> = {};
        fields.forEach(f => {
            initialForm[f.id] = f.defaultValue !== undefined ? f.defaultValue : (f.type === 'number' ? 0 : '');
        });
        return initialForm;
    });
    const [result, setResult] = useState<string | number | Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progressSteps, setProgressSteps] = useState<string>('');
    const fileRef = useRef<HTMLInputElement>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium
    };

    const handleFormChange = (id: string, value: any) => {
        setFormInput(prev => ({ ...prev, [id]: value }));
    };

    const handleAction = async () => {
        setError(null);
        setResult(null);
        
        // Final check before processing
        if (inputType === 'files' && Array.isArray(fileInput)) {
            const limitCheck = checkLimit(userStatus, 'batch_count', fileInput.length);
            if (!limitCheck.allowed) {
                onLimitReached?.(limitCheck.reason!);
                return;
            }
        } else if (inputType === 'file' && fileInput instanceof File) {
            const limitCheck = checkLimit(userStatus, 'file_size', fileInput.size);
            if (!limitCheck.allowed) {
                onLimitReached?.(limitCheck.reason!);
                return;
            }
        }

        if (credits) {
            const limitCheck = checkLimit(userStatus, 'credits', credits);
            if (!limitCheck.allowed) {
                onLimitReached?.(limitCheck.reason!);
                return;
            }
        }

        setLoading(true);
        try {
            let input: any;
            if (inputType === 'text') input = textInput;
            else if (inputType === 'form') input = formInput;
            else input = fileInput;

            const res = await onAction(input);
            setResult(res);
        } catch (e: any) {
            const errorMessage = e?.message || 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
            setResult(null);
            console.error('Tool error:', e);
        }
        setLoading(false);
        setProgressSteps('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (inputType === 'files') {
            const fileList = Array.from(files);
            const limitCheck = checkLimit(userStatus, 'batch_count', fileList.length);
            if (!limitCheck.allowed) {
                onLimitReached?.(limitCheck.reason!);
                // We still set them but the action will be blocked
                setFileInput(fileList);
            } else {
                setFileInput(fileList);
            }
        } else {
            const file = files[0];
            if (file) {
                const limitCheck = checkLimit(userStatus, 'file_size', file.size);
                if (!limitCheck.allowed) {
                    onLimitReached?.(limitCheck.reason!);
                }
                setFileInput(file);
            }
        }
    };

    const handleDownload = () => {
        if (result instanceof Blob) {
            const mime = (result.type || '').toLowerCase();
            const extensionByMime: Record<string, string> = {
                'application/pdf': 'pdf',
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
                'audio/mpeg': 'mp3',
                'application/zip': 'zip',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            };
            const extension = extensionByMime[mime] || (mime.split('/')[1] || 'processed');
            saveAs(result, `${id}_processed.${extension}`);
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
                <div className={styles.icon}>{icon}</div>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>
            </div>

            <div className={`${styles.card} glass`}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        {inputType === 'text' ? 'Input Data' : inputType === 'form' ? 'Configuration' : 'Upload File(s)'}
                    </label>

                    {inputType === 'text' ? (
                        <textarea
                            className={styles.textarea}
                            placeholder={inputPlaceholder}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                        />
                    ) : inputType === 'form' ? (
                        <div className={styles.formGrid}>
                            {fields.map(f => (
                                <div key={f.id} className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>{f.label}</label>
                                    {f.type === 'select' ? (
                                        <select
                                            className={styles.select}
                                            value={formInput[f.id]}
                                            onChange={(e) => handleFormChange(f.id, e.target.value)}
                                        >
                                            {f.options?.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : f.type === 'textarea' ? (
                                        <textarea
                                            className={styles.textareaSmall}
                                            placeholder={f.placeholder}
                                            value={formInput[f.id]}
                                            onChange={(e) => handleFormChange(f.id, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type={f.type}
                                            className={styles.input}
                                            placeholder={f.placeholder}
                                            value={formInput[f.id]}
                                            min={f.min}
                                            max={f.max}
                                            step={f.step}
                                            onChange={(e) => handleFormChange(f.id, f.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.fileBox}>
                            <input
                                type="file"
                                ref={fileRef}
                                multiple={inputType === 'files'}
                                accept={accept}
                                onChange={handleFileChange}
                                className={styles.fileInput}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className={styles.fileLabel}>
                                {fileInput ? (Array.isArray(fileInput) ? `${fileInput.length} files selected` : (fileInput as File).name) : 'Click to select or drag files'}
                            </label>
                        </div>
                    )}
                </div>

                <button
                    className="btn-primary"
                    onClick={handleAction}
                    disabled={loading || (inputType === 'text' ? !textInput : inputType === 'form' ? false : !fileInput)}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⌛</span>
                            Processing...
                        </span>
                    ) : (
                        buttonText
                    )}
                </button>

                {progressSteps && (
                    <div className={styles.progressInfo}>
                        <p style={{ fontSize: '0.9rem', color: '#a0aec0', marginTop: '1rem' }}>
                            {progressSteps}
                        </p>
                    </div>
                )}

                {credits && (
                    <div className={styles.creditCost}>
                        Cost: <strong>{credits} Credits</strong>
                    </div>
                )}

                {disclaimer && (
                    <div className={styles.disclaimer}>
                        <strong>Disclaimer:</strong> {disclaimer}
                    </div>
                )}

                <div className={styles.trustBadge}>
                    <Shield size={16} className={isAI ? styles.aiIcon : styles.trustIcon} />
                    <span>
                        {isAI
                            ? "AI Cloud: Data processed securely via Gemini AI. No data is stored."
                            : "Privacy Shield: 100% Local Browser Processing. Your data never leaves your device."}
                    </span>
                </div>

                {error && (
                    <div className={styles.errorContainer} style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginTop: '1rem'
                    }}>
                        <p style={{ color: '#ef4444', fontWeight: 500, marginBottom: '0.5rem' }}>
                            ⚠️ Error occurred
                        </p>
                        <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            {error}
                        </p>
                        <button
                            onClick={handleAction}
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            disabled={loading || (inputType === 'text' ? !textInput : inputType === 'form' ? false : !fileInput)}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {result !== null && !error && (
                    <div className={styles.resultGroup}>
                        <label className={styles.label}>Result</label>
                        <div className={styles.result}>
                            {result instanceof Blob ? (
                                <div className={styles.blobResult}>
                                    <span>✅ File ready for download</span>
                                    {(() => {
                                        const mime = (result.type || '').toLowerCase();
                                        const labelByMime: Record<string, string> = {
                                            'application/pdf': 'PDF',
                                            'image/jpeg': 'JPG',
                                            'image/jpg': 'JPG',
                                            'image/png': 'PNG',
                                            'image/webp': 'WEBP',
                                            'audio/mpeg': 'MP3',
                                            'application/zip': 'ZIP',
                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
                                        };
                                        const label = labelByMime[mime] || (mime.split('/')[1]?.toUpperCase() || 'FILE');
                                        return (
                                            <button className={styles.downloadBtn} onClick={handleDownload}>
                                                Download {label}
                                            </button>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <pre>{String(result)}</pre>
                            )}
                        </div>
                        {!(result instanceof Blob) && (
                            <button
                                className={styles.copyBtn}
                                onClick={() => navigator.clipboard.writeText(String(result))}
                            >
                                Copy to Clipboard
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
