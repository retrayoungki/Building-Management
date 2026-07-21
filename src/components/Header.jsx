import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ notifications, onMarkAllRead, searchTerm, onSearchChange, currentUser }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex justify-between items-center px-gutter w-full sticky top-0 z-40 bg-surface border-b border-outline-variant h-16 shadow-sm shrink-0">
      {/* Search Bar */}
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md text-left">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" data-icon="search">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all outline-none font-medium text-xs text-on-surface"
            placeholder={t('search_placeholder')}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications, Language Switcher & Profile */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 border border-outline-variant rounded-full text-[10px] font-bold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5 outline-none focus:outline-none shrink-0"
          title="Switch Language / Ganti Bahasa"
        >
          <span>🌐</span>
          <span>{lang === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {/* Bell Alerts */}
        <button
          onClick={onMarkAllRead}
          className="relative text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-high"
          title="Mark alerts as read"
        >
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          )}
        </button>

        <div className="h-8 w-[1px] bg-outline-variant"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 text-left">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-on-surface font-bold leading-none">
              {currentUser ? currentUser.name : 'Budi Santoso'}
            </p>
            <p className="font-label-md text-label-md text-on-surface-variant leading-none mt-1 text-[10px] font-semibold">
              {currentUser ? t(currentUser.role) : t('property_manager')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/10 border border-outline-variant flex items-center justify-center text-primary font-black text-xs shrink-0 select-none">
            {currentUser ? currentUser.initials : 'BS'}
          </div>
        </div>
      </div>
    </header>
  );
}
