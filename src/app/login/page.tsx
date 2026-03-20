'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from './Auth.module.css';
import { trackEvent } from '@/lib/analytics';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        trackEvent('login_submit');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            trackEvent('login_error', {
                message: error.message,
            });
            const msg = error.message === 'Failed to fetch'
                ? 'Authentication service is temporarily unavailable. Please try again in 5 minutes.'
                : error.message;
            setError(msg);
        } else {
            trackEvent('login_success');
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
                        width={180}
                        height={45}
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
                                <Link
                                    href="/forgot"
                                    className={styles.forgot}
                                    onClick={() => trackEvent('forgot_password_click')}
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className={styles.switch}>
                        Don't have an account? <Link href="/signup" onClick={() => trackEvent('signup_page_click', { source: 'login_page' })}>Sign Up for Free</Link>
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
