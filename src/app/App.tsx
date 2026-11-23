import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/layout/AppLayout';
import { ErrorBoundary } from '../components/access/ErrorBoundary';
import { LoadingState } from '../components/access/LoadingState';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MemberDashboardPage } from '../pages/MemberDashboardPage';
import { SavingsHistoryPage } from '../pages/SavingsHistoryPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ManagerDashboardPage } from '../pages/ManagerDashboardPage';
import { ManageMembersPage } from '../pages/ManageMembersPage';
import { HelpPage } from '../pages/HelpPage';
import { LoanPlaceholderPage } from '../pages/LoanPlaceholderPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Protected Route Guard for Authenticated Members
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Memeriksa sesi pengguna..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Protected Route Guard for Pengurus
function PengurusRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Memeriksa kewenangan pengurus..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== 'pengurus') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Root redirector based on session
function RootRedirect() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Memuat aplikasi SIMKOPDES..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role === 'pengurus') {
    return <Navigate to="/pengurus/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<RootRedirect />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="daftar" element={<RegisterPage />} />
              <Route path="bantuan" element={<HelpPage />} />

              {/* Member Routes */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <MemberDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="simpanan"
                element={
                  <ProtectedRoute>
                    <SavingsHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profil"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="pinjaman"
                element={
                  <ProtectedRoute>
                    <LoanPlaceholderPage />
                  </ProtectedRoute>
                }
              />

              {/* Pengurus Routes */}
              <Route
                path="pengurus/dashboard"
                element={
                  <PengurusRoute>
                    <ManagerDashboardPage />
                  </PengurusRoute>
                }
              />
              <Route
                path="pengurus/anggota"
                element={
                  <PengurusRoute>
                    <ManageMembersPage />
                  </PengurusRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
