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
import { useAuth } from '@/context/AuthContext';

const tools = Object.entries(toolsData).map(([id, data]) => ({
  id,
  ...(data as any)
}));

const categories = ['All', 'BlueSky', 'PDF', 'Images', 'Writing', 'Video/Social', 'Technical', 'Education', 'Health'];

const trendingIds = ['mpesa-statement', 'pdf-to-word', 'background-remover', 'essay-generator'];

export default function Home() {
  const { user, isPremium, credits, signOut } = useAuth();
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
          {/* Category pills only on home */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.navPill} ${activeCategory === cat ? styles.activeNavPill : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Every tool you need to work with files in one place</h1>
          <p className={styles.heroSub}>
            53+ tools to use PDFs and other files, at your fingertips.
            {isPremium ? ' Enjoy unlimited professional access.' : ' All are easy to use!'}
          </p>
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
