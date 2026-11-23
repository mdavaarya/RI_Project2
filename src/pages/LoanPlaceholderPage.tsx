import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, ShieldAlert } from 'lucide-react';

export function LoanPlaceholderPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-8">
      <Card className="max-w-lg w-full text-center p-8 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#A16207] mx-auto flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#17212B] mb-2">
          Layanan Pinjaman Belum Tersedia
        </h2>
        <p className="text-sm text-[#526170] mb-6 leading-relaxed">
          Sesuai batasan ruang lingkup PRD v1.1 dan keputusan tata kelola koperasi desa, modul pinjaman penuh (bunga, tenor cicilan, pencairan, dan pelaporan) belum diaktifkan pada rilis ini.
        </p>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 text-xs text-[#526170] text-left mb-6 space-y-1.5">
          <p className="font-semibold text-[#17212B]">Catatan Batasan Scope:</p>
          <p>• Data saldo atau simulasi cicilan fiktif tidak ditampilkan (kepatuhan AC-023 & AC-024).</p>
          <p>• Anggota dapat memanfaatkan menu <strong>Riwayat Simpanan</strong> untuk memantau akumulasi simpanan riil.</p>
        </div>

        <Link to="/dashboard">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda Anggota
          </Button>
        </Link>
      </Card>
    </div>
  );
}
