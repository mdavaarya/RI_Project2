import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { memberService } from '../services/memberService';
import { accountActionService } from '../services/accountActionService';
import { formatIndonesianDate, maskNIK } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge, MemberStatusBadge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { ContextualHelpHint } from '../components/help/ContextualHelpHint';
import {
  UserRound,
  Lock,
  ShieldCheck,
  Save,
  MapPin,
  Trash2,
  ArrowRightLeft,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { DAFTAR_DESA, DomisiliTransferRequest, AccountDeletionRequest } from '../types';

export function ProfilePage() {
  const { session, profile, member, refreshSession } = useAuth();

  const [nama, setNama] = useState(profile?.nama || '');
  const [noHp, setNoHp] = useState(profile?.no_hp || '');
  const [alamat, setAlamat] = useState(member?.alamat || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger' | 'warning'; message: string } | null>(null);

  // Sync state when profile or member changes
  useEffect(() => {
    if (profile?.nama) setNama(profile.nama);
    if (profile?.no_hp !== undefined) setNoHp(profile.no_hp || '');
    if (member?.alamat !== undefined) setAlamat(member.alamat || '');
  }, [profile?.nama, profile?.no_hp, member?.alamat]);

  const handleCancel = () => {
    setNama(profile?.nama || '');
    setNoHp(profile?.no_hp || '');
    setAlamat(member?.alamat || '');
    setIsEditing(false);
  };

  // Domisili Transfer State
  const [showDomisiliModal, setShowDomisiliModal] = useState(false);
  const [desaTujuan, setDesaTujuan] = useState<string>(DAFTAR_DESA[1] || 'Desa Sukamakmur');
  const [alasanDomisili, setAlasanDomisili] = useState('');
  const [domisiliRequests, setDomisiliRequests] = useState<DomisiliTransferRequest[]>([]);
  const [isDomisLoading, setIsDomisLoading] = useState(false);

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alasanHapus, setAlasanHapus] = useState('');
  const [deleteConfirmCheck, setDeleteConfirmCheck] = useState(false);
  const [deletionRequests, setDeletionRequests] = useState<AccountDeletionRequest[]>([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const loadRequests = async () => {
    if (member?.id) {
      const [domRes, delRes] = await Promise.all([
        accountActionService.getDomisiliTransferRequests(member.id),
        accountActionService.getDeletionRequests(member.id),
      ]);
      setDomisiliRequests(domRes);
      setDeletionRequests(delRes);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [member?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setFeedback({ type: 'danger', message: 'Nama lengkap tidak boleh kosong.' });
      return;
    }

    if (member && !alamat.trim()) {
      setFeedback({ type: 'danger', message: 'Alamat domisili terdaftar tidak boleh kosong.' });
      return;
    }

    if (!profile?.id) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await memberService.updateProfile(profile.id, {
        nama: nama.trim(),
        no_hp: noHp.trim(),
        alamat: alamat.trim(),
        memberId: member?.id,
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Data profil dan alamat domisili berhasil diperbarui.' });
        setIsEditing(false);
        await refreshSession();
      } else {
        setFeedback({ type: 'danger', message: res.error || 'Gagal menyimpan perubahan profil.' });
      }
    } catch {
      setFeedback({ type: 'danger', message: 'Terjadi kendala jaringan saat menyimpan profil.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Domisili Transfer Request
  const handleSubmitDomisili = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setIsDomisLoading(true);
    try {
      const res = await accountActionService.requestDomisiliTransfer({
        member_id: member.id,
        nama_anggota: profile?.nama || 'Anggota',
        nomor_anggota: member.nomor_anggota,
        desa_asal: member.domisili_desa || 'Desa Sukamaju',
        desa_tujuan: desaTujuan,
        alasan: alasanDomisili,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Permohonan perpindahan domisili koperasi berhasil dikirim dan menunggu verifikasi pengurus.',
        });
        setShowDomisiliModal(false);
        setAlasanDomisili('');
        await loadRequests();
      } else {
        setFeedback({ type: 'danger', message: res.error || 'Gagal mengirim permohonan.' });
      }
    } finally {
      setIsDomisLoading(false);
    }
  };

  // Submit Account Deletion Request
  const handleSubmitDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    if (!deleteConfirmCheck) {
      setFeedback({ type: 'danger', message: 'Harap centang konfirmasi pemahaman konsekuensi penghapusan akun.' });
      return;
    }

    setIsDeleteLoading(true);
    try {
      const res = await accountActionService.requestAccountDeletion({
        member_id: member.id,
        nama_anggota: profile?.nama || 'Anggota',
        nomor_anggota: member.nomor_anggota,
        alasan: alasanHapus,
      });

      if (res.success) {
        setFeedback({
          type: 'warning',
          message: 'Pengajuan penghapusan akun telah diterima. Pengurus akan memeriksa saldo dan kewajiban sebelum penutupan akun.',
        });
        setShowDeleteModal(false);
        setAlasanHapus('');
        setDeleteConfirmCheck(false);
        await loadRequests();
      } else {
        setFeedback({ type: 'danger', message: res.error || 'Gagal mengirim pengajuan penghapusan akun.' });
      }
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const activeDeletion = deletionRequests.find((r) => r.status === 'menunggu');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#17212B] flex items-center">
          Profil Saya & Pengaturan Akun
          <ContextualHelpHint
            title="Profil & Manajemen Keanggotaan"
            content="Kelola data kontak pribadi, status domisili koperasi desa, serta kontrol pengajuan perubahan data keanggotaan dan akun Anda."
          />
        </h1>
        <p className="text-sm text-[#526170] mt-1">
          Informasi akun, domisili unit koperasi, dan kendali data keanggotaan
        </p>
      </div>

      {feedback && (
        <Alert variant={feedback.type} className="mb-4">
          {feedback.message}
        </Alert>
      )}

      {/* Active Deletion Notice */}
      {activeDeletion && (
        <Alert variant="warning" title="Status Pengajuan Penghapusan Akun Aktif">
          Pengajuan penghapusan akun Anda per tanggal {formatIndonesianDate(activeDeletion.tanggal_pengajuan)} sedang dalam proses peninjauan pengurus koperasi.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        <Card className="md:col-span-1 text-center p-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#E8F4EF] text-[#176B52] flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
            {profile?.nama ? profile.nama.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#17212B]">{profile?.nama || 'Anggota'}</h3>
            <p className="text-xs text-[#526170] font-mono mt-0.5">{session?.user.email}</p>
          </div>

          {member && (
            <div className="pt-2 border-t border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Nomor Anggota</span>
                <span className="font-mono font-bold text-[#17212B]">{member.nomor_anggota}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Domisili Kopdes</span>
                <span className="font-semibold text-[#176B52] bg-[#E8F4EF] px-2 py-0.5 rounded">
                  {member.domisili_desa || 'Desa Sukamaju'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Status Keanggotaan</span>
                <MemberStatusBadge status={member.status} />
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Terdaftar Sejak</span>
                <span className="text-[#17212B]">{formatIndonesianDate(member.tanggal_daftar)}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Right Side: Editable & Protected Info */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <CardTitle className="text-base font-bold">Informasi Akun</CardTitle>
              <CardDescription>
                Kelola nama dan kontak Anda yang terhubung dengan akun koperasi
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Ubah Profil
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Batal
              </Button>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={!isEditing}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Alamat Email"
                  value={session?.user.email || ''}
                  disabled
                  helperText="Email digunakan sebagai identitas masuk utama."
                />

                <Input
                  label="Nomor HP / WhatsApp"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  disabled={!isEditing}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Alamat Domisili Terdaftar - Sekarang dapat diubah oleh anggota */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">
                  Alamat Domisili Terdaftar {isEditing && <span className="text-[#B91C1C]">*</span>}
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Contoh: Jl. Merdeka No. 45, RT 02 / RW 01, Desa Sukamaju"
                    className="w-full p-2.5 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    required
                  />
                ) : (
                  <p className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-sm text-[#17212B]">
                    {alamat || member?.alamat || 'Belum diisi'}
                  </p>
                )}
                <p className="text-xs text-[#526170]">
                  Alamat domisili tempat tinggal fisik anggota yang tercatat dalam sistem.
                </p>
              </div>

              {/* Protected Read-Only Fields (AC-022) */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526170] uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Data Resmi Keanggotaan (Hanya Dibaca)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="NIK (Nomor Induk Kependudukan)"
                    value={member?.nik ? maskNIK(member.nik) : '-'}
                    disabled
                    helperText="Disamarkan untuk melindungi privasi data pribadi."
                  />

                  <Input
                    label="Nomor Anggota Koperasi"
                    value={member?.nomor_anggota || '-'}
                    disabled
                    helperText="Diterbitkan secara resmi oleh sistem koperasi."
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-1.5" />
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* SEKSI 1: Pengajuan Perpindahan Domisili Koperasi Desa */}
      <Card>
        <CardHeader className="pb-3 border-b border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#176B52]" />
                Domisili Unit Koperasi Desa
              </CardTitle>
              <CardDescription>
                Unit koperasi desa tempat keanggotaan Anda saat ini terdaftar: <strong>{member?.domisili_desa || 'Desa Sukamaju'}</strong>
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDomisiliModal(true)}
              className="text-[#176B52] border-[#176B52] hover:bg-[#E8F4EF]"
            >
              <ArrowRightLeft className="w-4 h-4 mr-1.5" />
              Ajukan Pindah Domisili
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <p className="text-xs text-[#526170] mb-3">
            Bila Anda berpindah tempat tinggal ke desa lain, Anda dapat mengajukan perpindahan unit koperasi tanpa kehilangan data riwayat simpanan Anda.
          </p>

          {domisiliRequests.length > 0 && (
            <div className="divide-y divide-[#E2E8F0] border rounded-lg overflow-hidden">
              <div className="bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#526170] flex justify-between">
                <span>Riwayat Pengajuan Pindah Domisili</span>
                <span>Status</span>
              </div>
              {domisiliRequests.map((req) => (
                <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-[#17212B]">
                      {req.desa_asal} ➔ {req.desa_tujuan}
                    </span>
                    <p className="text-[#526170] mt-0.5">Alasan: {req.alasan}</p>
                    <p className="text-[11px] text-[#718096]">Diajukan pada {formatIndonesianDate(req.tanggal_pengajuan)}</p>
                    {req.catatan_pengurus && (
                      <p className="text-[#0369A1] font-medium mt-1">Catatan Pengurus: {req.catatan_pengurus}</p>
                    )}
                  </div>
                  <div>
                    {req.status === 'menunggu' && (
                      <Badge variant="warning">Menunggu Verifikasi</Badge>
                    )}
                    {req.status === 'disetujui' && (
                      <Badge variant="success">Disetujui</Badge>
                    )}
                    {req.status === 'ditolak' && (
                      <Badge variant="danger">Ditolak</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEKSI 2: Zona Kendali Akun — Pengajuan Penghapusan Akun */}
      <Card className="border-[#FECACA]">
        <CardHeader className="pb-3 border-b border-[#FEE2E2] bg-[#FFF5F5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-[#B91C1C] flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-[#B91C1C]" />
                Pengajuan Penghapusan Akun Keanggotaan
              </CardTitle>
              <CardDescription className="text-[#7F1D1D]">
                Ajukan penutupan akun dan keanggotaan koperasi jika Anda tidak lagi menjadi anggota
              </CardDescription>
            </div>
            <Button
              variant="danger"
              size="sm"
              disabled={Boolean(activeDeletion)}
              onClick={() => setShowDeleteModal(true)}
            >
              {activeDeletion ? 'Permohonan Sedang Ditinjau' : 'Ajukan Hapus Akun'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <p className="text-xs text-[#526170] leading-relaxed">
            Sesuai kebijakan koperasi desa, pengajuan penghapusan akun akan ditinjau oleh pengurus untuk memastikan hak simpanan telah diselesaikan dan tidak ada kewajiban tertunggak sebelum data keanggotaan dinonaktifkan secara permanen.
          </p>
        </CardContent>
      </Card>

      {/* Modal Pindah Domisili */}
      {showDomisiliModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h4 className="text-lg font-bold text-[#17212B] mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#176B52]" />
              Formulir Pindah Domisili Koperasi
            </h4>
            <p className="text-xs text-[#526170] mb-4">
              Domisili saat ini: <strong>{member?.domisili_desa || 'Desa Sukamaju'}</strong>
            </p>

            <form onSubmit={handleSubmitDomisili} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">Pilih Desa Tujuan Baru</label>
                <select
                  value={desaTujuan}
                  onChange={(e) => setDesaTujuan(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                >
                  {DAFTAR_DESA.filter((d) => d !== (member?.domisili_desa || 'Desa Sukamaju')).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">Alasan Perpindahan</label>
                <textarea
                  rows={3}
                  value={alasanDomisili}
                  onChange={(e) => setAlasanDomisili(e.target.value)}
                  placeholder="Contoh: Pindah domisili tempat tinggal ke Desa Karanganyar karena pekerjaan..."
                  className="w-full p-2.5 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDomisiliModal(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" isLoading={isDomisLoading}>
                  Kirim Pengajuan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Akun */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h4 className="text-lg font-bold text-[#B91C1C] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#B91C1C]" />
              Konfirmasi Penghapusan Akun
            </h4>
            <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-lg p-3 text-xs text-[#7F1D1D] mb-4 space-y-1">
              <p className="font-semibold">Konsekuensi Tindakan:</p>
              <p>• Akun keanggotaan Anda akan dinonaktifkan setelah diverifikasi pengurus.</p>
              <p>• Seluruh sisa saldo simpanan akan diproses pengembaliannya oleh pengurus koperasi desa sesuai AD/ART.</p>
              <p>• Anda tidak dapat mengakses layanan anggota setelah penutupan akun.</p>
            </div>

            <form onSubmit={handleSubmitDeletion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">Alasan Penghapusan Akun</label>
                <textarea
                  rows={3}
                  value={alasanHapus}
                  onChange={(e) => setAlasanHapus(e.target.value)}
                  placeholder="Tuliskan alasan Anda ingin menutup akun keanggotaan..."
                  className="w-full p-2.5 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                  required
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-[#526170] cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteConfirmCheck}
                  onChange={(e) => setDeleteConfirmCheck(e.target.checked)}
                  className="mt-0.5 rounded text-[#B91C1C] focus:ring-[#B91C1C]"
                />
                <span>Saya memahami konsekuensi penutupan akun dan menyatakan permohonan ini dengan sadar.</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  isLoading={isDeleteLoading}
                  disabled={!deleteConfirmCheck}
                >
                  Kirim Permohonan Hapus
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
