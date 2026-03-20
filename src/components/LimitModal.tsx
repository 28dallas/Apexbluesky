'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import styles from './LimitModal.module.css';

interface LimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
}

export default function LimitModal({ isOpen, onClose, reason }: LimitModalProps) {
    const { user } = useAuth();
    if (!isOpen) return null;

    const isGuest = !user;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.icon}>💎</div>
                <h2 className={styles.title}>{reason.includes('trial') ? 'Trial Ended' : 'Limit Reached'}</h2>
                <p className={styles.description}>{reason}</p>

                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <span>✅</span> {isGuest ? 'Increase file limits' : 'Unlimited file sizes'}
                    </div>
                    <div className={styles.featureItem}>
                        <span>✅</span> {isGuest ? 'More batch files' : 'Unlimited batch processing'}
                    </div>
                    <div className={styles.featureItem}>
                        <span>✅</span> {isGuest ? 'Standard processing' : 'Priority processing (2x faster)'}
                    </div>
                </div>

                <p className={styles.callout}>
                    {isGuest
                        ? 'Unlock more features by creating a free account!'
                        : 'Level up your workflow with Apex Pro status.'}
                </p>

                <div className={styles.actions}>
                    {isGuest ? (
                        <>
                            <Link href="/signup" className="btn-primary" style={{ width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}>
                                Create Free Account
                            </Link>
                            <a
                                href="https://www.tiktok.com/@apex_bluesky"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.tiktokBtn}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    background: '#010101',
                                    color: 'white',
                                    padding: '0.8rem',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    marginBottom: '0.5rem'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                                </svg>
                                Follow on TikTok
                            </a>
                        </>
                    ) : (
                        <Link href="/pricing" className="btn-primary" style={{ width: '100%', textAlign: 'center', background: 'var(--accent-gradient)' }}>
                            Upgrade to Pro status
                        </Link>
                    )}
                    <button onClick={onClose} className={styles.closeBtn}>
                        Maybe Later
                    </button>
                    {isGuest && (
                        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                            Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Log in</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
