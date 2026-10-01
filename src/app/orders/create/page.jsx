'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  User, 
  Gamepad2, 
  ShoppingCart, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Receipt,
  Minus,
  Plus
} from 'lucide-react';
import styles from './CreateOrder.module.css';

export default function CreateOrder() {
  const router = useRouter();
  const containerRef = useRef(null);
  
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ member_id: '', catalog_id: '', qty: 1 });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/members').then(res => res.json()).catch(() => []),
      fetch('/api/catalog').then(res => res.json()).catch(() => [])
    ]).then(([membersData, gamesData]) => {
      setMembers(Array.isArray(membersData) ? membersData : []);
      setGames(Array.isArray(gamesData) ? gamesData : []);
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.formCard}`,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out' }
      );

      gsap.fromTo(`.${styles.receiptCard}`,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power4.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const selectedMember = members.find(m => m.id === parseInt(form.member_id));
  const selectedGame = games.find(g => g.id === parseInt(form.catalog_id));
  const maxStock = selectedGame ? Number(selectedGame.stock) : 0;
  const unitPrice = selectedGame ? Number(selectedGame.price) : 0;
  const total = unitPrice * (form.qty || 1);
  const remainingStock = selectedGame ? maxStock - (form.qty || 1) : 0;

  const handleQtyChange = (delta) => {
    const nextQty = Math.max(1, Math.min(maxStock > 0 ? maxStock : 999, (form.qty || 1) + delta));
    setForm({ ...form, qty: nextQty });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.member_id || !form.catalog_id || form.qty < 1) {
      setError('Harap lengkapi pilihan Member dan Game dengan benar!');
      return;
    }

    if (selectedGame && maxStock < form.qty) {
      setError(`Stok game tidak mencukupi! Hanya tersisa ${maxStock} unit.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccessReceipt(data.receipt_no);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Header */}
      <div className={styles.formHeader}>
        <Link href="/orders" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Kembali ke Riwayat Transaksi</span>
        </Link>
        <div className={styles.titleWrapper}>
          <h1>Kasir Transaksi Baru</h1>
          <p>Lakukan pemesanan instan, pilih member pelanggan dan judul game, potong stok otomatis.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.layoutGrid}>
        {/* Left: Kasir Form */}
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>Pilih Data Pembelian</h2>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Member Selector */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <User size={16} className={styles.labelIcon} />
                <span>Pilih Member Pelanggan</span>
              </label>
              <select 
                required 
                className={styles.selectField}
                value={form.member_id}
                onChange={e => setForm({ ...form, member_id: e.target.value })}
              >
                <option value="">-- Pilih Member Pelanggan --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullname} (ID #{m.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Game Selector */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Gamepad2 size={16} className={styles.labelIcon} />
                <span>Pilih Judul Game</span>
              </label>
              <select 
                required 
                className={styles.selectField}
                value={form.catalog_id}
                onChange={e => {
                  const newGame = games.find(g => g.id === parseInt(e.target.value));
                  setForm({ 
                    ...form, 
                    catalog_id: e.target.value,
                    qty: 1
                  });
                }}
              >
                <option value="">-- Pilih Game dari Katalog --</option>
                {games.map(g => (
                  <option key={g.id} value={g.id} disabled={Number(g.stock) <= 0}>
                    {g.game_name} ({g.platform}) — Rp {Number(g.price).toLocaleString('id-ID')} {Number(g.stock) <= 0 ? '(STOK HABIS)' : `(Stok: ${g.stock})`}
                  </option>
                ))}
              </select>

              {selectedGame && (
                <div className={maxStock > 0 ? styles.stockNotice : styles.stockNoticeWarning}>
                  {maxStock > 0 ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Stok Tersedia: <strong>{maxStock} unit</strong></span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} />
                      <span>Stok Habis! Harap restok terlebih dahulu di katalog.</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Qty Stepper */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <ShoppingCart size={16} className={styles.labelIcon} />
                <span>Jumlah Pembelian (Qty)</span>
              </label>
              <div className={styles.stepperRow}>
                <button 
                  type="button" 
                  className={styles.stepperBtn}
                  onClick={() => handleQtyChange(-1)}
                  disabled={form.qty <= 1}
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max={maxStock > 0 ? maxStock : 1}
                  className={`${styles.inputField} ${styles.stepperInput}`}
                  value={form.qty}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 1;
                    const clamped = Math.max(1, Math.min(maxStock > 0 ? maxStock : 999, val));
                    setForm({ ...form, qty: clamped });
                  }}
                />
                <button 
                  type="button" 
                  className={styles.stepperBtn}
                  onClick={() => handleQtyChange(1)}
                  disabled={selectedGame && form.qty >= maxStock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Invoice Summary Bill */}
        <div className={styles.receiptCard}>
          <div className={styles.receiptHeader}>
            <div className={styles.receiptLogoRow}>
              <Flame size={20} className={styles.receiptLogoIcon} />
              <span className={styles.receiptLogoTitle}>LIONEL GAME STORE</span>
            </div>
            <span className={styles.receiptTag}>INVOICE KASIR</span>
          </div>

          <div className={styles.receiptBody}>
            <div className={styles.receiptRow}>
              <span className={styles.receiptRowLabel}>Member:</span>
              <span className={styles.receiptRowValue}>
                {selectedMember ? selectedMember.fullname : '— Belum Dipilih —'}
              </span>
            </div>

            <div className={styles.receiptRow}>
              <span className={styles.receiptRowLabel}>Game:</span>
              <span className={styles.receiptRowValue}>
                {selectedGame ? selectedGame.game_name : '— Belum Dipilih —'}
              </span>
            </div>

            <div className={styles.receiptRow}>
              <span className={styles.receiptRowLabel}>Platform:</span>
              <span className={styles.receiptRowValue}>
                {selectedGame ? selectedGame.platform : '—'}
              </span>
            </div>

            <div className={styles.receiptRow}>
              <span className={styles.receiptRowLabel}>Harga Satuan:</span>
              <span className={styles.receiptRowValue}>
                Rp {unitPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <div className={styles.receiptRow}>
              <span className={styles.receiptRowLabel}>Kuantitas:</span>
              <span className={styles.receiptRowValue}>
                {form.qty || 1}x Item
              </span>
            </div>

            <div className={styles.receiptRow}>
              <span className={styles.receiptRowLabel}>Sisa Stok Pasca Jual:</span>
              <span className={styles.receiptRowValue} style={{ color: remainingStock < 5 ? '#fbbf24' : '#34d399' }}>
                {selectedGame ? `${remainingStock} unit` : '—'}
              </span>
            </div>

            <div className={styles.receiptDivider} />

            {/* Total Highlight */}
            <div className={styles.receiptTotalRow}>
              <span className={styles.totalLabel}>Total Pembayaran</span>
              <span className={styles.totalValue}>
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>

            <button 
              type="button" 
              className={styles.btnSubmitOrder} 
              disabled={submitting || !selectedGame || maxStock <= 0}
              onClick={handleSubmit}
            >
              <ShoppingCart size={18} />
              <span>{submitting ? 'Memproses Transaksi...' : 'Proses & Cetak Transaksi'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Receipt Modal */}
      {successReceipt && (
        <div className={styles.modalBackdrop}>
          <div className={styles.successModalCard}>
            <div className={styles.successIconWrap}>
              <CheckCircle2 size={36} />
            </div>
            <h3>Transaksi Kasir Berhasil!</h3>
            <p>
              Pembelian telah berhasil dibukukan ke database dan stok inventaris telah otomatis terpotong.
            </p>

            <div className={styles.receiptBoxModal}>
              <span className={styles.receiptLabelModal}>Nomor Resi:</span>
              <span className={styles.receiptCodeModal}>{successReceipt}</span>
            </div>

            <div className={styles.modalActionButtons}>
              <button 
                className={styles.btnModalHistory}
                onClick={() => router.push('/orders')}
              >
                Buka Riwayat Transaksi
              </button>
              <button 
                className={styles.btnModalNew}
                onClick={() => {
                  setSuccessReceipt(null);
                  setForm({ member_id: '', catalog_id: '', qty: 1 });
                  // refresh game list to have updated stock
                  fetch('/api/catalog').then(r => r.json()).then(d => setGames(Array.isArray(d) ? d : []));
                }}
              >
                Buat Transaksi Baru Lainnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}