import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Globe,
  Sun,
  Moon,
  BookOpen,
  Sliders,
  Sparkles,
  Download,
  Smartphone,
  Check,
} from 'lucide-react';
import { isInterfaceLanguage, type InterfaceLanguage } from '../../preferences';
import { t } from '../../i18n';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  currentTheme: 'light' | 'dark' | 'sepia';
  onChangeTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  arabicFontSize: number;
  onChangeArabicFontSize: (size: number) => void;
  tajweedEnabled: boolean;
  onToggleTajweed: () => void;
  selectedTranslation: string;
  onChangeTranslation: (edition: string) => void;
  interfaceLanguage: InterfaceLanguage;
  onChangeInterfaceLanguage: (language: InterfaceLanguage) => void;
  onOpenCalendar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSearch,
  currentTheme,
  onChangeTheme,
  arabicFontSize,
  onChangeArabicFontSize,
  tajweedEnabled,
  onToggleTajweed,
  selectedTranslation,
  onChangeTranslation,
  interfaceLanguage,
  onChangeInterfaceLanguage,
  onOpenCalendar,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallHelp, setShowInstallHelp] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone display mode (already installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallHelp(true);
    }
  };

  const [hijriToday] = useState(() => {
    try {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      return fmt.format(now);
    } catch {
      return '1448 AH';
    }
  });

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-950/10 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between transition-colors shadow-xs">
        {/* Left: Mobile Toggle, Search Quick Button & Hijri Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-[#064e3b]" />
          </button>

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-xs font-medium transition-all w-48 sm:w-64 border border-slate-200/70 dark:border-slate-700"
          >
            <Search className="w-3.5 h-3.5 text-[#064e3b]" />
            <span className="truncate">Search ayahs, words, roots...</span>
            <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-sm border border-slate-300 dark:border-slate-700 text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {hijriToday && (
            <button
              onClick={onOpenCalendar}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/50 dark:border-slate-700 text-[#064e3b] dark:text-[#fbbf24] text-xs font-semibold hover:bg-emerald-100/70 transition-colors cursor-pointer"
              title="Open Islamic Calendar & Sacred Months"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{hijriToday}</span>
            </button>
          )}
        </div>

        {/* Right: Language, Font Adjuster, Theme Switcher, Settings */}
        <div className="flex items-center gap-2">
          {/* Translation Quick Select */}
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50/80 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/50 dark:border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#064e3b] dark:text-emerald-400" />
            <select
              value={selectedTranslation}
              onChange={(e) => onChangeTranslation(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-100 text-xs font-medium focus:outline-hidden cursor-pointer"
              style={{ colorScheme: currentTheme === 'dark' ? 'dark' : 'light' }}
            >
              <option value="en.saheeh">English (Saheeh)</option>
              <option value="ur.maududi.api">Urdu (Maududi)</option>
              <option value="hi.azizul">Hindi (Azizul Haque)</option>
              <option value="hinglish.paraphrase">Hinglish / Roman Urdu</option>
              <option value="bn.taisirul">Bengali (Taisirul Quran)</option>
              <option value="fr.hamidullah">French (Hamidullah)</option>
              <option value="id.ministry">Indonesian (Islamic Affairs Ministry)</option>
            </select>
          </div>

          {/* Tajweed Pill Toggle */}
          <button
            onClick={onToggleTajweed}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              tajweedEnabled
                ? 'bg-[#d97706]/15 border-[#d97706]/50 text-[#b45309] dark:text-[#fbbf24]'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title="Toggle Tajweed rules coloring"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tajweed</span>
          </button>

          {/* Reading Display Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reading Settings & Typography"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* PWA Install App Button */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:opacity-95 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              title="Install Noor-ul-Quran as an App (100% Free, Zero Login)"
            >
              <Download className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Theme Quick Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onChangeTheme('light')}
              className={`p-1.5 rounded-lg transition-colors ${
                currentTheme === 'light'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Emerald Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('sepia')}
              className={`p-1.5 rounded-lg transition-colors ${
                currentTheme === 'sepia'
                  ? 'bg-[#f4ecd8] text-[#854d0e] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Mushaf Ivory Sepia Theme"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('dark')}
              className={`p-1.5 rounded-lg transition-colors ${
                currentTheme === 'dark'
                  ? 'bg-slate-900 text-[#fbbf24] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Deep Forest Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-950/10 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24]">
                <Sliders className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {t(interfaceLanguage, 'settings')}
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Arabic Font Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t(interfaceLanguage, 'fontSize')} ({arabicFontSize}px)
                  </label>
                  <span className="font-arabic text-sm text-[#064e3b] dark:text-[#fbbf24]">بِسْمِ ٱللَّهِ</span>
                </div>
                <input
                  type="range"
                  min="22"
                  max="44"
                  value={arabicFontSize}
                  onChange={(e) => onChangeArabicFontSize(Number(e.target.value))}
                  className="w-full accent-[#064e3b] cursor-pointer"
                />
              </div>

              {/* Translation Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t(interfaceLanguage, 'translationLanguage')}
                </label>
                <select
                  value={selectedTranslation}
                  onChange={(e) => onChangeTranslation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  style={{ colorScheme: currentTheme === 'dark' ? 'dark' : 'light' }}
                >
                  <option value="en.saheeh">English — Saheeh International</option>
                  <option value="ur.maududi.api">Urdu — Sayyid Abul A'la Maududi</option>
                  <option value="hi.azizul">Hindi — Maulana Azizul Haque al-Umari</option>
                  <option value="hinglish.paraphrase">Hinglish / Roman Urdu — Conversational Paraphrase</option>
                  <option value="bn.taisirul">Bengali — Taisirul Quran</option>
                  <option value="fr.hamidullah">French — Muhammad Hamidullah</option>
                  <option value="id.ministry">Indonesian — Islamic Affairs Ministry</option>
                </select>
              </div>


              <div>
                <label htmlFor="interface-language" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t(interfaceLanguage, 'interfaceLanguage')}
                </label>
                <select
                  id="interface-language"
                  value={interfaceLanguage}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (isInterfaceLanguage(value)) onChangeInterfaceLanguage(value);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  style={{ colorScheme: currentTheme === 'dark' ? 'dark' : 'light' }}
                >
                  <option value="en">English</option>
                  <option value="ur">اردو</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ar">العربية</option>
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  {t(interfaceLanguage, 'interfaceCoverage')}
                </p>
              </div>

              {/* Tajweed Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{t(interfaceLanguage, 'tajweed')}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t(interfaceLanguage, 'tajweedHelp')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={tajweedEnabled}
                  onChange={onToggleTajweed}
                  className="w-4 h-4 accent-[#064e3b] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-semibold shadow-md transition-colors"
              >
                {t(interfaceLanguage, 'save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install App Guide Modal */}
      {showInstallHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Install Noor-ul-Quran App
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    100% Free • Works Offline • Zero Storage Lag
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallHelp(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  Android (Chrome / Samsung / Brave)
                </span>
                <p className="text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                  Tap the <strong>three dots (⋮)</strong> at top right and choose <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  iPhone & iPad (Safari)
                </span>
                <p className="text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                  Tap the <strong>Share button</strong> (square with arrow up ⎋) at the bottom, scroll down, and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  PC / Laptop (Chrome / Edge)
                </span>
                <p className="text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                  Click the <strong>Install icon (⊕)</strong> in your browser address bar next to the bookmark star.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInstallHelp(false)}
                className="w-full py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Understood (فهمت)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
