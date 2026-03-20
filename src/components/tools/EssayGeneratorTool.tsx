'use client';

import { useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { BookOpen, GraduationCap, Quote, MessageSquare, Shield } from 'lucide-react';
import { essayGenerator } from '@/lib/tools';
import { useAuth } from '@/context/AuthContext';
import { checkLimit } from '@/lib/limits';
import LimitModal from '../LimitModal';
import type { ToolDefinition } from '@/types/tools';

export default function EssayGeneratorTool({ tool, credits }: { tool: ToolDefinition, credits?: number }) {
    const { user, isPremium, credits: availableCredits } = useAuth();
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('University');
    const [tone, setTone] = useState('Analytical');
    const [citations, setCitations] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [limitReason, setLimitReason] = useState<string | null>(null);

    const userStatus = {
        isLoggedIn: !!user,
        isPremium: isPremium,
        credits: availableCredits,
    };

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        // Credit Check
        if (credits) {
            const creditCheck = checkLimit(userStatus, 'credits', credits);
            if (!creditCheck.allowed) {
                setLimitReason(creditCheck.reason!);
                return;
            }
        }

        setLoading(true);
        try {
            const res = await essayGenerator(topic, {
                level,
                tone,
                includeCitations: citations
            });
            setResult(res as string);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to generate essay.';
            setResult(`Error: ${message}`);
        }
        setLoading(false);
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
                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <MessageSquare size={16} /> Essay Topic or Prompt
                    </label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Enter your essay topic or a detailed prompt..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        style={{ height: '120px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <GraduationCap size={16} /> Academic Level
                        </label>
                        <select
                            className={styles.select}
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white'
                            }}
                        >
                            <option value="High School">High School</option>
                            <option value="University">University (Undergrad)</option>
                            <option value="Masters">Masters / PhD</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <BookOpen size={16} /> Tone / Style
                        </label>
                        <select
                            className={styles.select}
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white'
                            }}
                        >
                            <option value="Argumentative">Argumentative</option>
                            <option value="Narrative">Narrative</option>
                            <option value="Analytical">Analytical</option>
                            <option value="Expository">Expository</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="citations"
                        checked={citations}
                        onChange={(e) => setCitations(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="citations" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Quote size={16} /> Include Academic Citations (APA/MLA style)
                    </label>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                >
                    {loading ? 'Generating Essay...' : 'Generate Pro Essay'}
                </button>

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
                    <Shield size={16} className={styles.aiIcon} />
                    <span>AI Cloud Processing: Secured by Gemini-Pro. High-quality academic generation.</span>
                </div>

                {result && (
                    <div className={styles.resultGroup}>
                        <label className={styles.label}>Generated Content</label>
                        <div className={styles.result} style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
                            {result.startsWith('Error') ? (
                                <span className={styles.error}>{result}</span>
                            ) : (
                                <div>{result}</div>
                            )}
                        </div>
                        {!result.startsWith('Error') && (
                            <button
                                className={styles.copyBtn}
                                onClick={() => navigator.clipboard.writeText(result)}
                            >
                                Copy to Clipboard
                            </button>
                        )}
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
