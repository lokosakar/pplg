'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import styles from './CreateOrder.module.css';

export default function CreateOrder() {
  const router = useRouter();
  const formRef = useRef(null);
  
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({ member_id: '', catalog_id: '', qty: 1 });
  const [error, setError] = useState('');

  useEffect(() => {
    // Ambil data member dan game untuk dropdown
    Promise.all([
      fetch('/api/members').then(res => res.json()),
      fetch('/api/catalog').then(res => res.json())
    ]).then(([membersData, gamesData]) => {
      setMembers(membersData);
      setGames(gamesData);
    });

    gsap.fromTo(formRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const selectedGame = games.find(g => g.id === parseInt(form.catalog_id));
  const total = selectedGame ? selectedGame.price * form.qty : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if(!form.member_id || !form.catalog_id || form.qty < 1) {
      setError('Harap lengkapi semua data dengan benar!');
      return;
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error); // Menampilkan error jika stok habis
    } else {
      alert(`Transaksi Sukses! Resi: ${data.receipt_no}`);
      router.push('/orders'); // Kembali ke halaman riwayat
    }
  };

  return (
    <div className={styles.container}>
      <div ref={formRef} className={styles.card}>
        <h2>Kasir Transaksi Baru</h2>
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Pilih Member</label>
            <select value={form.member_id} onChange={e => setForm({...form, member_id: e.target.value})}>
              <option value="">-- Pilih Member --</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.fullname}</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Pilih Game</label>
            <select value={form.catalog_id} onChange={e => setForm({...form, catalog_id: e.target.value})}>
              <option value="">-- Pilih Game --</option>
              {games.map(g => <option key={g.id} value={g.id}>{g.game_name} (Stok: {g.stock})</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Jumlah Beli (Qty)</label>
            <input 
              type="number" min="1" 
              value={form.qty} 
              onChange={e => setForm({...form, qty: parseInt(e.target.value)})}
            />
          </div>

          <div className={styles.summary}>
            <span>Total Bayar:</span>
            <h3>Rp {total.toLocaleString('id-ID')}</h3>
          </div>

          <button type="submit" className={styles.btnSubmit}>Proses Transaksi</button>
        </form>
      </div>
    </div>
  );
}