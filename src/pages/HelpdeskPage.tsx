import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { helpdeskService } from '../services/helpdeskService';
import { HelpdeskTicket, HelpdeskMessage, TicketCategory } from '../types';
import { formatIndonesianDate } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import {
  MessageSquare,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  Bot,
  User,
  Shield,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function HelpdeskPage() {
  const { session, profile, member } = useAuth();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [messages, setMessages] = useState<HelpdeskMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  // New ticket dialog
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<TicketCategory>('Layanan');
  const [initialMsg, setInitialMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    if (member?.id) {
      const data = await helpdeskService.getTickets(member.id);
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    }
  };

  const loadMessages = async (ticketId: string) => {
    const msgs = await helpdeskService.getMessages(ticketId);
    setMessages(msgs);
  };

  useEffect(() => {
    loadTickets();
  }, [member?.id]);

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(selectedTicket.id);
    }
  }, [selectedTicket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedTicket) return;

    setIsSending(true);
    try {
      const res = await helpdeskService.sendMessage({
        ticket_id: selectedTicket.id,
        sender_role: 'anggota',
        sender_name: profile?.nama || 'Anggota',
        message: inputMsg.trim(),
      });

      if (res.success) {
        setInputMsg('');
        await loadMessages(selectedTicket.id);
        await loadTickets();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setIsCreating(true);
    try {
      const res = await helpdeskService.createTicket({
        member_id: member.id,
        nama_pengadu: profile?.nama || 'Anggota',
        nomor_anggota: member.nomor_anggota,
        judul,
        kategori,
        initialMessage: initialMsg,
      });

      if (res.success && res.ticket) {
        setShowNewTicketModal(false);
        setJudul('');
        setInitialMsg('');
        await loadTickets();
        setSelectedTicket(res.ticket);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-xs text-[#526170] hover:text-[#176B52] flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Kembali ke Beranda
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#17212B] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#176B52]" />
            Layanan Bantuan & Chat Pengurus
          </h1>
          <p className="text-sm text-[#526170] mt-0.5">
            Sampaikan kendala akun, simpanan, atau domisili langsung di dalam portal tanpa perlu beralih aplikasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* External WhatsApp button as secondary fallback option */}
          <a
            href="https://wa.me/6281234567890?text=Halo%20Pengurus%20SIMKOPDES,%20saya%20butuh%20bantuan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="text-[#15803D] border-[#BBF7D0] hover:bg-[#DCFCE7]">
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Kontak WhatsApp
            </Button>
          </a>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewTicketModal(true)}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Buat Pengaduan Baru
          </Button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden h-[600px]">
        {/* Left Side: Ticket List */}
        <div className="md:col-span-1 border-r border-[#E2E8F0] flex flex-col h-full bg-[#F8FAFC]">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
            <span className="font-semibold text-sm text-[#17212B]">Daftar Pengaduan</span>
            <span className="text-xs text-[#718096]">{tickets.length} tiket</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
            {tickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#718096]">
                Belum ada pengaduan. Klik tombol "Buat Pengaduan Baru" untuk memulai percakapan dengan pengurus.
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                      isSelected ? 'bg-[#E8F4EF] border-l-4 border-l-[#176B52]' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#176B52] bg-[#E8F4EF] px-1.5 py-0.5 rounded">
                        {t.kategori}
                      </span>
                      {t.status === 'menunggu' && (
                        <Badge variant="warning" className="text-[10px] py-0">Menunggu</Badge>
                      )}
                      {t.status === 'ditangani' && (
                        <Badge variant="info" className="text-[10px] py-0">Ditangani</Badge>
                      )}
                      {t.status === 'selesai' && (
                        <Badge variant="success" className="text-[10px] py-0">Selesai</Badge>
                      )}
                    </div>
                    <p className="font-semibold text-xs text-[#17212B] truncate">{t.judul}</p>
                    <span className="text-[10px] text-[#718096]">
                      {formatIndonesianDate(t.tanggal_buat)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Room */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div>
                  <h3 className="font-bold text-sm text-[#17212B]">{selectedTicket.judul}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#526170] mt-0.5">
                    <span>Kategori: {selectedTicket.kategori}</span>
                    <span>•</span>
                    <span>ID: {selectedTicket.id}</span>
                  </div>
                </div>

                <div>
                  {selectedTicket.status === 'menunggu' && (
                    <Badge variant="warning">Menunggu Respons</Badge>
                  )}
                  {selectedTicket.status === 'ditangani' && (
                    <Badge variant="info">Sedang Ditangani</Badge>
                  )}
                  {selectedTicket.status === 'selesai' && (
                    <Badge variant="success">Selesai</Badge>
                  )}
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
                {messages.map((m) => {
                  const isMe = m.sender_role === 'anggota';
                  const isBot = m.sender_role === 'system_bot';

                  if (isBot) {
                    return (
                      <div key={m.id} className="flex gap-2 max-w-lg mx-auto bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] p-3 rounded-xl text-xs shadow-sm">
                        <Bot className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0369A1]" />
                        <div>
                          <p className="font-semibold text-[11px] mb-0.5">{m.sender_name}</p>
                          <p className="leading-relaxed">{m.message}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[11px] text-[#718096] mb-1">
                        {!isMe && <Shield className="w-3 h-3 text-[#176B52]" />}
                        <span>{m.sender_name}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-[#176B52] text-white rounded-br-none'
                            : 'bg-white border border-[#E2E8F0] text-[#17212B] rounded-bl-none'
                        }`}
                      >
                        {m.message}
                      </div>
                      <span className="text-[10px] text-[#718096] mt-1">
                        {new Date(m.tanggal_kirim).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2E8F0] bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik balasan atau pertanyaan Anda di sini..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
                <Button type="submit" variant="primary" size="sm" isLoading={isSending} disabled={!inputMsg.trim()}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Kirim
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-[#718096]">
              <MessageSquare className="w-12 h-12 text-[#CBD5E1] mb-2" />
              <p className="font-semibold text-sm text-[#17212B]">Pilih atau Buat Pengaduan</p>
              <p className="text-xs text-[#526170] mt-1 max-w-sm">
                Pilih salah satu tiket di sebelah kiri untuk melihat pesan percakapan, atau buat pengaduan baru jika ada kendala.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h4 className="text-lg font-bold text-[#17212B] mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#176B52]" />
              Buat Pengaduan / Pertanyaan Baru
            </h4>
            <p className="text-xs text-[#526170] mb-4">
              Pesan Anda akan masuk ke Helpdesk internal dan langsung ditangani pengurus koperasi.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">Kategori Kendala</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as TicketCategory)}
                  className="w-full h-10 px-3 bg-white text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                >
                  <option value="Layanan">Layanan Umum</option>
                  <option value="Simpanan">Simpanan & Setoran</option>
                  <option value="Domisili">Perpindahan Domisili</option>
                  <option value="Akun">Akun & Profil</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <Input
                label="Judul Laporan / Pertanyaan"
                placeholder="Contoh: Konfirmasi Setoran Simpanan Wajib Bulan Ini"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#17212B]">Rincian Pesan Kendala</label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan secara singkat kendala yang Anda alami..."
                  value={initialMsg}
                  onChange={(e) => setInitialMsg(e.target.value)}
                  className="w-full p-2.5 text-sm border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowNewTicketModal(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" isLoading={isCreating}>
                  Kirim ke Helpdesk
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
