import React, { useState, useMemo } from 'react';
import {
  Share2, Plus, SlidersHorizontal, RefreshCw, Save,
  ZoomOut, ZoomIn, ChevronLeft, ChevronRight,
  Download, Send, QrCode, CheckCircle2, Banknote,
  Settings2, AlertTriangle, Building2, TrendingUp,
  TrendingDown, BarChart3, PieChart, Zap, Droplet,
  Shield, FileText, Users
} from 'lucide-react';

const months = [
  'Januari 2024', 'Februari 2024', 'Maret 2024', 'April 2024',
  'Mei 2024', 'Juni 2024', 'Juli 2024', 'Agustus 2024',
  'September 2024', 'Oktober 2024', 'November 2024', 'Desember 2024',
];

const categories = [
  {
    id: 'finance',
    label: 'Keuangan (Finance)',
    desc: 'Pemasukan, pengeluaran & tagihan.',
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    id: 'maintenance',
    label: 'Pemeliharaan (Maintenance)',
    desc: 'Log perbaikan & jadwal servis.',
    icon: <Settings2 className="w-5 h-5" />,
  },
  {
    id: 'incident',
    label: 'Insiden (Incident)',
    desc: 'Laporan keamanan & kejadian darurat.',
    icon: <AlertTriangle className="w-5 h-5" />,
  },
];

const incomeData = [
  { desc: 'Sewa Unit Kantor - Lantai 1', cat: 'Sewa Rutin',    amount: 150000000 },
  { desc: 'Sewa Unit Kantor - Lantai 2', cat: 'Sewa Rutin',    amount: 120000000 },
  { desc: 'Sewa Lantai 3 (Full Floor)',  cat: 'Sewa Rutin',    amount: 180000000 },
  { desc: 'Ruang Direksi - Mezzanin',   cat: 'Sewa Rutin',    amount: 250000000 },
  { desc: 'Service Charge – Tenant',    cat: 'Operasional',   amount: 180000000 },
  { desc: 'Sewa Parkir Bulanan',        cat: 'Fasilitas',     amount: 75000000  },
  { desc: 'Penyewaan Ruang Rapat',      cat: 'Fasilitas',     amount: 30000000  },
];

const CATEGORY_COLORS = [
  '#4f6bed', '#22c55e', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
];

const CATEGORY_ICONS = {
  'Token Listrik Unit': <Zap className="w-3.5 h-3.5" />,
  'Listrik Public Area': <Zap className="w-3.5 h-3.5" />,
  'Tagihan Air PDAM': <Droplet className="w-3.5 h-3.5" />,
  'Gaji Kebersihan & Security': <Shield className="w-3.5 h-3.5" />,
  'Pemeliharaan Lift & Genset': <Settings2 className="w-3.5 h-3.5" />,
};

function formatRp(num) {
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)} M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

function formatRpFull(num) {
  return `Rp ${num.toLocaleString('id-ID')}`;
}

// SVG Donut Chart component
function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-xs text-center text-on-surface-variant">Tidak ada data</div>;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const innerR = size * 0.22;
  let startAngle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(startAngle + angle);
    const y2 = cy + r * Math.sin(startAngle + angle);
    const xi1 = cx + innerR * Math.cos(startAngle);
    const yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(startAngle + angle);
    const yi2 = cy + innerR * Math.sin(startAngle + angle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      'Z'
    ].join(' ');

    startAngle += angle;
    return { path, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length], label: d.label };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1a1b21">Total</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="#44464f">{formatRp(total)}</text>
    </svg>
  );
}

// Bar Chart component (horizontal bars)
function HorizontalBarChart({ data, maxVal }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {data.map((d, i) => {
        const pct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="w-28 text-right text-[9px] font-semibold text-on-surface-variant shrink-0 truncate" title={d.label}>
              {d.label}
            </div>
            <div className="flex-1 bg-surface-container-high rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
              >
                <span className="text-[8px] text-white font-bold">{pct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="w-20 text-[9px] font-bold text-on-surface shrink-0 text-right">
              {formatRp(d.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Monthly trend mini-bars (simulate last 6 months trend)
function TrendBars({ baseValue, color = '#4f6bed' }) {
  const vals = [0.72, 0.85, 0.91, 0.78, 0.95, 1.0].map(f => Math.round(baseValue * f));
  const max = Math.max(...vals);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {vals.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: i === vals.length - 1 ? color : `${color}60`,
          }}
        />
      ))}
    </div>
  );
}

export default function Reports({ currentUser, expenses = [] }) {
  const [selectedMonth, setSelectedMonth] = useState('Maret 2024');
  const [selectedCat, setSelectedCat] = useState('finance');
  const [zoom, setZoom]   = useState(100);
  const [page, setPage]   = useState(1);
  const totalPages = 3;

  // ── Computed Expense Stats ──
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalIncome   = useMemo(() => incomeData.reduce((s, d) => s + d.amount, 0), []);
  const netIncome     = totalIncome - totalExpenses;

  // Group expenses by category
  const expenseByCategory = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Group by scope
  const publicAreaTotal  = expenses.filter(e => e.scope === 'Public Area').reduce((s, e) => s + e.amount, 0);
  const tenantUnitTotal  = expenses.filter(e => e.scope === 'Tenant Unit').reduce((s, e) => s + e.amount, 0);

  const maxCatVal = expenseByCategory.length > 0 ? expenseByCategory[0].value : 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-primary leading-tight">Laporan Bulanan</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Kelola dan tinjau performa operasional properti Anda.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline text-secondary text-xs font-bold rounded-lg hover:bg-surface-container transition-all active:scale-95 shadow-sm">
            <Share2 className="w-4 h-4" /> Bagikan
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-md">
            <Plus className="w-4 h-4" /> Laporan Baru
          </button>
        </div>
      </div>

      {/* ── Quick Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Pendapatan',
            value: formatRp(totalIncome),
            sub: 'Bulan ini',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
          },
          {
            label: 'Total Pengeluaran',
            value: formatRp(totalExpenses),
            sub: `${expenses.length} item biaya`,
            icon: <TrendingDown className="w-5 h-5" />,
            color: 'text-red-500',
            bg: 'bg-red-50',
            border: 'border-red-200',
          },
          {
            label: 'Net Income',
            value: formatRp(netIncome),
            sub: netIncome >= 0 ? 'Surplus' : 'Defisit',
            icon: <Banknote className="w-5 h-5" />,
            color: netIncome >= 0 ? 'text-primary' : 'text-error',
            bg: netIncome >= 0 ? 'bg-primary/5' : 'bg-error/5',
            border: netIncome >= 0 ? 'border-primary/20' : 'border-error/20',
          },
          {
            label: 'Kategori Biaya',
            value: expenseByCategory.length,
            sub: 'Jenis pengeluaran',
            icon: <PieChart className="w-5 h-5" />,
            color: 'text-secondary',
            bg: 'bg-secondary/5',
            border: 'border-secondary/20',
          },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${s.bg} ${s.border} shadow-sm`}>
            <div className={`p-2 rounded-lg bg-white shadow-sm ${s.color}`}>{s.icon}</div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{s.label}</p>
              <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-on-surface-variant">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">

        {/* ===== LEFT PANEL ===== */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Filter Card */}
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-on-surface mb-5 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Filter Laporan
            </h3>

            <div className="flex flex-col gap-5">
              {/* Month Picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Pilih Bulan</label>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer font-medium"
                  >
                    {months.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-lg">expand_more</span>
                </div>
              </div>

              {/* Category Radio */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Kategori Laporan</label>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <label
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id)}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors group ${
                        selectedCat === cat.id
                          ? 'bg-primary/5 border-primary'
                          : 'border-outline-variant hover:bg-primary/5'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selectedCat === cat.id ? 'border-primary bg-primary' : 'border-outline-variant'
                      }`}>
                        {selectedCat === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-on-surface">{cat.label}</p>
                        <p className="text-[10px] text-on-surface-variant">{cat.desc}</p>
                      </div>
                      <span className={`transition-colors ${selectedCat === cat.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                        {cat.icon}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <button className="w-full py-3 bg-primary text-white text-xs font-bold rounded-lg shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Pratinjau Laporan
                </button>
                <button className="w-full py-3 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Draft
                </button>
              </div>
            </div>
          </div>

          {/* Expense Breakdown Card */}
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Breakdown Pengeluaran
            </h3>
            {expenseByCategory.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-4">Belum ada data biaya.</p>
            ) : (
              <>
                {/* Donut Chart */}
                <div className="flex justify-center mb-4">
                  <DonutChart data={expenseByCategory} size={150} />
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-2">
                  {expenseByCategory.map((d, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                        />
                        <span className="text-[10px] font-semibold text-on-surface-variant truncate">{d.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-on-surface shrink-0">{formatRp(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Card */}
          <div className="bg-primary text-white rounded-xl p-6 shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[11px] font-bold opacity-75 mb-1 uppercase tracking-wider">Status Laporan Terakhir</p>
              <p className="text-xl font-extrabold mb-4">Siap Dikirim</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block shrink-0" />
                <span className="text-[11px] font-semibold">Semua data valid & terverifikasi.</span>
              </div>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-[11px] italic opacity-90">
                  "Laporan ini mencakup seluruh transaksi tenant dan biaya utilitas selama {selectedMonth}."
                </p>
              </div>
            </div>
            <CheckCircle2 className="absolute -bottom-3 -right-3 w-28 h-28 opacity-10 rotate-12 pointer-events-none" />
          </div>
        </div>

        {/* ===== RIGHT: PDF Preview ===== */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-container-high border border-outline-variant rounded-xl overflow-hidden shadow-inner flex flex-col min-h-[820px]">

            {/* PDF Toolbar */}
            <div className="bg-white px-4 py-2.5 border-b border-outline-variant flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-3">
                {/* Zoom */}
                <div className="flex items-center gap-1">
                  <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-on-surface w-12 text-center">{zoom}%</span>
                  <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-5 w-px bg-outline-variant" />
                {/* Pagination */}
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-on-surface w-20 text-center">Hal {page} dari {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Page tabs */}
                <div className="hidden md:flex gap-1 ml-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                        page === i + 1
                          ? 'bg-primary text-white'
                          : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-outline text-secondary text-xs font-bold rounded-md hover:bg-surface-container transition-all active:scale-95 shadow-sm">
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:brightness-110 transition-all active:scale-95 shadow-sm">
                  <Send className="w-3.5 h-3.5" /> Kirim ke Owner
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div
              className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col items-center gap-8 bg-surface-container-high"
              style={{ maxHeight: '780px' }}
            >

              {/* ───── PAGE 1: Executive Summary & Income ───── */}
              {page === 1 && (
                <div
                  className="w-full max-w-[680px] bg-white shadow-2xl flex flex-col relative"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                    padding: '48px',
                    minHeight: '960px',
                  }}
                >
                  <div className="absolute inset-0 border-8 border-primary/5 pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex items-center gap-3">
                      <img src="/logo-graha-kaji.png" alt="Graha Kaji" className="w-14 h-14 object-contain" />
                      <div>
                        <h4 className="text-base font-extrabold text-primary leading-tight">Graha Kaji</h4>
                        <p className="text-[10px] text-on-surface-variant tracking-widest uppercase font-semibold">Building Management</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h5 className="text-xs font-extrabold text-on-surface uppercase tracking-wider">Laporan Keuangan</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Periode: 1–31 {selectedMonth}</p>
                      <p className="text-[11px] text-on-surface-variant">ID: RPT-{selectedMonth.replace(' ', '').replace(' ', '-')}-001</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-primary/20 mb-8" />

                  {/* Executive Summary */}
                  <div className="mb-8 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Ringkasan Eksekutif
                    </h6>
                    <p className="text-xs text-on-surface leading-relaxed">
                      Laporan ini menyajikan ringkasan kinerja keuangan Graha Kaji selama periode {selectedMonth}.
                      Secara keseluruhan, pendapatan operasional menunjukkan pertumbuhan sebesar 4,2% dibandingkan bulan
                      sebelumnya, didorong oleh tingkat hunian yang stabil di seluruh lantai. Total biaya operasional
                      tetap terkendali sesuai dengan anggaran awal tahun.
                    </p>
                  </div>

                  {/* KPI Cards — dynamic */}
                  <div className="grid grid-cols-3 gap-3 mb-8 relative z-10 text-left">
                    <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Total Pendapatan</p>
                      <p className="text-base font-extrabold text-green-600">{formatRp(totalIncome)}</p>
                      <div className="mt-2"><TrendBars baseValue={totalIncome} color="#22c55e" /></div>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Total Pengeluaran</p>
                      <p className="text-base font-extrabold text-error">{formatRp(totalExpenses)}</p>
                      <div className="mt-2"><TrendBars baseValue={totalExpenses} color="#ef4444" /></div>
                    </div>
                    <div className="bg-primary p-4 rounded-lg shadow-md">
                      <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider mb-1">Net Income</p>
                      <p className="text-base font-extrabold text-white">{formatRp(netIncome)}</p>
                      <div className="mt-2"><TrendBars baseValue={Math.abs(netIncome)} color="rgba(255,255,255,0.8)" /></div>
                    </div>
                  </div>

                  {/* Income Table */}
                  <div className="mb-8 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Rincian Pendapatan
                    </h6>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface-container-highest">
                          <th className="p-2.5 border border-outline-variant font-bold text-on-surface">Deskripsi</th>
                          <th className="p-2.5 border border-outline-variant font-bold text-on-surface">Kategori</th>
                          <th className="p-2.5 border border-outline-variant font-bold text-on-surface text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomeData.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/40'}>
                            <td className="p-2.5 border border-outline-variant text-on-surface">{row.desc}</td>
                            <td className="p-2.5 border border-outline-variant text-on-surface-variant">{row.cat}</td>
                            <td className="p-2.5 border border-outline-variant font-bold text-right">{formatRpFull(row.amount)}</td>
                          </tr>
                        ))}
                        <tr className="bg-primary/10 font-extrabold">
                          <td className="p-2.5 border border-primary/20 text-primary" colSpan={2}>Total Pendapatan</td>
                          <td className="p-2.5 border border-primary/20 text-primary text-right">{formatRpFull(totalIncome)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Occupancy Info */}
                  <div className="mb-8 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Tingkat Hunian
                    </h6>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { floor: 'Lantai GF',       unit: 'Ruang Kerja GF',      status: 'Terisi',   tenant: 'Sinar Retailindo' },
                        { floor: 'Lantai 1 – 1A',   unit: '120 m²',              status: 'Terisi',   tenant: 'BlueTech Indonesia' },
                        { floor: 'Lantai 1 – 1B',   unit: '110 m²',              status: 'Tersedia', tenant: '-' },
                        { floor: 'Lantai 1 – 1C',   unit: '105 m²',              status: 'Tersedia', tenant: '-' },
                        { floor: 'Lantai 2 – 2A',   unit: '120 m²',              status: 'Terisi',   tenant: 'Creative Flow Studio' },
                        { floor: 'Lantai 3',        unit: '350 m² (Full Floor)', status: 'Terisi',   tenant: 'Global Koneksi Mandiri' },
                        { floor: 'Mezzanin – Dir.1', unit: '80 m²',             status: 'Terisi',   tenant: 'Mega Astra Ventura' },
                        { floor: 'Mezzanin – Dir.2', unit: '75 m²',             status: 'Tersedia', tenant: '-' },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-surface-container-low rounded-lg border border-outline-variant">
                          <div>
                            <p className="text-[10px] font-extrabold text-on-surface">{row.floor}</p>
                            <p className="text-[9px] text-on-surface-variant">{row.unit} — {row.tenant}</p>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                            row.status === 'Terisi'
                              ? 'bg-blue-50 text-primary border-blue-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {row.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer / Signature */}
                  <div className="mt-auto pt-8 border-t border-outline-variant flex justify-between items-end relative z-10 text-left">
                    <div>
                      <p className="text-[10px] text-on-surface-variant mb-10">Disiapkan Oleh,</p>
                      <p className="text-xs font-extrabold text-on-surface">{currentUser?.name || 'Admin Property'}</p>
                      <p className="text-[10px] text-on-surface-variant">Graha Kaji Building Management</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-surface-container-low border border-outline-variant p-2 rounded-lg inline-block mb-1">
                        <QrCode className="w-10 h-10 text-on-surface-variant" />
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Verifikasi Digital</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ───── PAGE 2: Expense Charts & Analysis ───── */}
              {page === 2 && (
                <div
                  className="w-full max-w-[680px] bg-white shadow-2xl flex flex-col relative"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                    padding: '48px',
                    minHeight: '960px',
                  }}
                >
                  <div className="absolute inset-0 border-8 border-primary/5 pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                      <img src="/logo-graha-kaji.png" alt="Graha Kaji" className="w-10 h-10 object-contain" />
                      <div>
                        <h4 className="text-sm font-extrabold text-primary">Graha Kaji</h4>
                        <p className="text-[9px] text-on-surface-variant tracking-widest uppercase">Building Management</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h5 className="text-xs font-extrabold text-on-surface uppercase tracking-wider">Halaman 2 — Analisis Biaya</h5>
                      <p className="text-[10px] text-on-surface-variant">Periode: {selectedMonth}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-primary/20 mb-6" />

                  {/* Charts row */}
                  <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">

                    {/* Donut chart */}
                    <div className="text-left">
                      <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                        Komposisi Biaya
                      </h6>
                      <div className="flex flex-col items-center gap-4">
                        <DonutChart data={expenseByCategory} size={160} />
                        <div className="w-full flex flex-col gap-1.5">
                          {expenseByCategory.map((d, i) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                                <span className="text-[9px] text-on-surface-variant">{d.label}</span>
                              </div>
                              <span className="text-[9px] font-bold text-on-surface">
                                {totalExpenses > 0 ? ((d.value / totalExpenses) * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          ))}
                          {expenseByCategory.length === 0 && (
                            <p className="text-[10px] text-on-surface-variant italic">Tidak ada data pengeluaran.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Scope breakdown */}
                    <div className="text-left">
                      <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                        Scope Biaya
                      </h6>

                      {/* Public vs Tenant */}
                      <div className="flex flex-col gap-3 mb-4">
                        {[
                          { label: 'Public Area', value: publicAreaTotal, color: '#4f6bed' },
                          { label: 'Tenant Unit', value: tenantUnitTotal, color: '#f59e0b' },
                        ].map((s, i) => {
                          const pct = totalExpenses > 0 ? (s.value / totalExpenses) * 100 : 0;
                          return (
                            <div key={i}>
                              <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.label}</span>
                                <span className="text-[10px] font-bold text-on-surface">{formatRp(s.value)}</span>
                              </div>
                              <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: s.color }}
                                />
                              </div>
                              <p className="text-[9px] text-on-surface-variant mt-0.5">{pct.toFixed(1)}% dari total biaya</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Summary boxes */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-[9px] text-primary font-bold uppercase tracking-wide">Total Biaya</p>
                          <p className="text-sm font-extrabold text-primary">{formatRp(totalExpenses)}</p>
                          <p className="text-[8px] text-on-surface-variant">{expenses.length} transaksi</p>
                        </div>
                        <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-[9px] text-green-700 font-bold uppercase tracking-wide">Margin Bersih</p>
                          <p className="text-sm font-extrabold text-green-600">
                            {totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}%
                          </p>
                          <p className="text-[8px] text-on-surface-variant">dari pendapatan</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal bar chart — expense by category */}
                  <div className="mb-6 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-4 text-on-surface uppercase tracking-widest">
                      Perbandingan Biaya per Kategori
                    </h6>
                    {expenseByCategory.length === 0 ? (
                      <p className="text-xs text-on-surface-variant italic">Tidak ada data pengeluaran untuk ditampilkan.</p>
                    ) : (
                      <HorizontalBarChart data={expenseByCategory} maxVal={maxCatVal} />
                    )}
                  </div>

                  {/* Expense detail table */}
                  <div className="relative z-10 text-left flex-1">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Rincian Pengeluaran
                    </h6>
                    {expenses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
                        <BarChart3 className="w-10 h-10 opacity-30 mb-2" />
                        <p className="text-xs">Belum ada data pengeluaran.</p>
                        <p className="text-[10px] opacity-60 mt-1">Tambahkan biaya di menu "Biaya Gedung".</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-surface-container-highest">
                            <th className="p-2 border border-outline-variant font-bold text-on-surface">Keterangan</th>
                            <th className="p-2 border border-outline-variant font-bold text-on-surface">Kategori</th>
                            <th className="p-2 border border-outline-variant font-bold text-on-surface">Scope</th>
                            <th className="p-2 border border-outline-variant font-bold text-on-surface text-right">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map((exp, i) => (
                            <tr key={exp.id} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/40'}>
                              <td className="p-2 border border-outline-variant text-on-surface">{exp.title}</td>
                              <td className="p-2 border border-outline-variant text-on-surface-variant">{exp.category}</td>
                              <td className="p-2 border border-outline-variant">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  exp.scope === 'Public Area'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-amber-50 text-amber-700'
                                }`}>{exp.scope}</span>
                              </td>
                              <td className="p-2 border border-outline-variant font-bold text-right text-error">{formatRpFull(exp.amount)}</td>
                            </tr>
                          ))}
                          <tr className="bg-error/10 font-extrabold">
                            <td className="p-2 border border-error/20 text-error" colSpan={3}>Total Pengeluaran</td>
                            <td className="p-2 border border-error/20 text-error text-right">{formatRpFull(totalExpenses)}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-6 border-t border-outline-variant flex justify-between items-end relative z-10">
                    <p className="text-[9px] text-on-surface-variant">Data diambil dari modul Biaya Gedung • {selectedMonth}</p>
                    <p className="text-[9px] text-on-surface-variant">Halaman 2 / {totalPages}</p>
                  </div>
                </div>
              )}

              {/* ───── PAGE 3: Operational Summary ───── */}
              {page === 3 && (
                <div
                  className="w-full max-w-[680px] bg-white shadow-2xl flex flex-col relative"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                    padding: '48px',
                    minHeight: '960px',
                  }}
                >
                  <div className="absolute inset-0 border-8 border-primary/5 pointer-events-none" />

                  {/* Header */}
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                      <img src="/logo-graha-kaji.png" alt="Graha Kaji" className="w-10 h-10 object-contain" />
                      <div>
                        <h4 className="text-sm font-extrabold text-primary">Graha Kaji</h4>
                        <p className="text-[9px] text-on-surface-variant tracking-widest uppercase">Building Management</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h5 className="text-xs font-extrabold text-on-surface uppercase tracking-wider">Halaman 3 — Operasional</h5>
                      <p className="text-[10px] text-on-surface-variant">Periode: {selectedMonth}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-primary/20 mb-6" />

                  {/* KPIs */}
                  <div className="mb-6 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Indikator Operasional
                    </h6>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Tingkat Hunian', value: '75%', sub: '6 dari 9 unit', icon: <Building2 className="w-4 h-4" />, color: 'text-primary bg-primary/5' },
                        { label: 'Tiket Selesai', value: '82%', sub: 'Resolusi bulan ini', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-600 bg-green-50' },
                        { label: 'Kepuasan Tenant', value: '4.7/5', sub: 'Rata-rata rating', icon: <Users className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50' },
                      ].map((kpi, i) => (
                        <div key={i} className={`p-3 rounded-lg border border-outline-variant flex flex-col gap-2 ${kpi.color.split(' ')[1]}`}>
                          <div className={`${kpi.color.split(' ')[0]}`}>{kpi.icon}</div>
                          <div>
                            <p className="text-[10px] text-on-surface-variant font-semibold">{kpi.label}</p>
                            <p className={`text-base font-extrabold ${kpi.color.split(' ')[0]}`}>{kpi.value}</p>
                            <p className="text-[9px] text-on-surface-variant">{kpi.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Maintenance Summary */}
                  <div className="mb-6 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Ringkasan Pemeliharaan
                    </h6>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Baru', count: 2, color: 'bg-blue-100 text-blue-700' },
                        { label: 'Proses', count: 1, color: 'bg-amber-100 text-amber-700' },
                        { label: 'Menunggu Sparepart', count: 1, color: 'bg-purple-100 text-purple-700' },
                        { label: 'Selesai', count: 1, color: 'bg-green-100 text-green-700' },
                      ].map((s, i) => (
                        <div key={i} className={`p-2.5 rounded-lg text-center ${s.color}`}>
                          <p className="text-xl font-extrabold">{s.count}</p>
                          <p className="text-[9px] font-semibold">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Catatan / Notes */}
                  <div className="mb-6 relative z-10 text-left">
                    <h6 className="text-[11px] font-extrabold border-b-2 border-primary w-fit pr-6 pb-1 mb-3 text-on-surface uppercase tracking-widest">
                      Catatan & Rekomendasi
                    </h6>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { type: 'info', text: 'Kontrak sewa Creative Flow Studio akan berakhir bulan depan. Perlu negosiasi perpanjangan segera.' },
                        { type: 'warning', text: 'Biaya token listrik unit meningkat 12% dari bulan sebelumnya. Rekomendasikan audit konsumsi energi.' },
                        { type: 'success', text: 'Tingkat resolusi tiket pemeliharaan di atas target 80%. Kinerja tim teknis memuaskan.' },
                      ].map((note, i) => (
                        <div key={i} className={`p-3 rounded-lg border-l-4 text-xs leading-relaxed ${
                          note.type === 'info' ? 'bg-blue-50 border-primary text-on-surface' :
                          note.type === 'warning' ? 'bg-amber-50 border-amber-400 text-on-surface' :
                          'bg-green-50 border-green-400 text-on-surface'
                        }`}>
                          {note.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer / Signature */}
                  <div className="mt-auto pt-8 border-t border-outline-variant flex justify-between items-end relative z-10 text-left">
                    <div>
                      <p className="text-[10px] text-on-surface-variant mb-10">Disiapkan Oleh,</p>
                      <p className="text-xs font-extrabold text-on-surface">{currentUser?.name || 'Admin Property'}</p>
                      <p className="text-[10px] text-on-surface-variant">Graha Kaji Building Management</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-surface-container-low border border-outline-variant p-2 rounded-lg inline-block mb-1">
                        <QrCode className="w-10 h-10 text-on-surface-variant" />
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Verifikasi Digital</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant opacity-60 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-sm">info</span>
          <p className="text-[10px] font-semibold text-on-surface-variant">
            Data pengeluaran tersinkronisasi langsung dari modul Biaya Gedung • Sistem diperbarui otomatis
          </p>
        </div>
      </div>
    </div>
  );
}
