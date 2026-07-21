import React, { useState } from 'react';

// Import standard lucide icons
import {
  Building2,
  LayoutDashboard,
  FileText,
  Wrench,
  ShieldCheck,
  BarChart3,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Bell,
  HelpCircle,
  Plus,
  Video,
  DoorOpen,
  CalendarDays,
  ChevronRight as ChevronRightIcon,
  X,
  UploadCloud
} from 'lucide-react';

export default function TenantPortal({ currentUser, onLogout, tickets = [], onAddTicket }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState('Engineering (Listrik, AC, Plafon)');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Map category to system categories
  const getSystemCategory = (val) => {
    if (val.includes('Engineering')) return 'Electrical';
    if (val.includes('Security')) return 'Security';
    if (val.includes('Cleaning')) return 'Cleaning';
    return 'Other';
  };

  // Convert all main tickets to local tenant display format, filtered by this tenant's name
  const filteredTickets = tickets
    .filter(t => t.reporter === currentUser.name || t.location?.includes(currentUser.name))
    .map(t => ({
      id: t.id.startsWith('WO-') ? t.id.replace('WO-', '#TCK-') : t.id,
      category: t.category,
      issue: t.title,
      date: t.date,
      status: t.status === 'Resolved' ? 'SELESAI' : 'DIPROSES'
    }));

  // Add default mockup tickets if none matching exists to maintain the design
  const displayTickets = filteredTickets.length > 0 ? filteredTickets : [
    { id: '#TCK-9902', category: 'Engineering', issue: 'Kebocoran AC di ruang meeting utama', date: '02 Oct 2026', status: 'DIPROSES' },
    { id: '#TCK-9871', category: 'Cleaning', issue: 'Pembersihan kaca luar unit', date: '28 Sep 2026', status: 'SELESAI' },
    { id: '#TCK-9850', category: 'Security', issue: 'Kartu akses unit hilang', date: '25 Sep 2026', status: 'SELESAI' }
  ];

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!complaintDesc.trim()) return;

    const ticketIdNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket = {
      id: `WO-2026-${ticketIdNum}`,
      title: complaintDesc.length > 30 ? complaintDesc.substring(0, 30) + '...' : complaintDesc,
      category: getSystemCategory(complaintCategory),
      priority: 'Medium',
      status: 'New',
      location: 'Unit Tenant - ' + currentUser.name,
      reporter: currentUser.name,
      description: complaintDesc,
      date: new Date().toLocaleDateString('en-GB'),
      assignee: 'Budi Santoso',
      timeText: 'Just now'
    };

    onAddTicket(newTicket);
    setComplaintDesc('');
    setShowModal(false);
    alert(`Keluhan Anda telah berhasil dikirim. Nomor tiket: #TCK-${ticketIdNum}`);
  };

  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body-md overflow-hidden text-left">
      
      {/* ===== SIDEBAR ===== */}
      <aside className="w-sidebar-width h-screen sticky left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-6 shrink-0 z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-primary leading-tight">Graha Kaji</h1>
            <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Tenant Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 text-left rounded-lg ${
              activeTab === 'dashboard'
                ? 'bg-secondary-container text-primary font-bold border-l-4 border-primary rounded-r-lg'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 text-left rounded-lg ${
              activeTab === 'contract'
                ? 'bg-secondary-container text-primary font-bold border-l-4 border-primary rounded-r-lg'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs">Tenant & Kontrak</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 text-left rounded-lg ${
              activeTab === 'complaints'
                ? 'bg-secondary-container text-primary font-bold border-l-4 border-primary rounded-r-lg'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span className="text-xs">Work Order / Komplain</span>
          </button>
        </nav>

        {/* Profile Card and Logout */}
        <div className="mt-auto px-4 space-y-3">
          <div className="flex items-center gap-3 p-2 bg-surface-container-low border border-outline-variant rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {currentUser.initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate">{currentUser.name}</p>
              <p className="text-[10px] text-on-surface-variant">Tenant Admin</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-semibold text-xs text-left"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex justify-between items-center px-8 w-full sticky top-0 z-40 bg-white border-b border-outline-variant h-16 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary text-xs"
                placeholder="Cari tagihan atau riwayat..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 text-on-surface-variant">
            <div className="flex items-center gap-3">
              <Bell className="w-4.5 h-4.5 cursor-pointer hover:text-primary transition-opacity" />
              <HelpCircle className="w-4.5 h-4.5 cursor-pointer hover:text-primary transition-opacity" />
            </div>
            <div className="h-6 w-px bg-outline-variant" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface">Unit 1A & 1B, Lt. 1</p>
              <p className="text-[10px] text-on-surface-variant">Graha Kaji Building</p>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Top Greeting Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Selamat Pagi, {currentUser.name}</h2>
                <p className="text-sm text-on-surface-variant mt-0.5">Berikut ringkasan aktivitas unit Anda untuk bulan ini.</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:brightness-110 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" /> Ajukan Komplain
              </button>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Bill Summary (Large Bento) */}
              <div className="col-span-12 lg:col-span-7 bg-white border border-outline-variant rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Tagihan Bulan Ini</p>
                      <h3 className="text-2xl font-bold text-primary">Rp 12.450.000</h3>
                    </div>
                    <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-extrabold border border-red-200">
                      BELUM BAYAR
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Sewa Ruangan</p>
                      <p className="text-sm font-bold text-on-surface">Rp 8.500.000</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Listrik & Air</p>
                      <p className="text-sm font-bold text-on-surface">Rp 3.950.000</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 flex-wrap gap-2 text-xs">
                    <p className="font-semibold text-on-surface-variant">Jatuh tempo: <span className="text-on-surface font-bold">15 Oct 2026</span></p>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:brightness-110 transition-all text-xs">
                      Bayar Sekarang
                    </button>
                  </div>
                </div>

                {/* Blurry Decors */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Facility Booking Teaser */}
              <div className="col-span-12 lg:col-span-5 bg-white border border-outline-variant rounded-xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Booking Fasilitas</h4>
                    <button className="text-primary text-xs font-bold hover:underline">Lihat Kalender</button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-xl cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                      <div className="w-9 h-9 rounded-lg bg-tertiary-fixed-dim flex items-center justify-center shrink-0">
                        <DoorOpen className="w-5 h-5 text-tertiary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-on-surface">Meeting Room A</p>
                        <p className="text-[10px] text-on-surface-variant">Tersedia jam 13:00 - 15:00</p>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-on-surface-variant" />
                    </div>

                    <div className="flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-xl cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                      <div className="w-9 h-9 rounded-lg bg-secondary-fixed flex items-center justify-center shrink-0">
                        <CalendarDays className="w-5 h-5 text-on-secondary-container" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-on-surface">Rooftop Lounge</p>
                        <p className="text-[10px] text-on-surface-variant">Penuh hari ini</p>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 py-2.5 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-1.5 text-xs font-bold">
                  <CalendarDays className="w-4 h-4" /> Booking Baru
                </button>
              </div>

              {/* Complaint History (Horizontal Table) */}
              <div className="col-span-12 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center flex-wrap gap-2">
                  <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Riwayat Komplain</h4>
                  <div className="flex gap-2">
                    <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded text-[10px] font-bold">Semua ({displayTickets.length})</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded text-[10px] font-bold">Diproses ({displayTickets.filter(t => t.status === 'DIPROSES').length})</span>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider font-bold text-[10px]">
                      <tr>
                        <th className="px-6 py-3">ID TICKET</th>
                        <th className="px-6 py-3">KATEGORI</th>
                        <th className="px-6 py-3">PERMASALAHAN</th>
                        <th className="px-6 py-3">TANGGAL</th>
                        <th className="px-6 py-3">STATUS</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-on-surface font-semibold">
                      {displayTickets.map(t => (
                        <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-6 py-4 font-mono text-primary font-extrabold">{t.id}</td>
                          <td className="px-6 py-4">{t.category}</td>
                          <td className="px-6 py-4 font-bold text-on-surface">{t.issue}</td>
                          <td className="px-6 py-4 text-on-surface-variant font-medium">{t.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              t.status === 'SELESAI'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.status === 'SELESAI' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                              {t.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-primary hover:underline font-bold">Detail</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* ===== NEW COMPLAINT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Form Keluhan Baru</h3>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Kategori</label>
                <select
                  value={complaintCategory}
                  onChange={e => setComplaintCategory(e.target.value)}
                  className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none font-semibold"
                >
                  <option>Engineering (Listrik, AC, Plafon)</option>
                  <option>Security (Keamanan, Akses)</option>
                  <option>Cleaning (Kebersihan)</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Deskripsi Keluhan</label>
                <textarea
                  value={complaintDesc}
                  onChange={e => setComplaintDesc(e.target.value)}
                  required
                  placeholder="Tuliskan detail permasalahan Anda..."
                  rows={4}
                  className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Lampiran Foto (Opsional)</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                  <UploadCloud className="w-8 h-8 text-outline mb-1.5" />
                  <p className="text-[10px] font-bold">Klik atau tarik file foto ke sini</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:brightness-110 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/10 transition-all"
                >
                  Kirim Keluhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
