'use client';

import { useState } from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const subject = encodeURIComponent(`Website inquiry from ${name || 'ApexBlueSky visitor'}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:support@apexblueskytools.online?subject=${subject}&body=${body}`;
    };

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo/logo.png"
                                alt="ApexBlueSky"
                                width={180}
                                height={45}
                                className={styles.logoImage}
                                priority
                                style={{ height: 'auto' }}
                            />
                        </Link>
                        <div className={styles.auth}>
                            <Link href="/login" className={styles.navLink}>LOGIN</Link>
                            <Link href="/signup" className="btn-primary">SIGN UP</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <section className={styles.hero} style={{ padding: '6rem 0' }}>
                <div className="container">
                    <h1 className={`${styles.heroTitle} gradient-text`}>Get in Touch</h1>
                    <p className={styles.heroSub}>
                        Have a suggestion for a new tool? Found a bug? We’d love to hear from you.
                    </p>
                </div>
            </section>

            <section style={{ padding: '4rem 0' }}>
                <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✉️</div>
                        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Contact Support</h2>
                        <p style={{ marginBottom: '2rem' }}>
                            Use the form below to contact the ApexBlueSky Tools team. We aim to respond within 24-48 hours.
                        </p>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Your name"
                                required
                                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Your email"
                                required
                                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                            />
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="How can we help?"
                                required
                                rows={6}
                                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', resize: 'vertical' }}
                            />
                            <button type="submit" className="btn-primary" style={{ justifySelf: 'center' }}>Send Message</button>
                        </form>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <Link href="https://github.com/NathanKrop" target="_blank" className="btn-primary">GitHub Profile</Link>
                            <Link href="https://www.tiktok.com/@apex_bluesky?_r=1&_t=ZS-94bCJVdKaO5" target="_blank" className="btn-primary" style={{ background: '#ff0050' }}>TikTok Tutorials</Link>
                            <Link href="https://twitter.com/NathanKrop" target="_blank" className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)' }}>X / Twitter</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
