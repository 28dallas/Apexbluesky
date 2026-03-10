import Link from 'next/link';
import Image from 'next/image';
import styles from '../page.module.css';

export const metadata = {
    title: 'Affiliate Disclosure - ApexBlueSky Tools',
    description: 'Information about our affiliate partnerships and how we earn commissions.',
};

export default function DisclosurePage() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.logo}>
                            <Image src="/logo.png" alt="Apex Blue Sky Logo" width={540} height={135} style={{ objectFit: 'contain' }} priority />
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
                <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Affiliate Disclosure</h1>

                <section className="glass" style={{ padding: '2.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Welcome to ApexBlueSky Tools. We believe in transparency and want to be upfront about how we maintain this free resource library.
                    </p>

                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }}>How We Earn Commissions</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Some of the links on this website are "affiliate links." This means if you click on the link and purchase a product or service from our partner, we may receive an affiliate commission.
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        <strong>This comes at no additional cost to you.</strong> In fact, sometimes our partnerships allow us to provide you with exclusive discounts or trial offers.
                    </p>

                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Our Goal</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Our primary mission is to provide high-quality, free utilities to the community. We only partner with companies and services that we believe provide genuine value to our users (such as Adobe, Canva, Grammarly, and others).
                    </p>
                    <p style={{ marginBottom: '1.5rem' }}>
                        The commissions earned help us cover the costs of server hosting, development time, and API fees, allowing us to keep the majority of our tools free for everyone forever.
                    </p>

                    <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }}>Your Trust</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Your trust is important to us. We do not accept payment for positive reviews. Our recommendations are based on our own assessment of tools that complement our native utilities.
                    </p>

                    <p style={{ marginTop: '3rem' }}>
                        If you have any questions regarding our affiliate relationships, please feel free to <Link href="/contact" style={{ color: 'var(--accent-primary)' }}>contact us</Link>.
                    </p>
                </section>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <Link href="/" className="btn-primary">Back to Tools</Link>
                </div>
            </div>
        </main>
    );
}
