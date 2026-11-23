import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { UserPlus, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Member, DAFTAR_DESA } from '../types';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    domisili_desa: DAFTAR_DESA[0] as string,
    no_hp: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.nama.trim()) {
      errs.nama = 'Nama lengkap wajib diisi.';
    }

    if (!formData.nik.trim()) {
      errs.nik = 'NIK wajib diisi.';
    } else if (!/^\d{16}$/.test(formData.nik.trim())) {
      errs.nik = 'NIK harus tepat 16 digit angka.';
    }

    if (!formData.alamat.trim()) {
      errs.alamat = 'Alamat domisili wajib diisi.';
    }

    if (!formData.no_hp.trim()) {
      errs.no_hp = 'Nomor HP/WhatsApp wajib diisi.';
    } else if (formData.no_hp.replace(/\D/g, '').length < 9) {
      errs.no_hp = 'Nomor HP tidak valid (minimal 9 digit).';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email wajib diisi.';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      errs.password = 'Kata sandi wajib diisi.';
    } else if (formData.password.length < 6) {
      errs.password = 'Kata sandi minimal 6 karakter.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await register({
        nama: formData.nama.trim(),
        nik: formData.nik.trim(),
        alamat: formData.alamat.trim(),
        domisili_desa: formData.domisili_desa,
        no_hp: formData.no_hp.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.success && res.member) {
        setRegisteredMember(res.member);
      } else {
        setErrors({ general: res.error || 'Pendaftaran belum dapat diselesaikan. Silakan periksa kembali data Anda.' });
      }
    } catch {
      setErrors({ general: 'Terjadi kendala jaringan saat mengirim pendaftaran. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredMember) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-8">
        <Card className="max-w-lg w-full text-center p-8 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#15803D] mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#17212B] mb-2">
            Pendaftaran Berhasil Dikirim!
          </h2>
          <p className="text-sm text-[#526170] mb-6 leading-relaxed">
            Data keanggotaan Anda telah berhasil dicatat ke sistem SIMKOPDES.
          </p>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#526170]">Nomor Anggota Sementara:</span>
              <span className="font-bold text-[#17212B]">{registeredMember.nomor_anggota}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#526170]">Nama Lengkap:</span>
              <span className="font-medium text-[#17212B]">{formData.nama}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#526170]">Status Keanggotaan:</span>
              <span className="font-semibold text-[#A16207] bg-[#FEF3C7] px-2 py-0.5 rounded text-xs">
                Menunggu Verifikasi (Pending)
              </span>
            </div>
          </div>

          <Alert variant="info" className="text-left mb-6">
            Sesuai kebijakan koperasi desa, akun baru berstatus <strong>Menunggu Verifikasi</strong>. Pengurus koperasi akan memvalidasi data Anda sebelum transaksi simpanan penuh dapat dilakukan.
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button variant="primary" className="w-full sm:w-auto">
                Masuk ke Halaman Login
              </Button>
            </Link>
            <Link to="/bantuan">
              <Button variant="outline" className="w-full sm:w-auto">
                Baca Panduan Anggota
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-6 sm:py-10">
      <div className="w-full max-w-xl">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Link to="/login" className="inline-flex items-center text-xs text-[#526170] hover:text-[#176B52]">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Kembali ke Login
              </Link>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#E8F4EF] text-[#176B52] rounded">
                Formulir Anggota
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">Pendaftaran Anggota Koperasi</CardTitle>
            <CardDescription>
              Isi data diri dengan benar sesuai KTP untuk mendaftar sebagai anggota SIMKOPDES
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {errors.general && (
              <Alert variant="danger" className="mb-4">
                {errors.general}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Nama Lengkap (sesuai KTP)"
                placeholder="Contoh: Budi Santoso"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                error={errors.nama}
                required
              />

              <Input
                label="NIK (Nomor Induk Kependudukan)"
                placeholder="16 digit nomor KTP"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                error={errors.nik}
                helperText="NIK disimpan dengan aman dan hanya digunakan untuk validasi keanggotaan koperasi."
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">
                  Pilihan Domisili Unit Koperasi Desa <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  value={formData.domisili_desa}
                  onChange={(e) => setFormData({ ...formData, domisili_desa: e.target.value })}
                  className="w-full h-10 px-3 bg-white text-[#17212B] text-sm border border-[#E2E8F0] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                >
                  {DAFTAR_DESA.map((desa) => (
                    <option key={desa} value={desa}>
                      {desa}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#526170]">Pilih desa domisili tempat koperasi Anda terdaftar.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">
                  Alamat Domisili Lengkap <span className="text-[#B91C1C]">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52] focus:border-[#176B52] placeholder:text-[#718096]"
                  rows={2}
                  placeholder="RT/RW, Dusun, Desa, Kecamatan"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  required
                />
                {errors.alamat && <p className="text-xs text-[#B91C1C] font-medium">{errors.alamat}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nomor HP / WhatsApp"
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  error={errors.no_hp}
                  required
                />

                <Input
                  label="Alamat Email"
                  placeholder="budi@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  required
                />
              </div>

              <Input
                label="Kata Sandi Akun"
                placeholder="Minimal 6 karakter"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                helperText="Kata sandi digunakan untuk masuk ke portal SIMKOPDES."
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4"
                size="lg"
                isLoading={isLoading}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Daftar Sebagai Anggota
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-[#F8FAFC] py-3 text-center justify-center">
            <p className="text-xs text-[#718096]">
              Dengan mendaftar, Anda menyetujui ketentuan keanggotaan Koperasi KDKMP Desa.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
