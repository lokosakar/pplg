import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Username XAMPP lu
  password: '',      // Password XAMPP (biasanya kosong)
  database: 'nexus_game_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});