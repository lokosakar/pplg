'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  AlertCircle,
  Eye
} from 'lucide-react';
import styles from './CreateMember.module.css';

export default function CreateMember() {
  const router = useRouter();
  const containerRef = useRef(null);

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    setError('');

    if (!form.fullname.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Harap lengkapi Nama Lengkap, Email, dan Nomor Telepon.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/members');
      } else {
        setError(data.error || 'Gagal mendaftarkan member baru.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Header */}
      <div className={styles.formHeader}>
        <Link href="/members" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Kembali ke Direktori Member</span>
        </Link>
        <div className={styles.titleWrapper}>
          <h1>Pendaftaran Member Baru</h1>
          <p>Daftarkan pelanggan toko menjadi VIP Member untuk mendapatkan akses kasir dan poin loyalitas.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.layoutGrid}>
        {/* Left: Form */}
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>Data Identitas Pelanggan</h2>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Nama Lengkap */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <User size={16} className={styles.labelIcon} />
                <span>Nama Lengkap Pelanggan</span>
              </label>
              <input 
                type="text" 
                required 
                className={styles.inputField}
                placeholder="Contoh: Budi Santoso"
                value={form.fullname}
                onChange={e => setForm({ ...form, fullname: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Mail size={16} className={styles.labelIcon} />
                <span>Alamat Email (Unik)</span>
              </label>
              <input 
                type="email" 
                required 
                className={styles.inputField}
                placeholder="budi.santoso@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Nomor Telepon / WA */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <Phone size={16} className={styles.labelIcon} />
                <span>Nomor Telepon / WhatsApp</span>
              </label>
              <input 
                type="tel" 
                required 
                className={styles.inputField}
                placeholder="081234567890"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className={styles.formActions}>
              <Link href="/members" className={styles.btnCancel}>
                Batalkan
              </Link>
              <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                <Sparkles size={17} />
                <span>{submitting ? 'Mendaftarkan...' : 'Daftarkan Member Baru'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: VIP Card Preview */}
        <div className={styles.previewSection}>
          <div className={styles.previewBadge}>
            <Eye size={13} />
            <span>Kartu Loyalitas Member VIP</span>
          </div>

          <div className={styles.vipCard}>
            <div className={styles.cardGlowOverlay} />

            <div className={styles.vipCardTop}>
              <div className={styles.storeBrandRow}>
                <Flame size={20} className={styles.flameIcon} />
                <span className={styles.storeBrandText}>LIONEL STORE</span>
              </div>
              <span className={styles.vipPill}>VIP ACCESS</span>
            </div>

            <div className={styles.chipSimulator} />

            <div className={styles.vipCardBottom}>
              <h3 className={styles.cardMemberName}>
                {form.fullname || 'NAMA PELANGGAN'}
              </h3>
              <div className={styles.cardMetaRow}>
                <span>ID: #AUTO-ASSIGN</span>
                <span>SINCE: {currentYear}</span>
              </div>
            </div>
          </div>

          <p className={styles.cardNotice}>
            Akun member baru langsung otomatis terdaftar di database MySQL dan dapat dipilih di menu Kasir Transaksi.
          </p>
        </div>
      </div>
    </div>
  );
}
