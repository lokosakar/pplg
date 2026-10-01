import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT id, fullname FROM members ORDER BY fullname ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}