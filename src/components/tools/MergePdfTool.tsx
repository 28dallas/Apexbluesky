'use client';

import { useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Download, FilePlus, GripVertical, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
    id: string;
    file: File;
    name: string;
    preview?: string;
}

export default function MergePdfTool({ tool, id }: { tool: any, id: string }) {
    const [pdfs, setPdfs] = useState<PDFFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
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
        setLoading(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const pdfObj of pdfs) {
                const arrayBuffer = await pdfObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const mergedPdfFile = await mergedPdf.save({ useObjectStreams: true });
            const blob = new Blob([mergedPdfFile as any], { type: 'application/pdf' });
            setProcessedBlob(blob);
        } catch (e) {
            console.error('Merge failed:', e);
            alert('Failed to merge PDFs.');
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
                            {loading ? 'Merging PDFs...' : `Merge ${pdfs.length} PDFs`}
                        </button>
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
        </div>
    );
}
