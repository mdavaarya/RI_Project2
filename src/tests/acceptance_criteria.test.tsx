import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoadingState } from '../components/access/LoadingState';
import { ErrorState } from '../components/access/ErrorState';
import { MemberStatusBadge } from '../components/ui/Badge';
import { LoanPlaceholderPage } from '../pages/LoanPlaceholderPage';

describe('Acceptance Criteria UI Verification', () => {
  it('AC-001: Renders startup loading state with non-misleading message', () => {
    render(<LoadingState message="Memuat aplikasi SIMKOPDES..." />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Memuat aplikasi SIMKOPDES...')).toBeInTheDocument();
  });

  it('AC-002 & AC-003: ErrorState presents clear, honest message and functional retry button', () => {
    const handleRetry = vi.fn();
    render(
      <BrowserRouter>
        <ErrorState
          title="Koneksi Terputus"
          message="Tidak dapat menghubungi server. Periksa koneksi internet Anda."
          onRetry={handleRetry}
        />
      </BrowserRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Koneksi Terputus')).toBeInTheDocument();
    expect(screen.getByText(/Tidak dapat menghubungi server/)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Coba Lagi/i });
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('AC-024: Loan module is honest placeholder without fake simulated transactions', () => {
    render(
      <BrowserRouter>
        <LoanPlaceholderPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Layanan Pinjaman Belum Tersedia')).toBeInTheDocument();
    expect(screen.getByText(/PRD v1\.1/)).toBeInTheDocument();
    expect(screen.getByText(/simulasi cicilan fiktif tidak ditampilkan/i)).toBeInTheDocument();
  });

  it('AC-038: Member status badge includes descriptive text for accessibility', () => {
    const { rerender } = render(<MemberStatusBadge status="aktif" />);
    expect(screen.getByText('Aktif')).toBeInTheDocument();

    rerender(<MemberStatusBadge status="pending" />);
    expect(screen.getByText('Menunggu Verifikasi')).toBeInTheDocument();

    rerender(<MemberStatusBadge status="nonaktif" />);
    expect(screen.getByText('Nonaktif')).toBeInTheDocument();
  });
});
