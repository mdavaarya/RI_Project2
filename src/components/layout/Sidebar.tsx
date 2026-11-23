import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  Wallet,
  UserRound,
  HelpCircle,
  Users,
  Shield,
  CreditCard,
  MessageSquare,
  FileCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useAuth();
  const isPengurus = profile?.role === 'pengurus';

  const memberNavItems: NavItem[] = [
    { to: '/dashboard', label: 'Beranda Anggota', icon: LayoutDashboard },
    { to: '/simpanan', label: 'Riwayat Simpanan', icon: Wallet },
    { to: '/profil', label: 'Profil Saya', icon: UserRound },
    { to: '/bantuan/chat', label: 'Layanan Chat Bantuan', icon: MessageSquare },
    { to: '/pinjaman', label: 'Pinjaman (Segera)', icon: CreditCard, disabled: true },
    { to: '/bantuan', label: 'Pusat Bantuan & FAQ', icon: HelpCircle },
  ];

  const pengurusNavItems: NavItem[] = [
    { to: '/pengurus/dashboard', label: 'Ringkasan Pengurus', icon: Shield },
    { to: '/pengurus/anggota', label: 'Kelola Anggota', icon: Users },
    { to: '/pengurus/permohonan', label: 'Permohonan Layanan', icon: FileCheck },
    { to: '/pengurus/helpdesk', label: 'Helpdesk & Chat', icon: MessageSquare },
    { to: '/bantuan', label: 'Panduan Pengurus', icon: HelpCircle },
  ];

  const navItems = isPengurus ? pengurusNavItems : memberNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-[#E2E8F0] p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Navigasi Utama"
      >
        <div className="flex flex-col gap-1">
          <div className="px-3 py-2 text-xs font-semibold text-[#718096] uppercase tracking-wider">
            {isPengurus ? 'Menu Pengurus Koperasi' : 'Menu Layanan Anggota'}
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.disabled) {
                return (
                  <div
                    key={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#718096] opacity-60 cursor-not-allowed select-none"
                    title="Modul belum diaktifkan sesuai batasan PRD"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#E8F4EF] text-[#176B52] font-semibold'
                        : 'text-[#526170] hover:bg-[#F1F5F9] hover:text-[#17212B]'
                    )
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer in sidebar */}
        <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs text-[#526170]">
          <p className="font-semibold text-[#17212B] mb-0.5">Koperasi KDKMP</p>
          <p className="text-[11px] text-[#718096]">SIMKOPDES v1.1 • Berbasis Desa</p>
        </div>
      </aside>
    </>
  );
}
