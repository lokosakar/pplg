'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  Gamepad2, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Receipt, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  Sparkles,
  UserPlus
} from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalMembers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    platformCounts: { PC: 0, PS5: 0, 'Nintendo Switch': 0 },
    lowStockGames: [],
    recentOrders: []
  });

  // Animated display values for GSAP counter
  const [animatedValues, setAnimatedValues] = useState({
    games: 0,
    members: 0,
    orders: 0,
    revenue: 0
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [catalogRes, membersRes, ordersRes] = await Promise.all([
          fetch('/api/catalog').then(r => r.json()).catch(() => []),
          fetch('/api/members').then(r => r.json()).catch(() => []),
          fetch('/api/orders').then(r => r.json()).catch(() => [])
        ]);

        const games = Array.isArray(catalogRes) ? catalogRes : [];
        const members = Array.isArray(membersRes) ? membersRes : [];
        const orders = Array.isArray(ordersRes) ? ordersRes : [];

        // Calculate Revenue
        const revenue = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

        // Platform Breakdown
        const platformCounts = { PC: 0, PS5: 0, 'Nintendo Switch': 0 };
        games.forEach(g => {
          if (platformCounts[g.platform] !== undefined) {
            platformCounts[g.platform]++;
          } else {
            platformCounts[g.platform] = 1;
          }
        });

        // Low stock games (<= 15)
        const lowStock = games.filter(g => Number(g.stock) <= 15).slice(0, 3);

        // Recent orders
        const recent = orders.slice(0, 5);

        setStats({
          totalGames: games.length,
          totalMembers: members.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
          platformCounts,
          lowStockGames: lowStock,
          recentOrders: recent
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // GSAP Animations with clean context
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // 1. Banner Entrance - Buttery smooth slide & fade
      gsap.fromTo(`.${styles.welcomeBanner}`, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out' }
      );

      // 2. Metric Cards Entrance - Staggered wave
      gsap.fromTo(`.${styles.statCard}`,
        { opacity: 0, y: 28, scale: 0.98 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.7, 
          stagger: 0.08, 
          ease: 'power3.out', 
          delay: 0.15 
        }
      );

      // 3. Bottom Panels Entrance
      gsap.fromTo(`.${styles.panelCard}`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.35 }
      );

      // 4. Smooth Counter Animation for KPI numbers
      const counterObj = {
        games: 0,
        members: 0,
        orders: 0,
        revenue: 0
      };

      gsap.to(counterObj, {
        games: stats.totalGames,
        members: stats.totalMembers,
        orders: stats.totalOrders,
        revenue: stats.totalRevenue,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          setAnimatedValues({
            games: Math.round(counterObj.games),
            members: Math.round(counterObj.members),
            orders: Math.round(counterObj.orders),
            revenue: Math.round(counterObj.revenue)
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, stats]);

  const cards = [
    {
      title: 'Katalog Game',
      value: animatedValues.games,
      subtitle: 'Game siap jual',
      icon: <Gamepad2 size={24} />,
      colorClass: styles.cardEmerald,
      trend: '+ Realtime Sync',
      href: '/catalog'
    },
    {
      title: 'Member Terdaftar',
      value: animatedValues.members,
      subtitle: 'Pelanggan aktif',
      icon: <Users size={24} />,
      colorClass: styles.cardCyan,
      trend: 'Kelola Member →',
      href: '/members'
    },
    {
      title: 'Transaksi Sukses',
      value: animatedValues.orders,
      subtitle: 'Pesanan selesai',
      icon: <ShoppingCart size={24} />,
      colorClass: styles.cardViolet,
      trend: 'Riwayat Transaksi →',
      href: '/orders'
    },
    {
      title: 'Total Pendapatan',
      value: `Rp ${animatedValues.revenue.toLocaleString('id-ID')}`,
      subtitle: 'Akumulasi omset',
      icon: <TrendingUp size={24} />,
      colorClass: styles.cardAmber,
      trend: 'Laporan Penjualan',
      href: '/orders'
    },
  ];

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Hero Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerGlowOrb} />
        <div className={styles.bannerContent}>
          <div className={styles.greetingBadge}>
            <Sparkles size={14} className={styles.greetingSparkle} />
            <span>{getGreeting()}, Lionel</span>
          </div>
          <h1>Workspace Lionel Game Store</h1>
          <p>
            Pantau performa penjualan, ketersediaan inventaris multi-platform, kelola database member aktif, dan kasir transaksi toko secara real-time.
          </p>
          
          <div className={styles.quickActions}>
            <Link href="/orders/create" className={styles.primaryActionBtn}>
              <ShoppingCart size={17} />
              <span>Kasir Transaksi Baru</span>
            </Link>
            <Link href="/catalog/create" className={styles.secondaryActionBtn}>
              <Plus size={17} />
              <span>Tambah Game Baru</span>
            </Link>
            <Link href="/members/create" className={styles.secondaryActionBtn}>
              <UserPlus size={17} />
              <span>Tambah Member</span>
            </Link>
            <Link href="/catalog" className={styles.tertiaryActionBtn}>
              <Layers size={17} />
              <span>Katalog</span>
            </Link>
          </div>
        </div>

        <div className={styles.bannerBadgeArea}>
          <div className={styles.livePulseBox}>
            <div className={styles.pulsePing} />
            <div className={styles.pulseCore} />
            <span className={styles.pulseLabel}>System Online</span>
          </div>
          <div className={styles.storeTagPill}>
            <span>Toko Game Cabang Utama</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={styles.grid}>
        {cards.map((card, index) => (
          <Link href={card.href} key={index} className={`${styles.statCard} ${card.colorClass}`}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardTitle}>{card.title}</span>
                <span className={styles.cardSubtitle}>{card.subtitle}</span>
              </div>
              <div className={styles.iconWrapper}>
                {card.icon}
              </div>
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardValue}>{card.value}</h2>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.trendBadge}>{card.trend}</span>
              <ArrowRight size={15} className={styles.arrowIcon} />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Information Split Section */}
      <div className={styles.splitSection}>
        {/* Left: Recent Orders */}
        <div className={`${styles.panelCard} ${styles.recentOrdersPanel}`}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleWrapper}>
              <Receipt size={19} className={styles.panelIcon} />
              <div>
                <h3>Transaksi Terbaru</h3>
                <p>Aktivitas pembelian kasir terkini</p>
              </div>
            </div>
            <Link href="/orders" className={styles.viewAllLink}>
              <span>Lihat Semua</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.tableResponsive}>
            {stats.recentOrders.length > 0 ? (
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>No. Resi</th>
                    <th>Member</th>
                    <th>Game</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.receiptCell}>
                        <code>{order.receipt_no}</code>
                      </td>
                      <td className={styles.memberName}>{order.fullname}</td>
                      <td className={styles.gameTitle}>{order.game_name}</td>
                      <td className={styles.amount}>
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={styles.statusSuccessPill}>
                          <CheckCircle2 size={12} />
                          {order.status || 'Sukses'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <Receipt size={32} className={styles.emptyIcon} />
                <p>Belum ada riwayat transaksi.</p>
                <Link href="/orders/create" className={styles.btnSmallPrimary}>
                  Mulai Transaksi Pertama
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Platform Breakdown & Inventory Health */}
        <div className={`${styles.panelCard} ${styles.inventoryPanel}`}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleWrapper}>
              <Gamepad2 size={19} className={styles.panelIcon} />
              <div>
                <h3>Status Stok & Platform</h3>
                <p>Distribusi konsol & peringatan stok</p>
              </div>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className={styles.platformDistribution}>
            <div className={styles.platformItem}>
              <div className={styles.platformMeta}>
                <span className={styles.platformLabel}>PC Windows</span>
                <span className={styles.platformCount}>{stats.platformCounts['PC'] || 0} Judul</span>
              </div>
              <div className={styles.progressBarBg}>
                <div 
                  className={`${styles.progressBar} ${styles.barPc}`} 
                  style={{ width: `${stats.totalGames > 0 ? ((stats.platformCounts['PC'] || 0) / stats.totalGames) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className={styles.platformItem}>
              <div className={styles.platformMeta}>
                <span className={styles.platformLabel}>PlayStation 5</span>
                <span className={styles.platformCount}>{stats.platformCounts['PS5'] || 0} Judul</span>
              </div>
              <div className={styles.progressBarBg}>
                <div 
                  className={`${styles.progressBar} ${styles.barPs5}`} 
                  style={{ width: `${stats.totalGames > 0 ? ((stats.platformCounts['PS5'] || 0) / stats.totalGames) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className={styles.platformItem}>
              <div className={styles.platformMeta}>
                <span className={styles.platformLabel}>Nintendo Switch</span>
                <span className={styles.platformCount}>{stats.platformCounts['Nintendo Switch'] || 0} Judul</span>
              </div>
              <div className={styles.progressBarBg}>
                <div 
                  className={`${styles.progressBar} ${styles.barSwitch}`} 
                  style={{ width: `${stats.totalGames > 0 ? ((stats.platformCounts['Nintendo Switch'] || 0) / stats.totalGames) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Low Stock Warning Section */}
          <div className={styles.lowStockSection}>
            <div className={styles.lowStockHeader}>
              <AlertTriangle size={15} className={styles.alertIcon} />
              <span>Peringatan Stok Menipis</span>
            </div>
            {stats.lowStockGames.length > 0 ? (
              <div className={styles.lowStockList}>
                {stats.lowStockGames.map(game => (
                  <div key={game.id} className={styles.lowStockItem}>
                    <div className={styles.lowStockInfo}>
                      <span className={styles.lowStockTitle}>{game.game_name}</span>
                      <span className={styles.lowStockPlatform}>{game.platform}</span>
                    </div>
                    <span className={styles.lowStockBadge}>
                      Sisa: {game.stock}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.stockSafeNotice}>
                <CheckCircle2 size={16} className={styles.safeIcon} />
                <span>Semua stok game dalam kondisi aman ({'>'} 15 unit).</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}