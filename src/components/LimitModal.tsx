'use client';

import Link from 'next/link';
import styles from './LimitModal.module.css';

interface LimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason: string;
}

export default function LimitModal({ isOpen, onClose, reason }: LimitModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.icon}>💎</div>
                <h2 className={styles.title}>Limit Reached</h2>
                <p className={styles.description}>{reason}</p>

                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <span>✅</span> Unlimited file sizes
                    </div>
                    <div className={styles.featureItem}>
                        <span>✅</span> Batch process unlimited files
                    </div>
                    <div className={styles.featureItem}>
                        <span>✅</span> Faster processing priority
                    </div>
                </div>

                <p className={styles.callout}>Unlock everything by creating a free account!</p>

                <div className={styles.actions}>
                    <Link href="/signup" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                        Create Free Account
                    </Link>
                    <button onClick={onClose} className={styles.closeBtn}>
                        Maybe Later
                    </button>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                        Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)' }}>Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
