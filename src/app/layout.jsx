import './globals.css';
import AppLayout from './components/layout/AppLayout';

export const metadata = {
  title: 'Lionel Game Store — Modern Management Hub',
  description: 'Sistem Manajemen Katalog Game & Kasir Transaksi Modern',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}