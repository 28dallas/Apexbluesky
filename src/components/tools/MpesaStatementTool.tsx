'use client';

import { useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Lock, ShieldCheck, Mail, FileText } from 'lucide-react';
import { mpesaToPDF } from '@/lib/tools';

export default function MpesaStatementTool({ tool, id }: { tool: any, id: string }) {
    const [smsText, setSmsText] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Blob | string | null>(null);

    const handleProcess = async () => {
        if (!smsText.trim() && !file) return;
        setLoading(true);
        try {
            const res = await mpesaToPDF(file || smsText, password);
            setResult(res);
        } catch (e: any) {
            setResult(`Error: ${e.message}`);
        }
        setLoading(false);
    };

    const handleDownload = () => {
        if (result instanceof Blob) {
            saveAs(result, `mpesa_statement_${Date.now()}.pdf`);
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

            <div className={`${styles.card} glass`} style={{ border: '1px solid var(--accent-primary)' }}>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#10b981'
                }}>
                    <ShieldCheck size={24} />
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500 }}>
                        <strong>Privacy Guaranteed:</strong> Your statement is processed entirely in your browser. We never see your transactions or your password.
                    </p>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <FileText size={16} /> Official M-Pesa Statement (PDF)
                    </label>
                    <div className={styles.fileBox}>
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className={styles.fileInput}
                            id="mpesa-file"
                        />
                        <label htmlFor="mpesa-file" className={styles.fileLabel}>
                            {file ? file.name : 'Click to select or drag monthly statement'}
                        </label>
                    </div>
                </div>

                <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                    <label className={styles.label}>
                        <Mail size={16} /> OR Paste SMS Messages
                    </label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Paste your M-Pesa SMS messages here (one or many)..."
                        value={smsText}
                        onChange={(e) => setSmsText(e.target.value)}
                        style={{ height: '120px' }}
                    />
                </div>

                <div className={styles.inputGroup} style={{ marginTop: '10px' }}>
                    <label className={styles.label}>
                        <Lock size={16} /> Password (Optional)
                    </label>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="Enter PDF password if uploading a monthly statement"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white'
                        }}
                    />
                    <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>
                        * Password support for PDF uploads coming soon. Currently processing SMS text.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleProcess}
                    disabled={loading || (!smsText.trim() && !file)}
                    style={{ marginTop: '10px' }}
                >
                    {loading ? 'Generating Statement...' : 'Generate Pro PDF Statement'}
                </button>

                {result && (
                    <div className={styles.resultGroup}>
                        <label className={styles.label}>Generated Statement</label>
                        <div className={styles.result}>
                            {result instanceof Blob ? (
                                <div className={styles.blobResult}>
                                    <FileText size={20} />
                                    <span>Professional PDF Statement Ready</span>
                                    <button className={styles.downloadBtn} onClick={handleDownload}>
                                        Download PDF
                                    </button>
                                </div>
                            ) : (
                                <span className={styles.error}>{result}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
