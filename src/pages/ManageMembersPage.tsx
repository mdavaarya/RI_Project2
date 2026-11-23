import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { memberService } from '../services/memberService';
import { Member, MemberStatus } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MemberStatusBadge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { LoadingState } from '../components/access/LoadingState';
import { formatIndonesianDate, maskNIK } from '../utils/formatters';
import { Users, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export function ManageMembersPage() {
  const { profile } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Guard: AC-025 - only role='pengurus' can access
  if (profile && profile.role !== 'pengurus') {
    return <Navigate to="/dashboard" replace />;
  }

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleUpdateStatus = async (memberId: string, newStatus: MemberStatus) => {
    setActionLoading(true);
    setActionFeedback(null);
    try {
      const res = await memberService.updateMemberStatus(memberId, newStatus);
      if (res.success) {
        setActionFeedback({
          type: 'success',
          message: `Status anggota berhasil diubah menjadi ${newStatus}.`,
        });
        await loadMembers();
        if (selectedMember && selectedMember.id === memberId) {
          setSelectedMember({ ...selectedMember, status: newStatus });
        }
      } else {
        setActionFeedback({
          type: 'danger',
          message: res.error || 'Gagal mengubah status anggota.',
        });
      }
    } catch {
      setActionFeedback({
        type: 'danger',
        message: 'Terjadi kendala jaringan saat memperbarui status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      (m.profile?.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      m.nomor_anggota.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingState message="Memuat daftar anggota koperasi..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17212B]">Kelola Anggota Koperasi</h1>
          <p className="text-sm text-[#526170] mt-1">
            Verifikasi pendaftaran anggota baru dan tinjau status keanggotaan aktif
          </p>
        </div>
      </div>

      {actionFeedback && (
        <Alert variant={actionFeedback.type} className="mb-4">
          {actionFeedback.message}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#718096] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau nomor anggota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#176B52]"
          />
        </div>

        <div className="flex gap-1 bg-white p-1 border border-[#E2E8F0] rounded-lg shadow-sm">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Pending' },
            { id: 'aktif', label: 'Aktif' },
            { id: 'nonaktif', label: 'Nonaktif' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#176B52] text-white'
                  : 'text-[#526170] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center text-[#718096]">
              <Users className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="font-semibold text-base text-[#17212B]">Tidak ada data anggota ditemukan</p>
              <p className="text-xs text-[#526170] mt-1">
                Ubah filter pencarian atau pastikan anggota sudah mendaftar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Tabel Kelola Anggota">
                <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#526170] uppercase border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-6 py-3.5">Nama Anggota</th>
                    <th className="px-6 py-3.5">No. Anggota</th>
                    <th className="px-6 py-3.5">NIK (Masked)</th>
                    <th className="px-6 py-3.5">Tanggal Daftar</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#17212B]">
                        {m.profile?.nama || 'Tanpa Nama'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#526170]">
                        {m.nomor_anggota}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#718096]">
                        {maskNIK(m.nik)}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#526170]">
                        {formatIndonesianDate(m.tanggal_daftar)}
                      </td>
                      <td className="px-6 py-4">
                        <MemberStatusBadge status={m.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMember(m)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Detail
                        </Button>
                        {m.status === 'pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(m.id, 'aktif')}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Verifikasi
                          </Button>
                        )}
                        {m.status === 'aktif' && (
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(m.id, 'nonaktif')}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Nonaktifkan
                          </Button>
                        )}
                        {m.status === 'nonaktif' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => handleUpdateStatus(m.id, 'aktif')}
                          >
                            Aktifkan Kembali
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Member Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h4 id="detail-title" className="text-lg font-bold text-[#17212B] mb-1">
              Rincian Anggota Koperasi
            </h4>
            <p className="text-xs text-[#526170] mb-4">
              Nomor Anggota: {selectedMember.nomor_anggota}
            </p>

            <div className="space-y-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 text-sm mb-6">
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#526170]">Nama Lengkap:</span>
                <span className="font-semibold text-[#17212B]">{selectedMember.profile?.nama}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#526170]">NIK:</span>
                <span className="font-mono text-[#17212B]">{selectedMember.nik}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#526170]">Nomor HP/WA:</span>
                <span className="text-[#17212B]">{selectedMember.profile?.no_hp || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#526170]">Status Keanggotaan:</span>
                <MemberStatusBadge status={selectedMember.status} />
              </div>
              <div className="py-1">
                <span className="text-[#526170] block mb-1">Alamat Domisili:</span>
                <span className="text-[#17212B] bg-white p-2 rounded border border-[#E2E8F0] block">
                  {selectedMember.alamat}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedMember(null)}>
                Tutup
              </Button>
              {selectedMember.status === 'pending' && (
                <Button
                  variant="primary"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedMember.id, 'aktif')}
                >
                  Setujui & Aktifkan
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
