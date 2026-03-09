'use client';

import { useState, useRef } from 'react';
import styles from './ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';

interface ToolInterfaceProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    inputPlaceholder: string;
    buttonText: string;
    onAction: (input: any) => Promise<string | number | Blob | null>;
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
    initialValue = '',
    inputType = 'text',
    accept = '*/*'
}: ToolInterfaceProps) {
    const [textInput, setTextInput] = useState(initialValue);
    const [fileInput, setFileInput] = useState<File | File[] | null>(null);
    const [result, setResult] = useState<string | number | Blob | null>(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleAction = async () => {
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

    const handleDownload = () => {
        if (result instanceof Blob) {
            const extension = result.type.split('/')[1] || 'processed';
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
                                onChange={(e) => setFileInput(inputType === 'files' ? Array.from(e.target.files || []) : e.target.files?.[0] || null)}
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
                                    <button className={styles.downloadBtn} onClick={handleDownload}>
                                        Download {result.type.split('/')[1].toUpperCase()}
                                    </button>
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
