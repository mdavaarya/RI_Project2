import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { savingsService } from '../services/savingsService';
import { SavingsSummary, SavingsTransaction } from '../types';
import { formatRupiah, formatIndonesianDate } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MemberStatusBadge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { LoadingState } from '../components/access/LoadingState';
import { ContextualHelpHint } from '../components/help/ContextualHelpHint';
import {
  Wallet,
  ArrowRight,
  UserRound,
  PiggyBank,
  Receipt,
  HelpCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export function MemberDashboardPage() {
  const { session, profile, member } = useAuth();
  const [savingsSummary, setSavingsSummary] = useState<SavingsSummary | null>(null);
  const [recentSavings, setRecentSavings] = useState<SavingsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (member?.id) {
        setLoading(true);
        try {
          const [summary, txs] = await Promise.all([
            savingsService.getSavingsSummary(member.id),
            savingsService.getSavingsByMemberId(member.id),
          ]);
          if (isMounted) {
            setSavingsSummary(summary);
            setRecentSavings(txs.slice(0, 3));
          }
        } catch (err) {
          console.error('Error loading member dashboard:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [member?.id]);

  if (loading) {
    return <LoadingState message="Memuat ringkasan keanggotaan dan simpanan..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#176B52] to-[#125640] rounded-xl text-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#DCFCE7] bg-white/10 px-2 py-0.5 rounded">
                Portal Anggota Koperasi
              </span>
              {member && (
                <MemberStatusBadge
                  status={member.status}
                  className="bg-white/20 text-white border-transparent"
                />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Selamat Datang, {profile?.nama || 'Anggota Koperasi'}
            </h1>
            <p className="text-sm text-[#E8F4EF] mt-1">
              Nomor Anggota: <span className="font-mono font-semibold">{member?.nomor_anggota || '-'}</span> • Tanggal Bergabung: {formatIndonesianDate(member?.tanggal_daftar || '')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/profil">
              <Button variant="outline" size="sm" className="bg-white text-[#176B52] hover:bg-[#F8FAFC] border-none font-semibold">
                <UserRound className="w-4 h-4 mr-1.5" />
                Lihat Profil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Pending status notification if member is pending */}
      {member?.status === 'pending' && (
        <Alert variant="warning" title="Status Keanggotaan: Menunggu Verifikasi">
          Permohonan keanggotaan Anda saat ini sedang dalam proses peninjauan oleh pengurus koperasi desa. Beberapa fitur transaksi simpanan akan aktif penuh setelah status Anda disetujui.
        </Alert>
      )}

      {/* Savings Summary Cards (Working Assumption FR-04, AC-018, AC-019) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#17212B] flex items-center">
            Ringkasan Simpanan
            <ContextualHelpHint
              title="Ringkasan Saldo Simpanan"
              content="Total akumulasi simpanan pokok, simpanan wajib, dan simpanan sukarela Anda yang tercatat secara riil pada database koperasi."
            />
          </h2>
          <Link to="/simpanan" className="text-xs font-semibold text-[#176B52] hover:underline flex items-center">
            Lihat Riwayat Lengkap <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Card */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#526170]">Total Saldo Simpanan</span>
                <div className="w-8 h-8 rounded-lg bg-[#E8F4EF] text-[#176B52] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-[#17212B]">
                {formatRupiah(savingsSummary?.total || 0)}
              </div>
              <p className="text-[11px] text-[#718096] mt-1">
                {savingsSummary?.transactionCount || 0} transaksi tercatat
              </p>
            </CardContent>
          </Card>

          {/* Simpanan Pokok */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#526170]">Simpanan Pokok</span>
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#526170] flex items-center justify-center">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-[#17212B]">
                {formatRupiah(savingsSummary?.pokok || 0)}
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Simpanan awal keanggotaan</p>
            </CardContent>
          </Card>

          {/* Simpanan Wajib */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#526170]">Simpanan Wajib</span>
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#526170] flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-[#17212B]">
                {formatRupiah(savingsSummary?.wajib || 0)}
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Iuran rutin bulanan</p>
            </CardContent>
          </Card>

          {/* Simpanan Sukarela */}
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#526170]">Simpanan Sukarela</span>
                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#526170] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-[#17212B]">
                {formatRupiah(savingsSummary?.sukarela || 0)}
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Dapat disetor sewaktu-waktu</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity / Empty State (AC-023) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Aktivitas Simpanan Terbaru</CardTitle>
            <p className="text-xs text-[#526170] mt-0.5">
              Riwayat 3 transaksi simpanan paling akhir
            </p>
          </div>
          <Link to="/simpanan">
            <Button variant="ghost" size="sm">
              Semua Transaksi
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {recentSavings.length === 0 ? (
            <div className="text-center py-8 px-4 bg-[#F8FAFC] rounded-lg border border-dashed border-[#CBD5E1]">
              <Clock className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#17212B]">Belum ada riwayat simpanan untuk ditampilkan</p>
              <p className="text-xs text-[#526170] mt-1 max-w-sm mx-auto">
                Setelah pengurus mencatat setoran simpanan Anda, rincian transaksi akan muncul secara otomatis di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {recentSavings.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E8F4EF] text-[#176B52] flex items-center justify-center font-bold text-xs uppercase">
                      {tx.jenis.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#17212B] capitalize">
                        Simpanan {tx.jenis}
                      </p>
                      <p className="text-xs text-[#718096]">
                        {formatIndonesianDate(tx.tanggal_transaksi)} {tx.keterangan ? `• ${tx.keterangan}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#15803D]">
                      +{formatRupiah(Number(tx.nominal))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/profil">
          <Card className="hover:border-[#176B52] transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center flex-shrink-0">
                <UserRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#17212B]">Kelola Data Diri</h3>
                <p className="text-xs text-[#526170] mt-0.5 leading-relaxed">
                  Periksa keakuratan data profil, nomor HP WhatsApp, dan alamat domisili Anda.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/bantuan">
          <Card className="hover:border-[#176B52] transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#17212B]">Pusat Bantuan & FAQ</h3>
                <p className="text-xs text-[#526170] mt-0.5 leading-relaxed">
                  Panduan lengkap penggunaan aplikasi SIMKOPDES dan cara mengakses layanan koperasi.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
