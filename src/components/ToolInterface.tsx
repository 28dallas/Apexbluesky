'use client';

import { useState, useRef } from 'react';
import styles from './ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';

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
    inputType?: 'text' | 'file' | 'files';
    accept?: string;
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
    accept = '*/*'
}: ToolInterfaceProps) {
    const { user } = useAuth();
    const [textInput, setTextInput] = useState(initialValue);
    const [fileInput, setFileInput] = useState<File | File[] | null>(null);
    const [result, setResult] = useState<string | number | Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: false // Placeholder for future stripe integration
    };

    const handleAction = async () => {
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

        setLoading(true);
        try {
            const input = inputType === 'text' ? textInput : fileInput;
            const res = await onAction(input);
            setResult(res);
        } catch (e: any) {
            setResult(`Error: ${e.message}`);
        }
        setLoading(false);
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
                        {inputType === 'text' ? 'Input Data' : 'Upload File(s)'}
                    </label>

                    {inputType === 'text' ? (
                        <textarea
                            className={styles.textarea}
                            placeholder={inputPlaceholder}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                        />
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
                    disabled={loading || (inputType === 'text' ? !textInput : !fileInput)}
                >
                    {loading ? 'Processing...' : buttonText}
                </button>

                {result !== null && (
                    <div className={styles.resultGroup}>
                        <label className={styles.label}>Result</label>
                        <div className={styles.result}>
                            {result instanceof Blob ? (
                                <div className={styles.blobResult}>
                                    <span>File ready for download</span>
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
                            ) : typeof result === 'string' && result.startsWith('Error') ? (
                                <span className={styles.error}>{result}</span>
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
