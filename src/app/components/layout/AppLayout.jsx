'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Flame, ShoppingCart, Plus, Layers } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className={styles.layoutWrapper}>
      {/* Mobile Top Navigation Bar (Visible on screens <= 1024px) */}
      <header className={styles.mobileHeader}>
        <button 
          className={styles.hamburgerBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className={styles.mobileBrand}>
          <div className={styles.mobileBrandIcon}>
            <Flame size={18} strokeWidth={2.5} />
          </div>
          <span className={styles.mobileBrandText}>LIONEL</span>
          <span className={styles.mobileProBadge}>PRO</span>
        </Link>

        <div className={styles.mobileActions}>
          <Link href="/orders/create" className={styles.mobileKasirBtn} title="Buka Kasir">
            <ShoppingCart size={17} />
          </Link>
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          className={styles.drawerBackdrop}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile open/close support */}
      <div className={`${styles.sidebarWrapper} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Viewport */}
      <main className={styles.mainViewport}>
        {children}
      </main>
    </div>
  );
}
