import { HelpdeskTicket, HelpdeskMessage, TicketCategory, TicketStatus } from '../types';

const TICKETS_KEY = 'simkopdes_helpdesk_tickets';
const MESSAGES_KEY = 'simkopdes_helpdesk_messages';

function getStore<T>(key: string, defaultVal: T[]): T[] {
  const data = localStorage.getItem(key);
  if (!data) return defaultVal;
  try {
    return JSON.parse(data);
  } catch {
    return defaultVal;
  }
}

function saveStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const helpdeskService = {
  /**
   * Create a new complaint ticket with an initial message
   */
  async createTicket(params: {
    member_id: string;
    nama_pengadu: string;
    nomor_anggota: string;
    judul: string;
    kategori: TicketCategory;
    initialMessage: string;
  }): Promise<{ success: boolean; ticket?: HelpdeskTicket; error?: string }> {
    if (!params.judul.trim()) return { success: false, error: 'Judul pengaduan wajib diisi.' };
    if (!params.initialMessage.trim()) return { success: false, error: 'Pesan pengaduan tidak boleh kosong.' };

    const tickets = getStore<HelpdeskTicket>(TICKETS_KEY, []);
    const messages = getStore<HelpdeskMessage>(MESSAGES_KEY, []);

    const ticketId = `tkt-${Date.now()}`;
    const newTicket: HelpdeskTicket = {
      id: ticketId,
      member_id: params.member_id,
      nama_pengadu: params.nama_pengadu,
      nomor_anggota: params.nomor_anggota,
      judul: params.judul.trim(),
      kategori: params.kategori,
      status: 'menunggu',
      tanggal_buat: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      unread_by_admin: true,
    };

    const firstMsg: HelpdeskMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      sender_role: 'anggota',
      sender_name: params.nama_pengadu,
      message: params.initialMessage.trim(),
      tanggal_kirim: new Date().toISOString(),
    };

    // Auto-reply bot confirmation (Interactive Bot response)
    const botReply: HelpdeskMessage = {
      id: `msg-${Date.now() + 1}`,
      ticket_id: ticketId,
      sender_role: 'system_bot',
      sender_name: 'Asisten Layanan SIMKOPDES',
      message: `Halo ${params.nama_pengadu}, laporan Anda perihal "${params.judul}" telah tercatat di sistem Helpdesk Koperasi. Pengurus koperasi desa akan segera meninjau dan merespons pesan Anda di sini.`,
      tanggal_kirim: new Date(Date.now() + 1000).toISOString(),
    };

    tickets.unshift(newTicket);
    messages.push(firstMsg, botReply);

    saveStore(TICKETS_KEY, tickets);
    saveStore(MESSAGES_KEY, messages);

    return { success: true, ticket: newTicket };
  },

  /**
   * Get tickets (filtered by member_id or all for admin)
   */
  async getTickets(memberId?: string): Promise<HelpdeskTicket[]> {
    const tickets = getStore<HelpdeskTicket>(TICKETS_KEY, []);
    if (memberId) {
      return tickets.filter((t) => t.member_id === memberId);
    }
    return tickets;
  },

  /**
   * Get ticket by ID
   */
  async getTicketById(ticketId: string): Promise<HelpdeskTicket | null> {
    const tickets = getStore<HelpdeskTicket>(TICKETS_KEY, []);
    return tickets.find((t) => t.id === ticketId) || null;
  },

  /**
   * Get messages for a ticket
   */
  async getMessages(ticketId: string): Promise<HelpdeskMessage[]> {
    const messages = getStore<HelpdeskMessage>(MESSAGES_KEY, []);
    return messages.filter((m) => m.ticket_id === ticketId);
  },

  /**
   * Send a chat message in a ticket
   */
  async sendMessage(params: {
    ticket_id: string;
    sender_role: 'anggota' | 'pengurus';
    sender_name: string;
    message: string;
  }): Promise<{ success: boolean; message?: HelpdeskMessage; error?: string }> {
    if (!params.message.trim()) return { success: false, error: 'Pesan tidak boleh kosong.' };

    const tickets = getStore<HelpdeskTicket>(TICKETS_KEY, []);
    const messages = getStore<HelpdeskMessage>(MESSAGES_KEY, []);

    const ticketIdx = tickets.findIndex((t) => t.id === params.ticket_id);
    if (ticketIdx === -1) return { success: false, error: 'Tiket pengaduan tidak ditemukan.' };

    const newMsg: HelpdeskMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: params.ticket_id,
      sender_role: params.sender_role,
      sender_name: params.sender_name,
      message: params.message.trim(),
      tanggal_kirim: new Date().toISOString(),
    };

    messages.push(newMsg);

    // Update ticket metadata
    tickets[ticketIdx].updated_at = new Date().toISOString();
    if (params.sender_role === 'pengurus') {
      if (tickets[ticketIdx].status === 'menunggu') {
        tickets[ticketIdx].status = 'ditangani';
      }
      tickets[ticketIdx].unread_by_member = true;
    } else {
      tickets[ticketIdx].unread_by_admin = true;
    }

    saveStore(TICKETS_KEY, tickets);
    saveStore(MESSAGES_KEY, messages);

    return { success: true, message: newMsg };
  },

  /**
   * Update ticket status (e.g. Selesai)
   */
  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<{ success: boolean }> {
    const tickets = getStore<HelpdeskTicket>(TICKETS_KEY, []);
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx !== -1) {
      tickets[idx].status = status;
      tickets[idx].updated_at = new Date().toISOString();
      saveStore(TICKETS_KEY, tickets);
      return { success: true };
    }
    return { success: false };
  },
};
