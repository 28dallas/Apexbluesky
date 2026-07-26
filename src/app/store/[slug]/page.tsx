"use client";

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Download } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { publishedProduct } from '@/lib/server/storeProducts';
import { useAuth } from '@/context/AuthContext';
import styles from '../store.module.css';

export const dynamic = 'force-dynamic';

function ProductPageContent({ product }: { product: Awaited<ReturnType<typeof publishedProduct>> }) {
  const { session, isLoading } = useAuth();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!session?.access_token || !product) return;
    const loadDownload = async () => {
      const response = await fetch(`/api/store/${product.slug}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.downloadUrl) setDownloadUrl(data.downloadUrl);
      else setMessage(data.error || 'Purchase required to access this download.');
    };
    void loadDownload();
  }, [product, session?.access_token]);

  if (!product) notFound();

  return (
    <main className={styles.page}>
      <section className={styles.storeHero}>
        <div className="container">
          <div className={styles.storeHeroInner}>
            <div className={styles.storeHeroCopy}>
              <Link href="/store" className={styles.productCta}><ArrowLeft size={16} /> Back to store</Link>
              <p className={styles.kicker}>{product.category}</p>
              <h1>{product.title}</h1>
              <p>{product.description}</p>
              <div className={styles.storeHeroActions}>
                {isLoading ? (
                  <span className={styles.storeSecondaryCta}>Checking access…</span>
                ) : downloadUrl ? (
                  <a href={downloadUrl} target="_blank" rel="noreferrer" className={styles.storePrimaryCta}><Download size={16} /> Download product</a>
                ) : (
                  <Link href="/pricing" className={styles.storePrimaryCta}>Unlock access</Link>
                )}
              </div>
              {message ? <p style={{ marginTop: 12, color: '#dbeafe' }}>{message}</p> : null}
            </div>
            <div className={styles.storeHeroCard}>
              <p>Digital product</p>
              <h2>${product.price.toFixed(2)}</h2>
              <p>Protected access is available after checkout and sign-in.</p>
              <ul className={styles.storeFeatureList}>
                <li><CheckCircle2 size={16}/> Production-ready product files</li>
                <li><CheckCircle2 size={16}/> Instant access after payment setup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await publishedProduct(slug);
  return <ProductPageContent product={product} />;
}
