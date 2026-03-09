'use client';

import styles from '../page.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.logo}>
                            <Image src="/logo.png" alt="Apex Blue Sky Logo" width={540} height={135} style={{ objectFit: 'contain' }} priority />
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
                    <h1 className={`${styles.heroTitle} gradient-text`}>Get in Touch</h1>
                    <p className={styles.heroSub}>
                        Have a suggestion for a new tool? Found a bug? We’d love to hear from you.
                    </p>
                </div>
            </section>

            <section style={{ padding: '4rem 0' }}>
                <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✉️</div>
                        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Contact Information</h2>
                        <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                            Email: <Link href="mailto:admin@apexblueskytools.com" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>admin@apexblueskytools.com</Link>
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            <strong>Response Time:</strong> We aim to respond to all inquiries within 24–48 hours.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                            <Link href="https://github.com/NathanKrop" target="_blank" className="btn-primary">GitHub Profile</Link>
                            <Link href="https://twitter.com/NathanKrop" target="_blank" className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)' }}>X / Twitter</Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerContent}>
                        <div className={styles.footerLogo}>
                            <Image src="/logo.png" alt="Apex Blue Sky Logo" width={450} height={120} style={{ objectFit: 'contain' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link href="/about" className={styles.copy}>About</Link>
                            <Link href="/privacy" className={styles.copy}>Privacy</Link>
                            <Link href="/contact" className={styles.copy}>Contact</Link>
                        </div>
                        <div className={styles.copy}>&copy; 2026 ApexBlueSky Tools. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
