'use client';

import { useState } from 'react';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import styles from './page.module.css';

import toolsData from '@/data/tools.json';

const tools = Object.entries(toolsData).map(([id, data]) => ({
  id,
  ...(data as any)
}));

const categories = ['All', 'PDF', 'Images', 'Writing', 'Video/Social', 'Technical', 'Education', 'Health'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(t => t.category.includes(activeCategory));

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>APEX BLUE SKY</Link>
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
          <p className={styles.heroSub}>33+ tools to use PDFs and other files, at your fingertips. All are 100% FREE and easy to use!</p>
        </div>
      </section>

      <section id="tools" className={styles.toolsSection}>
        <div className="container">
          <div className={styles.grid}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>APEX BLUE SKY</div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/about" className={styles.copy}>About</Link>
              <Link href="/privacy" className={styles.copy}>Privacy</Link>
              <Link href="/contact" className={styles.copy}>Contact</Link>
            </div>
            <div className={styles.copy}>&copy; 2026 ApexBlueSky Tools. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
