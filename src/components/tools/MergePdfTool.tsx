'use client';

import { useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Download, FilePlus, GripVertical, Trash2, Shield } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';
import LimitModal from '../LimitModal';
import type { ToolDefinition } from '@/types/tools';

interface PDFFile {
    id: string;
    file: File;
    name: string;
    preview?: string;
}

export default function MergePdfTool({ tool, credits }: { tool: ToolDefinition, credits?: number }) {
    const { user, isPremium, credits: availableCredits } = useAuth();
    const [pdfs, setPdfs] = useState<PDFFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [limitReason, setLimitReason] = useState<string | null>(null);
    const [progress, setProgress] = useState('');

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium,
        credits: availableCredits,
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const incomingFiles = Array.from(e.target.files);
            const totalCount = pdfs.length + incomingFiles.length;

            const limitCheck = checkLimit(userStatus, 'batch_count', totalCount);
            if (!limitCheck.allowed) {
                setLimitReason(limitCheck.reason!);
                return;
            }

            const newFiles = incomingFiles.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name
            }));
            setPdfs(prev => [...prev, ...newFiles]);
        }
    };

    const removePdf = (idToRemove: string) => {
        setPdfs(pdfs.filter(p => p.id !== idToRemove));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newPdfs = [...pdfs];
        [newPdfs[index - 1], newPdfs[index]] = [newPdfs[index], newPdfs[index - 1]];
        setPdfs(newPdfs);
    };

    const moveDown = (index: number) => {
        if (index === pdfs.length - 1) return;
        const newPdfs = [...pdfs];
        [newPdfs[index + 1], newPdfs[index]] = [newPdfs[index], newPdfs[index + 1]];
        setPdfs(newPdfs);
    };

    const handleMerge = async () => {
        if (pdfs.length < 2) return;

        // Credit Check
        if (credits) {
            const creditCheck = checkLimit(userStatus, 'credits', credits);
            if (!creditCheck.allowed) {
                setLimitReason(creditCheck.reason!);
                return;
            }
        }

        setLoading(true);
        setProgress('');
        try {
            setProgress(`Preparing to merge ${pdfs.length} files...`);
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < pdfs.length; i++) {
                setProgress(`Loading PDF ${i + 1} of ${pdfs.length}...`);
                const pdfObj = pdfs[i];
                const arrayBuffer = await pdfObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                
                setProgress(`Processing ${pdfObj.name}...`);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            setProgress('Finalizing document...');
            const mergedPdfFile = await mergedPdf.save({ useObjectStreams: true });
            const pdfBytes = Uint8Array.from(mergedPdfFile);
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setProcessedBlob(blob);
            setProgress('');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to merge PDFs. Please try again.';
            console.error('Merge failed:', error);
            setProgress(`Error: ${message}`);
        }
        setLoading(false);
    };

    const handleDownload = () => {
        if (processedBlob) {
            saveAs(processedBlob, `merged_document_${Date.now()}.pdf`);
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
                        <div style={{ marginBottom: '20px', border: '2px dashed rgba(255,255,255,0.2)', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="pdf-upload"
                            />
                            <label htmlFor="pdf-upload" style={{ cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <FilePlus size={40} style={{ opacity: 0.7 }} />
                                <span>Click to add PDF files</span>
                            </label>
                        </div>

                        {pdfs.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                {pdfs.map((pdf, index) => (
                                    <div key={pdf.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <button onClick={() => moveUp(index)} disabled={index === 0} style={{ background: 'none', border: 'none', color: index === 0 ? 'transparent' : 'white', cursor: index === 0 ? 'default' : 'pointer' }}>▲</button>
                                            <button onClick={() => moveDown(index)} disabled={index === pdfs.length - 1} style={{ background: 'none', border: 'none', color: index === pdfs.length - 1 ? 'transparent' : 'white', cursor: index === pdfs.length - 1 ? 'default' : 'pointer' }}>▼</button>
                                        </div>
                                        <GripVertical size={20} style={{ opacity: 0.5 }} />
                                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pdf.name}</span>
                                        <button onClick={() => removePdf(pdf.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleMerge}
                            disabled={pdfs.length < 2 || loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⌛</span>
                                    Merging...
                                </span>
                            ) : (
                                `Merge ${pdfs.length} PDFs`
                            )}
                        </button>

                        {progress && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.5)',
                                borderRadius: '0.5rem',
                                fontSize: '0.9rem',
                                color: '#a0aec0'
                            }}>
                                {progress}
                            </div>
                        )}

                        {credits && (
                            <div className={styles.creditCost} style={{ marginTop: '10px' }}>
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
                            <span>Privacy Shield: 100% Local Browser Processing. Files are never uploaded.</span>
                        </div>

                        {pdfs.length === 1 && <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#f59e0b', marginTop: '10px' }}>Please add at least 2 PDFs to merge.</p>}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '15px', borderRadius: '50%', marginBottom: '10px' }}>
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </div>
                        <h2>Your PDFs have been merged!</h2>

                        <div style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '20px' }}>
                            <button
                                onClick={() => { setProcessedBlob(null); setPdfs([]); }}
                                className="btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Start Over
                            </button>
                            <button className="btn-primary" onClick={handleDownload} style={{ flex: 2, display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                <Download size={20} /> Download Merged PDF
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
