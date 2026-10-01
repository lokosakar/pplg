'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  Users, 
  UserPlus, 
  Search, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  AlertCircle, 
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UserCheck
} from 'lucide-react';
import styles from './Members.module.css';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, member: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const containerRef = useRef(null);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
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

  const handleOpenDelete = (member) => {
    setDeleteModal({ isOpen: true, member });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.member) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/members/${deleteModal.member.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || `Member ${deleteModal.member.fullname} berhasil dihapus.`);
        setDeleteModal({ isOpen: false, member: null });
        fetchMembers();
      } else {
        alert(data.error || 'Gagal menghapus member.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const term = search.toLowerCase();
    return (
      (m.fullname && m.fullname.toLowerCase().includes(term)) ||
      (m.email && m.email.toLowerCase().includes(term)) ||
      (m.phone && m.phone.toLowerCase().includes(term))
    );
  });

  const getInitials = (name) => {
    if (!name) return 'MB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Hari ini';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Toast Alert */}
      {toast && (
        <div className={styles.toastNotification}>
          <PackageCheck size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleBadge}>
            <Users size={13} />
            <span>Manajemen Komunitas & Pelanggan</span>
          </div>
          <h1>Member Pelanggan</h1>
          <p>Kelola data member aktif, pendaftaran akun kasir baru, dan riwayat loyalitas toko.</p>
        </div>

        <Link href="/members/create" className={styles.btnAdd}>
          <UserPlus size={18} />
          <span>Tambah Member Baru</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapCyan}>
            <Users size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Total Member Terdaftar</span>
            <h3 className={styles.kpiValue}>{members.length} Orang</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapEmerald}>
            <UserCheck size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Status Keanggotaan</span>
            <h3 className={`${styles.kpiValue} ${styles.emeraldValue}`}>Semua Aktif</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapViolet}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Tingkat Keamanan Kasir</span>
            <h3 className={styles.kpiValue}>Terverifikasi</h3>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <Search size={17} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Cari nama member, email, atau nomor telepon..." 
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

      {/* Members Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID & Profil Member</th>
              <th>Alamat Email</th>
              <th>Kontak / WhatsApp</th>
              <th>Bergabung Sejak</th>
              <th>Status Akun</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id} className={styles.tableRow}>
                  {/* Profil */}
                  <td>
                    <div className={styles.profileCell}>
                      <div className={styles.avatarWrap}>
                        <span>{getInitials(member.fullname)}</span>
                      </div>
                      <div className={styles.profileInfo}>
                        <span className={styles.fullname}>{member.fullname}</span>
                        <span className={styles.memberId}>Member ID #{member.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td>
                    <div className={styles.contactCell}>
                      <Mail size={14} className={styles.contactIcon} />
                      <a href={`mailto:${member.email}`} className={styles.contactLink}>
                        {member.email}
                      </a>
                    </div>
                  </td>

                  {/* Phone */}
                  <td>
                    <div className={styles.contactCell}>
                      <Phone size={14} className={styles.contactIcon} />
                      <a href={`https://wa.me/${member.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                        {member.phone}
                      </a>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td>
                    <div className={styles.dateCell}>
                      <Calendar size={13} className={styles.dateIcon} />
                      <span>{formatDate(member.joined_date)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={styles.badgeActive}>
                      <Sparkles size={12} />
                      <span>VIP Member</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className={styles.actionCell}>
                      <button 
                        className={styles.btnDelete}
                        onClick={() => handleOpenDelete(member)}
                        title="Hapus data member"
                      >
                        <Trash2 size={15} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className={styles.emptyTable}>
                    <Users size={48} className={styles.emptyIcon} />
                    <h3>Tidak Ada Member Ditemukan</h3>
                    <p>
                      {search 
                        ? `Tidak ada member dengan nama, email, atau telepon "${search}".` 
                        : 'Belum ada data member terdaftar di database.'}
                    </p>
                    <Link href="/members/create" className={styles.btnCreateFirst}>
                      <UserPlus size={16} />
                      <span>Tambah Member Baru Sekarang</span>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIconWrap}>
              <AlertCircle size={32} className={styles.modalWarningIcon} />
            </div>
            <h3>Hapus Data Member?</h3>
            <p>
              Apakah Anda yakin ingin menghapus member <strong>&ldquo;{deleteModal.member?.fullname}&rdquo;</strong> (ID #{deleteModal.member?.id}) dari database?
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalBtnCancel} 
                onClick={() => setDeleteModal({ isOpen: false, member: null })}
                disabled={isDeleting}
              >
                Batalkan
              </button>
              <button 
                className={styles.modalBtnConfirm} 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
