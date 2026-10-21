import React from 'react';
import {
  BookOpen,
  Sparkles,
  Bookmark,
  ShieldCheck,
  Home,
  CalendarDays,
  Library,
  X,
} from 'lucide-react';
import type { InterfaceLanguage } from '../../preferences';
import { t } from '../../i18n';

export type NavSection =
  | 'home'
  | 'reader'
  | 'companion'
  | 'maktabah'
  | 'research'
  | 'library'
  | 'calendar'
  | 'tafsir'
  | 'search'
  | 'linguistics'
  | 'hadith'
  | 'academy'
  | 'hifz'
  | 'notebook'
  | 'bookmarks'
  | 'history'
  | 'admin';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isOpen: boolean;
  onToggle: () => void;
  interfaceLanguage: InterfaceLanguage;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpen,
  onToggle,
  interfaceLanguage,
}) => {
  // 6 Core Focused Pillars
  const navItems = [
    { id: 'home' as NavSection, icon: Home, arabic: 'الرئيسية' },
    { id: 'reader' as NavSection, icon: BookOpen, arabic: 'المصحف والتلاوة' },
    { id: 'companion' as NavSection, icon: CalendarDays, arabic: 'الرفيق والصلوات' },
    { id: 'maktabah' as NavSection, icon: Library, arabic: 'المكتبة والتعليم' },
    { id: 'research' as NavSection, icon: Sparkles, arabic: 'مركز البحوث والدراسات' },
    { id: 'library' as NavSection, icon: Bookmark, arabic: 'مكتبتي والملاحظات' },
  ];

  const isPillarActive = (id: NavSection) => {
    if (currentSection === id) return true;
    if (id === 'companion' && currentSection === 'calendar') return true;
    if (id === 'maktabah' && (currentSection === 'maktabah' || currentSection === 'academy')) return true;
    if (id === 'reader' && (currentSection === 'hifz' || currentSection === 'tafsir')) return true;
    if (
      id === 'research' &&
      (currentSection === 'search' || currentSection === 'linguistics' || currentSection === 'hadith')
    )
      return true;
    if (
      id === 'library' &&
      (currentSection === 'bookmarks' || currentSection === 'notebook' || currentSection === 'history')
    )
      return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#064e3b] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#047857]/40 flex items-center justify-between bg-[#022c22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97706] to-[#b45309] flex items-center justify-center shadow-lg text-white font-bold text-xl">
              ن
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wide text-white">Noor-ul-Quran</span>
              </div>
              <p className="text-xs text-[#fbbf24] font-arabic font-medium">نور القرآن الكريم</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Core Navigation Pillars */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isPillarActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d97706] to-[#b45309] text-white shadow-lg'
                    : 'text-emerald-100/90 hover:bg-[#047857]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-[#fbbf24] group-hover:scale-110'
                    }`}
                  />
                  <span className="truncate">{t(interfaceLanguage, item.id)}</span>
                </div>
                <span className="text-[11px] font-arabic opacity-80 shrink-0 ml-2 hidden sm:inline">
                  {item.arabic}
                </span>
              </button>
            );
          })}
        </nav>

        {/* System Integrity & Footer Tagline */}
        <div className="p-4 border-t border-[#047857]/40 bg-[#022c22]/70 space-y-3">
          <button
            onClick={() => {
              onSelectSection('admin');
              if (window.innerWidth < 1024) onToggle();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
              currentSection === 'admin'
                ? 'bg-emerald-950 text-[#fbbf24] border border-[#fbbf24]/40'
                : 'text-emerald-200/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>System & Data Integrity</span>
            </div>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-black/40 text-emerald-300">
              SHA-256
            </span>
          </button>

          <div className="text-xs text-emerald-200/80 pt-1 border-t border-emerald-900/60">
            <p className="font-semibold text-[#fbbf24] text-[11px] mb-0.5">{t(interfaceLanguage, 'authenticity')}</p>
            <p className="text-[10px] leading-relaxed opacity-70">
              {t(interfaceLanguage, 'verified')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
