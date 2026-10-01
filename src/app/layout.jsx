import './globals.css';
import Sidebar from './components/Sidebar/Sidebar';

export const metadata = {
  title: 'Lionel game store',
  description: 'Proyek STS RPL - Game Store Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}