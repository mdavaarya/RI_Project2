import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="max-w-md w-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-[#F1F5F9] text-[#526170] mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-[#17212B] mb-2">404</h1>
        <h2 className="text-lg font-semibold text-[#17212B] mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-[#526170] mb-6">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Halaman Utama
          </Button>
        </Link>
      </Card>
    </div>
  );
}
