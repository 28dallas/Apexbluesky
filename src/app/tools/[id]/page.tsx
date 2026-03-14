import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../page.module.css';
import ToolClient from '@/components/ToolClient';
import AdSense from '@/components/AdSense';
import AffiliateCard from '@/components/AffiliateCard';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import toolsData from '@/data/tools.json';
import { SITE_URL } from '@/lib/site';

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

    const canonical = `${SITE_URL}/tools/${id}`;
    const title = tool.seo?.title || `${tool.title} | ApexBlueSky Tools`;
    const description = tool.seo?.description || tool.description;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'ApexBlueSky Tools',
            type: 'website',
            images: [
                {
                    url: `${SITE_URL}/og-image.jpg`, // You can eventually make this tool-specific
                    width: 1200,
                    height: 630,
                    alt: `${tool.title} - ApexBlueSky Tools`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${SITE_URL}/og-image.jpg`],
        },
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

    const canonical = `${SITE_URL}/tools/${id}`;
    const pageTitle = tool.seo?.title || `${tool.title} | ApexBlueSky Tools`;
    const pageDescription = tool.seo?.description || tool.description;

    // JSON-LD: WebPage
    const ldWebPage = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageTitle,
        description: pageDescription,
        url: canonical,
        isPartOf: {
            "@type": "WebSite",
            name: "ApexBlueSky Tools",
            url: SITE_URL,
        },
    };

    // JSON-LD: SoftwareApplication
    const ldSoftwareApp = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.title,
        description: pageDescription,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        url: canonical,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        author: {
            "@type": "Organization",
            name: "ApexBlueSky Tools",
            url: SITE_URL
        }
    };

    // JSON-LD: FAQ
    const ldFaq = tool.seo?.faqs && tool.seo.faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tool.seo.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
            },
        })),
    } : null;

    // JSON-LD: Breadcrumb
    const ldBreadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL
            },
            {
                "@type": "ListItem",
                position: 2,
                name: tool.category,
                item: `${SITE_URL}/#${tool.category.toLowerCase()}`
            },
            {
                "@type": "ListItem",
                position: 3,
                name: tool.title,
                item: canonical
            }
        ]
    };

    // JSON-LD: HowTo
    const ldHowTo = tool.seo?.howTo ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use ${tool.title}`,
        description: `Step-by-step guide on using the ${tool.title} tool.`,
        step: [
            {
                "@type": "HowToStep",
                text: tool.seo.howTo
            }
        ]
    } : null;

    return (
        <main className={styles.main}>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldWebPage) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldSoftwareApp) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
            />
            {ldFaq && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }}
                />
            )}
            {ldHowTo && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ldHowTo) }}
                />
            )}

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

            <div className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                {/* 1. Top Ad Banner */}
                <AdSense adSlot={AD_SLOTS.top} />

                {/* Main Tool Interface */}
                <ToolClient tool={tool} id={id} />

                {/* Affiliate Partner CTA Card */}
                {tool.affiliate && (
                    <div style={{ marginTop: '2rem' }}>
                        <AffiliateCard
                            name={tool.affiliate.name}
                            text={tool.affiliate.text}
                            url={tool.affiliate.url}
                            cta={tool.affiliate.cta}
                            logo={tool.affiliate.logo}
                            features={tool.affiliate.features}
                        />
                        <AffiliateDisclosure />
                    </div>
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

                        {/* Additional Content Blocks for "Density" */}
                        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Why choose our {tool.title}?</h3>
                            <p style={{ lineHeight: '1.8' }}>
                                Unlike other online utilities, our {tool.title} is designed for privacy and speed. All processing is character-based or calculated within your browser, meaning your sensitive data never touches our servers. It's safe, secure, and ready for professional use.
                            </p>
                        </div>
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

            <footer className={styles.footer} id="site-footer">
                <div className="container">
                    <div className={styles.footerContent}>
                        <div className={styles.footerLogo}>
                            <Link href="/">
                                <Image
                                    src="/logo/logo.png"
                                    alt="ApexBlueSky"
                                    width={360}
                                    height={90}
                                    className={styles.logoImage}
                                    style={{ height: 'auto' }}
                                />
                            </Link>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <Link href="/about" className={styles.copy}>About</Link>
                            <Link href="/privacy" className={styles.copy}>Privacy</Link>
                            <Link href="/contact" className={styles.copy}>Contact</Link>
                            <Link href="/disclosure" className={styles.copy}>Affiliate Disclosure</Link>
                        </div>
                        <div className={styles.copy}>&copy; 2026 ApexBlueSky Tools. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
