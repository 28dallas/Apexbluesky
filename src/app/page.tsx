'use client';

import { useState } from 'react';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Search, MessageSquarePlus } from 'lucide-react';
import styles from './page.module.css';

import toolsData from '@/data/tools.json';
import AppDownloadSection from '@/components/AppDownloadSection';
import Footer from '@/components/Footer';

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
          <p className={styles.heroSub}>53+ tools to use PDFs and other files, at your fingertips. All are 100% FREE and easy to use!</p>
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

      <Footer />
    </main>
  );
}
