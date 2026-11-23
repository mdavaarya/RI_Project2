import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Badge, MemberStatusBadge } from '../ui/Badge';
import { LogOut, Menu, X, HelpCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export function Navbar({ onToggleMobileSidebar, isMobileSidebarOpen }: NavbarProps) {
  const { session, profile, member, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {session && (
          <button
            type="button"
            className="p-2 text-[#526170] hover:text-[#17212B] hover:bg-[#F1F5F9] rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            onClick={onToggleMobileSidebar}
            aria-label={isMobileSidebarOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#176B52] flex items-center justify-center text-white font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <span className="font-bold text-lg text-[#17212B] tracking-tight">SIMKOPDES</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-[#526170] px-1.5 py-0.5 bg-[#F1F5F9] rounded">
              Desa Mandiri
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/bantuan">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-[#526170]">
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Bantuan
          </Button>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#17212B]">
                  {profile?.nama || session.user.email}
                </span>
                {profile?.role === 'pengurus' && (
                  <Badge variant="info" className="text-[11px] py-0 px-1.5 gap-0.5">
                    <ShieldCheck className="w-3 h-3 inline" /> Pengurus
                  </Badge>
                )}
              </div>
              {member && (
                <div className="flex items-center gap-1.5 text-xs text-[#526170]">
                  <span>{member.nomor_anggota}</span>
                  <span>•</span>
                  <MemberStatusBadge status={member.status} className="py-0 px-1.5 text-[10px]" />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-[#B91C1C] hover:bg-[#FEE2E2] hover:text-[#B91C1C] border-[#E2E8F0]"
              title="Keluar dari akun"
            >
              <LogOut className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link to="/daftar">
              <Button variant="primary" size="sm">
                Daftar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
