import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  FileText,
  Building,
  Users,
  Search,
  Filter,
  Eye,
  Check,
  Zap,
  Droplet,
  Shield,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Finance({
  tenants = [],
  expenses = [],
  invoices = [],
  onAddInvoice,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
  onAddExpense,
  onDeleteExpense
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('invoicing'); // 'invoicing', 'costing', 'cashflow'
  
  // Filter states
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');

  // Modal states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState(null);

  // New Invoice Form state
  const [invTenantId, setInvTenantId] = useState('');
  const [invPeriod, setInvPeriod] = useState(new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }));
  const [invBaseRent, setInvBaseRent] = useState('');
  const [invServiceCharge, setInvServiceCharge] = useState('');
  const [invUtilities, setInvUtilities] = useState('');
  const [invDueDate, setInvDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [invNote, setInvNote] = useState('');

  // New Expense Form state
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('Token Listrik Unit');
  const [expCustomCategory, setExpCustomCategory] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expScope, setExpScope] = useState('Public Area');
  const [expDescription, setExpDescription] = useState('');

  // Predefined expense categories
  const expenseCategories = [
    'Token Listrik Unit',
    'Listrik Public Area',
    'Tagihan Air PDAM',
    'Gaji Kebersihan & Security',
    'Pemeliharaan Lift & Genset',
    'Lainnya'
  ];

  // Populate default base rent when tenant is selected in invoice modal
  const handleTenantSelect = (tenantId) => {
    setInvTenantId(tenantId);
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      const monthlyRent = Math.round(tenant.rent / 12);
      setInvBaseRent(monthlyRent.toString());
      setInvServiceCharge(Math.round(monthlyRent * 0.1).toString()); // Default 10% service charge
      setInvUtilities('1500000'); // Default utility estimate
    }
  };

  // Submit new invoice
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!invTenantId || !invBaseRent) {
      alert('Mohon pilih tenant dan tentukan jumlah sewa!');
      return;
    }

    const tenant = tenants.find(t => t.id === invTenantId);
    const baseRentNum = parseFloat(invBaseRent) || 0;
    const serviceChargeNum = parseFloat(invServiceCharge) || 0;
    const utilitiesNum = parseFloat(invUtilities) || 0;
    const totalAmount = baseRentNum + serviceChargeNum + utilitiesNum;

    const newInv = {
      id: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      tenantId: invTenantId,
      company: tenant ? tenant.company : 'Unknown Tenant',
      unit: tenant ? tenant.unit : '-',
      period: invPeriod,
      baseRent: baseRentNum,
      serviceCharge: serviceChargeNum,
      utilities: utilitiesNum,
      totalAmount: totalAmount,
      dueDate: invDueDate,
      status: 'Unpaid',
      createdDate: new Date().toISOString().split('T')[0],
      note: invNote
    };

    onAddInvoice(newInv);
    alert(`Invoice ${newInv.id} berhasil dibuat untuk ${newInv.company}`);

    // Reset Form
    setInvTenantId('');
    setInvBaseRent('');
    setInvServiceCharge('');
    setInvUtilities('');
    setInvNote('');
    setShowInvoiceModal(false);
  };

  // Submit new expense (costing)
  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    const finalCategory = expCategory === 'Lainnya' && expCustomCategory ? expCustomCategory : expCategory;

    const newExpense = {
      id: 'EXP-' + Math.floor(1000 + Math.random() * 9000),
      title: expTitle,
      category: finalCategory,
      amount: parseFloat(expAmount),
      date: expDate,
      scope: expScope,
      description: expDescription
    };

    onAddExpense(newExpense);
    alert(`Pengeluaran ${expTitle} berhasil dicatat.`);

    // Reset Form
    setExpTitle('');
    setExpAmount('');
    setExpDescription('');
    setExpCustomCategory('');
    setShowExpenseModal(false);
  };

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
    const searchLower = invoiceSearch.toLowerCase();
    const matchesSearch = inv.company.toLowerCase().includes(searchLower) ||
                          inv.unit.toLowerCase().includes(searchLower) ||
                          inv.id.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  // Filtered Expenses
  const filteredExpenses = expenseCategoryFilter === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === expenseCategoryFilter);

  // Financial Calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalUnpaid = invoices.filter(inv => inv.status === 'Unpaid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalCosting = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const publicAreaCosting = expenses.filter(e => e.scope === 'Public Area').reduce((sum, e) => sum + e.amount, 0);
  const tenantAreaCosting = expenses.filter(e => e.scope === 'Tenant Unit').reduce((sum, e) => sum + e.amount, 0);

  const netOperatingIncome = totalPaid - totalCosting;
  const collectionRatePercentage = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header and Breadcrumb */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <nav className="flex mb-2 gap-2 text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">
            <span>Manajemen</span>
            <span>/</span>
            <span className="text-primary font-bold">Keuangan & Finance</span>
          </nav>
          <h2 className="font-display text-display text-on-surface text-3xl font-extrabold">Manajemen Keuangan</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Kelola seluruh ekosistem keuangan gedung: penagihan sewa, invoice tenant, costing operasional, dan laporan laba bersih.
          </p>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Penagihan */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Total Penagihan Sewa</p>
            <p className="text-xl font-extrabold text-on-surface mt-1">
              Rp {totalInvoiced.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {collectionRatePercentage}% Terkumpul
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Pembayaran Terbayar */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Pembayaran Diterima (Paid)</p>
            <p className="text-xl font-extrabold text-green-700 mt-1">
              Rp {totalPaid.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">
              {invoices.filter(i => i.status === 'Paid').length} Invoice Lunas
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Costing Operasional */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Costing / Pengeluaran</p>
            <p className="text-xl font-extrabold text-rose-600 mt-1">
              Rp {totalCosting.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">
              {expenses.length} Catatan Operasional
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Net Operating Income */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Net Operating Income (NOI)</p>
            <p className={`text-xl font-extrabold mt-1 ${netOperatingIncome >= 0 ? 'text-primary' : 'text-rose-600'}`}>
              Rp {netOperatingIncome.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">
              Pendapatan Net Operasional
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-outline-variant gap-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('invoicing')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'invoicing'
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2'
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Penagihan Sewa & Invoice ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('costing')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'costing'
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2'
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Costing & Pengeluaran Operasional ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer outline-none focus:outline-none ${
            activeTab === 'cashflow'
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg border-b-2'
              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Ringkasan Arus Kas & Laba Operasional
        </button>
      </div>

      {/* ================= TAB 1: PENAGIHAN SEWA & INVOICE ================= */}
      {activeTab === 'invoicing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Bar & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search Box */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Cari ID Invoice, Tenant, atau Unit..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant">
                {['All', 'Paid', 'Unpaid', 'Overdue'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInvoiceStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      invoiceStatusFilter === st
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {st === 'All' ? 'Semua' : st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[#001c59] transition-colors shadow cursor-pointer justify-center"
            >
              <Plus className="w-4 h-4" /> Buat Invoice Baru
            </button>
          </div>

          {/* Invoice Data Table */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold text-left">
                    <th className="px-6 py-4">NO. INVOICE</th>
                    <th className="px-6 py-4">TENANT & UNIT</th>
                    <th className="px-6 py-4">PERIODE</th>
                    <th className="px-6 py-4">RINCIAN BIAYA</th>
                    <th className="px-6 py-4">TOTAL TAGIHAN</th>
                    <th className="px-6 py-4">JATUH TEMPO</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-extrabold text-primary font-mono">
                        {inv.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-xs">{inv.company}</span>
                          <span className="text-[10px] text-primary font-bold mt-0.5">{inv.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">
                        {inv.period}
                      </td>
                      <td className="px-6 py-4 text-[11px]">
                        <div className="space-y-0.5 text-on-surface-variant">
                          <p>Sewa: <span className="font-semibold text-on-surface">Rp {(inv.baseRent || 0).toLocaleString('id-ID')}</span></p>
                          <p>Service Charge: <span className="font-semibold text-on-surface">Rp {(inv.serviceCharge || 0).toLocaleString('id-ID')}</span></p>
                          {(inv.utilities || 0) > 0 && (
                            <p>Utilitas: <span className="font-semibold text-on-surface">Rp {(inv.utilities || 0).toLocaleString('id-ID')}</span></p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-on-surface text-sm">
                        Rp {inv.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">
                        {inv.dueDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold gap-1.5 ${
                          inv.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : inv.status === 'Overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === 'Paid' ? 'bg-green-600' : inv.status === 'Overdue' ? 'bg-red-600' : 'bg-amber-600'
                          }`}></span>
                          {inv.status === 'Paid' ? 'Lunas (Paid)' : inv.status === 'Overdue' ? 'Jatuh Tempo (Overdue)' : 'Belum Bayar (Unpaid)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')}
                              className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Tandai Lunas"
                            >
                              Tandai Lunas
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoicePreview(inv)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors cursor-pointer"
                            title="Pratinjau / Cetak Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus invoice ${inv.id}?`)) {
                                onDeleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-outline">
                        Belum ada data invoice tagihan. Klik "Buat Invoice Baru" untuk menerbitkan penagihan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: COSTING & OPERASIONAL ================= */}
      {activeTab === 'costing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Action & Breakdown */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Filter Kategori:</span>
              <select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-bold text-on-surface outline-none"
              >
                <option value="All">Semua Kategori ({expenses.length})</option>
                {expenseCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowExpenseModal(true)}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[#001c59] transition-colors shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Catat Costing Operasional
            </button>
          </div>

          {/* Costing Area Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Costing Public Area (Gedung)</p>
                <p className="text-xl font-extrabold text-on-surface mt-1">
                  Rp {publicAreaCosting.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                  Biaya operasional umum & fasilitas publik
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary shrink-0">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Costing Tenant Unit</p>
                <p className="text-xl font-extrabold text-on-surface mt-1">
                  Rp {tenantAreaCosting.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                  Biaya yang dialokasikan ke unit tenant
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Costing Table */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold text-left">
                    <th className="px-6 py-4">ID COSTING</th>
                    <th className="px-6 py-4">DESKRIPSI PENGELUARAN</th>
                    <th className="px-6 py-4">KATEGORI</th>
                    <th className="px-6 py-4">LINGKUP AREA</th>
                    <th className="px-6 py-4">TANGGAL</th>
                    <th className="px-6 py-4">JUMLAH (BIAYA)</th>
                    <th className="px-6 py-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-bold text-primary font-mono">{exp.id}</td>
                      <td className="px-6 py-4 font-bold text-on-surface">{exp.title}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-surface-container-high text-on-surface">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          exp.scope === 'Public Area' ? 'bg-blue-100 text-primary' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {exp.scope}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">{exp.date}</td>
                      <td className="px-6 py-4 font-extrabold text-rose-600 text-sm">
                        Rp {exp.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus pengeluaran ${exp.title}?`)) {
                              onDeleteExpense(exp.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Hapus Costing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-outline">
                        Belum ada pencatatan costing pengeluaran operasional.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RINGKASAN ARUS KAS & P&L ================= */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm space-y-6">
            <h3 className="text-base font-bold text-primary">Laporan Arus Kas & Laba Operasional Gedung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant">
                <p className="text-[11px] font-bold uppercase text-on-surface-variant">TOTAL PENDAPATAN (INFLOW)</p>
                <p className="text-2xl font-extrabold text-green-700 mt-2">Rp {totalPaid.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-1">Pembayaran sewa & service charge diterima</p>
              </div>

              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant">
                <p className="text-[11px] font-bold uppercase text-on-surface-variant">TOTAL BIAYA OPERASIONAL (OUTFLOW)</p>
                <p className="text-2xl font-extrabold text-rose-600 mt-2">Rp {totalCosting.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-1">Pengeluaran listrik, PDAM, gaji & perawatan</p>
              </div>

              <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                <p className="text-[11px] font-bold uppercase text-primary">LABA OPERASIONAL NET (NOI)</p>
                <p className={`text-2xl font-extrabold mt-2 ${netOperatingIncome >= 0 ? 'text-primary' : 'text-rose-600'}`}>
                  Rp {netOperatingIncome.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-on-surface-variant font-semibold mt-1">Keuntungan operasional bersih gedung</p>
              </div>
            </div>

            {/* Visual Margin Bar */}
            <div className="space-y-2 pt-4 border-t border-outline-variant">
              <div className="flex justify-between text-xs font-bold">
                <span>Margin Operasional</span>
                <span>{totalPaid > 0 ? Math.round((netOperatingIncome / totalPaid) * 100) : 0}% Margin</span>
              </div>
              <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden flex">
                <div 
                  className="bg-green-600 h-full transition-all" 
                  style={{ width: `${totalPaid > 0 ? Math.min(100, Math.max(0, (netOperatingIncome / totalPaid) * 100)) : 0}%` }}
                ></div>
                <div 
                  className="bg-rose-500 h-full transition-all" 
                  style={{ width: `${totalPaid > 0 ? Math.min(100, Math.max(0, (totalCosting / totalPaid) * 100)) : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant pt-1">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600"></span> Laba Bersih</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Costing Operasional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: BUAT INVOICE BARU ================= */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Buat Invoice Tagihan Baru
              </h3>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-outline uppercase tracking-wider block">Pilih Tenant / Perusahaan</label>
                <select
                  required
                  value={invTenantId}
                  onChange={(e) => handleTenantSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                >
                  <option value="">-- Pilih Tenant --</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.company} ({t.unit})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-outline uppercase tracking-wider block">Periode Tagihan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Agustus 2026"
                  value={invPeriod}
                  onChange={(e) => setInvPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Sewa Dasar (Rp)</label>
                  <input 
                    type="number" 
                    required
                    value={invBaseRent}
                    onChange={(e) => setInvBaseRent(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Service Charge (Rp)</label>
                  <input 
                    type="number" 
                    value={invServiceCharge}
                    onChange={(e) => setInvServiceCharge(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Air & Utilitas (Rp)</label>
                  <input 
                    type="number" 
                    value={invUtilities}
                    onChange={(e) => setInvUtilities(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Tanggal Jatuh Tempo</label>
                  <input 
                    type="date" 
                    required
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-[#001c59] transition-colors"
                >
                  Terbitan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CATAT COSTING OPERASIONAL ================= */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Catat Costing Operasional Baru
              </h3>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-outline uppercase tracking-wider block">Deskripsi Pengeluaran</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Pembayaran Token Listrik Lobby Lt. 1"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Kategori</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  >
                    {expenseCategories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Lingkup Area</label>
                  <select
                    value={expScope}
                    onChange={(e) => setExpScope(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  >
                    <option value="Public Area">Public Area (Gedung)</option>
                    <option value="Tenant Unit">Tenant Unit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Jumlah Biaya (Rp)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-outline uppercase tracking-wider block">Tanggal Pengeluaran</label>
                  <input 
                    type="date" 
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg hover:bg-[#001c59] transition-colors"
                >
                  Simpan Costing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: PRATINJAU INVOICE ================= */}
      {selectedInvoicePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant text-left p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-outline-variant pb-6">
              <div>
                <h3 className="font-extrabold text-2xl text-primary">GRAHA KAJI</h3>
                <p className="text-xs text-on-surface-variant font-semibold">Building Management System</p>
                <p className="text-[11px] text-on-surface-variant mt-1">Jl. KH. Hasyim Ashari No. 12, Jakarta Pusat</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-primary font-mono">{selectedInvoicePreview.id}</span>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">Tanggal: {selectedInvoicePreview.createdDate}</p>
                <p className="text-xs text-rose-600 font-bold">Jatuh Tempo: {selectedInvoicePreview.dueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-surface-container-low p-4 rounded-xl text-xs font-semibold">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">DITAGIHKAN KEPADA:</p>
                <p className="font-bold text-on-surface text-sm mt-1">{selectedInvoicePreview.company}</p>
                <p className="text-primary font-bold">{selectedInvoicePreview.unit}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">PERIODE PENAGIHAN:</p>
                <p className="font-bold text-on-surface text-sm mt-1">{selectedInvoicePreview.period}</p>
                <p className="text-on-surface-variant">Status: <span className="font-bold text-primary">{selectedInvoicePreview.status}</span></p>
              </div>
            </div>

            <table className="w-full text-xs font-semibold">
              <thead>
                <tr className="border-b border-outline-variant text-[10px] uppercase text-on-surface-variant font-bold text-left">
                  <th className="py-2">DESKRIPSI BIAYA</th>
                  <th className="py-2 text-right">JUMLAH (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr>
                  <td className="py-2.5 font-bold">Sewa Dasar Ruangan ({selectedInvoicePreview.unit})</td>
                  <td className="py-2.5 text-right font-mono">Rp {(selectedInvoicePreview.baseRent || 0).toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Service Charge & Maintenance Facility</td>
                  <td className="py-2.5 text-right font-mono">Rp {(selectedInvoicePreview.serviceCharge || 0).toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Tagihan Pemakaian Listrik & Air Utilitas</td>
                  <td className="py-2.5 text-right font-mono">Rp {(selectedInvoicePreview.utilities || 0).toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-primary text-sm font-extrabold text-primary">
                  <td className="py-3">TOTAL HARUS DIBAYAR</td>
                  <td className="py-3 text-right font-mono">Rp {selectedInvoicePreview.totalAmount.toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-xs font-bold text-on-surface transition-colors cursor-pointer"
              >
                Tutup Pratinjau
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#001c59] transition-colors cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" /> Cetak Invoice / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
