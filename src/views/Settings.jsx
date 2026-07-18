import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Info } from 'lucide-react';

export default function Settings() {
  const [bName, setBName] = useState('Gedung Sudirman Tower');
  const [tempLimit, setTempLimit] = useState(24.5);
  const [allowSSO, setAllowSSO] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Pengaturan disimpan!');
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-6 max-w-xl mx-auto text-left shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold text-primary">Pengaturan Sistem Gedung</h3>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
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
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#001c59] text-white font-bold rounded-lg shadow transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
