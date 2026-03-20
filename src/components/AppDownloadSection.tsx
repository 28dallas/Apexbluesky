'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Smartphone, Send, CheckCircle2 } from 'lucide-react';
import styles from './AppDownloadSection.module.css';
import { trackEvent } from '@/lib/analytics';

export default function AppDownloadSection() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const generateQR = async () => {
            try {
                // Generate QR for the current site URL
                const url = typeof window !== 'undefined' ? window.location.origin : 'https://apexblueskytools.online';
                const qr = await QRCode.toDataURL(url, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#ffffff',
                        light: '#00000000' // Transparent background
                    }
                });
                setQrCodeUrl(qr);
            } catch (err) {
                console.error('Failed to generate QR code:', err);
            }
        };
        generateQR();
    }, []);

    const handleSendLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 9) return;

        trackEvent('app_link_sms_request', {
            phone_length: phoneNumber.length,
        });
        setIsLoading(true);
        // Mock SMS sending logic
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
            trackEvent('app_link_sms_sent');
            setPhoneNumber('');
            setTimeout(() => setIsSent(false), 5000);
        }, 1500);
    };

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <h2 className={styles.title}>Access Apex Tools on the Go</h2>
                        <p className={styles.description}>
                            Install Apex Tools as a Progressive Web App on your phone or computer for quick access to all 50+ tools. Works offline and updates automatically.
                        </p>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button 
                                onClick={() => {
                                    trackEvent('app_install_click', {
                                        location: 'app_download_section',
                                    });
                                    // PWA install prompt would go here
                                    if ((window as any).deferredPrompt) {
                                        (window as any).deferredPrompt.prompt();
                                    } else {
                                        alert('Installation instructions depend on your device and browser. Look for an "Install" or "Add to Home Screen" option in your browser menu.');
                                    }
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: 'var(--accent-primary)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }}
                            >
                                📱 Install App
                            </button>
                        </div>
                    </div>

                    <div className={styles.visuals}>
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Smartphone size={80} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Available on iOS, Android, Windows & Mac</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
