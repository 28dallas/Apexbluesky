'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from '../login/Auth.module.css';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
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
                            We sent a confirmation link to <strong>{email}</strong>.
                            Please click the link to activate your account.
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
                    <Image src="/logo/logo.png" alt="Apex Blue Sky Logo" width={480} height={120} style={{ objectFit: 'contain' }} priority />
                </Link>

                <div className={`${styles.authCard} glass`}>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join thousands of creators using premium tools.</p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleSignup} className={styles.form}>
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
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required
                            />
                        </div>

                        <p className={styles.terms}>
                            By signing up, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
                        </p>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Creating account...' : 'Create Free Account'}
                        </button>
                    </form>

                    <p className={styles.switch}>
                        Already have an account? <Link href="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
