import React from 'react';

export function LoadingState({ message = 'Memuat informasi aplikasi SIMKOPDES...' }: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-[#E2E8F0] border-t-[#176B52] rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-[#526170]">{message}</p>
      <span className="sr-only">Sedang memuat data</span>
    </div>
  );
}
