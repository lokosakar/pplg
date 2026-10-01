import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // Wajib di-await di Next.js terbaru
    const [rows] = await db.query('SELECT * FROM catalog WHERE id = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Wajib di-await
    const data = await request.json();
    const { game_name, genre, platform, price, stock, description } = data;
    
    await db.query(
      'UPDATE catalog SET game_name=?, genre=?, platform=?, price=?, stock=?, description=? WHERE id=?',
      [game_name, genre, platform, price, stock, description, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // Wajib di-await agar ID terbaca
    await db.query('DELETE FROM catalog WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}