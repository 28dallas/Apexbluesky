'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from '../../login/Auth.module.css';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            // Supabase auth handles the hash in the URL automatically via onAuthStateChange
            // However, we explicitly check for auth errors in the hash fragment here if needed
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const queryParams = new URLSearchParams(window.location.search);

            const errorParam = hashParams.get('error') || queryParams.get('error');
            const errorDescriptionParam = hashParams.get('error_description') || queryParams.get('error_description');

            if (errorParam) {
                setError(errorDescriptionParam || errorParam);
                return;
            }

            // Since PKCE flow exchange happens under the hood or via hash,
            // we can just wait for a session to be established and redirect.
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                router.push('/');
            } else {
                // If there's no session and no error, maybe it's still processing
                // or the user navigated here directly without a token.
                // We listen for the auth state change:
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' && session) {
                        router.push('/');
                    }
                });

                // Set a timeout to redirect to login if no auth state resolves
                const timeout = setTimeout(() => {
                    setError("Authentication callback timed out. Please try logging in again.");
                }, 5000);

                return () => {
                    subscription.unsubscribe();
                    clearTimeout(timeout);
                };
            }
        };

        handleCallback();
    }, [router]);

    return (
        <main className={styles.authMain}>
            <div className={styles.authContainer}>
                <div className={`${styles.authCard} glass`}>
                    {error ? (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                            <h1 className={styles.title}>Authentication Error</h1>
                            <p className={styles.description} style={{ color: 'var(--accent-red)' }}>
                                {error}
                            </p>
                            <button onClick={() => router.push('/login')} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Back to Login
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⏳</div>
                            <h1 className={styles.title}>Completing Sign In</h1>
                            <p className={styles.description}>
                                Please wait while we securely log you in...
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
