import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { memberService } from '../services/memberService';
import { formatIndonesianDate, maskNIK } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MemberStatusBadge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { ContextualHelpHint } from '../components/help/ContextualHelpHint';
import { UserRound, Lock, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const { session, profile, member, refreshSession } = useAuth();

  const [nama, setNama] = useState(profile?.nama || '');
  const [noHp, setNoHp] = useState(profile?.no_hp || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setFeedback({ type: 'danger', message: 'Nama lengkap tidak boleh kosong.' });
      return;
    }

    if (!profile?.id) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await memberService.updateProfile(profile.id, {
        nama: nama.trim(),
        no_hp: noHp.trim(),
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Data profil berhasil diperbarui.' });
        setIsEditing(false);
        await refreshSession();
      } else {
        setFeedback({ type: 'danger', message: res.error || 'Gagal menyimpan perubahan profil.' });
      }
    } catch {
      setFeedback({ type: 'danger', message: 'Terjadi kendala jaringan saat menyimpan profil.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#17212B] flex items-center">
          Profil Saya
          <ContextualHelpHint
            title="Pengaturan Profil Anggota"
            content="Data keanggotaan Anda di SIMKOPDES. Nomor Anggota dan Status ditentukan oleh koperasi untuk menjaga integritas data."
          />
        </h1>
        <p className="text-sm text-[#526170] mt-1">
          Informasi akun dan data keanggotaan Koperasi KDKMP
        </p>
      </div>

      {feedback && (
        <Alert variant={feedback.type} className="mb-4">
          {feedback.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        <Card className="md:col-span-1 text-center p-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#E8F4EF] text-[#176B52] flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
            {profile?.nama ? profile.nama.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#17212B]">{profile?.nama || 'Anggota'}</h3>
            <p className="text-xs text-[#526170] font-mono mt-0.5">{session?.user.email}</p>
          </div>

          {member && (
            <div className="pt-2 border-t border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Nomor Anggota</span>
                <span className="font-mono font-bold text-[#17212B]">{member.nomor_anggota}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Status Keanggotaan</span>
                <MemberStatusBadge status={member.status} />
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#526170]">Terdaftar Sejak</span>
                <span className="text-[#17212B]">{formatIndonesianDate(member.tanggal_daftar)}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Right Side: Editable & Protected Info */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <CardTitle className="text-base font-bold">Informasi Akun</CardTitle>
              <CardDescription>
                Kelola nama dan kontak Anda yang terhubung dengan akun koperasi
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Ubah Profil
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Batal
              </Button>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={!isEditing}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Alamat Email"
                  value={session?.user.email || ''}
                  disabled
                  helperText="Email digunakan sebagai identitas masuk utama."
                />

                <Input
                  label="Nomor HP / WhatsApp"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  disabled={!isEditing}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Protected Read-Only Fields (AC-022) */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#526170] uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Data Resmi Keanggotaan (Hanya Dibaca)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="NIK (Nomor Induk Kependudukan)"
                    value={member?.nik ? maskNIK(member.nik) : '-'}
                    disabled
                    helperText="Disamarkan untuk melindungi privasi data pribadi."
                  />

                  <Input
                    label="Nomor Anggota Koperasi"
                    value={member?.nomor_anggota || '-'}
                    disabled
                    helperText="Diterbitkan secara resmi oleh sistem koperasi."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#718096]">Alamat Domisili Terdaftar</label>
                  <p className="p-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-md text-sm text-[#526170]">
                    {member?.alamat || 'Belum diisi'}
                  </p>
                  <p className="text-xs text-[#718096]">
                    Untuk perubahan alamat domisili resmi, silakan hubungi pengurus koperasi desa.
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-1.5" />
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
