import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE_URL } from '@/lib/site';

const STORE_URL = `${SITE_URL}/store`;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'HY300 4K Smart Mini Projector Deal — Best AliExpress Tech Deals | ApexBlueSky',
  description:
    'Shop the HY300 4K Smart Mini Projector with Android 11, Dual WiFi & 180° rotation. Curated AliExpress affiliate deals on top-rated tech gadgets at up to 60% off.',
  keywords: [
    'HY300 projector',
    'HY300 4K mini projector',
    'smart mini projector AliExpress',
    'best mini projector 2024',
    'Android 11 projector',
    'home cinema projector deal',
    'AliExpress tech deals',
    'cheap 4K projector',
    'portable projector Android',
    'mini projector WiFi Bluetooth',
    'AliExpress affiliate deals',
    'best gadget deals online',
  ],
  alternates: {
    canonical: STORE_URL,
  },
  openGraph: {
    title: 'HY300 4K Smart Mini Projector — 60% OFF | ApexBlueSky Deals',
    description:
      'Get the HY300 Smart Mini Projector with Android 11, 4K decoding, Dual WiFi & 180° flip for just $59.99 (was $149.99). Free shipping via AliExpress.',
    url: STORE_URL,
    siteName: 'ApexBlueSky',
    images: [
      {
        url: `${SITE_URL}/Store/f6bfd5a79993cb10c63d2174d9c52ca0.jpg`,
        width: 1200,
        height: 630,
        alt: 'HY300 4K Smart Mini Projector — AliExpress Deal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HY300 4K Smart Mini Projector — 60% OFF on AliExpress',
    description:
      'Android 11, 4K decoding, Dual WiFi, 180° flip. Only $59.99. Free shipping. Buyer protection included.',
    images: [`${SITE_URL}/Store/f6bfd5a79993cb10c63d2174d9c52ca0.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'HY300 4K Smart Mini Projector Android 11 Home Cinema',
  description:
    'HY300 Smart Mini Projector featuring native 1080p with 4K decoding, Android 11 OS, Dual-Band WiFi, Bluetooth 5.0, and 180° rotation. Perfect for home cinema, gaming, and bedroom ceiling projection.',
  image: [
    `${SITE_URL}/Store/f6bfd5a79993cb10c63d2174d9c52ca0.jpg`,
    `${SITE_URL}/Store/0a81172ed88441bf4349c5163ecb3c95.jpg`,
    `${SITE_URL}/Store/10f1f460c94bdbe4db231060eee1ba22.jpg`,
    `${SITE_URL}/Store/41a852de9723df6e6eda83ec84657517.jpg`,
  ],
  brand: { '@type': 'Brand', name: 'HY300' },
  sku: 'hy300-projector',
  category: 'Electronics > Projectors',
  offers: {
    '@type': 'Offer',
    url: 'https://s.click.aliexpress.com/e/_c3mX5Ugr',
    priceCurrency: 'USD',
    price: '59.99',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'AliExpress' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 7, maxValue: 20, unitCode: 'DAY' },
      },
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1247',
    bestRating: '5',
    worstRating: '1',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Store', item: STORE_URL },
    { '@type': 'ListItem', position: 3, name: 'HY300 4K Smart Mini Projector', item: `${STORE_URL}#hy300-projector` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the HY300 projector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The HY300 is a smart mini projector with Android 11, native 1080p resolution, 4K decoding support, Dual-Band WiFi, Bluetooth 5.0, and 180° rotation for flexible placement including ceiling projection.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does the HY300 projector cost on AliExpress?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The HY300 projector is currently available for $59.99 on AliExpress, down from the original price of $149.99 — a saving of 60%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the HY300 projector support Netflix and YouTube?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The HY300 runs Android 11 OS, which supports Netflix, YouTube, Disney+, and other streaming apps directly without any additional device.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does AliExpress offer buyer protection on this projector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All purchases through AliExpress include buyer protection — if the item does not arrive or does not match the description, you are eligible for a full refund.',
      },
    },
  ],
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
