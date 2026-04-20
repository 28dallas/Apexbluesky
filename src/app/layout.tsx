import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: "Free Online Tools for Developers & Creators | ApexBlueSky",
  description: "40+ free online tools for PDF, code, images & writing. No signup needed. Works in your browser. Built for developers, students & creators worldwide.",
  openGraph: {
    title: "Free Online Tools for Developers & Creators | ApexBlueSky",
    description: "40+ free online tools for PDF, code, images & writing. No signup needed. Works in your browser. Built for developers, students & creators worldwide.",
    url: SITE_URL,
    siteName: 'ApexBlueSky Tools',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ApexBlueSky Tools – 40+ Free Online Tools. Try Free →',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools for Developers & Creators | ApexBlueSky',
    description: '40+ free online tools for PDF, code, images & writing. No signup. Works in your browser. Try free →',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  other: {
    "google-adsense-account": "ca-pub-7586264347899672",
  },
};

// Replace ca-pub-XXXXXXXXXXXXXXXXX with your actual AdSense Publisher ID
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-7586264347899672';

// Replace G-XXXXXXXXXX with your actual GA Measurement ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ChatWidget from "@/components/ChatWidget";

import Nav from '@/components/Nav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />
        {/* structured data */}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ApexBlueSky Tools",
              "url": SITE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL}/?search={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <AuthProvider>
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </AuthProvider>
        <ChatWidget />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
