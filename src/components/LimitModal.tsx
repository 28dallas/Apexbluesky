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
                <h2 className={styles.title}>Limit Reached</h2>
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
                        <Link href="/signup" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                            Create Free Account
                        </Link>
                    ) : (
                        <Link href="/pricing" className="btn-primary" style={{ width: '100%', textAlign: 'center', background: 'var(--accent-gradient)' }}>
                            Upgrade to Pro
                        </Link>
                    )}
                    <button onClick={onClose} className={styles.closeBtn}>
                        Maybe Later
                    </button>
                    {isGuest && (
                        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)' }}>Log in</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
