import './globals.css';
import Sidebar from './components/sidebar/Sidebar';

export const metadata = {
  title: 'Lionel Game Store — Modern Management Hub',
  description: 'Sistem Manajemen Katalog Game & Kasir Transaksi Modern',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Sidebar />
        <main style={{ 
          flex: 1, 
          height: '100vh', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          padding: '2.5rem 3rem',
          position: 'relative' 
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}