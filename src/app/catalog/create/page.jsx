'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import styles from '../Form.module.css'; 

export default function CreateGame() {
  const router = useRouter();
  const formRef = useRef(null);
  
  // State default kosong
  const [form, setForm] = useState({ game_name: '', genre: '', platform: '', price: '', stock: '', description: '' });

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        // Pastikan formatnya angka murni saat dikirim ke database MySQL
        price: form.price.toString().replace(/\D/g, ''),
        stock: form.stock.toString().replace(/\D/g, '')
      })
    });
    router.push('/catalog');
  };

  return (
    <div className={styles.container} ref={formRef}>
      <h2>Tambah Game Baru</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Judul Game</label>
          <input type="text" required value={form.game_name} onChange={e => setForm({...form, game_name: e.target.value})} placeholder="Contoh: Black Myth Wukong" />
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Genre</label>
            <input type="text" required value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} placeholder="Action RPG" />
          </div>
          <div className={styles.inputGroup}>
            <label>Platform</label>
            <select required value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
              <option value="">-- Pilih Platform --</option>
              <option value="PC">PC</option>
              <option value="PS5">PS5</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Harga (Rp)</label>
            {/* Input tipe text agar bisa format titik otomatis ala UX pro */}
            <input 
              type="text" required 
              value={form.price ? Number(form.price).toLocaleString('id-ID') : ''} 
              onChange={e => setForm({...form, price: e.target.value.replace(/\D/g, '')})} 
              placeholder="Contoh: 700.000"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Stok Fisik / Digital</label>
            <input 
              type="text" required 
              value={form.stock ? Number(form.stock).toLocaleString('id-ID') : ''} 
              onChange={e => setForm({...form, stock: e.target.value.replace(/\D/g, '')})} 
              placeholder="Contoh: 50"
            />
          </div>
        </div>
        <button type="submit" className={styles.btnSubmit}>Simpan Game ke Katalog</button>
      </form>
    </div>
  );
}