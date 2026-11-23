import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { session } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {session && (
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
      <footer className="bg-white border-t border-[#E2E8F0] py-4 px-6 text-center text-xs text-[#718096]">
        SIMKOPDES — Usulan Peningkatan Pengalaman Akses dan Penggunaan Koperasi Desa • PRD v1.1
      </footer>
    </div>
  );
}
