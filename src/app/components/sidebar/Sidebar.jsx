'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, ShoppingCart, LayoutDashboard, Flame, Sparkles, Database, Users } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} strokeWidth={2} /> },
    { name: 'Katalog Game', path: '/catalog', icon: <Gamepad2 size={20} strokeWidth={2} /> },
    { name: 'Transaksi Kasir', path: '/orders', icon: <ShoppingCart size={20} strokeWidth={2} /> },
    { name: 'Member Pelanggan', path: '/members', icon: <Users size={20} strokeWidth={2} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brand}>
        <div className={styles.brandIconWrapper}>
          <div className={styles.iconGlow} />
          <Flame size={24} className={styles.brandIcon} strokeWidth={2.5} />
        </div>
        <div className={styles.brandText}>
          <div className={styles.brandHeaderRow}>
            <h2>LIONEL</h2>
            <span className={styles.proBadge}>PRO</span>
          </div>
          <p>GAME STORE HUB</p>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navSection}>
        <span className={styles.sectionLabel}>MENU UTAMA</span>
        <nav className={styles.nav}>
          {menu.map((item) => {
            const isActive = item.path === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.path);

            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${styles.link} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.linkIconWrapper}>
                  {item.icon}
                </div>
                <span className={styles.linkLabel}>{item.name}</span>
                {isActive && <div className={styles.activePillDot} />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Store Status Badge */}
      <div className={styles.bottomCard}>
        <div className={styles.statusIndicator}>
          <div className={styles.statusDot} />
          <span>Sistem Aktif & Terhubung</span>
        </div>
        <div className={styles.storeMeta}>
          <div className={styles.metaRow}>
            <Database size={13} className={styles.metaIcon} />
            <span>MySQL Database: Online</span>
          </div>
          <div className={styles.metaRow}>
            <Sparkles size={13} className={styles.metaIcon} />
            <span>Workspace: Lionel RPL</span>
          </div>
        </div>
      </div>
    </aside>
  );
}