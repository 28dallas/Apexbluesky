'use client';

import { useEffect, useState } from 'react';
import { getRecentlyUsed } from '@/lib/usage';
import ToolCard from './ToolCard';
import toolsData from '@/data/tools.json';
import styles from '@/app/page.module.css';
import type { ToolDefinition, ToolWithId } from '@/types/tools';

const tools: ToolWithId[] = Object.entries(toolsData).map(([id, data]) => ({
    id,
    ...(data as ToolDefinition)
}));

export default function RecentlyUsed() {
    const [recentIds, setRecentIds] = useState<string[]>([]);

    const updateRecent = () => {
        setRecentIds(getRecentlyUsed());
    };

    useEffect(() => {
        updateRecent();
        window.addEventListener('apexbs_usage_update', updateRecent);
        return () => window.removeEventListener('apexbs_usage_update', updateRecent);
    }, []);

    if (recentIds.length === 0) return null;

    const recentTools = recentIds
        .map(id => tools.find(t => t.id === id))
        .filter((t): t is ToolWithId => !!t);

    if (recentTools.length === 0) return null;

    return (
        <div className={styles.trendingSection} style={{ marginBottom: '4rem' }}>
            <h2 className={styles.sectionTitle}>🕒 Recently Used</h2>
            <div className={styles.grid}>
                {recentTools.map(t => (
                    <ToolCard key={`recent-${t.id}`} {...t} />
                ))}
            </div>
        </div>
    );
}
