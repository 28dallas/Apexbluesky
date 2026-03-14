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
                            Email: <Link href="mailto:apexbluesky6@gmail.com" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>apexbluesky6@gmail.com</Link>
                        </p>
                        <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                            Phone: <Link href="tel:+254702605566" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>+254 702 605 566</Link>
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            <strong>Response Time:</strong> We aim to respond to all inquiries within 24–48 hours.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <Link href="https://github.com/NathanKrop" target="_blank" className="btn-primary">GitHub Profile</Link>
                            <Link href="https://www.tiktok.com/@apex_bluesky?_r=1&_t=ZS-94bCJVdKaO5" target="_blank" className="btn-primary" style={{ background: '#ff0050' }}>TikTok Tutorials</Link>
                            <Link href="https://twitter.com/NathanKrop" target="_blank" className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)' }}>X / Twitter</Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        <div className={styles.footerCol}>
                            <Link href="/" className={styles.logo}>
                                <Image
                                    src="/logo/logo.png"
                                    alt="ApexBlueSky"
                                    width={360}
                                    height={90}
                                    className={styles.logoImage}
                                    style={{ height: 'auto', marginBottom: '1rem' }}
                                />
                            </Link>
                            <p className={styles.footerValueProp}>
                                The ultimate precision-engineered utility hub. 43+ professional tools for developers, students, and creators. All 100% free.
                            </p>
                            <div className={styles.footerSocials}>
                                <a href="https://github.com/NathanKrop" target="_blank" className={styles.socialIcon} title="GitHub"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"></path></svg></a>
                                <a href="https://twitter.com/NathanKrop" target="_blank" className={styles.socialIcon} title="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
                                <a href="https://www.tiktok.com/@apex_bluesky" target="_blank" className={styles.socialIcon} title="TikTok"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg></a>
                            </div>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Popular Tools</h4>
                            <Link href="/tools/merge-pdf" className={styles.footerLink}>Merge PDF</Link>
                            <Link href="/tools/background-remover" className={styles.footerLink}>Background Remover</Link>
                            <Link href="/tools/essay-generator" className={styles.footerLink}>Essay Generator</Link>
                            <Link href="/tools/json-formatter" className={styles.footerLink}>JSON Formatter</Link>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Company</h4>
                            <Link href="/about" className={styles.footerLink}>About Us</Link>
                            <Link href="/contact" className={styles.footerLink}>Contact</Link>
                            <Link href="/disclosure" className={styles.footerLink}>Affiliate Disclosure</Link>
                            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Support</h4>
                            <Link href="/contact" className={styles.footerLink}>Help Center</Link>
                            <Link href="/login" className={styles.footerLink}>User Dashboard</Link>
                            <Link href="/signup" className={styles.footerLink}>Create Account</Link>
                            <Link href="mailto:apexbluesky6@gmail.com" className={styles.footerLink}>Business Inquiries</Link>
                        </div>
                    </div>

                    <div className={styles.footerBottom}>
                        <div>&copy; 2026 ApexBlueSky Tools. All rights reserved.</div>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <span>Engineered in Kenya 🇰🇪</span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
