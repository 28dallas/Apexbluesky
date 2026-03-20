import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.css';
import ToolClient from '@/components/ToolClient';
import AdSense from '@/components/AdSense';
import AffiliateCard from '@/components/AffiliateCard';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import toolsData from '@/data/tools.json';
import { SITE_URL } from '@/lib/site';
import Footer from '@/components/Footer';
import type { ToolCatalog, ToolDefinition, ToolFaq } from '@/types/tools';

// Replace these with your actual AdSense Ad Unit IDs from your AdSense dashboard
const AD_SLOTS = {
    top: '1111111111',
    mid: '2222222222',
    bottom: '3333333333',
};

type Props = {
    params: { id: string };
};

const toolCatalog = toolsData as ToolCatalog;

function getTool(id: string): ToolDefinition | undefined {
    return toolCatalog[id];
}

function getProcessingSummary(tool: ToolDefinition, id: string) {
    const aiActions = new Set([
        'essayGenerator',
        'paraphraseText',
        'grammarChecker',
        'generateBlogTitles',
        'generateBlogPost',
        'generateProductDesc',
        'draftEmail',
        'generateStory',
        'generateInstaCaption',
        'generateYTDescription',
        'generateLinkedInPost',
        'generateTweet',
        'generateSEOKeywords',
        'generateMetaTagsAI',
        'generateBlogOutline',
        'generateBusinessName',
        'generateValueProp',
        'generateImagePrompt',
        'generateCoverLetter',
        'generateResumeSummary',
        'reviewCode',
        'generateRegex',
        'generateFlashcards',
        'generateSlogan',
        'generateAltText',
        'generateSQL',
        'generateStudyPlan'
    ]);

    if (id === 'background-remover') {
        return `${tool.description} This tool runs an AI model locally in your browser, so your image stays on your device while processing.`;
    }

    if (id === 'mpesa-statement') {
        return `${tool.description} This tool formats statement data locally in your browser and does not upload or store your records on our servers.`;
    }

    if (aiActions.has(tool.action)) {
        return `${tool.description} This tool uses secure cloud AI processing to generate results. Submitted text is processed for the request and is not presented as local-only browser processing.`;
    }

    return `${tool.description} Processing happens in your browser where possible, so you can finish the job quickly without heavyweight desktop software.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const tool = getTool(id);

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
    const tool = getTool(id);

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
    const processingSummary = getProcessingSummary(tool, id);

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
        mainEntity: tool.seo.faqs.map((faq: ToolFaq) => ({
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
                                    {tool.seo.faqs.map((faq: ToolFaq, idx: number) => (
                                        <div key={idx}>
                                            <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Q: {faq.q}</p>
                                            <p>{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Processing & Privacy</h3>
                            <p style={{ lineHeight: '1.8' }}>
                                {processingSummary}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Tools Section */}
                {(() => {
                    const relatedTools = Object.entries(toolCatalog)
                        .filter(([rid, rdata]) => rid !== id && rdata.category === tool.category)
                        .slice(0, 4);
                    if (relatedTools.length === 0) return null;
                    return (
                        <section style={{ marginTop: '3rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Related Tools</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {relatedTools.map(([rid, rdata]) => (
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

            <Footer />
        </main>
    );
}
