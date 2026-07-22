import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Search, Download, Filter, FileText, ChevronLeft, ChevronRight, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import ExportToolbar from '../components/ExportToolbar';

export default function Certifications() {
  const { t, lang } = useLanguage();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Document form state
  const [newName, setNewName] = useState('');
  const [newNo, setNewNo] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newCategory, setNewCategory] = useState('apartment');

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Sertifikat Laik Fungsi (SLF)', code: '503/128/SLF/DPMPTSP/2023', issueDate: '12 Jan 2023', expiryDate: '12 Jan 2028', status: 'Active', icon: 'apartment', bgIcon: 'bg-secondary-container', textIcon: 'text-primary' },
    { id: 2, name: 'Persetujuan Bangunan Gedung (PBG)', code: 'PBG-3273-01052023-01', issueDate: '05 Mei 2023', expiryDate: 'Seumur Hidup', status: 'Active', icon: 'architecture', bgIcon: 'bg-secondary-container', textIcon: 'text-primary' },
    { id: 3, name: 'SIA Lift (Passenger & Cargo)', code: 'K3/LIFT/XI/2022', issueDate: '15 Nov 2022', expiryDate: '15 Nov 2024', status: 'Expiring', icon: 'elevator', bgIcon: 'bg-tertiary-fixed', textIcon: 'text-tertiary-container' },
    { id: 4, name: 'Izin Operasional Genset', code: 'GEN-2021-X-004', issueDate: '20 Okt 2021', expiryDate: '20 Okt 2024', status: 'Expired', icon: 'settings_input_component', bgIcon: 'bg-error-container', textIcon: 'text-error' },
    { id: 5, name: 'Rekomendasi Kebakaran (Damkar)', code: '300/REK-DK/VIII/2023', issueDate: '10 Agt 2023', expiryDate: '10 Agt 2025', status: 'Active', icon: 'fire_extinguisher', bgIcon: 'bg-secondary-container', textIcon: 'text-primary' }
  ]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newNo) return;

    let bgIcon = 'bg-secondary-container';
    let textIcon = 'text-primary';
    if (newCategory === 'elevator') {
      bgIcon = 'bg-tertiary-fixed';
      textIcon = 'text-tertiary-container';
    } else if (newCategory === 'genset') {
      bgIcon = 'bg-error-container';
      textIcon = 'text-error';
    }

    const newDoc = {
      id: Date.now(),
      name: newName,
      code: `No: ${newNo}`,
      issueDate: newIssueDate || 'Today',
      expiryDate: newExpiryDate || 'Lifetime',
      status: newExpiryDate ? 'Active' : 'Active',
      icon: newCategory,
      bgIcon,
      textIcon
    };

    setDocuments([newDoc, ...documents]);
    setNewName('');
    setNewNo('');
    setNewIssueDate('');
    setNewExpiryDate('');
    setShowUploadModal(false);
  };

  const handleDownload = (docName) => {
    alert(lang === 'id' ? `Mengunduh berkas: ${docName}` : `Downloading file: ${docName}`);
  };

  // Filter based on search term
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary text-xl font-bold">
            {lang === 'id' ? 'Sertifikasi & Perizinan' : 'Certifications & Licensing'}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs font-semibold mt-1">
            {lang === 'id' ? 'Pantau masa berlaku izin operasional dan sertifikasi teknis gedung.' : 'Monitor the validity period of building operational permits and technical certifications.'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ExportToolbar
            title="Sertifikasi & Perizinan"
            subtitle="Daftar perizinan dan sertifikasi teknis gedung Graha Kaji"
            filename="sertifikasi_perizinan"
            data={filteredDocs}
            columns={[
              { key: 'name', label: 'Nama Dokumen' },
              { key: 'code', label: 'Nomor Dokumen' },
              { key: 'issueDate', label: 'Tanggal Terbit' },
              { key: 'expiryDate', label: 'Tanggal Kadaluarsa' },
              { key: 'status', label: 'Status' },
            ]}
            summaryCards={[
              { label: 'Total Dokumen', value: filteredDocs.length },
              { label: 'Aktif', value: filteredDocs.filter(d=>d.status==='Active').length },
              { label: 'Akan Kadaluarsa', value: filteredDocs.filter(d=>d.status==='Expiring Soon').length },
              { label: 'Kadaluarsa', value: filteredDocs.filter(d=>d.status==='Expired').length },
            ]}
          />
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all outline-none focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {lang === 'id' ? 'Tambah Dokumen' : 'Add Document'}
          </button>
        </div>
      </div>

      {/* Visual Progress Bar Section (Bento Grid Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Meter */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                {lang === 'id' ? 'Kepatuhan Total' : 'Total Compliance'}
              </h3>
              <p className="text-[11px] font-semibold text-on-surface-variant mt-0.5">
                {lang === 'id' ? 'Status seluruh perizinan aktif' : 'Active permit status across entire site'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold font-display text-primary">85%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-1000" 
                style={{ width: '85%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>{lang === 'id' ? '12 Dokumen Aktif' : '12 Active Documents'}</span>
              <span className="text-amber-600">{lang === 'id' ? '2 Mendekati Expired' : '2 Near Expired'}</span>
            </div>
          </div>
        </div>

        {/* Attention/Action Card */}
        <div className="bg-[#1e3a8a] text-white rounded-xl p-6 shadow-sm overflow-hidden relative group">
          <div className="relative z-10">
            <h3 className="text-sm font-bold mb-2">
              {lang === 'id' ? 'Tindakan Segera' : 'Immediate Action'}
            </h3>
            <p className="text-white/80 text-xs mb-4 leading-relaxed font-semibold">
              {lang === 'id' 
                ? 'Ada 2 perizinan (Genset & Lift) yang akan berakhir dalam 30 hari ke depan.' 
                : 'There are 2 certifications (Genset & Lift) expiring within the next 30 days.'}
            </p>
            <button 
              onClick={() => alert(lang === 'id' ? 'Membuka formulir perpanjangan perizinan...' : 'Opening licensing renewal form...')}
              className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#d6e0f1] transition-colors"
            >
              {lang === 'id' ? 'Perpanjang Sekarang' : 'Renew Now'}
            </button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] opacity-10 rotate-12 text-white">
            warning
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-on-surface">
            {lang === 'id' ? 'Daftar Dokumen Perizinan' : 'Licensing Documents Directory'}
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input 
                type="text"
                placeholder={lang === 'id' ? 'Cari perizinan...' : 'Search permits...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-surface-container-low text-xs border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-48 font-medium"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            </div>

            <button className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-bold hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              {lang === 'id' ? 'Filter' : 'Filter'}
            </button>
            <button 
              onClick={() => alert('CSV Export complete')}
              className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-bold hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              {lang === 'id' ? 'Ekspor CSV' : 'Export CSV'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant">
                <th className="px-6 py-4 border-b border-outline-variant">{lang === 'id' ? 'Nama Dokumen' : 'Document Name'}</th>
                <th className="px-6 py-4 border-b border-outline-variant">{lang === 'id' ? 'Tanggal Terbit' : 'Issue Date'}</th>
                <th className="px-6 py-4 border-b border-outline-variant">{lang === 'id' ? 'Tanggal Berakhir' : 'Expiry Date'}</th>
                <th className="px-6 py-4 border-b border-outline-variant">{lang === 'id' ? 'Status' : 'Status'}</th>
                <th className="px-6 py-4 border-b border-outline-variant text-right">{lang === 'id' ? 'Aksi' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-xs font-semibold text-on-surface">
              {filteredDocs.map((doc) => {
                const isExpiring = doc.status === 'Expiring';
                const isExpired = doc.status === 'Expired';
                
                return (
                  <tr 
                    key={doc.id} 
                    className={`transition-colors hover:bg-surface-container-low ${
                      isExpiring ? 'bg-yellow-50/20' : 
                      isExpired ? 'bg-error-container/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${doc.bgIcon} ${doc.textIcon} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-[20px]">{doc.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-xs">{doc.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{doc.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-medium">{doc.issueDate}</td>
                    <td className={`px-6 py-4 font-bold ${
                      isExpiring ? 'text-tertiary' : 
                      isExpired ? 'text-error' : 'text-on-surface-variant'
                    }`}>
                      {doc.expiryDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isExpired 
                          ? 'bg-error-container text-on-error-container border-error' 
                          : isExpiring 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDownload(doc.name)}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors inline-block"
                        title="Download Certificate"
                      >
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="p-4 border-t border-outline-variant flex items-center justify-between text-xs font-bold text-on-surface-variant">
          <p>{lang === 'id' ? `Menampilkan ${filteredDocs.length} dari ${documents.length} dokumen` : `Showing ${filteredDocs.length} of ${documents.length} documents`}</p>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded bg-primary text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 rounded hover:bg-surface-container text-xs">2</button>
            <button className="w-8 h-8 rounded hover:bg-surface-container text-xs">3</button>
            <button className="p-1 rounded hover:bg-surface-container transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Context Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Recent Operations Log */}
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
          <h4 className="text-xs font-bold text-on-surface mb-4 uppercase tracking-wider">
            {lang === 'id' ? 'Aktivitas Terakhir' : 'Recent Activity'}
          </h4>
          <ul className="space-y-4 text-xs font-semibold">
            <li className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
              <div>
                <p className="text-on-surface font-bold">
                  {lang === 'id' ? 'Sertifikat PBG Baru Diunggah' : 'New PBG Certificate Uploaded'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {lang === 'id' ? 'Oleh Admin Teknik • 2 jam yang lalu' : 'By Technical Admin • 2 hours ago'}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
              <div>
                <p className="text-on-surface font-bold">
                  {lang === 'id' ? 'Pengingat: Perpanjangan SIA Lift' : 'Reminder: SIA Lift License Renewal'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {lang === 'id' ? 'Sistem Otomatis • 5 jam yang lalu' : 'Automated System • 5 hours ago'}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-outline mt-2 shrink-0"></div>
              <div>
                <p className="text-on-surface font-bold">
                  {lang === 'id' ? 'Laporan Damkar Tahunan Selesai' : 'Annual Fire Safety Report Finalized'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {lang === 'id' ? 'Oleh Supervisor Ops • Kemarin' : 'By Ops Supervisor • Yesterday'}
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Legal Counseling Help Center */}
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant flex flex-col items-center justify-center text-center">
          <div 
            className="w-full h-28 bg-cover bg-center rounded-lg mb-4" 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeT53auV-xZUC3hLxNPiquso8ocgWjaG723Nb7M-F65C35eyat1qzgxzlfPhe8yynhKYUR6rlLM5Xjn5IwSbFQD1Gmcybnm_SIkT8ON6kkLDP8vLFkrllLTCqEZmHYefvmWFeK8F2YFDLnukfr_yPd2o0-pEa1WLsAzmE-sm9pTuBKl13qhiaVT__d1V4aSnvIfPS5kQx_XvnPlAM-T6g0TlR_7szL7MShS-1gyOdq80pkeIh7hWw')` }}
          ></div>
          <h4 className="text-xs font-bold text-on-surface">
            {lang === 'id' ? 'Butuh Bantuan Perizinan?' : 'Need Licensing Assistance?'}
          </h4>
          <p className="text-[11px] text-on-surface-variant font-medium mt-1 mb-4 max-w-sm">
            {lang === 'id' 
              ? 'Hubungi konsultan legal kami untuk membantu proses pengurusan dokumen yang expired.' 
              : 'Contact our legal consultants to expedite the renewal of expired documents.'}
          </p>
          <button 
            onClick={() => alert('Legal consultant requested')}
            className="w-full py-2 bg-outline hover:bg-on-surface-variant text-white rounded-lg text-xs font-bold transition-all"
          >
            {lang === 'id' ? 'Kontak Legal Support' : 'Contact Legal Support'}
          </button>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-primary text-white flex justify-between items-center">
              <h3 className="text-sm font-bold">
                {lang === 'id' ? 'Unggah Dokumen Perizinan Baru' : 'Upload New Licensing Document'}
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1">
                <label className="block uppercase tracking-wider">{lang === 'id' ? 'Nama Dokumen *' : 'Document Name *'}</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Sertifikat Laik Fungsi (SLF)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-semibold text-on-surface"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider">{lang === 'id' ? 'Nomor SK / Izin *' : 'Licensing / SK Number *'}</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: 503/128/SLF/DPMPTSP/2023"
                  value={newNo}
                  onChange={(e) => setNewNo(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase tracking-wider">{lang === 'id' ? 'Tanggal Terbit' : 'Issue Date'}</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 12 Jan 2023"
                    value={newIssueDate}
                    onChange={(e) => setNewIssueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase tracking-wider">{lang === 'id' ? 'Tanggal Berakhir' : 'Expiry Date'}</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 12 Jan 2028 / Seumur Hidup"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-medium text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block uppercase tracking-wider">Kategori Aset / Dokumen</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-semibold text-on-surface"
                >
                  <option value="apartment">Sipil / Bangunan Gedung (SLF/PBG)</option>
                  <option value="elevator">Elevator / Lift Kelayakan</option>
                  <option value="genset">Genset & Mekanikal</option>
                  <option value="fire_extinguisher">Sistem Proteksi Kebakaran</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Upload Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
