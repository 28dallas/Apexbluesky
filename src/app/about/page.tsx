'use client';

import styles from '../page.module.css';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.logo}>APEX BLUE SKY</Link>
                        <div className={styles.auth}>
                            <Link href="/login" className={styles.navLink}>LOGIN</Link>
                            <Link href="/signup" className="btn-primary">SIGN UP</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <section className={styles.hero} style={{ padding: '6rem 0' }}>
                <div className="container">
                    <h1 className={`${styles.heroTitle} gradient-text`}>About ApexBlueSky Tools</h1>
                    <p className={styles.heroSub}>
                        Welcome to ApexBlueSky Tools, a high-performance utility hub designed for developers, students, and digital creators.
                    </p>
                </div>
            </section>

            <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Our Mission</h2>
                        <p>
                            In a world of cluttered, slow, and ad-heavy utility sites, we aim to provide a Premium, Dark-Themed experience that is lightning-fast and privacy-focused. Every one of our 33+ tools—from our PDF suite to our Developer formatters—is built to run with maximum efficiency in your browser.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>The Engineering Behind the Tools</h2>
                        <p>
                            Founded by <strong>Nathan Krop</strong>, a Software Engineer based in Kenya, this platform was born out of a need for clean, functional web utilities that don't compromise on design. Built with Next.js and TypeScript, ApexBlueSky Tools represents the intersection of high-end software engineering and everyday utility.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Privacy First</h2>
                        <p>
                            We believe your data belongs to you. Most of our tools process data locally in your browser, meaning your sensitive documents and code snippets never touch a server.
                        </p>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerContent}>
                        <div className={styles.footerLogo}>APEX BLUE SKY</div>
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
