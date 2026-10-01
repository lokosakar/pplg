'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Plus, Receipt } from 'lucide-react';
import styles from './Orders.module.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data));

    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Data Transaksi</h1>
          <p>Riwayat pembelian tiket/game oleh member</p>
        </div>
        <Link href="/orders/create" className={styles.btnAdd}>
          <Plus size={18} /> Transaksi Baru
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No. Resi</th>
              <th>Member</th>
              <th>Item Game</th>
              <th>Qty</th>
              <th>Total (Rp)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className={styles.highlight}><Receipt size={14} className={styles.icon}/> {order.receipt_no}</td>
                <td>{order.fullname}</td>
                <td>{order.game_name}</td>
                <td>{order.qty}</td>
                <td className={styles.price}>{parseInt(order.total_amount).toLocaleString('id-ID')}</td>
                <td><span className={styles.badgeSuccess}>{order.status}</span></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Belum ada transaksi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}