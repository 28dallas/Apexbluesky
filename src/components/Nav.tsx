'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import styles from '@/app/page.module.css'; // Reuse existing styles
import { trackEvent } from '@/lib/analytics';

const homeCategories = ['All', 'BlueSky', 'PDF', 'Images', 'Writing', 'Video/Social', 'Technical', 'Education', 'Health'];

export default function Nav() {
    const { user, isPremium, credits, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isHomePage = pathname === '/';
    const activeCategory = searchParams.get('category') || 'All';

    const setCategory = (category: string) => {
        trackEvent('category_filter_click', {
            category,
        });
        const params = new URLSearchParams(searchParams.toString());

        if (category === 'All') {
            params.delete('category');
        } else {
            params.set('category', category);
        }

        const query = params.toString();
        router.replace(query ? `/?${query}` : '/');
    };

    return (
        <nav
            className={styles.nav}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                minHeight: isHomePage ? '116px' : '72px'
            }}
        >
            <div
                className="container"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '0.75rem 0'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', width: '100%', minHeight: '72px' }}>
                    <Link href="/" className={styles.logo} style={{ margin: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <Image
                            src="/logo/logo.png"
                            alt="ApexBlueSky"
                            width={156}
                            height={40}
                            priority
                            style={{ height: 'auto', width: '156px', maxWidth: '100%' }}
                        />
                    </Link>

                    {isHomePage && (
                        <div className={styles.navLinks} style={{ justifyContent: 'center' }}>
                            {homeCategories.map((category) => (
                                <button
                                    key={category}
                                    className={`${styles.navPill} ${activeCategory === category ? styles.activeNavPill : ''}`}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0 }}>
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
                                {!isPremium && !isHomePage && (
                                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: 240, lineHeight: 1.4 }}>
                                        Credit-priced tools use your balance. Free accounts start at 0 credits.
                                    </span>
                                )}
                                <Link
                                    href="/pricing"
                                    style={{ color: '#3b82f6', fontWeight: 500 }}
                                    onClick={() => trackEvent('pricing_page_click', { source: 'nav' })}
                                >
                                    Buy Credits
                                </Link>
                                <button 
                                    onClick={() => {
                                        trackEvent('logout_click');
                                        signOut();
                                    }}
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
                                <Link
                                    href="/login"
                                    className={styles.navLink}
                                    style={{ fontWeight: 500 }}
                                    onClick={() => trackEvent('login_page_click', { source: 'nav' })}
                                >
                                    Login
                                </Link>
                                <Link href="/signup" 
                                    className="btn-primary" 
                                    onClick={() => trackEvent('signup_page_click', { source: 'nav' })}
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
            </div>
        </nav>
    );
}
