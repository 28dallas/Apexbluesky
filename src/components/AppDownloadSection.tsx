'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Smartphone, Send, CheckCircle2 } from 'lucide-react';
import styles from './AppDownloadSection.module.css';

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
        
        setIsLoading(true);
        // Mock SMS sending logic
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
            setPhoneNumber('');
            setTimeout(() => setIsSent(false), 5000);
        }, 1500);
    };

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <h2 className={styles.title}>Take Apex Tools everywhere</h2>
                        <p className={styles.description}>
                            Scan the QR code or get a text to download the app (Mockup) and access 33+ tools on the go.
                        </p>

                        <form onSubmit={handleSendLink} className={styles.smsForm}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.countryCode}>+254</span>
                                <input
                                    type="tel"
                                    placeholder="712345678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                    className={styles.input}
                                    disabled={isSent || isLoading}
                                />
                                <button 
                                    type="submit" 
                                    className={isSent ? styles.sentButton : styles.sendButton}
                                    disabled={!phoneNumber || isSent || isLoading}
                                >
                                    {isLoading ? '...' : isSent ? <CheckCircle2 size={18} /> : <Send size={18} />}
                                    <span>{isSent ? 'Sent!' : 'Send Me a Link'}</span>
                                </button>
                            </div>
                            {isSent && <p className={styles.successMsg}>Link sent! Check your messages (Mockup).</p>}
                        </form>
                    </div>

                    <div className={styles.visuals}>
                        <div className={styles.qrContainer}>
                            {qrCodeUrl ? (
                                <Image 
                                    src={qrCodeUrl} 
                                    alt="Scan to download" 
                                    width={160} 
                                    height={160} 
                                    className={styles.qrImage}
                                />
                            ) : (
                                <div className={styles.qrPlaceholder} />
                            )}
                            <div className={styles.qrOverlay}>
                                <Smartphone size={24} className={styles.phoneIcon} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
