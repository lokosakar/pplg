import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

// DELETE: Hapus data member
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const [[member]] = await db.query('SELECT fullname FROM members WHERE id = ?', [id]);
    if (!member) {
      return NextResponse.json({ error: 'Member tidak ditemukan' }, { status: 404 });
    }

    await db.query('DELETE FROM members WHERE id = ?', [id]);
    return NextResponse.json({ 
      success: true, 
      message: `Member "${member.fullname}" berhasil dihapus dari sistem.` 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
