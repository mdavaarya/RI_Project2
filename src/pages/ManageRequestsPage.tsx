import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { accountActionService } from '../services/accountActionService';
import { memberService } from '../services/memberService';
import { DomisiliTransferRequest, AccountDeletionRequest } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { LoadingState } from '../components/access/LoadingState';
import { formatIndonesianDate } from '../utils/formatters';
import { ArrowRightLeft, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

export function ManageRequestsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'domisili' | 'deletion'>('domisili');
  const [domisiliList, setDomisiliList] = useState<DomisiliTransferRequest[]>([]);
  const [deletionList, setDeletionList] = useState<AccountDeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Guard: only pengurus
  if (profile && profile.role !== 'pengurus') {
    return <Navigate to="/dashboard" replace />;
  }

  const loadData = async () => {
    setLoading(true);
    try {
      const [domData, delData] = await Promise.all([
        accountActionService.getDomisiliTransferRequests(),
        accountActionService.getDeletionRequests(),
      ]);
      setDomisiliList(domData);
      setDeletionList(delData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDomisiliAction = async (req: DomisiliTransferRequest, status: 'disetujui' | 'ditolak') => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await accountActionService.updateDomisiliStatus(
        req.id,
        status,
        status === 'disetujui' ? 'Perpindahan domisili diverifikasi dan disetujui.' : 'Ditolak karena berkas belum lengkap.'
      );

      if (res.success) {
        // If approved, update member's domisili_desa in memberService/localStore
        if (status === 'disetujui') {
          const members = await memberService.getAllMembers();
          const targetMem = members.find((m) => m.id === req.member_id);
          if (targetMem) {
            targetMem.domisili_desa = req.desa_tujuan;
            const dataStr = localStorage.getItem('simkopdes_local_store');
            if (dataStr) {
              const store = JSON.parse(dataStr);
              const idx = store.members.findIndex((m: any) => m.id === req.member_id);
              if (idx !== -1) {
                store.members[idx].domisili_desa = req.desa_tujuan;
                localStorage.setItem('simkopdes_local_store', JSON.stringify(store));
              }
            }
          }
        }

        setFeedback({
          type: 'success',
          message: `Permohonan perpindahan domisili ${req.nama_anggota} berhasil ${status}.`,
        });
        await loadData();
      } else {
        setFeedback({ type: 'danger', message: res.error || 'Gagal memproses permohonan.' });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletionAction = async (req: AccountDeletionRequest, status: 'disetujui' | 'ditolak') => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await accountActionService.updateDeletionStatus(
        req.id,
        status,
        status === 'disetujui' ? 'Penutupan akun disetujui. Keanggotaan dinonaktifkan.' : 'Penutupan akun ditolak.'
      );

      if (res.success) {
        // If approved, deactivate member
        if (status === 'disetujui') {
          await memberService.updateMemberStatus(req.member_id, 'nonaktif');
        }

        setFeedback({
          type: 'success',
          message: `Pengajuan penghapusan akun ${req.nama_anggota} berhasil ${status}.`,
        });
        await loadData();
      } else {
        setFeedback({ type: 'danger', message: res.error || 'Gagal memproses pengajuan.' });
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Memuat daftar permohonan anggota..." />;
  }

  const pendingDomisiliCount = domisiliList.filter((d) => d.status === 'menunggu').length;
  const pendingDeletionCount = deletionList.filter((d) => d.status === 'menunggu').length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#17212B]">Permohonan Layanan Anggota</h1>
        <p className="text-sm text-[#526170] mt-1">
          Tinjau dan verifikasi pengajuan perpindahan domisili koperasi serta permohonan penghapusan akun
        </p>
      </div>

      {feedback && (
        <Alert variant={feedback.type} className="mb-4">
          {feedback.message}
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('domisili')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'domisili'
              ? 'bg-[#176B52] text-white'
              : 'text-[#526170] hover:bg-[#F1F5F9]'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Pindah Domisili
          {pendingDomisiliCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#FEF3C7] text-[#A16207] rounded-full text-xs">
              {pendingDomisiliCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deletion')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'deletion'
              ? 'bg-[#B91C1C] text-white'
              : 'text-[#526170] hover:bg-[#F1F5F9]'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Penghapusan Akun
          {pendingDeletionCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#FEE2E2] text-[#B91C1C] rounded-full text-xs">
              {pendingDeletionCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Domisili Transfers */}
      {activeTab === 'domisili' && (
        <Card>
          <CardHeader className="pb-3 border-b border-[#E2E8F0]">
            <CardTitle className="text-base font-bold">Daftar Pengajuan Pindah Domisili Koperasi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {domisiliList.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#718096]">
                Belum ada pengajuan perpindahan domisili dari anggota.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#526170] uppercase border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-6 py-3">Nama & No. Anggota</th>
                      <th className="px-6 py-3">Desa Asal ➔ Tujuan</th>
                      <th className="px-6 py-3">Alasan</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {domisiliList.map((req) => (
                      <tr key={req.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#17212B]">{req.nama_anggota}</p>
                          <p className="text-xs font-mono text-[#526170]">{req.nomor_anggota}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-[#176B52]">
                          {req.desa_asal} ➔ {req.desa_tujuan}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#526170] max-w-xs">
                          {req.alasan}
                        </td>
                        <td className="px-6 py-4">
                          {req.status === 'menunggu' && <Badge variant="warning">Menunggu</Badge>}
                          {req.status === 'disetujui' && <Badge variant="success">Disetujui</Badge>}
                          {req.status === 'ditolak' && <Badge variant="danger">Ditolak</Badge>}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {req.status === 'menunggu' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleDomisiliAction(req, 'disetujui')}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Setujui Pindah
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleDomisiliAction(req, 'ditolak')}
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Tolak
                              </Button>
                            </>
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
      )}

      {/* Tab 2: Account Deletions */}
      {activeTab === 'deletion' && (
        <Card className="border-[#FECACA]">
          <CardHeader className="pb-3 border-b border-[#FEE2E2] bg-[#FFF5F5]">
            <CardTitle className="text-base font-bold text-[#B91C1C]">Daftar Pengajuan Penghapusan Akun</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {deletionList.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#718096]">
                Tidak ada permohonan penghapusan akun yang tertunda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#526170] uppercase border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-6 py-3">Nama Anggota</th>
                      <th className="px-6 py-3">No. Anggota</th>
                      <th className="px-6 py-3">Alasan Penutupan</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {deletionList.map((req) => (
                      <tr key={req.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-semibold text-[#17212B]">{req.nama_anggota}</td>
                        <td className="px-6 py-4 font-mono text-xs text-[#526170]">{req.nomor_anggota}</td>
                        <td className="px-6 py-4 text-xs text-[#526170] max-w-sm">{req.alasan}</td>
                        <td className="px-6 py-4">
                          {req.status === 'menunggu' && <Badge variant="warning">Menunggu Verifikasi</Badge>}
                          {req.status === 'disetujui' && <Badge variant="danger">Akun Ditutup</Badge>}
                          {req.status === 'ditolak' && <Badge variant="default">Ditolak</Badge>}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {req.status === 'menunggu' && (
                            <>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleDeletionAction(req, 'disetujui')}
                              >
                                Setujui & Tutup Akun
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleDeletionAction(req, 'ditolak')}
                              >
                                Tolak
                              </Button>
                            </>
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
      )}
    </div>
  );
}
