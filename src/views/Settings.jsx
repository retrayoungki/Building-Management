import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Plus, 
  Trash2, 
  Layers, 
  Users, 
  CreditCard, 
  UserPlus, 
  Building, 
  MapPin, 
  Maximize2, 
  CheckCircle2, 
  ExternalLink,
  Edit,
  UserCheck,
  Search,
  FileSpreadsheet,
  Printer,
  Download,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ExportToolbar from '../components/ExportToolbar';

export default function Settings({ 
  tenants = [], 
  onAddTenant, 
  onDeleteTenant, 
  spaces = [], 
  onAddSpace,
  onUpdateSpace,
  onDeleteSpace,
  accessCards = [], 
  onAssignAccessCard, 
  onToggleCardStatus, 
  onRevokeCard,
  users = [],
  currentUser = null,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('system'); // system, tenants, spaces, cards

  // --- Existing System Settings States ---
  const [bName, setBName] = useState('Gedung Sudirman Tower');
  const [tempLimit, setTempLimit] = useState(24.5);
  const [allowSSO, setAllowSSO] = useState(true);

  // --- Form States for Tenant Registration ---
  const [newCompany, setNewCompany] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]); // array of selected unit names
  const [newLeaseStart, setNewLeaseStart] = useState('');
  const [newLeaseEnd, setNewLeaseEnd] = useState('');
  const [newRent, setNewRent] = useState('');

  // --- Form States for Access Card Assignment ---
  const [cardTenantId, setCardTenantId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardJabatan, setCardJabatan] = useState('');
  const [cardPintu, setCardPintu] = useState('B/G/3');
  const [cardAccessLevel, setCardAccessLevel] = useState('Full Access');

  // --- Search, Filter & Export States for Access Cards ---
  const [cardSearchTerm, setCardSearchTerm] = useState('');
  const [cardStatusFilter, setCardStatusFilter] = useState('All');
  const [cardLevelFilter, setCardLevelFilter] = useState('All');

  // Filtered Access Cards Computation
  const filteredAccessCards = accessCards.filter(card => {
    const tenant = tenants.find(t => t.id === card.tenantId);
    const companyName = tenant ? tenant.company : '';
    const searchLower = cardSearchTerm.toLowerCase();
    
    const matchesSearch = 
      card.id.toLowerCase().includes(searchLower) ||
      (card.cardNumber || '').toLowerCase().includes(searchLower) ||
      (card.holderName || '').toLowerCase().includes(searchLower) ||
      companyName.toLowerCase().includes(searchLower);

    const matchesStatus = cardStatusFilter === 'All' || card.status === cardStatusFilter;
    const matchesLevel = cardLevelFilter === 'All' || card.accessLevel === cardLevelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Export to Excel / CSV
  const handleExportCardExcel = () => {
    if (filteredAccessCards.length === 0) {
      alert('Tidak ada data kartu akses untuk diexport!');
      return;
    }

    const headers = ["Card ID", "Nomor Kartu", "Perusahaan", "Pemegang Kartu", "Level Akses", "Status"];
    const rows = filteredAccessCards.map(c => {
      const cardTenant = tenants.find(t => t.id === c.tenantId);
      return [
        `"${c.id}"`,
        `"${c.cardNumber || ''}"`,
        `"${cardTenant ? cardTenant.company : 'Unknown'}"`,
        `"${c.holderName || ''}"`,
        `"${c.accessLevel || ''}"`,
        `"${c.status || ''}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kartu_Akses_GrahaKaji_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export / Print PDF Report
  const handleExportCardPDF = () => {
    if (filteredAccessCards.length === 0) {
      alert('Tidak ada data kartu akses untuk dicetak!');
      return;
    }

    const printWindow = window.open('', '_blank');
    const tableRows = filteredAccessCards.map(c => {
      const cardTenant = tenants.find(t => t.id === c.tenantId);
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 11px;">${c.id}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-family: monospace; color: #001c59;">${c.cardNumber}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${cardTenant ? cardTenant.company : 'Unknown'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${c.holderName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${c.accessLevel}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <span style="padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background-color: ${c.status === 'Suspended' ? '#fef2f2' : '#f0fdf4'}; color: ${c.status === 'Suspended' ? '#b91c1c' : '#15803d'}; border: 1px solid ${c.status === 'Suspended' ? '#fecaca' : '#bbf7d0'};">
              ${c.status === 'Suspended' ? 'Ditangguhkan' : 'Aktif'}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Kartu Akses - Graha Kaji</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px; color: #0f172a; }
            .header { border-bottom: 2px solid #001c59; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            h2 { margin: 0; color: #001c59; font-size: 20px; font-weight: 800; }
            .sub { font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { background-color: #f8fafc; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
            .footer { margin-top: 32px; font-size: 10px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>GRAHA KAJI BUILDING MANAGEMENT</h2>
              <div class="sub">Laporan Resmi Direktori & Status Kartu Akses Gedung</div>
            </div>
            <div style="text-align: right;" class="sub">
              <div>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div>Total Data: <strong>${filteredAccessCards.length} Kartu</strong></div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>CARD ID</th>
                <th>NOMOR KARTU</th>
                <th>PERUSAHAAN</th>
                <th>PEMEGANG KARTU</th>
                <th>LEVEL AKSES</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">Dicetak secara otomatis oleh Sistem Manajemen Gedung Graha Kaji.</div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  // --- Selected Space for mapping detail panel ---
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  // --- Form States for Space Add/Edit ---
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [spaceFloor, setSpaceFloor] = useState('');
  const [spaceUnitName, setSpaceUnitName] = useState('');
  const [spaceWing, setSpaceWing] = useState('East Wing');
  const [spaceArea, setSpaceArea] = useState('');
  const [spaceRent, setSpaceRent] = useState('');
  const [selectedWingOption, setSelectedWingOption] = useState('East Wing');
  const [customWing, setCustomWing] = useState('');

  // --- Form States for User Management ---
  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('role_property_manager');

  const availableSpaces = spaces.filter(s => s.status === 'Available');

  const handleOpenAddSpaceModal = () => {
    setEditingSpace(null);
    setSpaceFloor('');
    setSpaceUnitName('');
    setSpaceWing('East Wing');
    setSelectedWingOption('East Wing');
    setCustomWing('');
    setSpaceArea('');
    setSpaceRent('');
    setIsSpaceModalOpen(true);
  };

  const handleOpenEditSpaceModal = (space) => {
    setEditingSpace(space);
    setSpaceFloor(space.floor);
    
    // Parse unit name (extract "Unit 05" from "Fl. 02 - Unit 05")
    const unitParts = space.unit.split(' - ');
    const unitName = unitParts.length > 1 ? unitParts[1] : space.unit;
    setSpaceUnitName(unitName);
    
    const standardWings = ['East Wing', 'West Wing', 'Penthouse', 'Basement'];
    if (standardWings.includes(space.wing)) {
      setSelectedWingOption(space.wing);
      setSpaceWing(space.wing);
      setCustomWing('');
    } else {
      setSelectedWingOption('Custom');
      setSpaceWing(space.wing);
      setCustomWing(space.wing);
    }
    
    setSpaceArea(space.area.toString());
    setSpaceRent(space.rent.toString());
    setIsSpaceModalOpen(true);
  };

  const handleSpaceFormSubmit = (e) => {
    e.preventDefault();
    if (!spaceFloor || !spaceUnitName || !spaceArea || !spaceRent) return;

    const finalWing = selectedWingOption === 'Custom' ? customWing : selectedWingOption;
    if (!finalWing) {
      alert('Sektor/Wing tidak boleh kosong!');
      return;
    }

    const formattedUnit = `Fl. ${spaceFloor} - ${spaceUnitName}`;

    if (editingSpace) {
      const updatedSpace = {
        ...editingSpace,
        unit: formattedUnit,
        floor: spaceFloor,
        wing: finalWing,
        area: parseInt(spaceArea) || 0,
        rent: parseInt(spaceRent) || 0
      };
      onUpdateSpace(updatedSpace);
      alert(`Space ${formattedUnit} berhasil diperbarui.`);
    } else {
      const newSpaceId = 'SPC-' + Math.floor(1000 + Math.random() * 9000);
      const newSpace = {
        id: newSpaceId,
        unit: formattedUnit,
        floor: spaceFloor,
        wing: finalWing,
        area: parseInt(spaceArea) || 0,
        rent: parseInt(spaceRent) || 0,
        status: 'Available',
        tenantId: null
      };
      onAddSpace(newSpace);
      alert(`Space ${formattedUnit} berhasil ditambahkan.`);
    }

    setIsSpaceModalOpen(false);
  };

  // --- User Management Actions ---
  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPassword) return;

    const words = userName.trim().split(/\s+/);
    const initials = words.length > 1
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : userName.slice(0, 2).toUpperCase();

    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
        initials: initials
      };
      onUpdateUser(updatedUser);
      alert(`User ${userName} berhasil diperbarui.`);
      setEditingUser(null);
    } else {
      const newUserId = 'USR-' + Math.floor(1000 + Math.random() * 9000);
      const newUser = {
        id: newUserId,
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
        initials: initials
      };
      onAddUser(newUser);
      alert(`User ${userName} berhasil ditambahkan.`);
    }

    // Reset Form
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserRole('role_property_manager');
  };

  const handleStartEditUser = (user) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPassword(user.password);
    setUserRole(user.role);
  };

  const handleCancelEditUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserPassword('');
    setUserRole('role_property_manager');
  };

  // Handle Save System Settings
  const handleSaveSystem = (e) => {
    e.preventDefault();
    alert('Pengaturan Sistem disimpan!');
  };

  // Handle Tenant Registration Form Submit
  const handleTenantSubmit = async (e) => {
    e.preventDefault();
    if (!newCompany || selectedUnits.length === 0 || !newLeaseStart || !newLeaseEnd) {
      alert('Mohon isi nama perusahaan, pilih minimal 1 unit, dan tentukan masa sewa!');
      return;
    }

    const words = newCompany.trim().split(/\s+/);
    const initials = words.length > 1 
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : newCompany.slice(0, 2).toUpperCase();

    const jointUnits = selectedUnits.join(', ');
    
    const totalSelectedRent = selectedUnits.reduce((sum, unitName) => {
      const sp = spaces.find(s => s.unit === unitName);
      return sum + (sp ? sp.rent : 0);
    }, 0);

    const calculatedRent = parseInt(newRent) || totalSelectedRent || 150000000;

    let formattedDueDate = newLeaseEnd;
    try {
      if (newLeaseEnd) {
        const d = new Date(newLeaseEnd);
        if (!isNaN(d.getTime())) {
          formattedDueDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      }
    } catch (err) {
      console.warn('Date formatting warning:', err);
    }

    const newTenant = {
      id: 'TNT-' + Math.floor(1000 + Math.random() * 9000),
      company: newCompany,
      unit: jointUnits,
      leaseStart: newLeaseStart,
      leaseEnd: newLeaseEnd,
      dueDate: formattedDueDate,
      rent: calculatedRent,
      status: 'Active',
      payment: 'Paid',
      initials: initials
    };

    const success = await onAddTenant(newTenant);
    if (success !== false) {
      alert(`Tenant ${newCompany} berhasil ditambahkan pada unit: ${jointUnits}`);
      setNewCompany('');
      setSelectedUnits([]);
      setNewLeaseStart('');
      setNewLeaseEnd('');
      setNewRent('');
    }
  };

  // Handle Assigning Access Card Submit
  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardTenantId || !cardNumber || !cardHolderName) return;

    const tenant = tenants.find(t => t.id === cardTenantId);
    const newCard = {
      id: 'CARD-' + Math.floor(1000 + Math.random() * 9000),
      cardNumber: cardNumber,
      tenantId: cardTenantId,
      company: tenant ? tenant.company : '',
      holderName: cardHolderName,
      jabatan: cardJabatan,
      pintu: cardPintu,
      status: 'Active',
      assignedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      accessLevel: cardAccessLevel
    };

    onAssignAccessCard(newCard);
    alert(`Kartu akses ${cardNumber} berhasil diberikan kepada ${cardHolderName}`);

    // Reset Form
    setCardNumber('');
    setCardHolderName('');
    setCardJabatan('');
    setCardPintu('B/G/3');
    setCardAccessLevel('Full Access');
  };

  // Switch to Tenant Registration and auto-select unit from map
  const handleAssignUnitFromMap = (space) => {
    setSelectedUnits([space.unit]);
    setNewRent(space.rent.toString());
    setActiveTab('tenants');
    // Pre-fill lease dates for convenience
    const today = new Date().toISOString().split('T')[0];
    const nextYearDate = new Date();
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    const nextYear = nextYearDate.toISOString().split('T')[0];
    setNewLeaseStart(today);
    setNewLeaseEnd(nextYear);
  };

  // Quick stats calculations
  const totalArea = spaces.reduce((acc, curr) => acc + curr.area, 0);
  const occupiedArea = spaces.filter(s => s.status === 'Occupied').reduce((acc, curr) => acc + curr.area, 0);
  const availableArea = totalArea - occupiedArea;
  const occupancyRate = totalArea > 0 ? Math.round((occupiedArea / totalArea) * 100) : 0;

  // Selected space detail finder
  const currentSelectedSpace = spaces.find(s => s.id === selectedSpaceId);
  const spaceTenant = currentSelectedSpace && currentSelectedSpace.tenantId
    ? tenants.find(t => t.id === currentSelectedSpace.tenantId)
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header and Path */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <nav className="flex mb-2 gap-2 text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">
            <span>{t('management')}</span>
            <span>/</span>
            <span className="text-primary font-bold">{t('settings')}</span>
          </nav>
          <h2 className="font-display text-display text-on-surface text-3xl font-extrabold">{t('settings')}</h2>
        </div>
        {(activeTab === 'tenants' || activeTab === 'spaces' || activeTab === 'cards') && (
          <ExportToolbar
            title={activeTab === 'tenants' ? 'Data Tenant Gedung' : activeTab === 'spaces' ? 'Data Ruang & Unit' : 'Data Kartu Akses'}
            subtitle={activeTab === 'tenants' ? 'Daftar tenant terdaftar - Graha Kaji' : activeTab === 'spaces' ? 'Inventaris unit dan ruang gedung' : 'Database kartu akses gedung'}
            filename={activeTab === 'tenants' ? 'data_tenant' : activeTab === 'spaces' ? 'data_ruang_unit' : 'data_kartu_akses'}
            data={activeTab === 'tenants' ? tenants : activeTab === 'spaces' ? spaces : accessCards}
            columns={activeTab === 'tenants' ? [
              { key: 'company', label: 'Perusahaan' },
              { key: 'unit', label: 'Unit' },
              { key: 'status', label: 'Status' },
              { key: 'leaseStart', label: 'Mulai Sewa' },
              { key: 'leaseEnd', label: 'Akhir Sewa' },
              { key: 'rent', label: 'Nilai Sewa', render: r => `Rp ${Number(r.rent||0).toLocaleString('id-ID')}` },
              { key: 'payment', label: 'Status Bayar' },
            ] : activeTab === 'spaces' ? [
              { key: 'unit', label: 'Unit' },
              { key: 'floor', label: 'Lantai' },
              { key: 'area', label: 'Luas (m²)' },
              { key: 'status', label: 'Status' },
              { key: 'rent', label: 'Harga Sewa', render: r => r.rent ? `Rp ${Number(r.rent).toLocaleString('id-ID')}` : '-' },
              { key: 'tenant', label: 'Penyewa' },
            ] : [
              { key: 'card_number', label: 'No. Kartu' },
              { key: 'holder_name', label: 'Nama Pemegang' },
              { key: 'jabatan', label: 'Jabatan' },
              { key: 'access_level', label: 'Level Akses' },
              { key: 'pintu', label: 'Pintu Akses' },
              { key: 'status', label: 'Status' },
              { key: 'assigned_date', label: 'Tgl Diterima' },
            ]}
            summaryCards={activeTab === 'tenants' ? [
              { label: 'Total Tenant', value: tenants.length },
              { label: 'Aktif', value: tenants.filter(t=>t.status==='Active').length },
            ] : activeTab === 'spaces' ? [
              { label: 'Total Unit', value: spaces.length },
              { label: 'Tersewa', value: spaces.filter(s=>s.status==='Occupied').length },
              { label: 'Tersedia', value: spaces.filter(s=>s.status==='Available').length },
            ] : [
              { label: 'Total Kartu', value: accessCards.length },
              { label: 'Aktif', value: accessCards.filter(c=>c.status==='Active').length },
              { label: 'Suspended', value: accessCards.filter(c=>c.status==='Suspended').length },
            ]}
          />
        )}
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-outline-variant gap-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'system' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2' 
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          {t('tab_system')}
        </button>
        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'tenants' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2' 
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <Users className="w-4 h-4" />
          {t('tab_tenants')}
        </button>
        <button
          onClick={() => setActiveTab('spaces')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'spaces' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2' 
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <Layers className="w-4 h-4" />
          {t('tab_spaces')}
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'cards' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2' 
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {t('tab_cards')}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'users' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2' 
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          {t('tab_users')}
        </button>
      </div>

      {/* View Switcher Container */}
      <div className="w-full">
        
        {/* ==================== TAB 1: SYSTEM SETTINGS ==================== */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-2xl border border-outline-variant p-6 max-w-xl mx-auto shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-6">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-primary">Pengaturan Sistem Gedung</h3>
            </div>

            <form onSubmit={handleSaveSystem} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-outline uppercase tracking-wider block">Nama Kompleks Gedung</label>
                <input 
                  type="text" 
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-outline uppercase tracking-wider block">Batas Suhu AC Koridor (Eco Mode)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="sso"
                  checked={allowSSO}
                  onChange={(e) => setAllowSSO(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
                />
                <label htmlFor="sso" className="text-on-surface select-none cursor-pointer">Izinkan Enterprise Single Sign-On (SSO)</label>
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end">
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#001c59] text-white font-bold rounded-lg shadow transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== TAB 2: TENANT MANAGEMENT ==================== */}
        {activeTab === 'tenants' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Left: Register Tenant Form */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <UserPlus className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('modal_title')}</h3>
              </div>

              <form onSubmit={handleTenantSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">{t('comp_name_lbl')}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: PT BlueTech Indonesia"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Pilih Unit (Bisa lebih dari 1)</label>
                  <div className="border border-outline-variant rounded-lg p-3 bg-surface-container-low max-h-48 overflow-y-auto space-y-2">
                    {availableSpaces.map(sp => {
                      const isChecked = selectedUnits.includes(sp.unit);
                      return (
                        <label key={sp.id} className="flex items-center gap-2.5 p-2 rounded hover:bg-surface-container-high cursor-pointer transition-colors">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedUnits(selectedUnits.filter(u => u !== sp.unit));
                              } else {
                                setSelectedUnits([...selectedUnits, sp.unit]);
                              }
                            }}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <div className="text-left">
                            <p className="text-xs font-bold text-on-surface">{sp.unit}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium">{sp.area} m² — Rp {sp.rent.toLocaleString('id-ID')}/thn</p>
                          </div>
                        </label>
                      );
                    })}
                    {availableSpaces.length === 0 && (
                      <p className="text-[11px] text-on-surface-variant italic py-2">Tidak ada space tersedia</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-outline uppercase tracking-wider block">{t('start_contract_lbl')}</label>
                    <input 
                      type="date" 
                      required
                      value={newLeaseStart}
                      onChange={(e) => setNewLeaseStart(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-outline uppercase tracking-wider block">{t('end_contract_lbl')}</label>
                    <input 
                      type="date" 
                      required
                      value={newLeaseEnd}
                      onChange={(e) => setNewLeaseEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">{t('annual_rent_lbl')}</label>
                  <input 
                    type="number" 
                    placeholder="Rp 0"
                    value={newRent}
                    onChange={(e) => setNewRent(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-outline-variant flex justify-end">
                  <button 
                    type="submit" 
                    disabled={selectedUnits.length === 0}
                    className="w-full bg-primary hover:bg-[#001c59] disabled:bg-outline-variant text-white font-bold py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> {t('simpan')}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Tenant List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface mb-4">Daftar Tenant Aktif</h3>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold">
                        <th className="px-4 py-3">Tenant / Perusahaan</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">Masa Sewa</th>
                        <th className="px-4 py-3 text-center">Kartu Akses</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
                      {tenants.map(t => {
                        const countCards = accessCards.filter(c => c.tenantId === t.id).length;
                        return (
                          <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-primary-container/10 flex items-center justify-center text-primary font-extrabold text-[10px] shrink-0">
                                  {t.initials || 'TN'}
                                </div>
                                <span className="font-bold text-on-surface text-xs">{t.company}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-primary font-bold">{t.unit}</td>
                            <td className="px-4 py-3 text-[11px] text-on-surface-variant font-medium">
                              {t.leaseStart} - {t.leaseEnd}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center bg-secondary-container text-primary font-bold w-6 h-6 rounded-full text-xs">
                                {countCards}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                type="button"
                                onClick={() => {
                                  if (confirm(`Apakah Anda yakin ingin menghapus tenant ${t.company}?`)) {
                                    onDeleteTenant(t.id);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                                title="Hapus Tenant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {tenants.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-outline">
                            Belum ada tenant terdaftar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SPACES & FLOOR MAPPING ==================== */}
        {activeTab === 'spaces' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Spaces Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-primary shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t('total_spaces')}</p>
                  <p className="text-lg font-extrabold text-on-surface">{spaces.length} Unit</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t('available_spaces')}</p>
                  <p className="text-lg font-extrabold text-green-700">{availableSpaces.length} Unit</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t('area_size_lbl')}</p>
                  <p className="text-xs font-bold text-on-surface leading-tight">
                    Tersedia: <span className="text-green-700 font-extrabold">{availableArea} m²</span><br/>
                    Terisi: <span className="text-primary font-extrabold">{occupiedArea} m²</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Occupancy Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-extrabold text-primary">{occupancyRate}%</p>
                    <div className="w-16 bg-surface-container-high h-2 rounded-full overflow-hidden shrink-0">
                      <div className="bg-primary h-full" style={{ width: `${occupancyRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Layout Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Floor Layout Mapping */}
              <div id="floor-map-section" className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">{t('floor_map_title')}</h3>
                    <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">Klik unit pada denah gedung untuk melihat detail & menyewa.</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-extrabold">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-400 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span> {t('available_status')}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full border border-slate-700 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-blue-500/50"></span> {t('occupied_status')}
                    </span>
                  </div>
                </div>

                {/* Building Vertical Grid representation */}
                <div className="space-y-4 border border-outline-variant/60 rounded-xl p-4 bg-surface-container-low max-h-[480px] overflow-y-auto custom-scrollbar">
                  {['Mezzanin', '3', '2', '1', 'GF'].map(floorCode => {
                    const floorSpaces = spaces.filter(s => s.floor === floorCode);
                    const floorLabel = floorCode === 'GF'
                      ? 'Lantai GF'
                      : floorCode === 'Mezzanin'
                      ? 'Mezzanin'
                      : `Lantai ${floorCode}`;
                    return (
                      <div key={floorCode} className="flex flex-col md:flex-row items-stretch border border-outline-variant bg-white rounded-xl overflow-hidden shadow-sm">
                        {/* Floor Label */}
                        <div className="w-full md:w-28 bg-primary-container/10 border-b md:border-b-0 md:border-r border-outline-variant flex items-center justify-center p-3 text-center shrink-0 font-extrabold text-xs text-primary">
                          {floorLabel}
                        </div>
                        {/* Units Grid */}
                        <div className="flex-1 p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                          {floorSpaces.map(sp => {
                            const isOccupied = sp.status === 'Occupied';
                            const matchTenant = isOccupied ? tenants.find(t => t.id === sp.tenantId) : null;
                            const isSelected = selectedSpaceId === sp.id;
                            return (
                              <button
                                key={sp.id}
                                id={`map-unit-${sp.id}`}
                                onClick={() => {
                                  setSelectedSpaceId(sp.id);
                                  setTimeout(() => {
                                    document.getElementById(`row-${sp.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }, 100);
                                }}
                                className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all relative select-none cursor-pointer outline-none focus:outline-none ${
                                  isSelected 
                                    ? 'ring-4 ring-primary/40 scale-[1.03] shadow-lg z-10' 
                                    : ''
                                } ${
                                  isOccupied 
                                    ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800 shadow-md' 
                                    : 'bg-emerald-50 border-emerald-500 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-600 shadow-sm'
                                }`}
                              >
                                <div>
                                  <div className="flex justify-between items-center font-black text-xs mb-1">
                                    <span className={isOccupied ? 'text-white' : 'text-emerald-950 font-black'}>
                                      {sp.unit.split(' - ')[1]}
                                    </span>
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                      isOccupied 
                                        ? 'bg-blue-400 ring-2 ring-blue-500/50' 
                                        : 'bg-emerald-500 ring-2 ring-emerald-300 animate-pulse'
                                    }`}></span>
                                  </div>
                                  <p className={`text-[10px] font-bold ${isOccupied ? 'text-slate-300' : 'text-emerald-800'}`}>
                                    {sp.wing}
                                  </p>
                                </div>
                                <div className={`mt-3 flex justify-between items-end border-t pt-2 text-[9px] font-bold ${
                                  isOccupied ? 'border-slate-700/80 text-slate-300' : 'border-emerald-200 text-emerald-900'
                                }`}>
                                  <span>{sp.area} m²</span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                    isOccupied 
                                      ? 'bg-blue-600 text-white shadow-xs' 
                                      : 'bg-emerald-600 text-white shadow-xs'
                                  }`}>
                                    {isOccupied ? (matchTenant ? matchTenant.initials : 'Terisi') : 'Tersedia'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                          {floorSpaces.length === 0 && (
                            <div className="col-span-3 py-4 text-center text-[10px] font-semibold text-on-surface-variant italic">
                              Tidak ada unit di lantai ini
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Space Detail Panel */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between h-full min-h-[380px]">
                {currentSelectedSpace ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-outline-variant pb-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-on-surface">{currentSelectedSpace.unit}</h4>
                        <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{currentSelectedSpace.wing}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        currentSelectedSpace.status === 'Available' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-blue-100 text-primary border-blue-200'
                      }`}>
                        {currentSelectedSpace.status === 'Available' ? t('available_status') : t('occupied_status')}
                      </span>
                    </div>

                    <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
                      <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{t('area_size_lbl')}</span>
                        <span className="font-bold text-on-surface text-right">{currentSelectedSpace.area} m²</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{t('rent_price')}</span>
                        <span className="font-bold text-on-surface text-right">
                          Rp {currentSelectedSpace.rent.toLocaleString('id-ID')}/thn
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{t('floor')}</span>
                        <span className="font-bold text-on-surface text-right">Lantai {currentSelectedSpace.floor}</span>
                      </div>

                      {currentSelectedSpace.status === 'Occupied' ? (
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary-container/30 space-y-3 mt-4 text-[11px]">
                          <p className="font-bold text-primary flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Penyewa Aktif
                          </p>
                          {spaceTenant ? (
                            <div className="space-y-2">
                              <div>
                                <p className="text-[9px] uppercase font-bold text-outline">Perusahaan</p>
                                <p className="font-bold text-on-surface">{spaceTenant.company}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-[9px] uppercase font-bold text-outline">Mulai Kontrak</p>
                                  <p className="font-semibold text-on-surface">{spaceTenant.leaseStart}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] uppercase font-bold text-outline">Akhir Kontrak</p>
                                  <p className="font-semibold text-on-surface">{spaceTenant.leaseEnd}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="italic text-on-surface-variant font-medium">Data detail tenant tidak ditemukan.</p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20 text-[11px] mt-4">
                          <p className="font-bold text-green-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ruangan Siap Huni
                          </p>
                          <p className="text-on-surface-variant leading-relaxed mt-1 font-semibold">
                            Unit ini tidak sedang disewa dan berada dalam kondisi siap untuk disewakan kepada penyewa baru.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAssignUnitFromMap(currentSelectedSpace)}
                            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> {t('assign_tenant')}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-outline-variant/30 mt-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSpaceModal(currentSelectedSpace)}
                        className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold py-2 rounded-lg border border-outline-variant transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus space ${currentSelectedSpace.unit}?`)) {
                            const success = onDeleteSpace(currentSelectedSpace.id);
                            if (success) {
                              setSelectedSpaceId(null);
                            }
                          }
                        }}
                        className="px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2 rounded-lg border border-rose-200 transition-colors flex items-center justify-center cursor-pointer text-xs"
                        title="Hapus Space"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 flex-1">
                    <MapPin className="w-8 h-8 text-outline mb-2" />
                    <p className="text-xs font-bold text-on-surface-variant">Pilih unit ruangan pada peta untuk melihat detail spesifik.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Spaces Table List */}
            <div id="inventory-table-section" className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Daftar Inventaris Ruangan</h3>
                  <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">Klik baris untuk menyorot unit di peta lantai di atas ↑</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddSpaceModal()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#001c59] text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Space Baru
                </button>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold">
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Lantai</th>
                      <th className="px-4 py-3">Sektor/Wing</th>
                      <th className="px-4 py-3">Luas Space</th>
                      <th className="px-4 py-3">Nilai Sewa / Thn</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Tenant Aktif</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
                    {spaces.map(sp => {
                      const matchT = sp.tenantId ? tenants.find(t => t.id === sp.tenantId) : null;
                      const isRowSelected = selectedSpaceId === sp.id;
                      return (
                        <tr 
                          id={`row-${sp.id}`}
                          key={sp.id} 
                          onClick={() => {
                            setSelectedSpaceId(sp.id);
                            document.getElementById('floor-map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`transition-colors cursor-pointer ${
                            isRowSelected 
                              ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' 
                              : 'hover:bg-surface-container-low'
                          }`}
                        >
                          <td className={`px-4 py-3 font-bold flex items-center gap-2 ${ isRowSelected ? 'text-primary' : 'text-primary' }`}>
                            {isRowSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0"></span>}
                            {sp.unit}</td>
                          <td className="px-4 py-3">Lantai {sp.floor}</td>
                          <td className="px-4 py-3 text-on-surface-variant font-medium">{sp.wing}</td>
                          <td className="px-4 py-3 font-bold">{sp.area} m²</td>
                          <td className="px-4 py-3">Rp {sp.rent.toLocaleString('id-ID')}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                              sp.status === 'Available' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-blue-50 text-primary border-primary-container/20'
                            }`}>
                              {sp.status === 'Available' ? t('available_status') : t('occupied_status')}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-on-surface">
                            {matchT ? matchT.company : '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSpaceModal(sp)}
                                className="p-1.5 text-primary hover:bg-primary/5 rounded border border-transparent hover:border-primary/10 transition-colors cursor-pointer"
                                title="Edit Space"
                              >
                               <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Apakah Anda yakin ingin menghapus space ${sp.unit}?`)) {
                                    onDeleteSpace(sp.id);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                                title="Hapus Space"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: ACCESS CARDS ==================== */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Left: Assign Card Form */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <CreditCard className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('card_assignment_title')}</h3>
              </div>

              <form onSubmit={handleCardSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">{t('select_tenant')}</label>
                  <select 
                    required
                    value={cardTenantId}
                    onChange={(e) => setCardTenantId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium text-on-surface"
                  >
                    <option value="">-- Pilih Tenant / Perusahaan --</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.company} ({t.unit})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">{t('holder_name')}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Petrus Bernadus"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Jabatan / Posisi</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Direktur Utama, HRD, Staff"
                    value={cardJabatan}
                    onChange={(e) => setCardJabatan(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">{t('card_number')}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: 12561"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-outline uppercase tracking-wider block">Pintu Akses</label>
                    <select 
                      value={cardPintu}
                      onChange={(e) => setCardPintu(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium text-on-surface"
                    >
                      <option value="B/G/3">B/G/3</option>
                      <option value="B/G">B/G</option>
                      <option value="B/G/3/R. Pak Petrus">B/G/3/R. Pak Petrus</option>
                      <option value="Full Access">Full Access</option>
                      <option value="B">B (Basement)</option>
                      <option value="G">G (Ground)</option>
                      <option value="Lantai 3">Lantai 3</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-outline uppercase tracking-wider block">{t('access_level')}</label>
                    <select 
                      required
                      value={cardAccessLevel}
                      onChange={(e) => setCardAccessLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium text-on-surface"
                    >
                      <option value="Full Access">Full Access</option>
                      <option value="B/G/3">B/G/3</option>
                      <option value="B/G">B/G</option>
                      <option value="VIP">VIP Access</option>
                      <option value="Server Room">Server Room</option>
                      <option value="MEP Area">MEP Area</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant flex justify-end">
                  <button 
                    type="submit" 
                    disabled={tenants.length === 0}
                    className="w-full bg-primary hover:bg-[#001c59] disabled:bg-outline-variant text-white font-bold py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> {t('assign_card_btn')}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Active Cards Directory */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header Row with Export Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h3 className="text-base font-bold text-on-surface">{t('active_cards_title')}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportCardExcel}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Export Data Kartu Akses ke Excel / CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCardPDF}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#001c59] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Cetak / Save PDF Report Kartu Akses"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak / PDF
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
                  {/* Search Input */}
                  <div className="relative md:col-span-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      type="text"
                      placeholder="Cari ID, No. Kartu, Nama..."
                      value={cardSearchTerm}
                      onChange={(e) => setCardSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={cardStatusFilter}
                      onChange={(e) => setCardStatusFilter(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-bold text-on-surface outline-none cursor-pointer"
                    >
                      <option value="All">Semua Status ({accessCards.length})</option>
                      <option value="Active">Status: Aktif</option>
                      <option value="Suspended">Status: Ditangguhkan</option>
                    </select>
                  </div>

                  {/* Level Access Filter */}
                  <div>
                    <select
                      value={cardLevelFilter}
                      onChange={(e) => setCardLevelFilter(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-bold text-on-surface outline-none cursor-pointer"
                    >
                      <option value="All">Semua Level Akses</option>
                      <option value="Full Access">Full Access</option>
                      <option value="B/G/3">B/G/3</option>
                      <option value="B/G">B/G</option>
                      <option value="VIP">VIP Access</option>
                      <option value="Server Room">Server Room</option>
                      <option value="MEP Area">MEP Area</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold">
                        <th className="px-3 py-3">{t('card_number_col')}</th>
                        <th className="px-3 py-3">Perusahaan</th>
                        <th className="px-3 py-3">{t('holder_col')}</th>
                        <th className="px-3 py-3">Jabatan</th>
                        <th className="px-3 py-3">Pintu</th>
                        <th className="px-3 py-3">{t('access_level_col')}</th>
                        <th className="px-3 py-3">{t('card_status_col')}</th>
                        <th className="px-3 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
                      {filteredAccessCards.map((c, idx) => {
                        const cardTenant = tenants.find(t => t.id === c.tenantId);
                        const isSuspended = c.status === 'Suspended';
                        const companyName = c.company || (cardTenant ? cardTenant.company : '—');
                        return (
                          <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-3 py-2.5 font-bold font-mono text-primary text-[11px]">{c.cardNumber}</td>
                            <td className="px-3 py-2.5 font-extrabold truncate max-w-[120px] text-[10px]">{companyName}</td>
                            <td className="px-3 py-2.5 font-bold text-on-surface text-[11px]">{c.holderName}</td>
                            <td className="px-3 py-2.5 text-on-surface-variant text-[10px]">{c.jabatan || '—'}</td>
                            <td className="px-3 py-2.5 text-[10px]">
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold border border-primary/20">
                                {c.pintu || c.accessLevel}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-[10px]">
                              <span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant font-bold border border-outline-variant/60">
                                {c.accessLevel}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                                isSuspended 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`}>
                                {isSuspended ? t('card_status_suspended') : t('card_status_active')}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <div className="flex gap-2 justify-end">
                                <button 
                                  type="button"
                                  onClick={() => onToggleCardStatus(c.id)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                    isSuspended
                                      ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  {isSuspended ? t('card_action_activate') : t('card_action_suspend')}
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Apakah Anda yakin ingin mencabut kartu akses ${c.cardNumber} milik ${c.holderName}?`)) {
                                      onRevokeCard(c.id);
                                    }
                                  }}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                                  title={t('card_action_revoke')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredAccessCards.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center py-8 text-outline">
                            Tidak ada kartu akses yang sesuai dengan pencarian/filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: USER MANAGEMENT ==================== */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Left: Register/Edit User Form */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <UserCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {editingUser ? 'Perbarui User' : 'Tambah User Baru'}
                </h3>
              </div>

              <form onSubmit={handleUserSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Budi Santoso"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Work Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@company.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Password</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Minimal 6 karakter"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Role / Jabatan</label>
                  <select 
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-medium text-on-surface"
                  >
                    <option value="role_property_manager">{t('role_property_manager')}</option>
                    <option value="role_building_manager">{t('role_building_manager')}</option>
                    <option value="role_technician">{t('role_technician')}</option>
                    <option value="role_security">{t('role_security')}</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-outline-variant flex justify-end gap-2">
                  {editingUser && (
                    <button 
                      type="button" 
                      onClick={handleCancelEditUser}
                      className="px-4 py-2 border border-outline-variant text-on-surface hover:bg-surface-container-high font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-[#001c59] text-white font-bold py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {editingUser ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Users List Directory */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface mb-4">Daftar Pengguna Sistem</h3>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold">
                        <th className="px-4 py-3 text-left">Nama</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
                      {users.map(u => {
                        const isSelf = currentUser && currentUser.id === u.id;
                        return (
                          <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-primary-container/10 flex items-center justify-center text-primary font-extrabold text-[10px] shrink-0">
                                  {u.initials || 'US'}
                                </div>
                                <div>
                                  <span className="font-bold text-on-surface text-xs">{u.name}</span>
                                  {isSelf && <span className="ml-1.5 px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-extrabold rounded">Anda</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-[10px] text-on-surface-variant">{u.email}</td>
                            <td className="px-4 py-3 font-medium">
                              <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-bold border border-outline-variant/60">
                                {t(u.role)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button 
                                  type="button"
                                  onClick={() => handleStartEditUser(u)}
                                  className="p-1.5 text-primary hover:bg-primary/5 rounded border border-transparent hover:border-primary/10 transition-colors cursor-pointer"
                                  title="Edit User"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  type="button"
                                  disabled={isSelf}
                                  onClick={() => {
                                    if (confirm(`Apakah Anda yakin ingin menghapus user ${u.name}?`)) {
                                      onDeleteUser(u.id);
                                    }
                                  }}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent rounded border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                                  title={isSelf ? 'Anda tidak dapat menghapus akun Anda sendiri' : 'Hapus User'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add/Edit Space Modal */}
      {isSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant transform transition-all animate-in zoom-in-95 duration-300 text-left">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary text-base font-bold">
                  {editingSpace ? 'Edit Detail Space' : 'Tambah Space Baru'}
                </h3>
                <p className="text-body-md text-on-surface-variant text-[11px] font-semibold mt-0.5">
                  {editingSpace ? 'Perbarui informasi detail ruangan/unit.' : 'Masukkan detail spesifikasi ruangan/unit baru.'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsSpaceModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors outline-none focus:outline-none"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  close
                </span>
              </button>
            </div>
            
            <form onSubmit={handleSpaceFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs font-bold text-on-surface-variant">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Floor */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider">Lantai (Floor)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: 02, 12, Penthouse"
                    value={spaceFloor}
                    onChange={(e) => setSpaceFloor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>

                {/* Unit Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider">Nama / No. Unit</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Unit A1, Suite Y"
                    value={spaceUnitName}
                    onChange={(e) => setSpaceUnitName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>
              </div>

              {/* Sektor / Wing */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider">Sektor / Wing</label>
                <select 
                  value={selectedWingOption}
                  onChange={(e) => {
                    setSelectedWingOption(e.target.value);
                    if (e.target.value !== 'Custom') {
                      setSpaceWing(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                >
                  <option value="East Wing">East Wing</option>
                  <option value="West Wing">West Wing</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Basement">Basement</option>
                  <option value="Custom">Lainnya (Tulis Kustom)</option>
                </select>
              </div>

              {/* Custom Sektor Input */}
              {selectedWingOption === 'Custom' && (
                <div className="space-y-1 animate-in slide-in-from-top-1 duration-200">
                  <label className="block text-[10px] uppercase tracking-wider text-primary">Tulis Sektor / Wing Kustom</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: North Wing, Zona MEP"
                    value={customWing}
                    onChange={(e) => {
                      setCustomWing(e.target.value);
                      setSpaceWing(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>
              )}

              {/* Area size */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider">Luas Area (m²)</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  placeholder="Contoh: 120"
                  value={spaceArea}
                  onChange={(e) => setSpaceArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                />
              </div>

              {/* Annual Rent Rate */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider">Nilai Sewa per Tahun (Rp)</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  placeholder="Contoh: 150000000"
                  value={spaceRent}
                  onChange={(e) => setSpaceRent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                />
              </div>

              {/* Readonly Status (if editing) */}
              {editingSpace && (
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-outline">Status Ruangan (Dikelola Sistem)</label>
                  <div className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant font-medium select-none">
                    {editingSpace.status === 'Available' ? 'Tersedia (Available)' : 'Terisi (Occupied)'}
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-4 border-t border-outline-variant flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setIsSpaceModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant text-on-surface hover:bg-surface-container-high font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-primary hover:bg-[#001c59] text-white font-bold rounded-lg shadow transition-colors cursor-pointer"
                >
                  Simpan Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
