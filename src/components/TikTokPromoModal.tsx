'use client';

import { useEffect, useState } from 'react';

const TIKTOK_URL = 'https://www.tiktok.com/@apex_bluesky';
const STORAGE_KEY = 'apexbs_tiktok_dismissed';

interface Props {
    isOpen: boolean;
    onContinue: () => void;
}

export default function TikTokPromoModal({ isOpen, onContinue }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
    }, [isOpen]);

    if (!visible) return null;

    const handleFollow = () => {
        window.open(TIKTOK_URL, '_blank');
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
        setVisible(false);
        onContinue();
    };

    const handleSkip = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
        setVisible(false);
        onContinue();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.3s ease',
        }}>
            <div style={{
                background: 'linear-gradient(145deg, #0f172a, #1e1b4b)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                maxWidth: '460px',
                width: '100%',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* TikTok glow accent */}
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(255,0,80,0.25) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* TikTok Logo Icon */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #010101, #ff0050)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 10px 30px rgba(255,0,80,0.3)',
                }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                    </svg>
                </div>

                <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                    Follow Us on TikTok! 🎵
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                    Get free tutorials, tips, and tool walkthroughs from <strong style={{ color: '#fff' }}>@apex_bluesky</strong> to get the most out of ApexBlueSky Tools.
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>
                    It's free. It only takes a second. 🙏
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <button
                        onClick={handleFollow}
                        style={{
                            background: 'linear-gradient(135deg, #ff0050, #ff5c8a)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '14px',
                            padding: '1rem 1.5rem',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            boxShadow: '0 8px 25px rgba(255, 0, 80, 0.4)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                        </svg>
                        Follow @apex_bluesky on TikTok
                    </button>

                    <button
                        onClick={handleSkip}
                        style={{
                            background: 'transparent',
                            color: '#64748b',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px',
                            padding: '0.8rem 1.5rem',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'color 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                        Maybe later, continue to tool →
                    </button>
                </div>
            </div>
        </div>
    );
}
