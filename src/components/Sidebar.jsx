import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeView, onViewChange, onLogout }) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', name: t('dashboard'), icon: 'dashboard' },
    { id: 'tenants', name: t('tenants'), icon: 'description' },
    { id: 'maintenance', name: t('maintenance'), icon: 'engineering' },
    { id: 'certifications', name: t('certifications'), icon: 'verified_user' },
    { id: 'security', name: t('security'), icon: 'security' },
    { id: 'expenses', name: t('expenses'), icon: 'payments' },
    { id: 'reports', name: t('reports'), icon: 'assessment' },
    { id: 'settings', name: t('settings'), icon: 'settings' }
  ];

  return (
    <aside className="w-sidebar-width h-screen sticky left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-6 shrink-0 z-20 transition-all duration-200">
      {/* Brand Header with Building Box Icon */}
      <div className="px-6 mb-8 flex items-center gap-3 text-left">
        <img 
          src="/logo-graha-kaji.png" 
          alt="Graha Kaji Logo" 
          className="w-20 h-20 object-contain shrink-0"
        />
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary text-base leading-tight">Graha Kaji</h1>
          <p className="text-label-md font-label-md text-on-surface-variant text-[10px]">Building Management</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-stack-gap px-4 py-3 transition-colors duration-200 text-left rounded-lg outline-none focus:outline-none ${
                isActive
                  ? 'bg-secondary-container text-primary font-bold border-l-4 border-primary rounded-r-lg'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" data-icon={item.icon}>
                {item.icon}
              </span>
              <span className="font-body-md text-body-md text-xs">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Section & Logout */}
      <div className="px-6 mt-auto space-y-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-stack-gap px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-xs text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
