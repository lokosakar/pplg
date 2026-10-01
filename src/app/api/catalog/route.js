import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

// GET: Ambil semua data game
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM catalog ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah game baru
export async function POST(request) {
  try {
    const data = await request.json();
    const { game_name, genre, platform, price, stock, description } = data;
    
    // Validasi Sederhana
    if (!game_name || !price || !stock) {
      return NextResponse.json({ error: 'Data wajib diisi!' }, { status: 400 });
    }

    const query = 'INSERT INTO catalog (game_name, genre, platform, price, stock, description) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [game_name, genre, platform, price, stock, description]);
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}