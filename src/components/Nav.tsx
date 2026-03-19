'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Crown } from 'lucide-react';
import styles from '@/app/page.module.css'; // Reuse existing styles

export default function Nav() {
    const { user, isPremium, credits, signOut } = useAuth();

    return (
        <nav className={styles.nav} style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                <Link href="/" className={styles.logo} style={{ margin: 0 }}>
                    <img
                        src="/logo/logo.png"
                        alt="ApexBlueSky"
                        style={{ width: 150, height: 'auto' }}
                    />
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                <span>{user.email?.split('@')[0]}</span>
                                {!isPremium && (
                                    <span style={{ 
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        border: '1px solid rgba(99, 102, 241, 0.4)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem'
                                    }}>
                                        💳 {credits ?? 0} Credits
                                    </span>
                                )}
                                <span className={isPremium ? 'pro-badge' : 'free-badge'} style={{
                                    fontSize: '0.75rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '3px',
                                    fontWeight: 'bold',
                                    background: isPremium ? '#22c55e' : '#f59e0b',
                                    color: 'white'
                                }}>
                                    {isPremium ? 'PRO' : 'FREE'}
                                </span>
                            </div>
                            <Link href="/pricing" style={{ color: '#3b82f6', fontWeight: 500 }}>Buy Credits</Link>
                            <button 
                                onClick={signOut} 
                                title="Logout"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.navLink} style={{ fontWeight: 500 }}>Login</Link>
                            <Link href="/signup" 
                                className="btn-primary" 
                                style={{ 
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                }}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

