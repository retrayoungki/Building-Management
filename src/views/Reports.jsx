import React from 'react';
import { FileDown, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';

export default function Reports() {
  const reportsList = [
    { title: 'Laporan Hunian & Okupansi', desc: 'Analisis tingkat keterisian gedung bulanan dan histori sewa.', date: 'Periode: Juni 2026' },
    { title: 'Laporan Keuangan & Penagihan', desc: 'Rekap invoice bulanan, penunggak sewa, dan collection rate.', date: 'Periode: Juni 2026' },
    { title: 'Laporan Efisiensi Energi', desc: 'Konsumsi listrik AC Chiller, penerangan umum, dan penghematan Eco Mode.', date: 'Periode: Juni 2026' },
    { title: 'Laporan Preventive Maintenance', desc: 'Histori genset test, lift inspection, dan realisasi WO internal.', date: 'Periode: Juni 2026' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {reportsList.map((r, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <BarChart3 className="w-5 h-5 text-outline" />
                <span>{r.title}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">{r.desc}</p>
              <p className="text-[10px] text-outline font-semibold">{r.date}</p>
            </div>
            
            <button className="p-2 bg-blue-50 text-primary hover:bg-primary hover:text-white rounded-xl border border-blue-200 transition-all shrink-0">
              <FileDown className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
