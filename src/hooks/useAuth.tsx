import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserSession } from '../services/authService';
import { memberService } from '../services/memberService';
import { Member, Profile } from '../types';

interface AuthContextType {
  session: UserSession | null;
  user: UserSession['user'] | null;
  profile: Profile | null;
  member: Member | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null; role?: string }>;
  register: (params: {
    nama: string;
    nik: string;
    alamat: string;
    no_hp: string;
    email: string;
    password: string;
    domisili_desa?: string;
  }) => Promise<{ success: boolean; member: Member | null; error: string | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      setLoading(true);
      const curr = await authService.getCurrentSession();
      setSession(curr);
    } catch (err) {
      console.error('Error initializing auth:', err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res.session) {
      setSession(res.session);
      return { success: true, error: null, role: res.session.profile?.role };
    }
    return { success: false, error: res.error, role: undefined };
  };

  const register = async (params: {
    nama: string;
    nik: string;
    alamat: string;
    no_hp: string;
    email: string;
    password: string;
  }) => {
    return await authService.register(params);
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  const refreshSession = async () => {
    if (session?.profile?.id) {
      const updatedMem = await memberService.getMemberByProfileId(session.profile.id);
      if (updatedMem) {
        setSession(prev => prev ? { ...prev, member: updatedMem, profile: updatedMem.profile || prev.profile } : null);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        profile: session?.profile || null,
        member: session?.member || null,
        loading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
