'use client';

import { useState } from 'react';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Search, MessageSquarePlus } from 'lucide-react';
import styles from './page.module.css';

import toolsData from '@/data/tools.json';
import AppDownloadSection from '@/components/AppDownloadSection';

const tools = Object.entries(toolsData).map(([id, data]) => ({
  id,
  ...(data as any)
}));

const categories = ['All', 'PDF', 'Images', 'Writing', 'Video/Social', 'Technical', 'Education', 'Health'];

const trendingIds = ['mpesa-statement', 'pdf-to-word', 'background-remover', 'essay-generator'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category.includes(activeCategory);
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo/logo.png"
                alt="ApexBlueSky"
                width={150}
                height={38}
                className={styles.logoImage}
                priority
                style={{ height: 'auto' }}
              />
            </Link>
            <div className={styles.navLinks}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.navPill} ${activeCategory === cat ? styles.activeNavPill : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.auth}>
              <Link href="/login" className={styles.navLink}>LOGIN</Link>
              <Link href="/signup" className="btn-primary">SIGN UP</Link>
            </div>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Every tool you need to work with files in one place</h1>
          <p className={styles.heroSub}>50+ tools to use PDFs and other files, at your fingertips. All are 100% FREE and easy to use!</p>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search tools (e.g., PDF to Word, M-Pesa, JSON...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </section>

      <section id="tools" className={styles.toolsSection}>
        <div className="container">

          {searchQuery === '' && activeCategory === 'All' && (
            <div className={styles.trendingSection}>
              <h2 className={styles.sectionTitle}>🔥 Trending Tools</h2>
              <div className={styles.grid}>
                {tools.filter(t => trendingIds.includes(t.id)).map(t => (
                  <ToolCard key={`trend-${t.id}`} {...t} />
                ))}
              </div>
              <h2 className={styles.sectionTitle} style={{ marginTop: '5rem' }}>Explore All Tools</h2>
            </div>
          )}

          <div className={styles.grid}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <AppDownloadSection />

      <footer className={styles.footer}>
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
              <div className={styles.trustBadge}>
                <Shield className={styles.trustIcon} size={20} />
                <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <strong>Processed 10,000+ files safely.</strong> Privacy first: files are auto-deleted after 10 minutes or processed locally.
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
              <Link href="/contact" className={styles.footerLink}>Help Center</Link>
              <a href="mailto:apexbluesky6@gmail.com?subject=Feature%20Request/Bug%20Report" className={styles.footerLink}>
                <MessageSquarePlus size={16} /> Report a Bug / Request a Tool
              </a>
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
