import Link from 'next/link';

export default function AffiliateDisclosure() {
    return (
        <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginTop: '1rem',
            fontStyle: 'italic',
            lineHeight: '1.4'
        }}>
            * Disclosure: This page contains affiliate links. If you click and make a purchase, we may receive a small commission at no extra cost to you. Learn more in our <Link href="/disclosure" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Affiliate Disclosure</Link>.
        </div>
    );
}
