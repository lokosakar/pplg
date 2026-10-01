'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import gsap from 'gsap';
import styles from '../Form.module.css';

export default function EditGame() {
  const router = useRouter();
  const params = useParams(); // Menggunakan useParams untuk menangkap ID dengan aman
  const { id } = params;
  const formRef = useRef(null);
  
  const [form, setForm] = useState({ game_name: '', genre: '', platform: '', price: '', stock: '', description: '' });

  // Ambil data lama dari database begitu halaman Edit terbuka
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/catalog/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setForm(data); // Isi form dengan data lama!
        }
      });

    gsap.fromTo(formRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/catalog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: form.price.toString().replace(/\D/g, ''),
        stock: form.stock.toString().replace(/\D/g, '')
      })
    });
    router.push('/catalog');
  };

  return (
    <div className={styles.container} ref={formRef}>
      <h2>Edit Data Game</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Judul Game</label>
          <input type="text" required value={form.game_name} onChange={e => setForm({...form, game_name: e.target.value})} />
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Genre</label>
            <input type="text" required value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} />
          </div>
          <div className={styles.inputGroup}>
            <label>Platform</label>
            <select required value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
              <option value="PC">PC</option>
              <option value="PS5">PS5</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Harga (Rp)</label>
            <input 
              type="text" required 
              value={form.price ? Number(form.price).toLocaleString('id-ID') : ''} 
              onChange={e => setForm({...form, price: e.target.value.replace(/\D/g, '')})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Stok</label>
            <input 
              type="text" required 
              value={form.stock ? Number(form.stock).toLocaleString('id-ID') : ''} 
              onChange={e => setForm({...form, stock: e.target.value.replace(/\D/g, '')})} 
            />
          </div>
        </div>
        <button type="submit" className={styles.btnSubmit}>Update Data Game</button>
      </form>
    </div>
  );
}