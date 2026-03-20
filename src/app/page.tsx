'use client';

import { Suspense, useState } from 'react';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './page.module.css';

import toolsData from '@/data/tools.json';
import AppDownloadSection from '@/components/AppDownloadSection';
import RecentlyUsed from '@/components/RecentlyUsed';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { TRENDING_TOOL_IDS } from '@/config/toolConfig';
import type { ToolDefinition, ToolWithId } from '@/types/tools';

const tools: ToolWithId[] = Object.entries(toolsData).map(([id, data]) => ({
  id,
  ...(data as ToolDefinition)
}));

const trendingIds = TRENDING_TOOL_IDS;
const mpesaTool = tools.find((tool) => tool.id === 'mpesa-to-pdf');

export default function Home() {
  return (
    <Suspense fallback={<main className={styles.main} />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { isPremium } = useAuth();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const activeCategory = searchParams.get('category') || 'All';
  const trendingTools = trendingIds
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolWithId => Boolean(tool));

  const filteredTools = tools.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category.includes(activeCategory);
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className={styles.main}>
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

          {mpesaTool && (
            <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ maxWidth: '720px' }}>
                  <p style={{ margin: 0, color: '#4ade80', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    Kenya Spotlight
                  </p>
                  <h2 style={{ margin: '0.5rem 0', color: '#fff', fontSize: '1.7rem' }}>
                    {mpesaTool.icon} M-Pesa Statement PDF
                  </h2>
                  <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7 }}>
                    Convert pasted M-Pesa SMS messages or monthly statement PDFs into a clean downloadable document. It is one of the most locally useful tools on the platform and built specifically for real workflows in Kenya.
                  </p>
                </div>
                <Link href={`/tools/${mpesaTool.id}`} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Open M-Pesa Tool
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="tools" className={styles.toolsSection}>
        <div className="container">

          {searchQuery === '' && activeCategory === 'All' && (
            <div className={styles.trendingSection}>
              <RecentlyUsed />
              <h2 className={styles.sectionTitle}>🔥 Trending Tools</h2>
              <div className={styles.grid}>
                {trendingTools.map(t => (
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
