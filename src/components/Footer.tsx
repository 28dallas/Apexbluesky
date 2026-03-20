import Link from 'next/link';
import Image from 'next/image';
import { Shield, MessageSquarePlus } from 'lucide-react';
import styles from '@/app/page.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} id="site-footer">
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerCol}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo/logo.png"
                                alt="ApexBlueSky"
                                width={140}
                                height={35}
                                className={styles.logoImage}
                                style={{ height: 'auto', marginBottom: '1rem' }}
                            />
                        </Link>
                        <p className={styles.footerValueProp}>
                            Privacy-first web tools for developers, students, and creators. Use free tools instantly, then upgrade for Pro access and credit-based features.
                        </p>
                        <div className={styles.footerSocials}>
                            <a href="https://github.com/NathanKrop" target="_blank" className={styles.socialIcon} title="GitHub"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"></path></svg></a>
                            <a href="https://twitter.com/NathanKrop" target="_blank" className={styles.socialIcon} title="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
                            <a href="https://www.tiktok.com/@apex_bluesky" target="_blank" className={styles.socialIcon} title="TikTok"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg></a>
                        </div>
                        <div className={styles.trustBadge}>
                            <Shield className={styles.trustIcon} size={20} />
                            <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                                <strong>Privacy First.</strong> Files are processed locally in your browser where possible, or securely on cloud servers. Auto-deleted after use.
                            </span>
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
                        <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
                        <Link href="/contact" className={styles.footerLink}>Help Center</Link>
                        <a href="mailto:support@apexblueskytools.online?subject=Feature%20Request/Bug%20Report" className={styles.footerLink}>
                            <MessageSquarePlus size={16} /> Report a Bug
                        </a>
                        <Link href="/login" className={styles.footerLink}>User Dashboard</Link>
                        <Link href="/signup" className={styles.footerLink}>Create Account</Link>
                    </div>

                    <div className={styles.footerCol}>
                        <h4>Developer Details</h4>
                        <div className={styles.footerLink} style={{ cursor: 'default' }}>Name: Nate</div>
                        <div className={styles.footerLink} style={{ cursor: 'default' }}>Contact: +254702605566</div>
                        <a href="mailto:neithank47@gmail.com" className={styles.footerLink}>Email: neithank47@gmail.com</a>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <span>Engineered in Kenya 🇰🇪</span>
                </div>
            </div>
        </footer>
    );
}
