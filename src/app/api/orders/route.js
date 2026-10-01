import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

// GET: Tampilkan riwayat transaksi (JOIN 3 Tabel)
export async function GET() {
  try {
    const query = `
      SELECT o.id, o.receipt_no, o.qty, o.total_amount, o.order_date, o.status,
             m.fullname, c.game_name 
      FROM orders o
      JOIN members m ON o.member_id = m.id
      JOIN catalog c ON o.catalog_id = c.id
      ORDER BY o.id DESC
    `;
    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Buat Transaksi Baru & Potong Stok
export async function POST(request) {
  const connection = await db.getConnection(); // Pinjam koneksi khusus untuk transaksi aman
  try {
    const { member_id, catalog_id, qty } = await request.json();
    
    await connection.beginTransaction(); // MULAI TRANSAKSI AMAN

    // 1. Cek harga dan ketersediaan stok game
    const [[game]] = await connection.query('SELECT price, stock FROM catalog WHERE id = ? FOR UPDATE', [catalog_id]);
    
    if (!game) throw new Error('Game tidak ditemukan!');
    if (game.stock < qty) throw new Error('Stok tidak mencukupi untuk jumlah tersebut!');

    const total_amount = game.price * qty;
    const receipt_no = 'REC-' + Date.now(); // Bikin nomor resi unik otomatis

    // 2. Insert ke tabel orders
    await connection.query(
      'INSERT INTO orders (receipt_no, member_id, catalog_id, qty, total_amount) VALUES (?, ?, ?, ?, ?)',
      [receipt_no, member_id, catalog_id, qty, total_amount]
    );

    // 3. Potong stok di tabel catalog
    await connection.query('UPDATE catalog SET stock = stock - ? WHERE id = ?', [qty, catalog_id]);

    await connection.commit(); // SIMPAN PERUBAHAN KE DATABASE
    return NextResponse.json({ success: true, receipt_no });

  } catch (error) {
    await connection.rollback(); // BATALKAN SEMUA JIKA ADA ERROR
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    connection.release(); // Kembalikan koneksi
  }
}