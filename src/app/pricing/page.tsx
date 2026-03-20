'use client';

import Link from 'next/link';
import { Check, Shield, Zap, Star } from 'lucide-react';
import styles from './pricing.module.css';
import Footer from '@/components/Footer';
import Image from 'next/image';

const plans = [
    {
        name: 'Guest',
        price: 'Free',
        description: 'For occasional quick tasks.',
        features: [
            '10MB File Size limit',
            '2 Files per batch',
            '5 Daily uses',
            'Standard processing',
            'Community support'
        ],
        cta: 'Start Free',
        href: '/',
        highlight: false
    },
    {
        name: 'Free Account',
        price: 'Ksh 0',
        description: 'Perfect for regular users.',
        features: [
            '25MB File Size limit',
            '10 Files per batch',
            '20 Daily uses',
            'Standard processing',
            'Email support'
        ],
        cta: 'Sign Up Free',
        href: '/signup',
        highlight: false
    },
    {
        name: 'Pro Status',
        price: 'Ksh 999',
        priceSuffix: '/month',
        description: 'For professionals & power users.',
        features: [
            'Unlimited File Size',
            'Unlimited Batch processing',
            'Unlimited Daily uses',
            'Priority processing (2x faster)',
            'Priority support',
            'Advanced AI tools access'
        ],
        cta: 'Upgrade to Pro',
        href: '/signup?plan=pro',
        highlight: true
    }
];

export default function PricingPage() {
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
                                priority
                            />
                        </Link>
                    </nav>
                </div>
            </header>

            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Simple, Transparent Pricing</h1>
                    <p className={styles.subtitle}>Unlock the full power of 50+ tools with a professional plan, or buy credits for pay-per-use tools.</p>
                </div>
            </section>

            <section className={styles.plansSection}>
                <div className="container">
                    <div className={styles.grid}>
                        {plans.map((plan) => (
                            <div key={plan.name} className={`${styles.card} ${plan.highlight ? styles.highlight : ''} glass`}>
                                {plan.highlight && (
                                    <div className={styles.badge}>
                                        <Star size={14} /> RECOMMENDED
                                    </div>
                                )}
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.price}>{plan.price}</span>
                                    {plan.priceSuffix && <span className={styles.suffix}>{plan.priceSuffix}</span>}
                                </div>
                                <p className={styles.description}>{plan.description}</p>

                                <ul className={styles.featureList}>
                                    {plan.features.map((feature) => (
                                        <li key={feature} className={styles.featureItem}>
                                            <Check size={18} className={styles.checkIcon} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href={plan.href} className={plan.highlight ? 'btn-primary' : styles.secondaryBtn}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.trustSection}>
                <div className="container">
                    <div className={styles.trustGrid}>
                        <div className={styles.trustItem}>
                            <Shield className={styles.trustIcon} />
                            <h4>Secure Payments</h4>
                            <p>We use M-Pesa & Stripe for 100% secure transactions.</p>
                        </div>
                        <div className={styles.trustItem}>
                            <Zap className={styles.trustIcon} />
                            <h4>Instant Activation</h4>
                            <p>Your Pro limits are unlocked immediately after payment.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.trustSection}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#fff' }}>How Credits Work</h2>
                        <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                            Credits are only used on selected AI and premium processing tools. Guest users and free accounts start with
                            {' '}<strong>0 credits</strong>. Pro members do not spend credits on supported tools and get unlimited access
                            within their plan limits.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
