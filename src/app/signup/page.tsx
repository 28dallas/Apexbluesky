'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from '../login/Auth.module.css';
import { trackEvent } from '@/lib/analytics';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        trackEvent('signup_submit');

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            trackEvent('signup_error', {
                message: error.message,
            });
            const msg = error.message === 'Failed to fetch'
                ? 'Authentication service is temporarily unavailable. Please try again in 5 minutes.'
                : error.message;
            setError(msg);
        } else {
            trackEvent('signup_success');
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
                        <Link
                            href="/login"
                            className="btn-primary"
                            style={{ width: '100%', textAlign: 'center' }}
                            onClick={() => trackEvent('login_page_click', { source: 'signup_success' })}
                        >
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
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    minLength={6}
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

                        <p className={styles.terms}>
                            By signing up, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
                        </p>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Creating account...' : 'Create Free Account'}
                        </button>
                    </form>

                    <p className={styles.switch}>
                        Already have an account? <Link href="/login" onClick={() => trackEvent('login_page_click', { source: 'signup_page' })}>Sign In</Link>
                    </p>

                    {/* TikTok follow prompt */}
                    <a
                        href="https://www.tiktok.com/@apex_bluesky"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            marginTop: '1rem',
                            background: 'linear-gradient(135deg, rgba(255,0,80,0.1), rgba(255,92,138,0.05))',
                            border: '1px solid rgba(255,0,80,0.25)',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            color: '#fff',
                            transition: 'border-color 0.2s, background 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,0,80,0.5)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,0,80,0.25)'; }}
                        onClick={() => trackEvent('social_click', {
                            platform: 'tiktok',
                            source: 'signup_page',
                        })}
                    >
                        <div style={{
                            width: '42px',
                            height: '42px',
                            background: 'linear-gradient(135deg, #010101, #ff0050)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Follow us on TikTok 🎵</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>Get free tutorials & tips @apex_bluesky</div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#ff0050', fontSize: '1.1rem' }}>→</div>
                    </a>
                </div>
            </div>
        </main>
    );
}
