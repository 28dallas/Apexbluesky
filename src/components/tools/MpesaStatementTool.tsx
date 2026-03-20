'use client';

import { useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Lock, Mail, FileText, Shield } from 'lucide-react';
import { mpesaToPDF } from '@/lib/tools';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';
import LimitModal from '../LimitModal';
import type { ToolDefinition } from '@/types/tools';

export default function MpesaStatementTool({
    tool,
    credits,
    disclaimer,
    guestCreditsRemaining,
    onActionComplete
}: {
    tool: ToolDefinition,
    credits?: number,
    disclaimer?: string,
    guestCreditsRemaining?: number,
    onActionComplete?: (spent: number) => void
}) {
    const { user, isPremium, credits: availableCredits } = useAuth();
    const [smsText, setSmsText] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Blob | string | null>(null);
    const [limitReason, setLimitReason] = useState<string | null>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium,
        credits: availableCredits,
        guestCreditsRemaining: guestCreditsRemaining,
    };

    const handleProcess = async () => {
        if (!smsText.trim() && !file) return;

        // Limit Checks
        if (file) {
            const sizeCheck = checkLimit(userStatus, 'file_size', file.size);
            if (!sizeCheck.allowed) {
                setLimitReason(sizeCheck.reason!);
                return;
            }
        }

        if (credits) {
            const creditCheck = checkLimit(userStatus, 'credits', credits);
            if (!creditCheck.allowed) {
                setLimitReason(creditCheck.reason!);
                return;
            }
        }

        setLoading(true);
        try {
            const res = await mpesaToPDF(file || smsText, password);
            setResult(res);
            if (credits) onActionComplete?.(credits);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to generate statement.';
            setResult(`Error: ${message}`);
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
                </div>

                <button
                    className="btn-primary"
                    onClick={handleProcess}
                    disabled={loading || (!smsText.trim() && !file)}
                    style={{ marginTop: '10px' }}
                >
                    {loading ? 'Generating Statement...' : 'Generate Pro PDF Statement'}
                </button>

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

                {disclaimer && (
                    <div className={styles.disclaimer} style={{ marginTop: '15px' }}>
                        <strong>Legal Disclaimer:</strong> {disclaimer}
                    </div>
                )}

                <div className={styles.trustBadge}>
                    <Shield size={16} className={styles.trustIcon} />
                    <span>Privacy Shield: 100% Local Browser Processing. Statements are never uploaded or stored.</span>
                </div>

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
            <LimitModal
                isOpen={!!limitReason}
                onClose={() => setLimitReason(null)}
                reason={limitReason || ''}
            />
        </div>
    );
}
