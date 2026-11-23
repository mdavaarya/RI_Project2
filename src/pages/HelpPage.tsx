import React, { useEffect, useState } from 'react';
import { helpService } from '../services/helpService';
import { HelpContent } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LoadingState } from '../components/access/LoadingState';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, PhoneCall } from 'lucide-react';

export function HelpPage() {
  const [helpList, setHelpList] = useState<HelpContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ h1: true, h2: true });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await helpService.getHelpContents();
        if (isMounted) setHelpList(data);
      } catch (err) {
        console.error('Error loading help contents:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <LoadingState message="Memuat panduan dan bantuan SIMKOPDES..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#17212B] flex items-center">
          Pusat Bantuan & Panduan
        </h1>
        <p className="text-sm text-[#526170] mt-1">
          Petunjuk cara penggunaan portal SIMKOPDES dan informasi layanan koperasi desa
        </p>
      </div>

      {/* Accordion FAQ Items (AC-032) */}
      <div className="space-y-3">
        {helpList.map((item) => {
          const isOpen = Boolean(openIds[item.id]);
          return (
            <Card key={item.id} className="p-0 overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#176B52] flex-shrink-0" />
                  <span className="font-semibold text-sm text-[#17212B]">{item.judul}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#526170]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#526170]" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-[#526170] border-t border-[#E2E8F0] bg-white leading-relaxed">
                  {item.konten}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Honest Helpdesk Info (per PRD v1.1 scope control, avoiding fake contact numbers) */}
      <Card className="bg-[#E8F4EF] border-[#BBF7D0]">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#176B52] text-white flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#17212B]">Butuh Bantuan Langsung?</h3>
            <p className="text-xs text-[#526170] mt-1 leading-relaxed">
              Jika Anda mengalami kendala saat masuk akun, pendaftaran, atau memerlukan verifikasi dokumen di luar jam layanan online, silakan kunjungi Kantor Sekretariat Koperasi KDKMP Desa pada hari kerja (Senin–Jumat, pukul 08.00–15.00 WIB).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
