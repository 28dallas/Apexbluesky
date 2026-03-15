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
