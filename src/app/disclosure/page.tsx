import Link from 'next/link';
import Image from 'next/image';
import styles from '../page.module.css';

export const metadata = {
    title: 'Affiliate Disclosure - ApexBlueSky Tools',
    description: 'Information about our affiliate partnerships and how we earn commissions.',
};

export default function DisclosurePage() {
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
                    </nav>
                </div>
            </header>

            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
                <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Affiliate Disclosure</h1>

                <section className="glass" style={{ padding: '2.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Welcome to ApexBlueSky Tools. We believe in transparency and want to be upfront about how we maintain this free resource library.
                    </p>

                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }}>How We Earn Commissions</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Some of the links on this website are "affiliate links." This means if you click on the link and purchase a product or service from our partner, we may receive an affiliate commission.
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        <strong>This comes at no additional cost to you.</strong> In fact, sometimes our partnerships allow us to provide you with exclusive discounts or trial offers.
                    </p>

                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Our Goal</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Our primary mission is to provide high-quality, free utilities to the community. We only partner with companies and services that we believe provide genuine value to our users (such as Adobe, Canva, Grammarly, and others).
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        The commissions earned help us cover the costs of server hosting, development time, and API fees, allowing us to keep the majority of our tools free for everyone forever.
                    </p>

                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Your Trust</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Your trust is important to us. We do not accept payment for positive reviews. Our recommendations are based on our own assessment of tools that complement our native utilities.
                    </p>

                    <p style={{ marginTop: '3rem' }}>
                        If you have any questions regarding our affiliate relationships, please feel free to <Link href="/contact" style={{ color: 'var(--accent-primary)' }}>contact us</Link>.
                    </p>
                </section>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <Link href="/" className="btn-primary">Back to Tools</Link>
                </div>
            </div>

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
