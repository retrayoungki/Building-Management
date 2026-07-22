import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, UploadCloud } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TenantDetail({ tenant, onBack, onUpdateTenant }) {
  const { t } = useLanguage();
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);

  // Payment History State (Empty by default as requested)
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Editable Profile States
  const [companyName, setCompanyName] = useState(tenant.company || '');
  const [contactPerson, setContactPerson] = useState(tenant.contact || 'Dian Sastroatmodjo');
  const [contactRole, setContactRole] = useState(tenant.contactRole || 'General Affairs Manager');
  const [contactEmail, setContactEmail] = useState(tenant.email || 'dian.s@inovasi-tech.co.id');
  const [contactPhone, setContactPhone] = useState(tenant.phone || '+62 812-3456-7890');
  const [address, setAddress] = useState(tenant.unit ? `${tenant.unit}, East Wing` : 'Level 42, Suite 4201 - 4210, East Wing');

  // Send Message Form States
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');

  const [ticketsList, setTicketsList] = useState([
    { id: '#TK-9921', title: 'Masalah AC di Ruang Server (Suhu tidak stabil)', status: 'IN PROGRESS', reporter: 'Budi (IT Support)', date: '12 Ags 2024, 09:15 WIB', desc: 'Teknisi sedang dalam perjalanan untuk pengecekan freon dan kompresor.', type: 'urgent' },
    { id: '#TK-8840', title: 'Penggantian Lampu LED di Lobby Depan', status: 'COMPLETED', reporter: 'Siti (Receptionist)', date: '05 Ags 2024, 14:00 WIB', desc: 'Diselesaikan pada 06 Ags 2024 oleh tim Maintenance.', type: 'normal' },
    { id: '#TK-8712', title: 'Kebocoran Pipa di Pantry Level 42', status: 'COMPLETED', reporter: 'Dian', date: '22 Jul 2024', desc: 'Perbaikan pipa bocor dan pembersihan area terdampak selesai.', type: 'normal' }
  ]);

  // Form states for tickets
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketTitle || !newTicketDesc) return;

    const newTicket = {
      id: `#TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicketTitle,
      status: 'IN PROGRESS',
      reporter: contactPerson,
      date: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      desc: newTicketDesc,
      type: 'urgent'
    };

    setTicketsList([newTicket, ...ticketsList]);
    setNewTicketTitle('');
    setNewTicketDesc('');
    setShowAddTicketModal(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!companyName || !contactPerson) return;
    
    if (onUpdateTenant) {
      onUpdateTenant({
        ...tenant,
        company: companyName,
        contact: contactPerson,
        email: contactEmail,
        phone: contactPhone,
        unit: address.split(',')[0]
      });
    }

    alert(`Profil perusahaan ${companyName} berhasil diperbarui!`);
    setShowEditProfileModal(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgSubject || !msgContent) return;
    alert(`Pesan dengan subjek "${msgSubject}" telah berhasil dikirim ke ${companyName}!`);
    setMsgSubject('');
    setMsgContent('');
    setShowSendMessageModal(false);
  };

  const tenantDetails = {
    address: address,
    contactPerson: contactPerson,
    contactRole: contactRole,
    email: contactEmail,
    phone: contactPhone,
    contractId: tenant.contractId || 'KTR-2023-042',
    areaSize: tenant.areaSize || '1,240 m²',
    duration: tenant.duration || '48 Bulan',
    progress: 75,
    leaseStart: tenant.leaseStart || '12 Jan 2023',
    leaseEnd: tenant.leaseEnd || '11 Jan 2027',
    notes: t('renewal_notes'),
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH_mOiMu4aMrYk-d4WTLcvOVcc56KnkV4Z4Vi7sq9n27sMhNHltTxP6zK8SxjQTDgle8twup-z5wM_f_5vUeUY_H4GIWTFHG4rAhhVANXxC5nvwt0HWSGkLiQNW7f-N7S5C33tN2euCRGS8uKVirFlViKqES76gEUDXmT6VecID3xpF2vyNjLug6UwlSltV9uxN1dNiLIf2PgaMm9PO-FaiGpyXtPgc4fdP0XfZMp7Rh8Wkgg4U7E'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Breadcrumbs */}
      <nav className="flex text-on-surface-variant font-label-md text-label-md gap-2 items-center text-xs font-semibold">
        <button onClick={onBack} className="hover:text-primary transition-colors cursor-pointer outline-none flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('tenants')}</span>
        </button>
        <ChevronRight className="w-3 h-3 text-outline" />
        <span className="text-primary font-bold">{companyName}</span>
      </nav>

      {/* Tenant Profile Header Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Main Card */}
        <div className="lg:col-span-2 bg-white rounded-xl p-8 border border-outline-variant flex flex-col md:flex-row gap-8 items-start relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-green-200">
              {t('active_tenant_badge')}
            </span>
          </div>

          {/* Logo */}
          <div className="w-32 h-32 rounded-xl border border-outline-variant bg-white flex items-center justify-center p-4 shrink-0 shadow-inner">
            {companyName === 'BlueTech Indonesia, PT' || companyName === 'PT. Inovasi Teknologi Nusantara' ? (
              <img 
                className="max-w-full h-auto object-contain rounded" 
                src={tenantDetails.logoUrl} 
                alt="Company Logo" 
              />
            ) : (
              <div className="w-full h-full rounded bg-primary-container/10 flex items-center justify-center text-primary font-extrabold text-3xl">
                {tenant.initials || companyName.slice(0, 2).toUpperCase() || 'TN'}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl font-extrabold leading-tight">
                {companyName}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 mt-1.5 font-medium text-xs">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
                <span>{address}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
              <div>
                <p className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider">{t('contact_person')}</p>
                <p className="font-body-md text-body-md font-bold text-on-surface mt-0.5">{contactPerson}</p>
                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{contactRole}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-extrabold text-on-surface-variant tracking-wider">{t('contact_email')}</p>
                <p className="font-body-md text-body-md font-bold text-on-surface mt-0.5">{contactEmail}</p>
                <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">{contactPhone}</p>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setShowEditProfileModal(true)}
                className="bg-primary hover:bg-[#001c59] text-white px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                {t('edit_profile')}
              </button>
              <button 
                onClick={() => setShowSendMessageModal(true)}
                className="border border-outline hover:bg-slate-50 text-on-surface px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                {t('send_msg')}
              </button>
            </div>
          </div>
        </div>

        {/* Contract Snapshot Card */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant flex flex-col shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-extrabold mb-6">
            {t('contract_summary')}
          </h3>
          
          <div className="space-y-6 flex-1 text-xs">
            <div className="flex justify-between items-end border-b border-outline-variant pb-3 font-semibold">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{t('contract_id')}</p>
                <p className="font-bold text-primary text-sm mt-0.5">{tenantDetails.contractId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{t('area_size')}</p>
                <p className="font-bold text-on-surface text-sm mt-0.5">{tenantDetails.areaSize}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-on-surface-variant">{t('contract_duration')}</span>
                <span className="text-on-surface font-bold">{tenantDetails.duration}</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-3/4"></div>
              </div>
              
              <div className="flex justify-between text-[10px] text-on-surface-variant font-bold">
                <span>{t('start_lbl')}: {tenantDetails.leaseStart}</span>
                <span>{t('end_lbl')}: {tenantDetails.leaseEnd}</span>
              </div>
            </div>

            <div className="p-3 bg-primary-container/10 border border-primary-container rounded-lg">
              <p className="text-primary font-bold text-label-md">{t('important_notes')}</p>
              <p className="text-[11px] text-on-primary-fixed-variant leading-relaxed font-semibold mt-1">
                {tenantDetails.notes}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payments and Documents Row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Payment History Table */}
        <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold">
              {t('payment_history')}
            </h3>
            <button className="text-primary font-label-md text-xs font-bold hover:underline">
              {t('see_all')}
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant font-bold text-[10px] text-on-surface-variant tracking-wider uppercase">
                  <th className="py-3 px-4">{t('period_col')}</th>
                  <th className="py-3 px-4">{t('invoice_col')}</th>
                  <th className="py-3 px-4">{t('amount_col')}</th>
                  <th className="py-3 px-4">{t('status')}</th>
                  <th className="py-3 px-4">{t('action_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-semibold text-xs text-on-surface">
                {paymentHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-4 font-bold text-on-surface">{item.period}</td>
                    <td className="py-4 px-4 text-on-surface-variant font-mono">{item.invoiceId}</td>
                    <td className="py-4 px-4 font-bold">Rp {item.amount.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status === 'Paid' || item.status === 'TERBAYAR'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-primary">
                      <span className="material-symbols-outlined cursor-pointer hover:scale-110 transition-transform">
                        download
                      </span>
                    </td>
                  </tr>
                ))}
                {paymentHistory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-outline text-xs">
                      Belum ada riwayat pembayaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Documents Card */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold mb-6">
            {t('legal_docs')}
          </h3>

          <div className="space-y-4 flex-1 text-xs">
            {/* PSM */}
            <div className="group flex items-center p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-4 shrink-0 font-bold">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{t('psm_doc')}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Update: 12 Jan 2023</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                download
              </span>
            </div>

            {/* BAST */}
            <div className="group flex items-center p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shrink-0 font-bold">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{t('bast_doc')}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Update: 15 Jan 2023</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                download
              </span>
            </div>

            {/* Fit-out */}
            <div className="group flex items-center p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4 shrink-0 font-bold">
                <span className="material-symbols-outlined">architecture</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface">{t('fitout_doc')}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Update: 01 Feb 2023</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                download
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowUploadDocModal(true)}
            className="w-full mt-6 py-3 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:text-primary font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 outline-none"
          >
            <span className="material-symbols-outlined">add_circle</span>
            {t('upload_new_doc')}
          </button>
        </div>
      </section>

      {/* Complaint History List */}
      <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm overflow-hidden mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold">
              {t('complaint_history')}
            </h3>
            <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">
              {ticketsList.length}
            </span>
          </div>

          <button 
            onClick={() => setShowAddTicketModal(true)}
            className="bg-primary hover:bg-[#001c59] text-white px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow"
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
            {t('create_ticket')}
          </button>
        </div>

        <div className="space-y-4">
          {ticketsList.map((ticket, index) => {
            const isInProgress = ticket.status === 'IN PROGRESS';
            return (
              <div 
                key={index} 
                className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-all ${
                  isInProgress 
                    ? 'border-l-4 border-l-orange-500 border-outline-variant bg-orange-50/20' 
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex-1 text-left text-xs font-semibold">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`${isInProgress ? 'text-orange-600' : 'text-on-surface-variant'} font-bold`}>
                      {ticket.id}
                    </span>
                    <h4 className="font-bold text-on-surface text-sm">{ticket.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isInProgress 
                        ? 'bg-orange-100 text-orange-700 border-orange-200' 
                        : 'bg-surface-container-highest text-on-surface-variant border-outline-variant'
                    }`}>
                      {ticket.status === 'IN PROGRESS' ? t('in_progress') : t('completed')}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-medium leading-relaxed">
                    {t('reported_by')}: {ticket.reporter} | {ticket.date}. {ticket.desc}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">
                      {isInProgress ? 'chat_bubble' : 'history_edu'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant flex justify-center">
          <button className="text-primary font-bold text-xs flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
            {t('load_more')}
            <span className="material-symbols-outlined">arrow_downward</span>
          </button>
        </div>
      </section>

      {/* Modal - Buat Tiket Keluhan Baru */}
      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">{t('ticket_modal_title')}</h3>
              <button onClick={() => setShowAddTicketModal(false)} className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">{t('subject_lbl')}</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Lampu pantry redup / AC bocor"
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">{t('desc_lbl')}</label>
                <textarea 
                  rows="3" 
                  required 
                  placeholder="Jelaskan detail lokasi dan kondisi kerusakan..."
                  value={newTicketDesc}
                  onChange={(e) => setNewTicketDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setShowAddTicketModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-[11px] font-semibold rounded-lg"
                >
                  {t('batal')}
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white text-[11px] font-semibold rounded-lg"
                >
                  {t('send_ticket')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Unggah Dokumen Baru */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">{t('upload_modal_title')}</h3>
              <button onClick={() => setShowUploadDocModal(false)} className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">{t('doc_name_lbl')}</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Addendum Perjanjian Sewa"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">{t('select_file_lbl')}</label>
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                  <UploadCloud className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-1 transition-colors" />
                  <p className="text-xs text-on-surface-variant font-medium">{t('select_file_lbl')}</p>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-[11px] font-semibold rounded-lg"
                >
                  {t('batal')}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white text-[11px] font-semibold rounded-lg"
                >
                  {t('save_file')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Edit Profil Perusahaan */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Edit Profil Perusahaan / Tenant</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">Nama Tenant / Perusahaan</label>
                <input 
                  type="text" 
                  required 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block tracking-wider uppercase">Lokasi Unit & Sektor</label>
                <input 
                  type="text" 
                  required 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">Contact Person</label>
                  <input 
                    type="text" 
                    required 
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">Jabatan / Role</label>
                  <input 
                    type="text" 
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">Email Contact</label>
                  <input 
                    type="email" 
                    required 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">No. Telepon / HP</label>
                  <input 
                    type="text" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-[11px] font-semibold rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white text-[11px] font-semibold rounded-lg cursor-pointer shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Kirim Pesan Ke Tenant */}
      {showSendMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Kirim Pesan ke {companyName}</h3>
              <button onClick={() => setShowSendMessageModal(false)} className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">Subjek Pesan / Pengumuman</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Pemberitahuan Pemeliharaan AC Gedung"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block tracking-wider uppercase">Isi Pesan</label>
                <textarea 
                  rows="4" 
                  required 
                  placeholder="Tuliskan isi pesan atau pemberitahuan resmi untuk tenant..."
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setShowSendMessageModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-[11px] font-semibold rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white text-[11px] font-semibold rounded-lg cursor-pointer shadow"
                >
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
