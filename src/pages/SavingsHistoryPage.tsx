import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { savingsService } from '../services/savingsService';
import { SavingsTransaction, SavingsType } from '../types';
import { formatRupiah, formatIndonesianDate } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/access/LoadingState';
import { ContextualHelpHint } from '../components/help/ContextualHelpHint';
import { Wallet, Filter, Clock, Receipt } from 'lucide-react';

export function SavingsHistoryPage() {
  const { member } = useAuth();
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    async function loadSavings() {
      if (member?.id) {
        setLoading(true);
        try {
          const data = await savingsService.getSavingsByMemberId(member.id);
          if (isMounted) setTransactions(data);
        } catch (err) {
          console.error('Error loading savings history:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadSavings();
    return () => { isMounted = false; };
  }, [member?.id]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.jenis === filterType;
  });

  const totalFiltered = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);

  if (loading) {
    return <LoadingState message="Memuat riwayat transaksi simpanan..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17212B] flex items-center">
            Riwayat Simpanan
            <ContextualHelpHint
              title="Riwayat Simpanan Anggota"
              content="Daftar transaksi simpanan Anda. Setiap setoran simpanan pokok, wajib, dan sukarela dicatat dengan tanggal dan nominal sesuai tanda terima koperasi."
            />
          </h1>
          <p className="text-sm text-[#526170] mt-1">
            Catatan transaksi simpanan resmi untuk Nomor Anggota <span className="font-mono font-semibold text-[#17212B]">{member?.nomor_anggota || '-'}</span>
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 border border-[#E2E8F0] rounded-lg shadow-sm">
          <Filter className="w-4 h-4 text-[#718096] ml-2 mr-1" />
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pokok', label: 'Pokok' },
            { id: 'wajib', label: 'Wajib' },
            { id: 'sukarela', label: 'Sukarela' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterType === tab.id
                  ? 'bg-[#176B52] text-white'
                  : 'text-[#526170] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Filter Banner */}
      <div className="bg-[#E8F4EF] border border-[#BBF7D0] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#176B52]" />
          <span className="text-sm font-semibold text-[#176B52]">
            Total Simpanan ({filterType === 'all' ? 'Semua Jenis' : `Simpanan ${filterType}`}):
          </span>
        </div>
        <span className="text-lg font-bold text-[#176B52]">
          {formatRupiah(totalFiltered)}
        </span>
      </div>

      {/* Transactions List / Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Daftar Transaksi</CardTitle>
            <span className="text-xs text-[#526170]">
              {filteredTransactions.length} transaksi ditemukan
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Clock className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#17212B]">
                Belum ada transaksi simpanan untuk ditampilkan
              </h3>
              <p className="text-xs text-[#526170] mt-1 max-w-md mx-auto">
                {filterType === 'all'
                  ? 'Data simpanan Anda akan tercatat setelah pengurus koperasi melakukan verifikasi dan pembukuan setoran.'
                  : `Belum ada catatan setoran untuk kategori simpanan ${filterType}.`}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm" aria-label="Tabel Riwayat Simpanan">
                  <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#526170] uppercase border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-6 py-3.5">Tanggal</th>
                      <th className="px-6 py-3.5">Jenis Simpanan</th>
                      <th className="px-6 py-3.5">Keterangan</th>
                      <th className="px-6 py-3.5 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-4 text-[#17212B] whitespace-nowrap">
                          {formatIndonesianDate(tx.tanggal_transaksi)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize font-semibold text-[#176B52] bg-[#E8F4EF] px-2.5 py-0.5 rounded text-xs">
                            Simpanan {tx.jenis}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#526170]">
                          {tx.keterangan || '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#15803D] whitespace-nowrap">
                          +{formatRupiah(Number(tx.nominal))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View Card List */}
              <div className="md:hidden divide-y divide-[#E2E8F0]">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-semibold text-[#176B52] bg-[#E8F4EF] px-2 py-0.5 rounded text-xs">
                        Simpanan {tx.jenis}
                      </span>
                      <span className="font-bold text-[#15803D] text-sm">
                        +{formatRupiah(Number(tx.nominal))}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#526170]">
                      <span>{formatIndonesianDate(tx.tanggal_transaksi)}</span>
                      <span>{tx.keterangan || 'Setoran'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
