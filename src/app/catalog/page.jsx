'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import styles from './Catalog.module.css';

export default function Catalog() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const tbodyRef = useRef(null);
  const headerRef = useRef(null);

  const fetchGames = async () => {
    const res = await fetch('/api/catalog');
    const data = await res.json();
    setGames(data);
  };

  useEffect(() => {
    fetchGames();
    
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (games.length > 0 && tbodyRef.current) {
      gsap.fromTo(tbodyRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [games]);

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus game ini?')) {
      await fetch(`/api/catalog/${id}`, { method: 'DELETE' });
      fetchGames(); 
    }
  };

  const filteredGames = games.filter(game => 
    game.game_name.toLowerCase().includes(search.toLowerCase()) ||
    game.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div ref={headerRef} className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Katalog Game</h1>
          <p>Kelola data game, stok, dan harga</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Cari nama atau platform..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link href="/catalog/create" className={styles.btnAdd}>
            <Plus size={18} /> Tambah Game
          </Link>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Judul Game</th>
              <th>Genre</th>
              <th>Platform</th>
              <th>Harga (Rp)</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <tr key={game.id}>
                  <td className={styles.gameName}>{game.game_name}</td>
                  <td>{game.genre}</td>
                  <td><span className={styles.badge}>{game.platform}</span></td>
                  <td>{parseInt(game.price).toLocaleString('id-ID')}</td>
                  <td>
                    <span className={game.stock > 10 ? styles.stockSafe : styles.stockLow}>
                      {game.stock}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <Link href={`/catalog/${game.id}`} className={styles.btnEdit}>
                      <Edit size={16} />
                    </Link>
                    <button className={styles.btnDelete} onClick={() => handleDelete(game.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  Tidak ada data game ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}