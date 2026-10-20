import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Droplets, Globe, ChevronDown, Check, Cpu } from 'lucide-react';
import { Language } from '../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    notifications,
    setActiveModal,
    t,
    isWsConnected,
    activeUsersCount
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangOpen]);

  const languages: { id: Language; nativeName: string; label: string }[] = [
    { id: 'en', nativeName: 'English', label: 'English' },
    { id: 'ta', nativeName: 'தமிழ்', label: 'Tamil' },
    { id: 'hi', nativeName: 'हिन्दी', label: 'Hindi' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 shadow-md shadow-cyan-500/20 text-white shrink-0">
            <Droplets className="w-5 h-5 fill-white/20" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center shrink-0">
                Aqua<span className="text-cyan-400">Care</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Smart Leak Check & PPT Button */}
          <button
            type="button"
            onClick={() => setActiveModal('mlStudio')}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
            title="Check smart pipe leak detection system"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400 stroke-[2.2]" />
            <span className="text-[11px] sm:text-xs">Leak Checker</span>
            <span className="hidden sm:inline-block text-[9px] uppercase px-1 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
              Demo
            </span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/90 text-xs font-semibold text-slate-200 transition-all shadow-sm active:scale-95"
              title={t.selectLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-xs text-white">
                {language === 'en' ? 'English' : language === 'ta' ? 'தமிழ்' : 'हिन्दी'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu (English / தமிழ் / हिन्दी) */}
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  {t.chooseLanguage}
                </div>
                {languages.map((l) => {
                  const isSelected = language === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setLanguage(l.id);
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-3 py-2 flex items-center justify-between text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold">{l.nativeName}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({l.label})</span>
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications button */}
          <button
            onClick={() => setActiveModal('notifications')}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
