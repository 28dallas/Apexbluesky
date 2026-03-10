'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
    adSlot: string;
    adFormat?: string;
    fullWidth?: boolean;
    style?: React.CSSProperties;
}

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXXX';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function AdSense({ adSlot, adFormat = 'auto', fullWidth = true, style }: AdSlotProps) {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div
            style={{
                overflow: 'hidden',
                minHeight: '90px',
                margin: '2rem 0',
                borderRadius: '8px',
                ...style,
            }}
            aria-label="Advertisement"
        >
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={ADSENSE_PUBLISHER_ID}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidth ? 'true' : 'false'}
            />
        </div>
    );
}
