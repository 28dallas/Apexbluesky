import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApexBlueSky Tools - Premium Utility Hub",
  description: "High-performance, privacy-focused tool library for developers, students, and creators. 43+ tools built for speed.",
  openGraph: {
    title: "ApexBlueSky Tools",
    description: "43+ High-performance web utilities for developers, students, and creators.",
    url: 'https://www.apexbluesky.com',
    siteName: 'ApexBlueSky Tools',
    images: [
      {
        url: 'https://www.apexbluesky.com/og-image.jpg',
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
  },
};

// Replace ca-pub-XXXXXXXXXXXXXXXXX with your actual AdSense Publisher ID
const ADSENSE_ID = 'ca-pub-XXXXXXXXXXXXXXXXX';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
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
