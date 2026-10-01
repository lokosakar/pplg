import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

// GET: Ambil semua data member
export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT id, fullname, email, phone, joined_date FROM members ORDER BY id DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah member baru
export async function POST(request) {
  try {
    const { fullname, email, phone } = await request.json();

    if (!fullname || !email || !phone) {
      return NextResponse.json(
        { error: 'Nama Lengkap, Email, dan Nomor Telepon wajib diisi!' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const [existing] = await db.query('SELECT id FROM members WHERE email = ?', [email.trim()]);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Email ${email} sudah terdaftar sebagai member!` },
        { status: 400 }
      );
    }

    const query = 'INSERT INTO members (fullname, email, phone) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [fullname.trim(), email.trim().toLowerCase(), phone.trim()]);

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Member baru berhasil didaftarkan.'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}