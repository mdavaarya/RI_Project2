import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { memberService } from '../services/memberService';
import { Member } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MemberStatusBadge } from '../components/ui/Badge';
import { LoadingState } from '../components/access/LoadingState';
import { formatIndonesianDate, maskNIK } from '../utils/formatters';
import { Users, UserCheck, Clock, UserX, Shield, ArrowRight } from 'lucide-react';

export function ManagerDashboardPage() {
  const { profile } = useAuth();
  const [counts, setCounts] = useState<{ total: number; pending: number; aktif: number; nonaktif: number } | null>(null);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Guard: AC-025 - only role='pengurus' can access
  if (profile && profile.role !== 'pengurus') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [c, list] = await Promise.all([
          memberService.getMemberCounts(),
          memberService.getAllMembers(),
        ]);
        if (isMounted) {
          setCounts(c);
          setRecentMembers(list.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading manager dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <LoadingState message="Memuat dasbor pengurus koperasi..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#17212B] to-[#526170] rounded-xl text-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#BAE6FD] bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Portal Pengurus Koperasi
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Ringkasan Operasional Koperasi
            </h1>
            <p className="text-sm text-[#CBD5E1] mt-1">
              Pantau pendaftaran anggota baru, verifikasi status, dan pembukuan data koperasi desa.
            </p>
          </div>

          <Link to="/pengurus/anggota">
            <Button variant="outline" className="bg-white text-[#17212B] hover:bg-[#F8FAFC] border-none font-semibold">
              <Users className="w-4 h-4 mr-1.5" />
              Kelola Seluruh Anggota
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards (AC-026) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E2E8F0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#526170]">Total Anggota</span>
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#17212B]">{counts?.total || 0}</div>
            <p className="text-[11px] text-[#718096] mt-1">Terdaftar di sistem</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#526170]">Menunggu Verifikasi</span>
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#A16207] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#A16207]">{counts?.pending || 0}</div>
            <p className="text-[11px] text-[#718096] mt-1">Perlu ditinjau pengurus</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#526170]">Anggota Aktif</span>
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#15803D]">{counts?.aktif || 0}</div>
            <p className="text-[11px] text-[#718096] mt-1">Berhak atas layanan penuh</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#526170]">Nonaktif</span>
              <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#B91C1C]">{counts?.nonaktif || 0}</div>
            <p className="text-[11px] text-[#718096] mt-1">Status tidak aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <CardTitle className="text-base font-bold">Pendaftaran Anggota Terbaru</CardTitle>
            <p className="text-xs text-[#526170] mt-0.5">5 data anggota terakhir yang mendaftar</p>
          </div>
          <Link to="/pengurus/anggota">
            <Button variant="ghost" size="sm">
              Lihat Semua <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {recentMembers.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#718096]">
              Belum ada data anggota yang terdaftar di sistem.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Tabel Anggota Terbaru">
                <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#526170] uppercase border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">No. Anggota</th>
                    <th className="px-6 py-3">NIK (Masked)</th>
                    <th className="px-6 py-3">Tanggal Daftar</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {recentMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-3.5 font-medium text-[#17212B]">
                        {m.profile?.nama || 'Tanpa Nama'}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-[#526170]">
                        {m.nomor_anggota}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-[#718096]">
                        {maskNIK(m.nik)}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[#526170]">
                        {formatIndonesianDate(m.tanggal_daftar)}
                      </td>
                      <td className="px-6 py-3.5">
                        <MemberStatusBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
