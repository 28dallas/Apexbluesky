'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from '../login/Auth.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <main className={styles.authMain}>
                <div className={styles.authContainer}>
                    <div className={`${styles.authCard} glass`}>
                        <div style={{ fontSize: '3rem' }}>✉️</div>
                        <h1 className={styles.title}>Check your email</h1>
                        <p className={styles.description}>
                            We sent a password reset link to <strong>{email}</strong>.
                            Please check your inbox.
                        </p>
                        <Link href="/login" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.authMain}>
            <div className={styles.authContainer}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo/logo.png"
                        alt="ApexBlueSky"
                        width={180}
                        height={45}
                        className={styles.logoImage}
                        priority
                        style={{ height: 'auto' }}
                    />
                </Link>

                <div className={`${styles.authCard} glass`}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>Enter your email to receive a reset link.</p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleReset} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className={styles.switch} style={{ marginTop: '1.5rem' }}>
                        Remember your password? <Link href="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
