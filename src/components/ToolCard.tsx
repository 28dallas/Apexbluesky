import Link from 'next/link';
import styles from './ToolCard.module.css';

interface ToolCardProps {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
}

export default function ToolCard({ id, title, description, icon }: ToolCardProps) {
    return (
        <Link href={`/tools/${id}`} className={styles.card}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </Link>
    );
}
