'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  Plus, 
  Receipt, 
  Search, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  TrendingUp, 
  ShoppingCart, 
  Coins, 
  Trash2, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import styles from './Orders.module.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const containerRef = useRef(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.header}`,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(`.${styles.kpiRow}`,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' }
      );

      gsap.fromTo(`.${styles.tableWrapper}`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power4.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleCopyResi = (receiptNo) => {
    navigator.clipboard.writeText(receiptNo);
    setCopiedId(receiptNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDelete = (order) => {
    setDeleteModal({ isOpen: true, order });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.order) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/orders/${deleteModal.order.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || 'Transaksi berhasil dihapus & stok dikembalikan.');
        setDeleteModal({ isOpen: false, order: null });
        fetchOrders();
      } else {
        alert(data.error || 'Gagal menghapus transaksi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus transaksi.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const term = search.toLowerCase();
    return (
      (order.receipt_no && order.receipt_no.toLowerCase().includes(term)) ||
      (order.fullname && order.fullname.toLowerCase().includes(term)) ||
      (order.game_name && order.game_name.toLowerCase().includes(term))
    );
  });

  // Calculate KPIs
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
  const averageOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const getInitials = (name) => {
    if (!name) return 'MB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Toast Alert Notification */}
      {toast && (
        <div className={styles.toastNotification}>
          <PackageCheck size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Area */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleBadge}>
            <ShoppingCart size={13} />
            <span>Kasir & Laporan Transaksi</span>
          </div>
          <h1>Data Transaksi Penjualan</h1>
          <p>Daftar seluruh riwayat pembayaran tiket kasir, pesanan game, pembatalan invoice, dan cetak struk.</p>
        </div>

        <Link href="/orders/create" className={styles.btnAdd}>
          <Plus size={18} />
          <span>Kasir Transaksi Baru</span>
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapViolet}>
            <Receipt size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Total Transaksi Sukses</span>
            <h3 className={styles.kpiValue}>{orders.length} Pesanan</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapEmerald}>
            <Coins size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Total Omset Penjualan</span>
            <h3 className={`${styles.kpiValue} ${styles.emeraldValue}`}>
              Rp {totalRevenue.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapCyan}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Rata-rata Nilai Order (AOV)</span>
            <h3 className={styles.kpiValue}>
              Rp {averageOrder.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <Search size={17} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Cari nomor resi, nama member, atau game..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Orders Table Wrapper */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No. Resi Invoice</th>
              <th>Member Pelanggan</th>
              <th>Item Game</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th>Total Pembayaran</th>
              <th>Status Transaksi</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className={styles.tableRow}>
                  {/* Resi */}
                  <td>
                    <button 
                      className={styles.receiptPill} 
                      onClick={() => handleCopyResi(order.receipt_no)}
                      title="Klik untuk menyalin nomor resi"
                    >
                      <Receipt size={14} className={styles.receiptIcon} />
                      <code>{order.receipt_no}</code>
                      {copiedId === order.receipt_no ? (
                        <Check size={13} className={styles.copiedIcon} />
                      ) : (
                        <Copy size={13} className={styles.copyIcon} />
                      )}
                    </button>
                  </td>

                  {/* Member */}
                  <td>
                    <div className={styles.memberCell}>
                      <div className={styles.memberAvatar}>
                        <span>{getInitials(order.fullname)}</span>
                      </div>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{order.fullname}</span>
                        <span className={styles.memberSub}>Member Aktif</span>
                      </div>
                    </div>
                  </td>

                  {/* Game */}
                  <td>
                    <span className={styles.gameCellTitle}>{order.game_name}</span>
                  </td>

                  {/* Qty */}
                  <td style={{ textAlign: 'center' }}>
                    <span className={styles.qtyBadge}>{order.qty}x</span>
                  </td>

                  {/* Price */}
                  <td>
                    <span className={styles.priceTag}>
                      Rp {Number(order.total_amount).toLocaleString('id-ID')}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={styles.badgeSuccess}>
                      <CheckCircle2 size={13} />
                      <span>{order.status || 'Sukses'}</span>
                    </span>
                  </td>

                  {/* Action: Delete / Cancel Order */}
                  <td>
                    <div className={styles.actionCell}>
                      <button 
                        className={styles.btnDeleteOrder}
                        onClick={() => handleOpenDelete(order)}
                        title="Hapus / Batalkan Transaksi"
                      >
                        <Trash2 size={15} />
                        <span>Batalkan</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className={styles.emptyTable}>
                    <Receipt size={48} className={styles.emptyIcon} />
                    <h3>Belum Ada Transaksi Ditemukan</h3>
                    <p>
                      {search 
                        ? `Tidak ada transaksi dengan nomor resi atau member "${search}".` 
                        : 'Mulai catat transaksi pertama Anda melalui fitur kasir online.'}
                    </p>
                    <Link href="/orders/create" className={styles.btnCreateFirst}>
                      <Plus size={16} />
                      <span>Buat Transaksi Kasir Baru</span>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete / Cancel Order Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIconWrap}>
              <AlertCircle size={32} className={styles.modalWarningIcon} />
            </div>
            <h3>Batalkan & Hapus Transaksi?</h3>
            <p>
              Apakah Anda yakin ingin membatalkan transaksi resi <strong>&ldquo;{deleteModal.order?.receipt_no}&rdquo;</strong>?
            </p>
            
            <div className={styles.modalDetailBox}>
              <div className={styles.modalDetailRow}>
                <span>Pelanggan:</span>
                <strong>{deleteModal.order?.fullname}</strong>
              </div>
              <div className={styles.modalDetailRow}>
                <span>Item:</span>
                <strong>{deleteModal.order?.game_name} ({deleteModal.order?.qty}x)</strong>
              </div>
              <div className={styles.modalDetailRow}>
                <span>Total:</span>
                <strong style={{ color: '#34d399' }}>Rp {Number(deleteModal.order?.total_amount).toLocaleString('id-ID')}</strong>
              </div>
            </div>

            <div className={styles.stockReturnNotice}>
              <CheckCircle2 size={15} />
              <span>Stok game sebanyak {deleteModal.order?.qty} unit akan otomatis dikembalikan ke katalog.</span>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.modalBtnCancel} 
                onClick={() => setDeleteModal({ isOpen: false, order: null })}
                disabled={isDeleting}
              >
                Tutup
              </button>
              <button 
                className={styles.modalBtnConfirm} 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Membatalkan...' : 'Ya, Batalkan & Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}