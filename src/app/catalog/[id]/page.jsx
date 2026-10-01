'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Save, 
  Eye
} from 'lucide-react';
import styles from '../Form.module.css';

export default function EditGame() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const containerRef = useRef(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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
    if (!id) return;

    fetch(`/api/catalog/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setForm({
            game_name: data.game_name || '',
            genre: data.genre || '',
            platform: data.platform || 'PC',
            price: data.price ? String(parseInt(data.price)) : '',
            stock: data.stock ? String(data.stock) : '',
            description: data.description || ''
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/catalog/${id}`, {
        method: 'PUT',
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
        alert(data.error || 'Gagal memperbarui game.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
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
          <h1>Edit Data Game</h1>
          <p>Perbarui rincian harga, kategori genre, atau jumlah stok judul game.</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className={styles.layoutGrid}>
        {/* Left: Input Form */}
        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>Formulir Pembaruan Game #{id}</h2>
          
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
                  placeholder="Nama Game..."
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
                <Save size={17} />
                <span>{submitting ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Game'}</span>
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
                <h3>{form.game_name || 'Judul Game'}</h3>
                <span className={styles.previewGenreTag}>
                  {form.genre || 'Genre'}
                </span>
              </div>

              <div className={styles.previewPriceBox}>
                <span className={styles.previewPriceLabel}>Harga Retail</span>
                <span className={styles.previewPriceValue}>
                  {form.price ? `Rp ${Number(form.price).toLocaleString('id-ID')}` : 'Rp 0'}
                </span>
              </div>

              <p className={styles.previewNotice}>
                Perubahan pada formulir akan segera diperbarui pada katalog setelah tombol simpan ditekan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}