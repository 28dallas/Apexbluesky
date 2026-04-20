import type { Metadata } from 'next';
import styles from '../page.module.css';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
    title: 'About Nathan Krop – Software Engineer | ApexBlueSky Tools',
    description: 'ApexBlueSky Tools is built by Nathan Krop, a Software Engineer based in Nairobi, Kenya. Learn about the mission, tech stack, and the person behind the platform.',
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
        title: 'About Nathan Krop – ApexBlueSky Tools',
        description: 'Meet the engineer behind 40+ free online tools. Built with Next.js, TypeScript, and a privacy-first philosophy.',
        url: `${SITE_URL}/about`,
    },
};

export default function AboutPage() {
    return (
        <main className={styles.main}>
            <section className={styles.hero} style={{ padding: '6rem 0' }}>
                <div className="container">
                    <h1 className={`${styles.heroTitle} gradient-text`}>About ApexBlueSky Tools</h1>
                    <p className={styles.heroSub}>
                        A high-performance utility hub built for developers, students, and digital creators — by a developer who needed it.
                    </p>
                </div>
            </section>

            <section style={{ padding: '4rem 0', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>

                    {/* Builder Card */}
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            <Image
                                src="/logo/logo.png"
                                alt="Nathan Krop – Software Engineer, Nairobi Kenya"
                                width={80}
                                height={80}
                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                                <h2 style={{ color: '#fff', marginBottom: '0.25rem' }}>Nathan Krop</h2>
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>Software Engineer · Nairobi, Kenya</p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>GitHub →</a>
                                    <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>LinkedIn →</a>
                                </div>
                            </div>
                        </div>
                        <p>
                            I built ApexBlueSky Tools because I was tired of slow, ad-cluttered utility sites that make you sign up just to convert a PDF. As a full-stack engineer working daily with Next.js, TypeScript, and Tailwind CSS, I knew I could build something better — so I did.
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>The Engineering Behind the Tools</h2>
                        <p>
                            The platform is built with <strong style={{ color: '#fff' }}>Next.js 15 (App Router)</strong>, <strong style={{ color: '#fff' }}>TypeScript</strong>, and <strong style={{ color: '#fff' }}>Tailwind CSS</strong>, deployed on Vercel with edge caching for sub-100ms response times globally. AI-powered tools use the Gemini Pro API via secure server-side routes.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            Every tool is designed to run in your browser where possible — no unnecessary server round-trips, no data retention.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Our Mission</h2>
                        <p>
                            To give developers, students, and creators in Kenya and globally access to premium-quality web utilities — completely free, with no signup walls, no watermarks, and no compromises on speed or privacy.
                        </p>
                    </div>

                    {/* Privacy */}
                    <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Privacy First</h2>
                        <p>
                            Your data belongs to you. Most tools process everything locally in your browser — your files and code never touch our servers. For AI tools that require cloud processing, we use secure, session-scoped API calls with no data storage.
                        </p>
                    </div>

                    {/* Affiliates */}
                    <div className="glass" style={{ padding: '3rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Affiliate Partnerships</h2>
                        <p>
                            To keep this platform free and sustainable, we partner with tools like Adobe, Canva, and Grammarly. When you click a referral link, we may earn a small commission at no extra cost to you. We only recommend tools we genuinely use and trust. See our full <Link href="/disclosure" style={{ color: 'var(--accent-primary)' }}>affiliate disclosure</Link>.
                        </p>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
