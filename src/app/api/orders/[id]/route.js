import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

// DELETE: Hapus transaksi dan kembalikan stok game ke katalog
export async function DELETE(request, { params }) {
  const { id } = await params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ambil data order untuk mengetahui catalog_id dan qty
    const [[order]] = await connection.query(
      'SELECT id, receipt_no, catalog_id, qty FROM orders WHERE id = ? FOR UPDATE',
      [id]
    );

    if (!order) {
      await connection.rollback();
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    // 2. Kembalikan stok ke tabel catalog
    await connection.query(
      'UPDATE catalog SET stock = stock + ? WHERE id = ?',
      [order.qty, order.catalog_id]
    );

    // 3. Hapus data order dari database
    await connection.query('DELETE FROM orders WHERE id = ?', [id]);

    await connection.commit();
    return NextResponse.json({ 
      success: true, 
      message: `Transaksi ${order.receipt_no} berhasil dihapus dan ${order.qty} unit stok telah dikembalikan ke katalog.` 
    });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
