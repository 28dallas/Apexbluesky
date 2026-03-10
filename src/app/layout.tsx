import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: "ApexBlueSky Tools - Premium Utility Hub",
  description: "High-performance, privacy-focused tool library for developers, students, and creators. 43+ tools built for speed.",
  openGraph: {
    title: "ApexBlueSky Tools",
    description: "43+ High-performance web utilities for developers, students, and creators.",
    url: SITE_URL,
    siteName: 'ApexBlueSky Tools',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ApexBlueSky Tools Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexBlueSky Tools - Premium Utility Hub',
    description: '43+ lighting-fast tools for developers, students, and creators.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

// Replace ca-pub-XXXXXXXXXXXXXXXXX with your actual AdSense Publisher ID
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXXX';

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
