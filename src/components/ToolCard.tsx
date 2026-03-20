'use client';

import Link from 'next/link';
import styles from './ToolCard.module.css';
import { trackEvent } from '@/lib/analytics';

interface ToolCardProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
}

export default function ToolCard({ id, title, description, icon }: ToolCardProps) {
    return (
        <Link
            href={`/tools/${id}`}
            className={styles.card}
            onClick={() => trackEvent('tool_open_click', {
                tool_id: id,
                tool_title: title,
            })}
        >
            <div className={styles.icon}>{icon}</div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </Link>
    );
}
