'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from './Auth.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            window.location.href = '/';
        }
        setLoading(false);
    };

    return (
        <main className={styles.authMain}>
            <div className={styles.authContainer}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo/logo.png"
                        alt="ApexBlueSky"
                        width={480}
                        height={120}
                        className={styles.logoImage}
                        priority
                        style={{ height: 'auto' }}
                    />
                </Link>

                <div className={`${styles.authCard} glass`}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Unlock unlimited tools and premium features.</p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleLogin} className={styles.form}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label>Password</label>
                                <Link href="/forgot" className={styles.forgot}>Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className={styles.switch}>
                        Don't have an account? <Link href="/signup">Sign Up for Free</Link>
                    </p>
                </div>

                <div className={styles.footerLink}>
                    <Link href="/privacy">Privacy Policy</Link>
                    <span>&bull;</span>
                    <Link href="/contact">Help Center</Link>
                </div>
            </div>
        </main>
    );
}
