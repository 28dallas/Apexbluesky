'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { trackEvent } from '@/lib/analytics';
import styles from '@/app/ecosystem.module.css';

const links = [
  { href: '/tools', label: 'Tools' },
  { href: '/apps', label: 'Apps' },
  { href: '/store', label: 'Store' },
  { href: '/solutions', label: 'Solutions' },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navInner}`}>
        <Link href="/" className={styles.logo}><Image src="/logo/logo.png" alt="ApexBlueSky" width={156} height={40} priority /></Link>
        <div className={styles.navLinks}>{links.map(link => <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? styles.active : ''}>{link.label}</Link>)}</div>
        <div className={styles.navActions}>
          {user ? <><Link href="/pricing" className={styles.login}>Credits</Link><button aria-label="Sign out" onClick={() => { trackEvent('logout_click'); signOut(); }}><LogOut size={18} /></button></> : <><Link href="/login" className={styles.login}>Log in</Link><Link href="/signup" className="btn-primary">Get started</Link></>}
        </div>
      </div>
    </nav>
  );
}
