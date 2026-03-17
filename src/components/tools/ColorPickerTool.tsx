'use client';

import { useState } from 'react';
import styles from '../ToolInterface.module.css';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function ColorPickerTool({ tool, id }: any) {
    const [color, setColor] = useState('#6366f1');

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
    };

    return (
        <div className={styles.wrapper}>
            <Link href="/" className={styles.backLink}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Dashboard
            </Link>

            <div className={styles.header}>
                <div className={styles.icon}>{tool.icon}</div>
                <h1 className={styles.title}>{tool.title}</h1>
                <p className={styles.description}>{tool.description}</p>
            </div>

            <div className={`${styles.card} glass`}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
                    <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden', border: '5px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}
                        />
                    </div>

                    <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>HEX Code</label>
                            <input type="text" readOnly value={color.toUpperCase()} className={styles.textarea} style={{ height: 'auto', padding: '1rem', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>RGB Value</label>
                            <input type="text" readOnly value={hexToRgb(color) || ''} className={styles.textarea} style={{ height: 'auto', padding: '1rem', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }} />
                        </div>
                    </div>
                </div>

                <div className={styles.trustBadge}>
                    <Shield size={16} className={styles.trustIcon} />
                    <span>Privacy Shield: 100% Local Browser Processing. Colors are not tracked.</span>
                </div>
            </div>
        </div>
    );
}
