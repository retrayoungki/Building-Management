import React, { useState } from 'react';
import {
  Banknote,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Zap,
  Droplet,
  Shield,
  FileText,
  DollarSign,
  TrendingUp,
  Percent
} from 'lucide-react';

export default function Expenses({ expenseData, onAddExpense, onDeleteExpense }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Token Listrik Unit');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [scope, setScope] = useState('Public Area');
  const [description, setDescription] = useState('');

  // Predefined or custom category helper
  const expenseCategories = [
    'Token Listrik Unit',
    'Listrik Public Area',
    'Tagihan Air PDAM',
    'Gaji Kebersihan & Security',
    'Pemeliharaan Lift & Genset',
    'Lainnya'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const finalCategory = category === 'Lainnya' && customCategory ? customCategory : category;

    const newExpense = {
      id: 'EXP-' + Math.floor(1000 + Math.random() * 9000),
      title,
      category: finalCategory,
      amount: parseFloat(amount),
      date,
      scope,
      description
    };

    onAddExpense(newExpense);

    // Reset Form
    setTitle('');
    setAmount('');
    setDescription('');
    setCustomCategory('');
    setShowAddModal(false);
  };

  const filteredExpenses = selectedCategoryFilter === 'All'
    ? expenseData
    : expenseData.filter(exp => exp.category === selectedCategoryFilter);

  // Stats Calculations
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const publicAreaTotal = filteredExpenses.filter(e => e.scope === 'Public Area').reduce((sum, e) => sum + e.amount, 0);
  const privateAreaTotal = filteredExpenses.filter(e => e.scope === 'Tenant Unit').reduce((sum, e) => sum + e.amount, 0);

  // Group by category for visual breakdown
  const categoryBreakdown = filteredExpenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Biaya & Utilitas Gedung</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Catat, kelola, dan visualisasikan pengeluaran operasional Graha Kaji.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Catat Pengeluaran Baru
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center text-primary shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Biaya Operasional</p>
            <p className="text-lg font-extrabold text-on-surface">Rp {totalExpenses.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Area Publik / Umum</p>
            <p className="text-lg font-extrabold text-amber-700">Rp {publicAreaTotal.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Dibebankan ke Tenant</p>
            <p className="text-lg font-extrabold text-emerald-700">Rp {privateAreaTotal.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Bento Grid: Table and Chart mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Table & Filter */}
        <div className="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Daftar Transaksi Pengeluaran</h3>
            
            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="All">Semua Kategori</option>
              {Array.from(new Set(expenseData.map(e => e.category))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Judul Pengeluaran</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Lingkup</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Jumlah</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-semibold text-on-surface">
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-primary font-bold">{exp.id}</td>
                    <td className="px-4 py-3.5 font-bold">{exp.title}</td>
                    <td className="px-4 py-3.5 text-on-surface-variant">{exp.category}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                        exp.scope === 'Public Area'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {exp.scope}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant font-medium">{exp.date}</td>
                    <td className="px-4 py-3.5 text-right font-bold">Rp {exp.amount.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-colors"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant italic font-medium">
                      Belum ada data pengeluaran terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Distribution chart mockup */}
        <div className="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" /> Visualisasi Pengeluaran
          </h3>

          {/* Simple custom graph bar mapping */}
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([catName, val]) => {
              const percentage = totalExpenses > 0 ? (val / totalExpenses) * 100 : 0;
              return (
                <div key={catName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface truncate max-w-[180px]">{catName}</span>
                    <span className="text-primary">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium">Rp {val.toLocaleString('id-ID')}</p>
                </div>
              );
            })}
            {Object.keys(categoryBreakdown).length === 0 && (
              <p className="text-xs text-on-surface-variant italic text-center py-8">Belum ada grafik untuk ditampilkan.</p>
            )}
          </div>
        </div>

      </div>

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Catat Biaya Operasional</h3>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Judul Pengeluaran *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pembelian Token Listrik Lift Lobby"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Kategori *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-semibold"
                  >
                    {expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Lingkup Lokasi *</label>
                  <select
                    value={scope}
                    onChange={e => setScope(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-semibold"
                  >
                    <option value="Public Area">Area Publik / Umum</option>
                    <option value="Tenant Unit">Unit Tenant</option>
                  </select>
                </div>
              </div>

              {category === 'Lainnya' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Kategori Kustom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama kategori baru"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Nominal Biaya (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Keterangan Tambahan</label>
                <textarea
                  placeholder="Opsional..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary resize-none font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:brightness-110 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/10 transition-all"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
