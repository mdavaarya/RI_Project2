import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Eye, EyeOff, LogIn, ArrowRight, ShieldAlert } from 'lucide-react';
import { authService } from '../services/authService';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email atau identitas akun wajib diisi.';
    }
    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        if (res.role === 'pengurus') {
          navigate('/pengurus/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrors({ general: res.error || 'Login belum berhasil. Silakan periksa kembali informasi masuk Anda.' });
      }
    } catch {
      setErrors({ general: 'Terjadi kendala jaringan saat proses masuk. Silakan coba beberapa saat lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotStatus({ type: 'danger', message: 'Masukkan format email yang valid.' });
      return;
    }

    setIsForgotLoading(true);
    setForgotStatus(null);
    try {
      const res = await authService.resetPassword(forgotEmail.trim());
      if (res.success) {
        setForgotStatus({
          type: 'success',
          message: 'Jika akun terdaftar, tautan pemulihan kata sandi telah dikirim ke email Anda.',
        });
      } else {
        setForgotStatus({ type: 'danger', message: res.error || 'Gagal mengirim instruksi pemulihan.' });
      }
    } catch {
      setForgotStatus({ type: 'danger', message: 'Terjadi kendala jaringan.' });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-6 sm:py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#176B52] flex items-center justify-center text-white mb-3 shadow">
              <LogIn className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Masuk SIMKOPDES</CardTitle>
            <CardDescription>
              Masuk untuk mengakses layanan koperasi dan data keanggotaan Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {errors.general && (
              <Alert variant="danger" className="mb-4" title="Gagal Masuk">
                {errors.general}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email / Identitas Akun"
                type="text"
                placeholder="admin@simkopdes.id atau admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
                autoComplete="username"
                autoFocus
              />

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    label="Kata Sandi"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[34px] text-[#718096] hover:text-[#17212B] focus:outline-none focus:text-[#176B52]"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotStatus(null);
                      setForgotEmail(email);
                    }}
                    className="text-xs text-[#176B52] hover:underline font-medium focus:outline-none"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                size="lg"
                isLoading={isLoading}
              >
                Masuk ke Akun
              </Button>

              {/* Quick Demo Credentials Panel for testing */}
              <div className="mt-4 p-3 bg-[#E8F4EF] border border-[#BBF7D0] rounded-lg text-xs text-[#176B52]">
                <div className="font-semibold mb-1 flex items-center justify-between">
                  <span>Kredensial Demo untuk Pengujian:</span>
                </div>
                <p className="text-[11px] text-[#526170] mb-2 leading-relaxed">
                  Klik tombol di bawah untuk mengisi otomatis akun pengujian:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@simkopdes.id');
                      setPassword('password123');
                      setErrors({});
                    }}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-[#F8FAFC] border border-[#BBF7D0] rounded font-semibold text-[11px] text-[#176B52] shadow-sm text-center"
                  >
                    👤 Admin / Pengurus (admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('anggota@simkopdes.id');
                      setPassword('password123');
                      setErrors({});
                    }}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-[#F8FAFC] border border-[#BBF7D0] rounded font-semibold text-[11px] text-[#176B52] shadow-sm text-center"
                  >
                    👥 Anggota (anggota)
                  </button>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 text-center justify-center bg-[#F8FAFC] py-4">
            <p className="text-sm text-[#526170]">
              Belum terdaftar sebagai anggota koperasi?
            </p>
            <Link to="/daftar" className="w-full">
              <Button variant="outline" className="w-full" size="md">
                Daftar Anggota Baru
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
        >
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h4 id="forgot-title" className="text-lg font-bold text-[#17212B] mb-2">
              Pemulihan Kata Sandi
            </h4>
            <p className="text-xs text-[#526170] mb-4 leading-relaxed">
              Masukkan alamat email Anda yang terdaftar. Sistem akan mengirim instruksi untuk membuat kata sandi baru.
            </p>

            {forgotStatus && (
              <Alert variant={forgotStatus.type} className="mb-4">
                {forgotStatus.message}
              </Alert>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                label="Email Terdaftar"
                type="email"
                placeholder="nama@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotModal(false)}
                  disabled={isForgotLoading}
                >
                  Tutup
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isForgotLoading}
                >
                  Kirim Instruksi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
