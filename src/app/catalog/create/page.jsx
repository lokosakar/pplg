'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  Gamepad2, 
  Tag, 
  Monitor, 
  Tv, 
  Coins, 
  Boxes, 
  Sparkles, 
  Check, 
  Eye
} from 'lucide-react';
import styles from '../Form.module.css';

export default function CreateGame() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    game_name: '',
    genre: '',
    platform: 'PC',
    price: '',
    stock: '',
    description: ''
  });

  const popularGenres = ['Action RPG', 'Open World', 'Adventure', 'Sports', 'Horror', 'Fighting'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.formCard}`,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out' }
      );

      gsap.fromTo(`.${styles.previewSection}`,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power4.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.game_name || !form.price || !form.stock) {
      alert('Harap isi Judul Game, Harga, dan Stok.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.price.toString().replace(/\D/g, ''),
          stock: form.stock.toString().replace(/\D/g, '')
        })
      });

      if (res.ok) {
        router.push('/catalog');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan game.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPlatformClass = (platform) => {
    if (platform === 'PC') return styles.platformActive;
    if (platform === 'PS5') return styles.platformActivePs5;
    return styles.platformActiveSwitch;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Header */}
      <div className={styles.formHeader}>
        <Link href="/catalog" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Kembali ke Katalog</span>
        </Link>
        <div className={styles.titleWrapper}>
          <h1>Tambah Game Baru</h1>
          <p>Daftarkan judul game baru ke katalog inventaris toko Lionel Game Store.</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className={styles.layoutGrid}>
        {/* Left: Input Form */}
        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>Formulir Data Game</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Judul Game */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Gamepad2 size={16} className={styles.labelIcon} />
                <span>Judul Game</span>
              </label>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  required 
                  className={styles.inputField}
                  placeholder="Contoh: God of War Ragnarok, Cyberpunk 2077..."
                  value={form.game_name}
                  onChange={e => setForm({ ...form, game_name: e.target.value })}
                />
              </div>
            </div>

            {/* Genre */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Tag size={16} className={styles.labelIcon} />
                <span>Genre / Kategori</span>
              </label>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  required 
                  className={styles.inputField}
                  placeholder="Contoh: Action RPG, Adventure..."
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                />
              </div>
              <div className={styles.genrePills}>
                {popularGenres.map(g => (
                  <button 
                    type="button" 
                    key={g} 
                    className={styles.genreChip}
                    onClick={() => setForm({ ...form, genre: g })}
                  >
                    + {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Monitor size={16} className={styles.labelIcon} />
                <span>Pilih Platform Konsol / PC</span>
              </label>
              <div className={styles.platformSelector}>
                <button
                  type="button"
                  className={`${styles.platformBtn} ${form.platform === 'PC' ? styles.platformActive : ''}`}
                  onClick={() => setForm({ ...form, platform: 'PC' })}
                >
                  <Monitor size={20} />
                  <span>PC Windows</span>
                </button>

                <button
                  type="button"
                  className={`${styles.platformBtn} ${form.platform === 'PS5' ? styles.platformActivePs5 : ''}`}
                  onClick={() => setForm({ ...form, platform: 'PS5' })}
                >
                  <Tv size={20} />
                  <span>PlayStation 5</span>
                </button>

                <button
                  type="button"
                  className={`${styles.platformBtn} ${form.platform === 'Nintendo Switch' ? styles.platformActiveSwitch : ''}`}
                  onClick={() => setForm({ ...form, platform: 'Nintendo Switch' })}
                >
                  <Gamepad2 size={20} />
                  <span>Nintendo Switch</span>
                </button>
              </div>
            </div>

            {/* Row: Harga & Stok */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Coins size={16} className={styles.labelIcon} />
                  <span>Harga Jual (Rp)</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>Rp</span>
                  <input 
                    type="text" 
                    required 
                    className={`${styles.inputField} ${styles.inputWithPrefix}`}
                    placeholder="750.000"
                    value={form.price ? Number(form.price).toLocaleString('id-ID') : ''}
                    onChange={e => setForm({ ...form, price: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Boxes size={16} className={styles.labelIcon} />
                  <span>Stok Fisik / Digital</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    required 
                    className={styles.inputField}
                    placeholder="Contoh: 50"
                    value={form.stock ? Number(form.stock).toLocaleString('id-ID') : ''}
                    onChange={e => setForm({ ...form, stock: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.formActions}>
              <Link href="/catalog" className={styles.btnCancel}>
                Batalkan
              </Link>
              <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                <Sparkles size={17} />
                <span>{submitting ? 'Menyimpan...' : 'Simpan Game ke Katalog'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Card */}
        <div className={styles.previewSection}>
          <div className={styles.previewBadge}>
            <Eye size={13} />
            <span>Live Preview Etalase</span>
          </div>

          <div className={styles.previewCard}>
            <div className={styles.previewArtHeader}>
              <div className={styles.previewArtGlow} />
              <Gamepad2 size={64} className={styles.previewArtIcon} strokeWidth={1.5} />
            </div>

            <div className={styles.previewCardBody}>
              <div className={styles.previewPlatformRow}>
                <span className={styles.previewPlatformBadge}>
                  {form.platform || 'Platform'}
                </span>
                <span className={styles.previewStockPill}>
                  Stok: {form.stock || '0'} Unit
                </span>
              </div>

              <div className={styles.previewTitleArea}>
                <h3>{form.game_name || 'Judul Game Anda'}</h3>
                <span className={styles.previewGenreTag}>
                  {form.genre || 'Genre Belum Diisi'}
                </span>
              </div>

              <div className={styles.previewPriceBox}>
                <span className={styles.previewPriceLabel}>Harga Retail</span>
                <span className={styles.previewPriceValue}>
                  {form.price ? `Rp ${Number(form.price).toLocaleString('id-ID')}` : 'Rp 0'}
                </span>
              </div>

              <p className={styles.previewNotice}>
                Preview ini memperlihatkan bagaimana judul game ini akan terdaftar pada katalog dan kasir transaksi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}