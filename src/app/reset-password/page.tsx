'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import styles from '../login/Auth.module.css';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Check if the user arrived here with a valid recovery token in hash
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorParam = hashParams.get('error') || hashParams.get('error_description');

        if (errorParam) {
            setError(errorParam);
        }
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password
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
                        <div style={{ fontSize: '3rem' }}>✅</div>
                        <h1 className={styles.title}>Password Updated</h1>
                        <p className={styles.description}>
                            Your password has been successfully reset.
                        </p>
                        <Link href="/" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                            Go to Homepage
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
                    <h1 className={styles.title}>Set New Password</h1>
                    <p className={styles.subtitle}>Enter your new password below.</p>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleUpdatePassword} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
