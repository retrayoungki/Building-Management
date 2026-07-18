import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardOverview({ onViewChange, tickets, tenants }) {
  const { t } = useLanguage();

  // Mock monthly data for collection trends
  const collectionData = [
    { month: 'Jan', percent: 60, height: '60%' },
    { month: 'Feb', percent: 75, height: '75%' },
    { month: 'Mar', percent: 65, height: '65%' },
    { month: 'Apr', percent: 80, height: '80%' },
    { month: 'Mei', percent: 85, height: '85%' },
    { month: 'Jun', percent: 92, height: '92%', active: true }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {/* Occupancy Rate */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary-container/10">
              <span className="material-symbols-outlined text-primary" data-icon="group">
                group
              </span>
            </div>
            <span className="text-emerald-600 flex items-center font-bold text-label-md">
              <span className="material-symbols-outlined text-sm" data-icon="trending_up">
                trending_up
              </span>{' '}
              2.4%
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">
            {t('occupancy_rate')}
          </h3>
          <p className="text-[32px] leading-tight font-display font-bold text-on-surface mt-1">94.2%</p>
          <p className="text-on-surface-variant text-[11px] mt-1.5 font-medium">118/125 {t('units_leased')}</p>
        </div>

        {/* Collection Rate */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-secondary-container">
              <span className="material-symbols-outlined text-primary" data-icon="payments">
                payments
              </span>
            </div>
            <span className="text-emerald-600 flex items-center font-bold text-label-md">
              <span className="material-symbols-outlined text-sm" data-icon="trending_up">
                trending_up
              </span>{' '}
              1.1%
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">
            {t('collection_rate')}
          </h3>
          <p className="text-[32px] leading-tight font-display font-bold text-on-surface mt-1">88.5%</p>
          <p className="text-on-surface-variant text-[11px] mt-1.5 font-medium">{t('current_bill')}</p>
        </div>

        {/* Open Work Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-tertiary-container/10">
              <span className="material-symbols-outlined text-tertiary-container" data-icon="engineering" style={{ color: '#6e2c00' }}>
                engineering
              </span>
            </div>
            <span className="text-error flex items-center font-bold text-label-md">
              <span className="material-symbols-outlined text-sm" data-icon="priority_high">
                priority_high
              </span>{' '}
              Urgent
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">
            {t('open_orders')}
          </h3>
          <p className="text-[32px] leading-tight font-display font-bold text-on-surface mt-1">14</p>
          <p className="text-on-surface-variant text-[11px] mt-1.5 font-medium">3 {t('high_priority')}</p>
        </div>

        {/* Expired Soon */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-error-container">
              <span className="material-symbols-outlined text-error" data-icon="verified_user">
                verified_user
              </span>
            </div>
            <span className="text-on-surface-variant font-bold text-label-md">
              <span className="material-symbols-outlined text-sm" data-icon="schedule">
                schedule
              </span>{' '}
              &lt;30 Hari
            </span>
          </div>
          <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">
            {t('expired_soon')}
          </h3>
          <p className="text-[32px] leading-tight font-display font-bold text-on-surface mt-1">02</p>
          <p className="text-on-surface-variant text-[11px] mt-1.5 font-medium">{t('slf_water')}</p>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-12 gap-6 text-left">
        {/* Line Chart: Collection Trends */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">{t('collection_trend')}</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border border-outline-variant text-xs font-semibold hover:bg-surface-container transition-colors">
                {t('monthly')}
              </button>
              <button className="px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-[#001c59] transition-colors">
                {t('quarterly')}
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-4 relative mt-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-10">
              <div className="w-full border-t border-on-surface-variant"></div>
              <div className="w-full border-t border-on-surface-variant"></div>
              <div className="w-full border-t border-on-surface-variant"></div>
              <div className="w-full border-t border-on-surface-variant"></div>
            </div>

            {/* Bars */}
            {collectionData.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group z-10 h-full justify-end">
                <div 
                  className={`w-8 sm:w-12 rounded-t transition-all duration-500 cursor-pointer relative ${
                    d.active 
                      ? 'bg-primary hover:bg-[#001c59] shadow-lg shadow-primary/20' 
                      : 'bg-primary-container/20 hover:bg-primary-container/40'
                  }`}
                  style={{ height: d.height }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                    {d.percent}%
                  </div>
                </div>
                <span className={`mt-4 text-xs font-semibold ${d.active ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart: Maintenance Status */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{t('maintenance_status')}</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 rounded-full border-[16px] border-surface-container flex items-center justify-center">
              {/* Donut Segments */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" fill="none" r="80" stroke="#10b981" strokeDasharray="350 500" strokeWidth="16"></circle>
                <circle cx="96" cy="96" fill="none" r="80" stroke="#f59e0b" strokeDasharray="100 500" strokeDashoffset="-350" strokeWidth="16"></circle>
                <circle cx="96" cy="96" fill="none" r="80" stroke="#ef4444" strokeDasharray="50 500" strokeDashoffset="-450" strokeWidth="16"></circle>
              </svg>
              <div className="text-center">
                <span className="text-4xl font-display font-bold text-on-surface leading-none">42</span>
                <p className="text-xs text-on-surface-variant mt-1 font-semibold">{t('total_wo')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 w-full mt-8 gap-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>{t('done')}</span>
                </div>
                <span className="font-bold text-primary">28</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>{t('running')}</span>
                </div>
                <span className="font-bold text-primary">10</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>{t('late')}</span>
                </div>
                <span className="font-bold text-primary">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">{t('recent_activity')}</h2>
            <button 
              onClick={() => onViewChange('maintenance')}
              className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
            >
              {t('see_all')}{' '}
              <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-4 font-bold">{t('category')}</th>
                  <th className="pb-3 px-4 font-bold">{t('description')}</th>
                  <th className="pb-3 px-4 font-bold">{t('unit_party')}</th>
                  <th className="pb-3 px-4 font-bold">{t('status')}</th>
                  <th className="pb-3 px-4 font-bold">{t('time')}</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium">
                <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary-container text-[10px] font-extrabold uppercase">
                      COMPLAINT
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface">AC Kamar Bocor</td>
                  <td className="py-4 px-4 text-on-surface-variant">Unit 14B - PT. Maju Jaya</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-amber-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      Assigned
                    </div>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant font-mono">10:45 AM</td>
                </tr>

                <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded bg-primary-container/10 text-primary text-[10px] font-extrabold uppercase">
                      WORK ORDER
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface">Lift 3 Maintenance</td>
                  <td className="py-4 px-4 text-on-surface-variant">Internal Engineering</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      In Progress
                    </div>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant font-mono">09:12 AM</td>
                </tr>

                <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase">
                      PERMIT
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface">Izin Bongkar Muat</td>
                  <td className="py-4 px-4 text-on-surface-variant">Loading Dock A</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Approved
                    </div>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant font-mono">08:30 AM</td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary-container text-[10px] font-extrabold uppercase">
                      COMPLAINT
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface">Plafon Parkir Basement 2 Rembes</td>
                  <td className="py-4 px-4 text-on-surface-variant">Fasilitas Umum</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      New Task
                    </div>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant font-mono">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Panel: Calendar & Reminders */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Calendar Widget */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface">{t('pm_schedule')}</h2>
              <span className="text-xs text-on-surface-variant font-semibold">{t('sunday')} 24 - Jun</span>
            </div>

            {/* Mini Calendar Visual */}
            <div className="grid grid-cols-7 gap-1 text-center mb-6 font-semibold text-xs">
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">S</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">S</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">R</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">K</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">J</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">S</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">M</span>
              <span className="p-2 text-on-surface-variant font-normal">17</span>
              <span className="p-2 text-on-surface-variant font-normal">18</span>
              <span className="p-2 text-on-surface-variant font-normal">19</span>
              <span className="p-2 text-on-surface-variant font-normal">20</span>
              <span className="p-2 text-on-surface-variant font-normal">21</span>
              <span className="p-2 text-on-surface-variant font-normal">22</span>
              <span className="p-2 text-on-surface-variant font-normal">23</span>
              <span className="p-2 bg-primary text-white rounded-full font-extrabold flex items-center justify-center w-7 h-7 mx-auto leading-none">
                24
              </span>
              <span className="p-2 text-on-surface">25</span>
              <span className="p-2 text-on-surface">26</span>
              <span className="p-2 text-on-surface">27</span>
              <span className="p-2 text-on-surface">28</span>
              <span className="p-2 text-on-surface">29</span>
              <span className="p-2 text-on-surface">30</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer">
                <div className="h-10 w-1 bg-primary rounded-full shrink-0"></div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-bold text-on-surface">{t('genset_test')}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">09:00 - 11:00 • {t('mep_area')}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-sm shrink-0 self-center" data-icon="chevron_right">
                  chevron_right
                </span>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer">
                <div className="h-10 w-1 bg-amber-500 rounded-full shrink-0"></div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-bold text-on-surface">{t('fogging_parking')}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">21:00 - 23:00 • {t('basement')}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-sm shrink-0 self-center" data-icon="chevron_right">
                  chevron_right
                </span>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer opacity-50">
                <div className="h-10 w-1 bg-outline rounded-full shrink-0"></div>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-bold text-on-surface">{t('electric_panel')}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">{t('done')} • 08:30 AM</p>
                </div>
                <span className="material-symbols-outlined text-emerald-500 shrink-0 self-center" data-icon="check_circle">
                  check_circle
                </span>
              </div>
            </div>
          </div>

          {/* Certification Reminder */}
          <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden text-left mt-4 shrink-0">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-8xl" data-icon="verified_user">
                verified_user
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold mb-2">{t('slf_renewal_title')}</h3>
            <p className="text-white/80 text-xs mb-4 leading-relaxed font-medium">
              {t('slf_renewal_desc')}
            </p>
            <button className="w-full bg-white text-primary font-bold py-2.5 rounded-lg hover:bg-surface-container transition-colors text-xs shadow-md">
              {t('start_renewal')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
