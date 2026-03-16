'use client';

import styles from '../page.module.css';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
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
                        <div className={styles.auth}>
                            <Link href="/login" className={styles.navLink}>LOGIN</Link>
                            <Link href="/signup" className="btn-primary">SIGN UP</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <section className={styles.hero} style={{ padding: '6rem 0' }}>
                <div className="container">
                    <h1 className={`${styles.heroTitle} gradient-text`}>Privacy Policy</h1>
                    <p className={styles.heroSub}>
                        Your privacy is our priority. Learn how we handle your data and our commitment to transparency.
                    </p>
                </div>
            </section>

            <section style={{ padding: '4rem 0' }}>
                <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Cookies & Tracking</h2>
                        <p>
                            We use cookies to analyze site traffic via Google Analytics and to serve personalized ads through Google AdSense. Cookies help us understand how you interact with our tools so we can continue to improve the user experience.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Affiliate Disclosure</h2>
                        <p>
                            ApexBlueSky Tools is a participant in the Amazon Services LLC Associates Program and other affiliate platforms. We may earn a commission from qualifying purchases made through our links at no additional cost to you. These commissions help support the maintenance of this platform.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Data Usage</h2>
                        <p>
                            We do not store or collect the data you input into our tools (e.g., PDF content, JSON strings). All processing is temporary and session-based. Most of our tools process data locally in your browser, ensuring maximum privacy for your documents and snippets.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
