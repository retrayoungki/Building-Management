import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Trash2, Plus, Filter, Download, ChevronLeft, ChevronRight, X, UploadCloud } from 'lucide-react';
import TenantDetail from './TenantDetail';
import { useLanguage } from '../context/LanguageContext';

export default function TenantManagement({ tenants, onAddTenant, onDeleteTenant, searchTerm }) {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Form State
  const [newCompany, setNewCompany] = useState('');
  const [newUnit, setNewUnit] = useState('Fl. 12 - Unit A1');
  const [newLeaseStart, setNewLeaseStart] = useState('');
  const [newLeaseEnd, setNewLeaseEnd] = useState('');
  const [newRent, setNewRent] = useState('');

  const unitOptions = ['Fl. 12 - Unit A1', 'Fl. 08 - Unit C4', 'Fl. 15 - Unit B2', 'Fl. 20 - Suite X', 'Fl. 02 - Unit 05'];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCompany || !newUnit || !newLeaseStart || !newLeaseEnd) return;

    const words = newCompany.split(' ');
    const initials = words.length > 1 
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : newCompany.slice(0, 2).toUpperCase();

    const newTenant = {
      id: 'TNT-' + Math.floor(1000 + Math.random() * 9000),
      company: newCompany,
      unit: newUnit,
      leaseStart: newLeaseStart,
      leaseEnd: newLeaseEnd,
      dueDate: new Date(newLeaseEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      rent: parseInt(newRent) || 150000000,
      status: 'Active',
      payment: 'Paid',
      initials: initials
    };

    onAddTenant(newTenant);

    setNewCompany('');
    setNewUnit('Fl. 12 - Unit A1');
    setNewLeaseStart('');
    setNewLeaseEnd('');
    setNewRent('');
    setShowAddModal(false);
  };

  const filteredTenants = tenants.filter(t => {
    return t.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
           t.unit.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate statistics (base values matching the screenshot, offset by active array changes)
  const baseTotal = 148;
  const baseActive = 132;
  const baseEnding = 12;
  const baseLate = 4;

  const currentTotal = baseTotal + (tenants.length - 5);
  const currentActive = baseActive + (tenants.filter(t => t.status === 'Active').length - 3);
  const currentEnding = baseEnding + (tenants.filter(t => t.status === 'Ending Soon' || t.status === 'Terminating').length - 1);
  const currentLate = baseLate + (tenants.filter(t => t.payment === 'Late' || t.payment === 'Unpaid').length - 1);

  if (selectedTenant) {
    return <TenantDetail tenant={selectedTenant} onBack={() => setSelectedTenant(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Path & Title */}
      <div className="flex justify-between items-end mb-8 text-left">
        <div>
          <nav className="flex mb-2 gap-2 text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">
            <span>{t('management')}</span>
            <span>/</span>
            <span className="text-primary font-bold">{t('tenants')}</span>
          </nav>
          <h2 className="font-display text-display text-on-surface text-3xl font-extrabold">{t('tenant_list_title')}</h2>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-body-md flex items-center gap-2 hover:bg-primary-container hover:shadow-lg transition-all shadow-md active:scale-95 text-white font-bold text-xs shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">
            add
          </span>
          {t('add_tenant_btn')}
        </button>
      </div>

      {/* Filters & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {/* Total Tenant */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              groups
            </span>
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">{t('total_tenant')}</p>
            <p className="text-2xl font-extrabold text-on-surface leading-tight mt-0.5">{currentTotal}</p>
          </div>
        </div>

        {/* Kontrak Aktif */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">{t('active_contracts')}</p>
            <p className="text-2xl font-extrabold text-on-surface leading-tight mt-0.5">{currentActive}</p>
          </div>
        </div>

        {/* Akan Berakhir */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              history
            </span>
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">{t('ending_soon')}</p>
            <p className="text-2xl font-extrabold text-on-surface leading-tight mt-0.5">{currentEnding}</p>
          </div>
        </div>

        {/* Terlambat Bayar */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              cancel
            </span>
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface-variant text-[11px] font-semibold">{t('late_payment')}</p>
            <p className="text-2xl font-extrabold text-on-surface leading-tight mt-0.5">{currentLate}</p>
          </div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden text-left">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-outline-variant flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-lg font-bold">{t('inventory_title')}</h3>
            <span className="bg-secondary-container text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {t('updated_time')}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm" data-icon="filter_list">
                filter_list
              </span>
              {t('filter')}
            </button>
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm" data-icon="download">
                download
              </span>
              {t('export')}
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant border-b border-outline-variant text-[11px] uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">{t('unit_col')}</th>
                <th className="px-6 py-4">{t('tenant_name_col')}</th>
                <th className="px-6 py-4">{t('contract_status_col')}</th>
                <th className="px-6 py-4">{t('rent_due_col')}</th>
                <th className="px-6 py-4">{t('payment_status_col')}</th>
                <th className="px-6 py-4 text-right">{t('action_col')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-body-md text-xs font-medium">
              {filteredTenants.map((tenant) => {
                const isRentLate = tenant.payment === 'Late' || tenant.payment === 'Unpaid';
                return (
                  <tr 
                    key={tenant.id} 
                    className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                    onClick={() => setSelectedTenant(tenant)}
                  >
                    {/* Unit */}
                    <td className="px-6 py-4 font-bold text-primary">
                      {tenant.unit}
                    </td>
                    {/* Tenant Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {tenant.initials || 'TN'}
                        </div>
                        <span className="font-bold text-on-surface">{tenant.company}</span>
                      </div>
                    </td>
                    {/* Contract Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold gap-1 ${
                        tenant.status === 'Active' ? 'bg-green-100 text-green-700' :
                        tenant.status === 'Ending Soon' || tenant.status === 'Terminating' ? 'bg-amber-100 text-amber-700' :
                        'bg-surface-variant text-on-surface-variant'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tenant.status === 'Active' ? 'bg-green-700' :
                          tenant.status === 'Ending Soon' || tenant.status === 'Terminating' ? 'bg-amber-700' :
                          'bg-on-surface-variant'
                        }`}></span>
                        {tenant.status === 'Active' ? 'Active' : tenant.status === 'Ending Soon' || tenant.status === 'Terminating' ? 'Ending Soon' : 'Expired'}
                      </span>
                    </td>
                    {/* Due Date */}
                    <td className={`px-6 py-4 ${isRentLate ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                      {tenant.dueDate}
                    </td>
                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tenant.payment === 'Paid' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tenant.payment}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTenant(tenant.id);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full border border-transparent hover:border-rose-200 transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus Kontrak"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2 hover:bg-surface-container-high rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="more_vert">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-outline">
                    {t('no_data')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex items-center justify-between font-semibold text-xs text-on-surface-variant">
          <p className="text-label-md">
            {t('showing_txt')} 1 {t('to_txt')} {filteredTenants.length} {t('of_txt')} {filteredTenants.length} {t('tenants_txt')}
          </p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors text-xs">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors text-xs">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tambah Tenant Baru Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant transform transition-all animate-in zoom-in-95 duration-300 text-left">
            <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary text-lg font-bold">{t('modal_title')}</h3>
                <p className="text-body-md text-on-surface-variant text-xs font-semibold mt-1">{t('modal_subtitle')}</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors outline-none"
              >
                <span className="material-symbols-outlined text-on-surface-variant" data-icon="close">
                  close
                </span>
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-on-surface-variant">
                
                {/* Name */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="block text-label-md font-label-md uppercase tracking-wider">{t('comp_name_lbl')}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: PT Teknologi Maju"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>

                {/* Unit Option */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="block text-label-md font-label-md uppercase tracking-wider">{t('unit_floor_lbl')}</label>
                  <select 
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  >
                    {unitOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="block text-label-md font-label-md uppercase tracking-wider">{t('start_contract_lbl')}</label>
                  <input 
                    type="date" 
                    required
                    value={newLeaseStart}
                    onChange={(e) => setNewLeaseStart(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="block text-label-md font-label-md uppercase tracking-wider">{t('end_contract_lbl')}</label>
                  <input 
                    type="date" 
                    required
                    value={newLeaseEnd}
                    onChange={(e) => setNewLeaseEnd(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>

                {/* annual Rent */}
                <div className="space-y-2 col-span-2">
                  <label className="block text-label-md font-label-md uppercase tracking-wider">{t('annual_rent_lbl')}</label>
                  <input 
                    type="number" 
                    placeholder="Rp 0"
                    value={newRent}
                    onChange={(e) => setNewRent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-low"
                  />
                </div>

                {/* file Upload Mock */}
                <div className="space-y-2 col-span-2">
                  <label className="block text-label-md font-label-md uppercase tracking-wider">{t('upload_doc_lbl')}</label>
                  <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary mb-2 transition-colors" data-icon="cloud_upload">
                      cloud_upload
                    </span>
                    <p className="text-body-md text-on-surface-variant font-medium text-xs">
                      {t('drag_drop_txt')} <span className="text-primary font-bold hover:underline">{t('browse_txt')}</span>
                    </p>
                    <p className="text-label-sm text-on-surface-variant font-semibold text-[10px] mt-1">{t('max_size_txt')}</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 flex justify-end gap-4 border-t border-outline-variant px-8 py-6 bg-surface">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-xl font-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors font-bold text-xs"
                >
                  {t('batal')}
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl font-body-md font-bold shadow-lg hover:shadow-xl hover:bg-[#001c59] transition-all text-white text-xs"
                >
                  {t('simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
