import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../page.module.css';
import ToolClient from '@/components/ToolClient';
import AdSense from '@/components/AdSense';
import AffiliateCard from '@/components/AffiliateCard';
import toolsData from '@/data/tools.json';

// Replace these with your actual AdSense Ad Unit IDs from your AdSense dashboard
const AD_SLOTS = {
    top: '1111111111',
    mid: '2222222222',
    bottom: '3333333333',
};

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const tool = (toolsData as any)[id];

    if (!tool) return { title: 'Tool Not Found - ApexBlueSky' };

    return {
        title: tool.seo?.title || `${tool.title} | ApexBlueSky Tools`,
        description: tool.seo?.description || tool.description,
    };
}

export default async function ToolPage({ params }: Props) {
    const { id } = await params;
    const tool = (toolsData as any)[id];

    if (!tool) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1>Tool Not Found</h1>
                <Link href="/" style={{ color: 'var(--accent-primary)' }}>Back Home</Link>
            </div>
        );
    }

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

            <div className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                {/* 1. Top Ad Banner */}
                <AdSense adSlot={AD_SLOTS.top} />

                {/* Main Tool Interface */}
                <ToolClient tool={tool} id={id} />

                {/* Affiliate Partner CTA Card */}
                {tool.affiliate && (
                    <AffiliateCard
                        name={tool.affiliate.name}
                        text={tool.affiliate.text}
                        url={tool.affiliate.url}
                        cta={tool.affiliate.cta}
                        logo={tool.affiliate.logo}
                        features={tool.affiliate.features}
                    />
                )}

                {/* 2. Below Tool Ad */}
                <AdSense adSlot={AD_SLOTS.mid} />

                {/* SEO Content: About / How to */}
                <section style={{ marginTop: '4rem', color: 'var(--text-secondary)' }}>
                    <div className="glass" style={{ padding: '2.5rem' }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>About {tool.title}</h2>
                        <p style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
                            {tool.seo?.description}
                        </p>

                        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>How to use this tool</h3>
                        <p style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
                            {tool.seo?.howTo || "Simply upload your file or paste your data into the input field above and click the button to process your request."}
                        </p>

                        {tool.seo?.faqs && tool.seo.faqs.length > 0 && (
                            <>
                                <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {tool.seo.faqs.map((faq: any, idx: number) => (
                                        <div key={idx}>
                                            <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Q: {faq.q}</p>
                                            <p>{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Related Tools Section */}
                {(() => {
                    const relatedTools = Object.entries(toolsData as any)
                        .filter(([rid, rdata]: [string, any]) => rid !== id && rdata.category === tool.category)
                        .slice(0, 4);
                    if (relatedTools.length === 0) return null;
                    return (
                        <section style={{ marginTop: '3rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Related Tools</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {relatedTools.map(([rid, rdata]: [string, any]) => (
                                    <Link
                                        key={rid}
                                        href={`/tools/${rid}`}
                                        className={styles.relatedToolCard}
                                    >
                                        <span style={{ fontSize: '1.5rem' }}>{rdata.icon}</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{rdata.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                })()}

                {/* 3. Bottom Ad Slot */}
                <AdSense adSlot={AD_SLOTS.bottom} />
            </div>

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
