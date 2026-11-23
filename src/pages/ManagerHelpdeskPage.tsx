import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { helpdeskService } from '../services/helpdeskService';
import { HelpdeskTicket, HelpdeskMessage, TicketStatus } from '../types';
import { formatIndonesianDate } from '../utils/formatters';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/access/LoadingState';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  User,
  Shield,
  Bot,
  Filter,
} from 'lucide-react';

export function ManagerHelpdeskPage() {
  const { profile } = useAuth();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [messages, setMessages] = useState<HelpdeskMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (profile && profile.role !== 'pengurus') {
    return <Navigate to="/dashboard" replace />;
  }

  const loadTickets = async () => {
    setLoading(true);
    try {
      const all = await helpdeskService.getTickets();
      setTickets(all);
      if (all.length > 0 && !selectedTicket) {
        setSelectedTicket(all[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (ticketId: string) => {
    const msgs = await helpdeskService.getMessages(ticketId);
    setMessages(msgs);
  };

  useEffect(() => {
    loadTickets();
  }, []);

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
        sender_role: 'pengurus',
        sender_name: profile?.nama || 'Pengurus Koperasi',
        message: inputMsg.trim(),
      });

      if (res.success) {
        setInputMsg('');
        await loadMessages(selectedTicket.id);
        const updatedList = await helpdeskService.getTickets();
        setTickets(updatedList);
        const curr = updatedList.find((t) => t.id === selectedTicket.id);
        if (curr) setSelectedTicket(curr);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    await helpdeskService.updateTicketStatus(selectedTicket.id, status);
    setSelectedTicket({ ...selectedTicket, status });
    const updatedList = await helpdeskService.getTickets();
    setTickets(updatedList);
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  if (loading) {
    return <LoadingState message="Memuat Helpdesk Pengurus..." />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17212B] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#176B52]" />
            Helpdesk & Pengaduan Masuk
          </h1>
          <p className="text-sm text-[#526170] mt-0.5">
            Tanggapi pesan dan kendala anggota koperasi langsung melalui ruang obrolan internal
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 bg-white p-1 border border-[#E2E8F0] rounded-lg shadow-sm">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'menunggu', label: 'Menunggu' },
            { id: 'ditangani', label: 'Ditangani' },
            { id: 'selesai', label: 'Selesai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#176B52] text-white'
                  : 'text-[#526170] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Admin Chat Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden h-[620px]">
        {/* Ticket List */}
        <div className="md:col-span-1 border-r border-[#E2E8F0] flex flex-col h-full bg-[#F8FAFC]">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
            <span className="font-semibold text-sm text-[#17212B]">Tiket Masuk ({filteredTickets.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
            {filteredTickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#718096]">
                Tidak ada tiket pengaduan pada filter ini.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1 ${
                      isSelected ? 'bg-[#E8F4EF] border-l-4 border-l-[#176B52]' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#17212B]">{t.nama_pengadu}</span>
                      {t.status === 'menunggu' && <Badge variant="warning" className="text-[10px] py-0">Menunggu</Badge>}
                      {t.status === 'ditangani' && <Badge variant="info" className="text-[10px] py-0">Ditangani</Badge>}
                      {t.status === 'selesai' && <Badge variant="success" className="text-[10px] py-0">Selesai</Badge>}
                    </div>
                    <p className="text-xs text-[#526170] font-medium truncate">{t.judul}</p>
                    <div className="flex justify-between text-[10px] text-[#718096] mt-0.5">
                      <span>{t.kategori} • {t.nomor_anggota}</span>
                      <span>{formatIndonesianDate(t.tanggal_buat)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div>
                  <h3 className="font-bold text-sm text-[#17212B]">{selectedTicket.judul}</h3>
                  <p className="text-xs text-[#526170]">
                    Pengadu: <strong>{selectedTicket.nama_pengadu}</strong> ({selectedTicket.nomor_anggota}) • Kategori: {selectedTicket.kategori}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'selesai' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus('selesai')}
                      className="text-[#15803D] border-[#BBF7D0] hover:bg-[#DCFCE7]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Tandai Selesai
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus('ditangani')}
                    >
                      Buka Kembali
                    </Button>
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
                {messages.map((m) => {
                  const isPengurus = m.sender_role === 'pengurus';
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
                      className={`flex flex-col ${isPengurus ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[11px] text-[#718096] mb-1">
                        {!isPengurus && <User className="w-3 h-3 text-[#526170]" />}
                        {isPengurus && <Shield className="w-3 h-3 text-[#176B52]" />}
                        <span>{m.sender_name}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed shadow-sm ${
                          isPengurus
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

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2E8F0] bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik balasan resmi pengurus untuk anggota..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
                <Button type="submit" variant="primary" size="sm" isLoading={isSending} disabled={!inputMsg.trim()}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Kirim Balasan
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-[#718096]">
              <MessageSquare className="w-12 h-12 text-[#CBD5E1] mb-2" />
              <p className="font-semibold text-sm text-[#17212B]">Pilih Tiket Pengaduan</p>
              <p className="text-xs text-[#526170] mt-1 max-w-sm">
                Pilih tiket di sisi kiri untuk membaca keluhan anggota dan mengirimkan balasan solusi resmi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
