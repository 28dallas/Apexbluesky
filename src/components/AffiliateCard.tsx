import styles from './AffiliateCard.module.css';

interface AffiliateCardProps {
    name: string;
    text: string;
    url: string;
    cta: string;
    logo?: string;
    features?: string[];
}

export default function AffiliateCard({ name, text, url, cta, logo, features }: AffiliateCardProps) {
    return (
        <aside className={styles.card}>
            <div className={styles.inner}>
                <div className={styles.badge}>
                    <span className={styles.sponsoredLabel}>Partner</span>
                </div>

                <div className={styles.headerSection}>
                    <div className={styles.logo}>{logo || '⚡'}</div>
                    <div>
                        <p className={styles.upgradeLabel}>🚀 Upgrade Your Workflow</p>
                        <p className={styles.name}>{name}</p>
                    </div>
                </div>

                <p className={styles.desc}>{text}</p>

                {features && features.length > 0 && (
                    <ul className={styles.features}>
                        {features.map((f, i) => (
                            <li key={i} className={styles.featureItem}>
                                <span className={styles.checkmark}>✔</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                )}

                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={styles.cta}
                    aria-label={`Visit ${name} — affiliate link`}
                >
                    {cta}
                </a>
            </div>
        </aside>
    );
}
