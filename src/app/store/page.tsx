'use client';

import Footer from '@/components/Footer';
import { useState } from 'react';
import { AFFILIATE_PRODUCTS, Product } from './products';
import styles from './store.module.css';

const CATEGORIES = ['All Deals', 'Audio & Visual', 'Top Rated', 'Best Price'];
const featured = AFFILIATE_PRODUCTS.find((p) => p.isFeatured)!;

function filterProducts(products: Product[], cat: string) {
  if (cat === 'All Deals') return products.filter((p) => !p.isFeatured);
  if (cat === 'Top Rated') return products.filter((p) => !p.isFeatured && p.rating >= 4.8);
  if (cat === 'Best Price') return products.filter((p) => !p.isFeatured && parseFloat(p.price.replace('$', '')) < 65);
  return products.filter((p) => !p.isFeatured && p.category === cat);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.stars}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.dealCard}>
      <div className={styles.dealImageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} className={styles.dealImage}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/0f172a/818cf8?text=Product'; }} />
        {product.badge && <span className={styles.dealBadge}>{product.badge}</span>}
        <span className={styles.discountTag}>{product.discount}</span>
      </div>
      <div className={styles.dealBody}>
        <span className={styles.categoryPill}>{product.category}</span>
        <h3 className={styles.dealTitle}>{product.title}</h3>
        <div className={styles.dealMeta}>
          <StarRating rating={product.rating} />
          <span className={styles.soldCount}>{product.salesCount}</span>
        </div>
        <div className={styles.dealPriceRow}>
          <strong className={styles.salePrice}>{product.price}</strong>
          <s className={styles.origPrice}>{product.originalPrice}</s>
        </div>
        <div className={styles.freeShipRow}>
          <span className={styles.freeShip}>🚚 Free Shipping</span>
          <span className={styles.buyerProt}>🛡 Buyer Protection</span>
        </div>
        <a href={product.affiliateUrl} target="_blank" rel="noopener sponsored" className={styles.viewDealBtn}>
          View on AliExpress →
        </a>
      </div>
    </article>
  );
}

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState('All Deals');
  const filtered = filterProducts(AFFILIATE_PRODUCTS, activeCategory);

  return (
    <main className={styles.page}>

      {/* Breadcrumb — visible + semantic for SEO */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <ol className={styles.breadcrumbList}>
          <li><a href="/">Home</a></li>
          <li aria-hidden="true">›</li>
          <li><a href="/store">Store</a></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">HY300 4K Smart Mini Projector</li>
        </ol>
      </nav>

      {/* AliExpress-style top announcement bar */}
      <div className={styles.aeTopBar}>
        <span>🔥 Flash Sale — Up to 70% OFF on top gadgets</span>
        <span className={styles.aeTopBarDivider}>|</span>
        <span>🛡 Buyer Protection on every order</span>
        <span className={styles.aeTopBarDivider}>|</span>
        <span>🚚 Free Shipping on orders over $10</span>
      </div>

      {/* Hero */}
      <section className={styles.storeHero}>
        <div className="container">
          <div className={styles.storeHeroInner}>
            <div className={styles.storeHeroCopy}>
              {/* AliExpress-style logo badge */}
              <div className={styles.aeBrandBadge}>
                <span className={styles.aeLogoText}>Ali<span className={styles.aeOrange}>Express</span></span>
                <span className={styles.aeAffiliatePill}>Affiliate Deals</span>
              </div>
              <h1>Curated Tech Deals &amp; Smart Gadgets</h1>
              <p>
                Handpicked high-value gadgets, home cinema gear, and electronics sourced directly
                from AliExpress at unbeatable prices.
              </p>
              <div className={styles.storeHeroActions}>
                <a href="#deals" className={styles.storePrimaryCta}>🔥 Explore Top Deals</a>
                <a href={`#${featured.id}`} className={styles.storeSecondaryCta}>Featured Product</a>
              </div>
              <div className={styles.storeTrustRow}>
                <span>🛡 Buyer Protection</span>
                <span>🚚 Free Shipping</span>
                <span>↩ Easy Returns</span>
                <span>💳 Secure Pay</span>
              </div>
            </div>

            {/* Featured Hero Card — AliExpress product page style */}
            <div className={styles.featuredCard} id={featured.id}>
              <div className={styles.featuredCardTop}>
                <span className={styles.featuredBadge}>{featured.badge}</span>
                <span className={styles.choiceBadge}>✦ AliExpress Choice</span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                className={styles.featuredImg}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/520x340/0f172a/818cf8?text=HY300+Projector'; }}
              />

              {/* Flash deal strip */}
              <div className={styles.flashDealStrip}>
                <span className={styles.flashIcon}>⚡</span>
                <span className={styles.flashLabel}>FLASH DEAL</span>
                <span className={styles.flashEnds}>Ends in: <strong>02:47:13</strong></span>
                <span className={styles.flashStock}>Only 23 left!</span>
              </div>

              <h2 className={styles.featuredTitle}>{featured.title}</h2>

              <div className={styles.featuredRatingRow}>
                <span className={styles.featuredStars}>★★★★★</span>
                <span className={styles.featuredRatingNum}>4.8</span>
                <span className={styles.featuredReviews}>(1,247 reviews)</span>
                <span className={styles.featuredSoldBadge}>2.4k+ sold</span>
              </div>

              <ul className={styles.featuredSpecs}>
                <li>📺 Native 1080p / 4K Decoding</li>
                <li>🔄 180° Rotation Support</li>
                <li>📱 Built-in Android 11 OS</li>
                <li>📶 Dual-Band WiFi</li>
              </ul>

              <div className={styles.featuredPriceRow}>
                <strong className={styles.featuredSalePrice}>{featured.price}</strong>
                <s className={styles.featuredOrigPrice}>{featured.originalPrice}</s>
                <span className={styles.featuredDiscount}>{featured.discount} OFF</span>
              </div>

              <div className={styles.featuredShipRow}>
                <span>🚚 <strong>Free Shipping</strong></span>
                <span>🛡 <strong>Buyer Protection</strong></span>
              </div>

              <a href={featured.affiliateUrl} target="_blank" rel="noopener sponsored" className={styles.claimDealBtn}>
                🛒 Buy on AliExpress
              </a>
              <p className={styles.affiliateNote}>* Opens AliExpress — affiliate link</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter + Grid */}
      <section id="deals" className={styles.storeSection}>
        <div className="container">
          <div className={styles.storeSectionHeading}>
            <p className={styles.kicker}>🛍 All Products</p>
            <h2>Browse Deals</h2>
            <p className={styles.sectionSub}>All products ship from AliExpress with buyer protection.</p>
          </div>

          <div className={styles.filterBar}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? styles.filterBtnActive : styles.filterBtn}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className={styles.emptyState}>No products in this category yet. Check back soon!</p>
          ) : (
            <div className={styles.dealGrid}>
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* AliExpress trust strip */}
      <div className={styles.aeTrustStrip}>
        <div className={styles.aeTrustItem}><span className={styles.aeTrustIcon}>🛡</span><div><strong>Buyer Protection</strong><p>Money back guarantee</p></div></div>
        <div className={styles.aeTrustItem}><span className={styles.aeTrustIcon}>🚚</span><div><strong>Free Shipping</strong><p>On eligible orders</p></div></div>
        <div className={styles.aeTrustItem}><span className={styles.aeTrustIcon}>↩</span><div><strong>Easy Returns</strong><p>Hassle-free refunds</p></div></div>
        <div className={styles.aeTrustItem}><span className={styles.aeTrustIcon}>💳</span><div><strong>Secure Payment</strong><p>Multiple methods accepted</p></div></div>
      </div>

      {/* FAQ Section — targets long-tail search queries */}
      <section className={styles.faqSection} aria-label="Frequently Asked Questions">
        <div className="container">
          <p className={styles.kicker}>FAQ</p>
          <h2 className={styles.faqHeading}>HY300 Projector — Common Questions</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'What is the HY300 projector?', a: 'The HY300 is a smart mini projector running Android 11 with native 1080p resolution, 4K decoding, Dual-Band WiFi, Bluetooth 5.0, and 180° rotation — ideal for home cinema, gaming, and bedroom ceiling projection.' },
              { q: 'How much does the HY300 cost on AliExpress?', a: 'Currently $59.99 (down from $149.99) — a 60% saving. Free shipping is included and AliExpress buyer protection covers your order.' },
              { q: 'Does the HY300 support Netflix and YouTube?', a: 'Yes. It runs Android 11 OS natively, so Netflix, YouTube, Disney+, and other streaming apps work directly without any extra device.' },
              { q: 'Is the HY300 good for gaming?', a: 'Yes. The HY300 supports low-latency game mode and can project up to a 120" screen, making it great for console and mobile gaming.' },
              { q: 'Does AliExpress offer buyer protection?', a: 'Yes. Every AliExpress order includes buyer protection — if the item does not arrive or does not match the description, you get a full refund.' },
              { q: 'Can the HY300 project on a ceiling?', a: 'Yes. The 180° rotation feature lets you flip the projection for ceiling use, perfect for bedroom movie nights.' },
            ].map(({ q, a }) => (
              <details key={q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{q}</summary>
                <p className={styles.faqA}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <div className={styles.affiliateDisclosure}>
        <p>🔗 <strong>Affiliate Disclosure:</strong> We may earn a commission from purchases made through links on this store at no additional cost to you.</p>
      </div>
    </main>
  );
}
