'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { trackEvent } from '@/lib/analytics';
import { useState, useEffect } from 'react';
import styles from '@/app/ecosystem.module.css';
import navStyles from './Nav.module.css';

const links = [
  { href: '/tools', label: 'Tools' },
  { href: '/apps', label: 'Apps' },
  { href: '/store', label: 'Store' },
  { href: '/solutions', label: 'Solutions' },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo/logo.png" alt="ApexBlueSky" width={156} height={40} priority />
          </Link>

          {/* Desktop links */}
          <div className={styles.navLinks}>
            {links.map(link => (
              <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? styles.active : ''}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className={styles.navActions}>
            {user ? (
              <>
                <Link href="/pricing" className={styles.login}>Credits</Link>
                <button aria-label="Sign out" onClick={() => { trackEvent('logout_click'); signOut(); }}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`${styles.login} ${navStyles.desktopOnly}`}>Log in</Link>
                <Link href="/signup" className={`btn-primary ${navStyles.desktopOnly}`}>Get started</Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className={navStyles.hamburger}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && <div className={navStyles.backdrop} onClick={() => setOpen(false)} />}
      <div className={`${navStyles.drawer} ${open ? navStyles.drawerOpen : ''}`} aria-hidden={!open}>
        <div className={navStyles.drawerHeader}>
          <Image src="/logo/logo.png" alt="ApexBlueSky" width={130} height={34} />
          <button aria-label="Close menu" onClick={() => setOpen(false)} className={navStyles.drawerClose}>
            <X size={22} />
          </button>
        </div>

        <nav className={navStyles.drawerLinks}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${navStyles.drawerLink} ${pathname.startsWith(link.href) ? navStyles.drawerLinkActive : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={navStyles.drawerActions}>
          {user ? (
            <>
              <Link href="/pricing" className={navStyles.drawerActionBtn}>Credits</Link>
              <button className={`${navStyles.drawerActionBtn} ${navStyles.drawerSignOut}`}
                onClick={() => { trackEvent('logout_click'); signOut(); setOpen(false); }}>
                <LogOut size={16} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navStyles.drawerActionBtn}>Log in</Link>
              <Link href="/signup" className={`btn-primary ${navStyles.drawerPrimary}`}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
