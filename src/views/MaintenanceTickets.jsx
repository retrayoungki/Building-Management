import React, { useState } from 'react';
import { Plus, Search, Calendar, User, CheckCircle2, Clock, AlertCircle, HelpCircle, ChevronLeft, ChevronRight, Download, Filter, Eye, Edit2, Play, Check, MapPin, Archive } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MaintenanceTickets({ tickets, onAddTicket, onUpdateTicketStatus, onAssignTechnician }) {
  const { t, lang } = useLanguage();
  const [viewMode, setViewMode] = useState('board'); // 'board' (Work Order) or 'pm' (Jadwal PM)
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // PM Schedule States
  const [showAddPMModal, setShowAddPMModal] = useState(false);
  const [pmCompletedCount, setPmCompletedCount] = useState(12);
  const [pmTotalCount, setPmTotalCount] = useState(24);
  const [pmTasks, setPmTasks] = useState([
    { id: 1, type: 'ac', typeName: 'AC Central', title: 'Pembersihan Filter & Evaporator', time: '09:00 - 12:00', technician: 'Tim Teknik B', color: '#3B82F6', completed: false },
    { id: 2, type: 'genset', typeName: 'Genset', title: 'Pengecekan Oli & Aki Bulanan', time: '13:00 - 15:00', technician: 'Budi Santoso', color: '#10B981', completed: false },
    { id: 3, type: 'elevator', typeName: 'Elevator', title: 'Sertifikasi Tahunan Lift Barang', time: '08:30 - Selesai', technician: 'Vendor & Disnaker', color: '#F59E0B', completed: false }
  ]);

  // Form State - Work Order
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electrical');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newLocation, setNewLocation] = useState('');
  const [newReporter, setNewReporter] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Form State - PM Schedule
  const [newPmAsset, setNewPmAsset] = useState('AC Central');
  const [newPmTitle, setNewPmTitle] = useState('');
  const [newPmTime, setNewPmTime] = useState('09:00 - 12:00');
  const [newPmTech, setNewPmTech] = useState('Tim Teknik B');
  const [newPmDay, setNewPmDay] = useState('7');

  const technicians = ['Budi Santoso', 'Cecep Hermawan', 'Yadi Mulyadi', 'Susilo Bambang', 'Siti Aminah', 'Rahmat H.', 'Andi Wijaya', 'Doni Pratama'];
  const columns = ['New', 'In Progress', 'Waiting Sparepart', 'Resolved'];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newReporter) return;

    const newTicket = {
      id: 'WO-2023-' + Math.floor(1000 + Math.random() * 9000),
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      status: 'New',
      location: newLocation,
      reporter: newReporter,
      description: newDesc || 'No details provided.',
      date: new Date().toLocaleDateString('en-GB'),
      assignee: 'Budi Santoso',
      timeText: 'Just now'
    };

    onAddTicket(newTicket);

    // Reset Form
    setNewTitle('');
    setNewCategory('Electrical');
    setNewPriority('Medium');
    setNewLocation('');
    setNewReporter('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const handleCreatePMSubmit = (e) => {
    e.preventDefault();
    if (!newPmTitle) return;

    let assetColor = '#3B82F6'; // AC
    let assetType = 'ac';
    if (newPmAsset === 'Genset') {
      assetColor = '#10B981';
      assetType = 'genset';
    } else if (newPmAsset === 'Elevator') {
      assetColor = '#F59E0B';
      assetType = 'elevator';
    } else if (newPmAsset === 'Fire Hydrant') {
      assetColor = '#EF4444';
      assetType = 'hydrant';
    }

    const newTask = {
      id: Date.now(),
      type: assetType,
      typeName: newPmAsset,
      title: newPmTitle,
      time: newPmTime,
      technician: newPmTech,
      color: assetColor,
      day: parseInt(newPmDay) || 7,
      completed: false
    };

    setPmTasks([...pmTasks, newTask]);
    setPmTotalCount(pmTotalCount + 1);
    setNewPmTitle('');
    setShowAddPMModal(false);
  };

  const handleResolvePM = (taskId) => {
    setPmTasks(pmTasks.map(t => {
      if (t.id === taskId && !t.completed) {
        setPmCompletedCount(prev => prev + 1);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
      case 'High':
        return 'bg-error-container text-on-error-container';
      case 'Medium':
        return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
      case 'Low':
      default:
        return 'bg-secondary-container text-on-secondary-container';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New':
        return <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>;
      case 'In Progress':
        return <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim inline-block"></span>;
      case 'Waiting Sparepart':
        return <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim inline-block"></span>;
      case 'Resolved':
        return <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim inline-block"></span>;
      default:
        return null;
    }
  };

  const getColumnHeader = (col) => {
    switch (col) {
      case 'New':
        return lang === 'id' ? 'Baru' : 'New';
      case 'In Progress':
        return lang === 'id' ? 'Dikerjakan' : 'In Progress';
      case 'Waiting Sparepart':
        return lang === 'id' ? 'Menunggu Sparepart' : 'Waiting Sparepart';
      case 'Resolved':
        return lang === 'id' ? 'Selesai' : 'Resolved';
      default:
        return col;
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top View Mode Switcher */}
      <div className="flex justify-between items-center border-b border-outline-variant pb-3 text-left">
        <div>
          <nav className="flex mb-2 gap-2 text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">
            <span>{t('management')}</span>
            <span>/</span>
            <span className="text-primary font-bold">{t('maintenance')}</span>
          </nav>
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('board')}
              className={`pb-2 text-sm font-bold border-b-2 transition-all outline-none focus:outline-none ${
                viewMode === 'board' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lang === 'id' ? 'Board Tiket Work Order' : 'Work Order Ticket Board'}
            </button>
            <button
              onClick={() => setViewMode('pm')}
              className={`pb-2 text-sm font-bold border-b-2 transition-all outline-none focus:outline-none ${
                viewMode === 'pm' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lang === 'id' ? 'Jadwal Preventive Maintenance' : 'Preventive Maintenance Schedule'}
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'board' ? (
        /* --- REACTIVE WORK ORDER KANBAN BOARD VIEW (UPDATED MOCKUP) --- */
        <div className="space-y-8">
          {/* Header Description Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 text-left">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary text-xl font-bold">Work Order Management</h2>
              <p className="text-on-surface-variant font-body-md text-xs font-semibold mt-1">
                {lang === 'id' ? 'Kelola pemeliharaan dan perbaikan fasilitas gedung secara efisien.' : 'Efficiently manage building maintenance and repairs.'}
              </p>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-container text-primary font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {lang === 'id' ? 'Buat Work Order Baru' : 'Create Work Order'}
            </button>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 custom-scrollbar overflow-x-auto pb-4">
            {columns.map((colName) => {
              const colTickets = filteredTickets.filter(t => t.status === colName);
              const isResolvedCol = colName === 'Resolved';
              
              return (
                <div key={colName} className="flex flex-col gap-4 text-left min-w-[250px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                      {getStatusIcon(colName)}
                      <span>{getColumnHeader(colName)}</span>
                    </h3>
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded text-xs font-bold text-on-surface-variant">
                      {colTickets.length}
                    </span>
                  </div>

                  {/* Column Body Container */}
                  <div className={`kanban-column bg-surface-container-low rounded-xl p-3 flex flex-col gap-3 border border-outline-variant ${
                    isResolvedCol ? 'opacity-85 grayscale-[0.1]' : ''
                  }`}>
                    {colTickets.map(ticket => {
                      const isHigh = ticket.priority === 'High' || ticket.priority === 'Urgent';
                      const isSparepartHold = ticket.status === 'Waiting Sparepart';
                      const isProgressState = ticket.status === 'In Progress';
                      const isTicketDone = ticket.status === 'Resolved';

                      return (
                        <div 
                          key={ticket.id} 
                          onClick={() => setSelectedTicket(ticket)}
                          className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm wo-card-hover transition-all cursor-pointer text-xs"
                          style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                        >
                          {/* Priority and ID */}
                          <div className="flex justify-between items-start mb-2 font-bold text-[10px]">
                            <span className="text-on-surface-variant tracking-tight uppercase">{ticket.id}</span>
                            <span className={`px-2 py-0.5 rounded ${getPriorityBadge(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className={`font-bold text-primary mb-1 text-sm ${
                            isTicketDone ? 'line-through decoration-on-surface-variant/30 text-on-surface-variant' : 'text-primary'
                          }`}>
                            {ticket.title}
                          </h4>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-on-surface-variant mb-3 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-outline" />
                            <span>{ticket.location}</span>
                          </div>

                          {/* Progress bar for In Progress */}
                          {isProgressState && (
                            <div className="mt-3 mb-3 w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                              <div className="bg-primary h-full w-[65%]"></div>
                            </div>
                          )}

                          {/* Sparepart waiting label */}
                          {isSparepartHold && (
                            <div className="mt-3 mb-3 flex items-center gap-1 text-tertiary font-bold text-[10px]">
                              <Archive className="w-3.5 h-3.5" />
                              <span>{ticket.sparepartNote || (lang === 'id' ? 'Menunggu Sparepart' : 'Waiting for Sparepart')}</span>
                            </div>
                          )}

                          {/* Footer Assignee & Time */}
                          <div className="flex items-center justify-between mt-auto border-t border-slate-50 pt-2 text-[10px] text-on-surface-variant font-bold">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 border border-outline-variant flex items-center justify-center font-bold text-[10px] text-primary overflow-hidden shrink-0">
                                {ticket.assignee ? ticket.assignee.charAt(0) : '?'}
                              </div>
                              <span className="truncate max-w-[80px]">{ticket.assignee || 'Unassigned'}</span>
                            </div>
                            <span className={isTicketDone ? 'text-primary font-bold' : ''}>
                              {ticket.timeText || '2 jam lalu'}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {colTickets.length === 0 && (
                      <div className="h-44 border-2 border-dashed border-outline-variant/60 rounded-xl flex items-center justify-center text-outline text-xs font-semibold">
                        {lang === 'id' ? 'Tidak ada tiket' : 'No tickets here'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* --- JADWAL PREVENTIVE MAINTENANCE VIEW --- */
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Left Sidebar Filter Panel */}
          <div className="w-full lg:w-72 space-y-6 text-left shrink-0">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold mb-6 text-on-surface">
                {lang === 'id' ? 'Kategori Aset' : 'Asset Categories'}
              </h3>
              
              <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#3B82F6]"></div>
                    <span className="group-hover:text-on-surface">Air Conditioning (AC)</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#10B981]"></div>
                    <span className="group-hover:text-on-surface">Genset</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]"></div>
                    <span className="group-hover:text-on-surface">Elevator / Lift</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444]"></div>
                    <span className="group-hover:text-on-surface">Fire Hydrant</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" />
                </label>
              </div>

              {/* Progress Summary */}
              <div className="mt-8 pt-6 border-t border-outline-variant">
                <h3 className="text-[10px] font-bold mb-4 uppercase tracking-wider text-on-surface-variant">
                  {lang === 'id' ? 'Ringkasan Bulan Ini' : 'Monthly Summary'}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                    <span>{t('done')}</span>
                    <span className="text-primary">{pmCompletedCount}/{pmTotalCount}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${(pmCompletedCount / pmTotalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Service Request Card */}
            <div className="relative overflow-hidden rounded-xl border border-outline-variant h-48 group">
              <div className="absolute inset-0 bg-primary opacity-90 z-10 p-6 flex flex-col justify-end text-on-primary text-white">
                <h4 className="text-sm font-bold leading-tight">
                  {lang === 'id' ? 'Minta Layanan Darurat' : 'Request Emergency Service'}
                </h4>
                <p className="text-[10px] opacity-80 mt-1 font-semibold">
                  {lang === 'id' ? 'Hubungi tim teknik 24/7 untuk insiden kritis.' : 'Contact technical team 24/7 for critical incidents.'}
                </p>
                <button className="mt-4 bg-white text-primary font-bold py-2 rounded-lg text-xs hover:bg-opacity-90 transition-all active:scale-95 shadow">
                  {lang === 'id' ? 'Panggil Sekarang' : 'Call Now'}
                </button>
              </div>
              <img 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRhwvD_aupPCvD00gDvuW9yxvv3r8Fln2siuw1TCnbRZmBBhnGDQMg59h26rEC5Yp7cdhmZLBMVF1qWkY4hKcnGGZ2BMJKJTpn2zNapUToMlHqGIROMwCq7-yf16XMCj-zYaJq9qdQF4952hmaF6_18nx3XHLxGK85VtBvOGn9a9-O8g2vk4IfvrCtyWZc1NaDxl1O-A7X0qL_XqJXn0EsPll9_ldXytnNZw1lZfl0q-S7-8MzTwI"
                alt="Electrician panel check"
              />
            </div>
          </div>

          {/* Calendar & Cards Container */}
          <div className="flex-1 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden text-left">
              {/* Calendar Toolbar */}
              <div className="p-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-on-surface">
                    {lang === 'id' ? 'Agustus 2024' : 'August 2024'}
                  </h2>
                  <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant">
                    <button className="p-1 hover:bg-surface-container-high rounded transition-colors flex items-center justify-center">
                      <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
                    </button>
                    <button className="px-3 text-xs font-bold text-on-surface-variant">
                      {lang === 'id' ? 'Hari Ini' : 'Today'}
                    </button>
                    <button className="p-1 hover:bg-surface-container-high rounded transition-colors flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowAddPMModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-[#001c59] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    {lang === 'id' ? 'Tambah Jadwal' : 'Add Schedule'}
                  </button>
                  <button className="flex items-center gap-2 bg-white text-on-surface-variant border border-outline-variant px-4 py-2 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-all">
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    Export
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="calendar-grid bg-outline-variant gap-[1px]">
                {/* Weekdays */}
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
                  <div key={day} className="bg-surface-container-low p-3 text-center text-xs font-bold text-on-surface-variant">
                    {day}
                  </div>
                ))}

                {/* Days (August 2024 Offset Mock grid) */}
                <div className="bg-surface-container-lowest min-h-[120px] p-2 opacity-40"><span className="text-xs font-bold text-outline">29</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 opacity-40"><span className="text-xs font-bold text-outline">30</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 opacity-40"><span className="text-xs font-bold text-outline">31</span></div>

                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span className="text-xs font-bold">1</span>
                  <div className="mt-2">
                    <div className="bg-[#3B82F615] text-[#3B82F6] border-l-2 border-[#3B82F6] p-1.5 rounded-r text-[9px] font-bold truncate" title="AC Central - Lt. 4">
                      AC Central - Lt. 4
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">2</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">3</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">4</span></div>

                {/* Day 5 */}
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span className="text-xs font-bold">5</span>
                  <div className="mt-2 space-y-1">
                    <div className="bg-[#10B98115] text-[#10B981] border-l-2 border-[#10B981] p-1.5 rounded-r text-[9px] font-bold truncate">
                      Genset Utama - Check
                    </div>
                    <div className="bg-[#F59E0B15] text-[#F59E0B] border-l-2 border-[#F59E0B] p-1.5 rounded-r text-[9px] font-bold truncate">
                      Lift Barang B-2
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">6</span></div>

                {/* Day 7 (Today highlighted with blue ring) */}
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer ring-2 ring-inset ring-primary">
                  <span className="text-xs font-extrabold text-primary bg-primary-container/20 w-5 h-5 inline-flex items-center justify-center rounded-full leading-none">
                    7
                  </span>
                  <div className="mt-2 space-y-1">
                    <div className="bg-[#EF444415] text-[#EF4444] border-l-2 border-[#EF4444] p-1.5 rounded-r text-[9px] font-bold truncate">
                      Hydrant Lt. Ground
                    </div>
                    {pmTasks.map((t, idx) => (
                      <div key={idx} className="p-1 rounded-r text-[9px] font-bold truncate" style={{ backgroundColor: `${t.color}15`, color: t.color, borderLeft: `2px solid ${t.color}` }}>
                        {t.typeName} - {t.title.slice(0, 10)}...
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">8</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">9</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">10</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">11</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">12</span></div>

                {/* Day 13 */}
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span className="text-xs font-bold">13</span>
                  <div className="mt-2">
                    <div className="bg-[#3B82F615] text-[#3B82F6] border-l-2 border-[#3B82F6] p-1.5 rounded-r text-[9px] font-bold truncate">
                      AC Split - All Units
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">14</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">15</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">16</span></div>

                {/* Day 17: Independence Day holiday */}
                <div className="bg-surface-container-lowest min-h-[120px] p-2 bg-red-50/20">
                  <span className="text-xs font-extrabold text-error">17</span>
                  <div className="mt-2 text-center italic text-[9px] text-error font-bold">
                    {lang === 'id' ? 'Hari Kemerdekaan' : 'Independence Day'}
                  </div>
                </div>

                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">18</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">19</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">20</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">21</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">22</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">23</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">24</span></div>
                <div className="bg-surface-container-lowest min-h-[120px] p-2 hover:bg-surface-container-low transition-colors cursor-pointer"><span className="text-xs font-bold">25</span></div>
              </div>
            </div>

            {/* PM Cards below Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {pmTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all cursor-pointer flex flex-col justify-between ${
                    task.completed ? 'opacity-60 bg-slate-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div 
                        className="px-3 py-1 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: `${task.color}15`, color: task.color }}
                      >
                        {task.typeName}
                      </div>
                      {task.completed ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> {t('done')}
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">more_vert</span>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-bold text-on-surface leading-tight">
                      {task.title}
                    </h4>

                    <div className="mt-4 flex items-center gap-4 text-on-surface-variant text-[11px] font-semibold">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {task.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        {task.technician}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button className="flex-1 border border-outline-variant py-2 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors">
                      {lang === 'id' ? 'Detail' : 'Details'}
                    </button>
                    {!task.completed ? (
                      <button 
                        onClick={() => handleResolvePM(task.id)}
                        className="flex-1 bg-primary hover:bg-[#001c59] text-white py-2 rounded-lg text-xs font-bold transition-all active:scale-95 shadow"
                      >
                        {lang === 'id' ? 'Selesaikan' : 'Complete'}
                      </button>
                    ) : (
                      <button disabled className="flex-1 bg-slate-100 text-slate-400 py-2 rounded-lg text-xs font-bold cursor-not-allowed">
                        {t('done')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Sheet Overlay (Work Order Detail) */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200 text-left text-xs">
            <div className="p-5 bg-[#001c59] text-white flex justify-between items-center">
              <div>
                <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">{selectedTicket.id}</span>
                <h3 className="text-base font-bold mt-0.5">{selectedTicket.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5 text-on-surface-variant font-semibold">
              <div className="grid grid-cols-2 gap-4 border-b border-outline-variant pb-4">
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Priority</p>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Status</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {getStatusIcon(selectedTicket.status)}
                    <span className="text-xs font-bold text-on-surface">{selectedTicket.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Category</p>
                  <p className="text-xs font-semibold text-on-surface mt-1.5">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Location / Suite</p>
                  <p className="text-xs font-semibold text-on-surface mt-1.5">{selectedTicket.location}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">Issue details</p>
                <p className="text-xs text-on-surface leading-relaxed p-3 bg-surface-container-low border border-outline-variant rounded-xl font-medium">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="flex justify-between text-xs font-medium text-outline">
                <span>Reporter: <span className="text-on-surface font-semibold">{selectedTicket.reporter}</span></span>
                <span>Created on: <span className="text-on-surface font-semibold">{selectedTicket.date}</span></span>
              </div>

              {/* Dispatch controls */}
              <div className="bg-blue-50/40 p-4 border border-outline-variant rounded-xl space-y-4 text-xs">
                <p className="text-xs font-bold text-primary">Dispatch & Operations</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Technician Assignee</label>
                    <select 
                      value={selectedTicket.assignee}
                      onChange={(e) => onAssignTechnician(selectedTicket.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="">-- Choose technician --</option>
                      {technicians.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">Set Work Status</label>
                    <select 
                      value={selectedTicket.status}
                      onChange={(e) => onUpdateTicketStatus(selectedTicket.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      {columns.map(c => (
                        <option key={c} value={c}>{getColumnHeader(c)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="px-5 py-2 bg-primary hover:bg-[#001c59] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create WO Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="p-5 bg-primary text-white flex justify-between items-center">
              <h3 className="text-base font-bold">File Maintenance Work Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block tracking-wider">TICKET TITLE *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ringkasan singkat masalah"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block tracking-wider">CATEGORY</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-semibold text-on-surface"
                  >
                    <option value="HVAC">HVAC / Cooling</option>
                    <option value="Plumbing">Plumbing / Water</option>
                    <option value="Electrical">Electrical / Power</option>
                    <option value="Elevator">Elevator / Lift</option>
                    <option value="Cleaning">Cleaning / Housekeeping</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider">PRIORITY</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-semibold text-on-surface"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider">LOCATION / SUITE *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Toilet Lobby Lantai 3"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider">REPORTER NAME *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Nama pelapor / unit tenant"
                    value={newReporter}
                    onChange={(e) => setNewReporter(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block tracking-wider">DETAILED DESCRIPTION</label>
                <textarea 
                  rows="3"
                  placeholder="Detail lengkap masalah kerusakan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  File Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create PM Schedule Modal */}
      {showAddPMModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="p-5 bg-primary text-white flex justify-between items-center">
              <h3 className="text-base font-bold">
                {lang === 'id' ? 'Tambah Jadwal Preventive Maintenance Baru' : 'Add New PM Schedule'}
              </h3>
              <button 
                onClick={() => setShowAddPMModal(false)}
                className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePMSubmit} className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block tracking-wider uppercase">
                  {lang === 'id' ? 'Nama Jadwal PM *' : 'PM Task Name *'}
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Kalibrasi Sensor Kebocoran / Pembersihan Chiller"
                  value={newPmTitle}
                  onChange={(e) => setNewPmTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">KATEGORI ASET</label>
                  <select 
                    value={newPmAsset}
                    onChange={(e) => setNewPmAsset(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-semibold text-on-surface"
                  >
                    <option value="AC Central">Air Conditioning (AC)</option>
                    <option value="Genset">Genset</option>
                    <option value="Elevator">Elevator / Lift</option>
                    <option value="Fire Hydrant">Fire Hydrant</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">
                    {lang === 'id' ? 'Tanggal Pelaksanaan (Hari)' : 'Execution Day (Date)'}
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="25"
                    value={newPmDay}
                    onChange={(e) => setNewPmDay(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">Waktu Pelaksanaan</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 09:00 - 12:00"
                    value={newPmTime}
                    onChange={(e) => setNewPmTime(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block tracking-wider uppercase">Teknisi / Penanggung Jawab</label>
                  <input 
                    type="text"
                    placeholder="Contoh: Budi Santoso / Vendor"
                    value={newPmTech}
                    onChange={(e) => setNewPmTech(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button"
                  onClick={() => setShowAddPMModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  {lang === 'id' ? 'Simpan Jadwal' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) for quick status summary */}
      <button 
        onClick={() => {
          if (viewMode === 'pm') {
            alert(lang === 'id' ? `Jadwal PM bulan ini: ${pmCompletedCount} selesai dari ${pmTotalCount} total kegiatan.` : `This month's PM: ${pmCompletedCount} completed of ${pmTotalCount} tasks.`);
          } else {
            alert(lang === 'id' ? `Total tiket dalam antrean WO: ${tickets.length} tiket.` : `Total work orders: ${tickets.length} tickets.`);
          }
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-[#001c59] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 outline-none focus:outline-none"
        title="Quick Summary / Ringkasan Cepat"
      >
        <span className="material-symbols-outlined text-[28px] text-white">pending_actions</span>
      </button>
    </div>
  );
}
