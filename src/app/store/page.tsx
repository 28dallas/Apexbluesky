import Footer from '@/components/Footer';
import { ArrowRight, LayoutTemplate, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { storeProducts } from './products';
import { publishedProducts } from '@/lib/server/storeProducts';
import styles from './store.module.css';

const services = [
  {
    name: 'Developer kits',
    description: 'Launch-ready starter systems for founders, dev teams, and product builders.',
    icon: LayoutTemplate,
  },
  {
    name: 'Automation assets',
    description: 'Reusable workflows, scripts, and productivity systems that save hours.',
    icon: Zap,
  },
  {
    name: 'Creator toolkits',
    description: 'Practical digital assets for content creation, product marketing, and growth.',
    icon: Sparkles,
  },
];

export const dynamic = 'force-dynamic';

function serviceForCategory(category: string) {
  const value = category.toLowerCase();
  if (value.includes('automation') || value.includes('script')) return 'Automation assets';
  if (value.includes('creator') || value.includes('prompt')) return 'Creator toolkits';
  return 'Developer kits';
}

export default async function StorePage() {
  const generatedProducts = (await publishedProducts()).map((product) => ({
    title: product.title,
    slug: product.slug,
    service: serviceForCategory(product.category),
    price: `$${product.price.toFixed(2)}`,
    badge: 'New',
    description: product.description,
    features: [product.category, 'Instant digital delivery'],
  }));
  const products = [...generatedProducts, ...storeProducts];
  const groupedProducts = services.map((service) => ({
    ...service,
    items: products.filter((product) => product.service === service.name),
  }));
  return (
    <main className={styles.page}>
      <section className={styles.storeHero}>
        <div className="container">
          <div className={styles.storeHeroInner}>
            <div className={styles.storeHeroCopy}>
              <p className={styles.kicker}>DIGITAL PRODUCT STORE</p>
              <h1>Sell polished digital products like a modern Shopify storefront.</h1>
              <p>
                Curate collections, highlight your best offers, and make every product easy to discover.
              </p>
              <div className={styles.storeHeroActions}>
                <a href="#collections" className={styles.storePrimaryCta}>
                  Browse collections
                </a>
                <Link href="/tools" className={styles.storeSecondaryCta}>
                  Explore free tools
                </Link>
                <Link href="/admin/store" className={styles.storeSecondaryCta}>
                  Manage products
                </Link>
              </div>
              <div className={styles.storeTrustRow}>
                <span>Instant delivery</span>
                <span>Flexible bundles</span>
                <span>Easy to expand</span>
              </div>
            </div>

            <div className={styles.storeHeroCard}>
              <div className={styles.storeHeroCardTop}>
                <p>Featured offer</p>
                <span className={styles.storeBadge}>Best seller</span>
              </div>
              <h2>Launchpad Pro Kit</h2>
              <p>Everything you need to launch a premium web product in one clean bundle.</p>
              <div className={styles.storePriceRow}>
                <strong>$129</strong>
                <span>Digital download</span>
              </div>
              <ul className={styles.storeFeatureList}>
                <li>Ready-to-use layouts</li>
                <li>Professional onboarding flow</li>
                <li>Easy to customize</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className={styles.storeSection}>
        <div className="container">
          <div className={styles.storeSectionHeading}>
            <p className={styles.kicker}>Collections</p>
            <h2>Shop by service</h2>
            <p>Each category is ready for new products to be added as soon as you publish them.</p>
          </div>

          <div className={styles.collectionGrid}>
            {services.map(({ name, description, icon: Icon }) => (
              <article className={styles.collectionCard} key={name}>
                <div className={styles.collectionIcon}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <span>{products.filter((product) => product.service === name).length} items</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.storeSection}>
        <div className="container">
          <div className={styles.storeSectionHeading}>
            <p className={styles.kicker}>Featured products</p>
            <h2>Browse the latest offers</h2>
            <p>Use this area as your storefront catalog and expand it whenever you add a new asset.</p>
          </div>

          <div className={styles.groupList}>
            {groupedProducts.map((service) => (
              <div className={styles.groupBlock} key={service.name}>
                <div className={styles.groupHeader}>
                  <div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <span>{service.items.length} product{service.items.length === 1 ? '' : 's'}</span>
                </div>

                <div className={styles.productGrid}>
                  {service.items.map((product) => (
                    <article className={styles.productCard} key={product.title}>
                      <div className={styles.productCardTop}>
                        <span className={styles.storeBadge}>{product.badge}</span>
                        <span className={styles.productPrice}>{product.price}</span>
                      </div>
                      <h4>{product.title}</h4>
                      <p>{product.description}</p>
                      <ul className={styles.storeFeatureList}>
                        {product.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                      <Link href={product.slug ? `/store/${product.slug}` : '/contact'} className={styles.productCta}>
                        Get access <ArrowRight size={16} />
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
