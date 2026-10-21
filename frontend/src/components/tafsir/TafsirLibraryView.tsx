import React, { useState, useEffect } from 'react';
import { Library, BookOpen, ShieldCheck, Columns, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TafsirEdition, TafsirPassage, SurahSummary } from '../../types';
import { api } from '../../services/api';

interface TafsirLibraryViewProps {
  surahs: SurahSummary[];
  initialVerseKey?: string;
  onOpenAyahInReader: (verseKey: string) => void;
}

export const TafsirLibraryView: React.FC<TafsirLibraryViewProps> = ({
  surahs,
  initialVerseKey = '1:1',
  onOpenAyahInReader,
}) => {
  const [verseKey, setVerseKey] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('noor_tafsir_verse_key');
      if (stored && /^\d+:\d+$/.test(stored)) return stored;
    } catch {}
    return initialVerseKey;
  });
  const [editions, setEditions] = useState<TafsirEdition[]>([]);
  const [passages, setPassages] = useState<TafsirPassage[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewLayout, setViewLayout] = useState<'side_by_side' | 'tabs'>(() => {
    try {
      const stored = localStorage.getItem('noor_tafsir_layout');
      if (stored === 'side_by_side' || stored === 'tabs') return stored;
    } catch {}
    return 'side_by_side';
  });
  const [activeTab, setActiveTab] = useState<string>('ibn_kathir');

  // Persist studied verse and layout
  useEffect(() => {
    try {
      localStorage.setItem('noor_tafsir_verse_key', verseKey);
      localStorage.setItem('noor_tafsir_layout', viewLayout);
    } catch {}
  }, [verseKey, viewLayout]);

  // Parse current surah and verse numbers safely
  const parts = verseKey.split(':');
  const currentSurahId = parseInt(parts[0]) || 1;
  const currentAyahNum = parseInt(parts[1]) || 1;
  const currentSurah = surahs.find((s) => s.id === currentSurahId) || surahs[0];
  const maxAyahs = currentSurah?.verses_count || 7;

  useEffect(() => {
    api.getTafsirEditions().then(setEditions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!/^\d+:\d+$/.test(verseKey)) return;
    const [s, a] = verseKey.split(':').map(Number);
    if (!s || !a || s < 1 || s > 114 || a < 1) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getAyahTafsir(verseKey),
      api.compareTafsir(verseKey)
    ])
      .then(([pass, comp]) => {
        if (isMounted) {
          setPassages(pass);
          setComparisonData(comp);
          if (pass.length > 0 && !pass.some((p) => p.edition.identifier === activeTab)) {
            setActiveTab(pass[0].edition.identifier);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [verseKey]);

  const handlePrevVerse = () => {
    if (currentAyahNum > 1) {
      setVerseKey(`${currentSurahId}:${currentAyahNum - 1}`);
    } else if (currentSurahId > 1) {
      const prevSurah = surahs.find((s) => s.id === currentSurahId - 1);
      const prevMax = prevSurah?.verses_count || 1;
      setVerseKey(`${currentSurahId - 1}:${prevMax}`);
    }
  };

  const handleNextVerse = () => {
    if (currentAyahNum < maxAyahs) {
      setVerseKey(`${currentSurahId}:${currentAyahNum + 1}`);
    } else if (currentSurahId < 114) {
      setVerseKey(`${currentSurahId + 1}:1`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <Library className="w-4 h-4" />
              <span>Multi-Tafsir Comparative Library</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Classical Exegesis & Scholarly Commentary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authentic commentary from recognized traditions (Ibn Kathir, Al-Jalalayn, Maududi) with verified provenance.
            </p>
          </div>

          {/* Quick Navigator: Surah Dropdown + Ayah Dropdown + Prev/Next Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Prev Verse Button */}
            <button
              onClick={handlePrevVerse}
              disabled={currentSurahId === 1 && currentAyahNum === 1}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Previous Verse"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Surah Selector */}
            {surahs && surahs.length > 0 && (
              <select
                value={currentSurahId}
                onChange={(e) => setVerseKey(`${e.target.value}:1`)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-hidden"
              >
                {surahs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.name_simple}
                  </option>
                ))}
              </select>
            )}

            {/* Ayah Number Selector */}
            <span className="text-xs font-semibold text-slate-500">Ayah:</span>
            <select
              value={currentAyahNum}
              onChange={(e) => setVerseKey(`${currentSurahId}:${e.target.value}`)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-hidden"
            >
              {Array.from({ length: maxAyahs }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            {/* Next Verse Button */}
            <button
              onClick={handleNextVerse}
              disabled={currentSurahId === 114 && currentAyahNum === maxAyahs}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Next Verse"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Open in Reader Button */}
            <button
              onClick={() => onOpenAyahInReader(verseKey)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              title="Open Ayah in Reader"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read</span>
            </button>
          </div>
        </div>

        {/* Verse Arabic Showcase */}
        {comparisonData && (
          <div className="pt-6 text-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Commentary on Ayah {verseKey} ({currentSurah?.name_simple})
            </p>
            <p className="font-arabic text-2xl sm:text-3xl text-[#064e3b] dark:text-[#fbbf24] font-bold leading-relaxed" dir="rtl">
              {comparisonData.ayah_text_uthmani}
            </p>
          </div>
        )}
      </div>

      {/* View Layout Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Available Editions ({editions.length}):</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {editions.map((ed) => (
              <span
                key={ed.id}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 text-[11px] font-semibold text-[#064e3b] dark:text-[#fbbf24] border border-emerald-100 dark:border-slate-700"
              >
                {ed.name}
              </span>
            ))}
          </div>
        </div>

        {/* Toggle Layout */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewLayout('side_by_side')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              viewLayout === 'side_by_side'
                ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                : 'text-slate-500'
            }`}
            title="Side-by-side comparison"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>
          <button
            onClick={() => setViewLayout('tabs')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              viewLayout === 'tabs'
                ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                : 'text-slate-500'
            }`}
            title="Tabbed view"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Single</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading scholarly passages for Ayah {verseKey}...</p>
        </div>
      )}

      {/* Content Rendering */}
      {!loading && passages.length > 0 && (
        <>
          {viewLayout === 'side_by_side' ? (
            /* Side-by-side Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {passages.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Source Attribution Badge */}
                    <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {p.edition.era || 'Classical'}
                        </span>
                        <span className="text-xs font-arabic text-slate-400">
                          {p.edition.name_ar}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                        {p.edition.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        By {p.edition.author_name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Methodology: {p.edition.methodology}
                      </p>
                    </div>

                    {/* Commentary Body */}
                    <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-2">
                      <p>{p.text}</p>
                    </div>
                  </div>

                  {/* Provenance Footer */}
                  <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Source
                    </span>
                    <span>License: {p.edition.license}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Tabbed View */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
                {passages.map((p) => (
                  <button
                    key={p.edition.identifier}
                    onClick={() => setActiveTab(p.edition.identifier)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === p.edition.identifier
                        ? 'bg-[#064e3b] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {p.edition.name}
                  </button>
                ))}
              </div>

              {passages
                .filter((p) => p.edition.identifier === activeTab)
                .map((p) => (
                  <div key={p.id} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {p.edition.name} ({p.edition.name_ar})
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Author: {p.edition.author_name} • {p.edition.era}
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] font-semibold border border-emerald-100 dark:border-slate-700">
                        {p.edition.methodology}
                      </span>
                    </div>

                    <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 py-3">
                      {p.text}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Source Work: {p.section_title || p.edition.name}</span>
                      <span>License: {p.edition.license}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {!loading && passages.length === 0 && (
        <div className="py-16 text-center text-slate-400 text-xs space-y-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800">
          <Library className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">No commentary found for Ayah {verseKey}</p>
          <p>Please select another Ayah or Surah from the navigation controls above.</p>
        </div>
      )}
    </div>
  );
};
