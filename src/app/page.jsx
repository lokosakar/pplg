'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Gamepad2, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(cardRefs.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const cards = [
    { title: 'Katalog Game', value: '10', icon: <Gamepad2 size={22} />, trend: '+2 Bulan ini' },
    { title: 'Member Aktif', value: '3', icon: <Users size={22} />, trend: 'Stabil' },
    { title: 'Transaksi Sukses', value: '3', icon: <ShoppingCart size={22} />, trend: '+1 Hari ini' },
  ];

  return (
    <div className={styles.container}>
      <div ref={headerRef} className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h1>Selamat Datang di Workspace</h1>
          <p>Pantau performa penjualan dan kelola stok Lionel Game Store dengan mudah.</p>
        </div>
        <div className={styles.bannerDecoration}>
          <TrendingUp size={120} strokeWidth={1} />
        </div>
      </div>
      
      <div className={styles.grid}>
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={styles.card}
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <div className={styles.cardHeader}>
              <h3>{card.title}</h3>
              <div className={styles.iconWrapper}>{card.icon}</div>
            </div>
            <h2>{card.value}</h2>
            <p className={styles.trend}>{card.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}