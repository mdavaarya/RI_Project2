import React from 'react';
import { Button } from '../ui/Button';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'Akses Aplikasi Mengalami Kendala',
  message = 'Sistem belum dapat memuat data. Periksa koneksi internet Anda atau coba beberapa saat lagi.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[350px] p-6 max-w-md mx-auto text-center"
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#17212B] mb-2">{title}</h3>
      <p className="text-sm text-[#526170] mb-6 leading-relaxed">{message}</p>
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            isLoading={isRetrying}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        )}
        <Link to="/bantuan">
          <Button variant="outline" className="w-full sm:w-auto">
            <HelpCircle className="w-4 h-4 mr-2" />
            Pusat Bantuan
          </Button>
        </Link>
      </div>
    </div>
  );
}
