'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Gamepad2, 
  Tv, 
  Monitor, 
  Layers, 
  X, 
  AlertCircle,
  PackageCheck,
  PackageOpen,
  ArrowUpDown,
  SlidersHorizontal
} from 'lucide-react';
import styles from './Catalog.module.css';

export default function Catalog() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'price-asc', 'price-desc', 'newest', 'name-asc', 'stock-desc'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, game: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const containerRef = useRef(null);
  const tableRef = useRef(null);

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/catalog');
      const data = await res.json();
      setGames(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Entrance GSAP animation
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.header}`,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(`.${styles.quickStatsRow}`,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' }
      );

      gsap.fromTo(`.${styles.tableWrapper}`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power4.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleOpenDelete = (game) => {
    setDeleteModal({ isOpen: true, game });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.game) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/catalog/${deleteModal.game.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Game "${deleteModal.game.game_name}" berhasil dihapus.`);
        setDeleteModal({ isOpen: false, game: null });
        fetchGames();
      } else {
        alert('Gagal menghapus game.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus data.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Sorting logic
  const filteredAndSortedGames = games
    .filter(game => {
      const matchesSearch = 
        game.game_name.toLowerCase().includes(search.toLowerCase()) ||
        (game.genre && game.genre.toLowerCase().includes(search.toLowerCase()));
      
      const matchesPlatform = 
        selectedPlatform === 'ALL' || 
        game.platform.toLowerCase() === selectedPlatform.toLowerCase();

      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name-asc') return a.game_name.localeCompare(b.game_name);
      if (sortBy === 'stock-desc') return Number(b.stock) - Number(a.stock);
      // 'newest' default
      return b.id - a.id;
    });

  // Stats calculations
  const totalStock = games.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
  const lowStockCount = games.filter(g => Number(g.stock) <= 15).length;

  const platforms = [
    { id: 'ALL', label: 'Semua', count: games.length },
    { id: 'PC', label: 'PC Windows', count: games.filter(g => g.platform === 'PC').length },
    { id: 'PS5', label: 'PlayStation 5', count: games.filter(g => g.platform === 'PS5').length },
    { id: 'Nintendo Switch', label: 'Switch', count: games.filter(g => g.platform === 'Nintendo Switch').length },
  ];

  const getPlatformIcon = (platform) => {
    if (platform === 'PC') return <Monitor size={14} />;
    if (platform === 'PS5') return <Tv size={14} />;
    return <Gamepad2 size={14} />;
  };

  const getPlatformBadgeClass = (platform) => {
    if (platform === 'PC') return styles.badgePc;
    if (platform === 'PS5') return styles.badgePs5;
    return styles.badgeSwitch;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Toast Alert Notification */}
      {toast && (
        <div className={styles.toastNotification}>
          <PackageCheck size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Area */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleBadge}>
            <Layers size={13} />
            <span>Manajemen Inventaris</span>
          </div>
          <h1>Katalog Game</h1>
          <p>Kelola data judul game, pembaruan stok fisik & digital, serta penetapan harga jual.</p>
        </div>

        <Link href="/catalog/create" className={styles.btnAdd}>
          <Plus size={18} />
          <span>Tambah Game Baru</span>
        </Link>
      </div>

      {/* Quick Stats Pills */}
      <div className={styles.quickStatsRow}>
        <div className={styles.quickStatItem}>
          <span className={styles.statLabel}>Total Judul:</span>
          <span className={styles.statHighlight}>{games.length} Judul</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.quickStatItem}>
          <span className={styles.statLabel}>Total Unit Stok:</span>
          <span className={styles.statHighlight}>{totalStock} Unit</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.quickStatItem}>
          <span className={styles.statLabel}>Perlu Restok:</span>
          <span className={lowStockCount > 0 ? styles.statWarning : styles.statSafe}>
            {lowStockCount} Judul {lowStockCount > 0 ? '(<= 15)' : '(Aman)'}
          </span>
        </div>
      </div>

      {/* Controls: Search, Platform Tabs & Sorting */}
      <div className={styles.controlsRow}>
        <div className={styles.platformTabs}>
          {platforms.map(p => (
            <button
              key={p.id}
              className={`${styles.tabBtn} ${selectedPlatform === p.id ? styles.activeTab : ''}`}
              onClick={() => setSelectedPlatform(p.id)}
            >
              <span>{p.label}</span>
              <span className={styles.tabBadge}>{p.count}</span>
            </button>
          ))}
        </div>

        <div className={styles.controlsRight}>
          {/* Sorting Dropdown */}
          <div className={styles.sortBox}>
            <ArrowUpDown size={15} className={styles.sortIcon} />
            <select 
              className={styles.sortSelect} 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Urutan: Terbaru Ditambahkan</option>
              <option value="price-asc">Harga: Termurah → Termahal</option>
              <option value="price-desc">Harga: Termahal → Termurah</option>
              <option value="name-asc">Nama: A → Z</option>
              <option value="stock-desc">Stok: Terbanyak</option>
            </select>
          </div>

          {/* Search Box */}
          <div className={styles.searchBox}>
            <Search size={17} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Cari judul game atau genre..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.tableWrapper} ref={tableRef}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Judul Game & Genre</th>
              <th>Platform</th>
              <th>Harga Jual (Rp)</th>
              <th>Status Stok</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedGames.length > 0 ? (
              filteredAndSortedGames.map((game) => {
                const stockNum = Number(game.stock);
                return (
                  <tr key={game.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.gameCell}>
                        <div className={styles.gameAvatar}>
                          <Gamepad2 size={20} className={styles.avatarIcon} />
                        </div>
                        <div className={styles.gameInfo}>
                          <span className={styles.gameName}>{game.game_name}</span>
                          <span className={styles.gameGenre}>{game.genre || 'Standard Edition'}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`${styles.badge} ${getPlatformBadgeClass(game.platform)}`}>
                        {getPlatformIcon(game.platform)}
                        <span>{game.platform}</span>
                      </span>
                    </td>

                    <td>
                      <span className={styles.priceTag}>
                        Rp {parseInt(game.price).toLocaleString('id-ID')}
                      </span>
                    </td>

                    <td>
                      {stockNum > 15 ? (
                        <span className={styles.stockSafe}>
                          <span className={styles.dotSafe} />
                          {stockNum} Unit (Tersedia)
                        </span>
                      ) : stockNum > 0 ? (
                        <span className={styles.stockLow}>
                          <span className={styles.dotLow} />
                          {stockNum} Unit (Menipis)
                        </span>
                      ) : (
                        <span className={styles.stockEmpty}>
                          <span className={styles.dotEmpty} />
                          Habis
                        </span>
                      )}
                    </td>

                    <td>
                      <div className={styles.actionCell}>
                        <Link 
                          href={`/catalog/${game.id}`} 
                          className={styles.btnEdit}
                          title="Edit game"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </Link>
                        <button 
                          className={styles.btnDelete} 
                          onClick={() => handleOpenDelete(game)}
                          title="Hapus game"
                        >
                          <Trash2 size={16} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">
                  <div className={styles.emptyTable}>
                    <PackageOpen size={48} className={styles.emptyIcon} />
                    <h3>Tidak Ada Game Ditemukan</h3>
                    <p>
                      {search 
                        ? `Tidak ada game yang cocok dengan kata kunci "${search}".` 
                        : 'Belum ada game pada platform ini.'}
                    </p>
                    {search && (
                      <button className={styles.btnResetSearch} onClick={() => setSearch('')}>
                        Reset Pencarian
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIconWrap}>
              <AlertCircle size={32} className={styles.modalWarningIcon} />
            </div>
            <h3>Konfirmasi Hapus Game</h3>
            <p>
              Apakah Anda yakin ingin menghapus data game <strong>&ldquo;{deleteModal.game?.game_name}&rdquo;</strong> dari sistem? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalBtnCancel} 
                onClick={() => setDeleteModal({ isOpen: false, game: null })}
                disabled={isDeleting}
              >
                Batalkan
              </button>
              <button 
                className={styles.modalBtnConfirm} 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Game'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}