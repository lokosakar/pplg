'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, ShoppingCart, LayoutDashboard, Flame } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Katalog Game', path: '/catalog', icon: <Gamepad2 size={20} /> },
    { name: 'Transaksi', path: '/orders', icon: <ShoppingCart size={20} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Flame size={28} strokeWidth={2.5} />
        </div>
        <div className={styles.logoText}>
          <h2>LIONEL</h2>
          <p>GAME STORE</p>
        </div>
      </div>
      <nav className={styles.nav}>
        {menu.map((item, index) => (
          <Link 
            key={index} 
            href={item.path} 
            className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}