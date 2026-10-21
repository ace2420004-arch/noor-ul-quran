import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Languages,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { SurahSummary, Ayah, Word } from '../../types';
import { AyahCard } from './AyahCard';
import { WordPopover } from './WordPopover';
import { TajweedLegendBar } from './TajweedLegendBar';
import { AyahQuoteCardModal } from '../modals/AyahQuoteCardModal';
import { renderTajweedText } from '../../utils/tajweed';
import { api } from '../../services/api';

interface QuranReaderProps {
  surahs: SurahSummary[];
  selectedSurahId: number;
  onSelectSurahId: (id: number) => void;
  selectedTranslation: string;
  arabicFontSize: number;
  tajweedEnabled: boolean;
  playingAyahKey: string | null;
  onPlayAudio: (ayah: Ayah) => void;
  onOpenTafsir: (verseKey: string) => void;
  onOpenNote: (verseKey: string) => void;
  onToggleBookmark: (verseKey: string) => void;
  bookmarkedKeys: Set<string>;
  onExploreRoot?: (rootLetters: string) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  surahs,
  selectedSurahId,
  onSelectSurahId,
  selectedTranslation,
  arabicFontSize,
  tajweedEnabled,
  playingAyahKey,
  onPlayAudio,
  onOpenTafsir,
  onOpenNote,
  onToggleBookmark,
  bookmarkedKeys,
  onExploreRoot,
}) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [viewMode, setViewMode] = useState<'ayah' | 'mushaf'>(() => {
    try {
      const stored = localStorage.getItem('noor_reader_view_mode');
      if (stored === 'ayah' || stored === 'mushaf') return stored;
    } catch {}
    return 'ayah';
  });
  const [showSurahModal, setShowSurahModal] = useState<boolean>(false);
  const [surahFilter, setSurahFilter] = useState<string>('');
  const [secondaryTranslation, setSecondaryTranslation] = useState<string>(() => {
    try {
      return localStorage.getItem('noor_reader_secondary_translation') || 'none';
    } catch {
      return 'none';
    }
  });
  const [activeQuoteCardAyah, setActiveQuoteCardAyah] = useState<Ayah | null>(null);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [hifzMode, setHifzMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_reader_hifz_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Persist reading preferences
  useEffect(() => {
    try {
      localStorage.setItem('noor_reader_view_mode', viewMode);
      localStorage.setItem('noor_reader_secondary_translation', secondaryTranslation);
      localStorage.setItem('noor_reader_hifz_mode', hifzMode.toString());
    } catch {}
  }, [viewMode, secondaryTranslation, hifzMode]);

  const currentSurah = surahs.find((s) => s.id === selectedSurahId) || surahs[0];

  // Auto-scroll to active Ayah during continuous recitation
  useEffect(() => {
    if (!autoScroll || !playingAyahKey) return;
    const el = document.getElementById(`ayah-${playingAyahKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [playingAyahKey, autoScroll]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .getSurahAyahs(selectedSurahId, 'alafasy', selectedTranslation)
      .then((data) => {
        if (isMounted) {
          setAyahs(data);
          setLoading(false);
          if (data && data.length > 0) {
            try {
              const raw = localStorage.getItem('noor_reading_history');
              const list = raw ? JSON.parse(raw) : [];
              const firstAyah = data[0];
              const filtered = list.filter((item: any) => item.verse_key !== firstAyah.verse_key);
              const updated = [
                {
                  verse_key: firstAyah.verse_key,
                  surah: currentSurah?.name_simple || `Surah ${selectedSurahId}`,
                  snippet: firstAyah.text_uthmani,
                  timestamp: Date.now()
                },
                ...filtered
              ].slice(0, 30);
              localStorage.setItem('noor_reading_history', JSON.stringify(updated));
            } catch {}
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load Ayahs');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahId, selectedTranslation, currentSurah?.name_simple]);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.name_simple.toLowerCase().includes(surahFilter.toLowerCase()) ||
      s.name_arabic.includes(surahFilter) ||
      s.id.toString() === surahFilter
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Surah Dropdown Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSurahModal(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100/70 dark:hover:bg-slate-700/80 text-[#064e3b] dark:text-[#fbbf24] font-bold text-sm border border-emerald-200/60 dark:border-slate-700 transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {currentSurah ? `${currentSurah.id}. ${currentSurah.name_simple}` : 'Select Surah'}
            </span>
            <span className="font-arabic font-normal text-xs opacity-75">
              ({currentSurah?.name_arabic})
            </span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            {currentSurah?.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'} • {currentSurah?.verses_count} Ayahs
          </span>
        </div>

        {/* View Mode & Surah Previous/Next Stepper & Features */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dual Translation Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700/60">
            <Languages className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span className="text-[11px] text-slate-500 font-medium hidden lg:inline">2nd Translation:</span>
            <select
              value={secondaryTranslation}
              onChange={(e) => setSecondaryTranslation(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
              style={{ colorScheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' }}
              title="Select secondary translation for dual comparison"
            >
              <option value="none">Dual: Off</option>
              <option value="ur.maududi.api">Urdu (Maududi)</option>
              <option value="en.saheeh">English (Saheeh)</option>
              <option value="hi.azizul">Hindi (Azizul Haque)</option>
              <option value="hinglish.paraphrase">Hinglish / Roman</option>
              <option value="bn.taisirul">Bengali (Taisirul Quran)</option>
              <option value="fr.hamidullah">French (Hamidullah)</option>
              <option value="id.ministry">Indonesian (Islamic Affairs Ministry)</option>
            </select>
          </div>

          {/* Zen Mode Button */}
          <button
            onClick={() => setZenMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold transition-all shadow-xs"
            title="Enter Distraction-Free Tilawat Zen Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zen Mode</span>
          </button>

          {/* Hifz Memorisation Mode Toggle */}
          <button
            onClick={() => setHifzMode(!hifzMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              hifzMode
                ? 'bg-[#064e3b] text-white border border-emerald-600 ring-2 ring-emerald-400/30 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60'
            }`}
            title="Toggle Hifz Practice Mode (hides Arabic text for active recall)"
          >
            {hifzMode ? <EyeOff className="w-3.5 h-3.5 text-amber-300" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">Hifz Practice</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('ayah')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'ayah'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ayah View
            </button>
            <button
              onClick={() => setViewMode('mushaf')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'mushaf'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mushaf View
            </button>
          </div>

          {/* Prev/Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              disabled={selectedSurahId <= 1}
              onClick={() => onSelectSurahId(selectedSurahId - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Surah"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              disabled={selectedSurahId >= 114}
              onClick={() => onSelectSurahId(selectedSurahId + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next Surah"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Surah Banner */}
      {currentSurah && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#022c22] text-white text-center shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h2 className="font-arabic text-4xl sm:text-5xl text-[#fbbf24] font-bold">
              {currentSurah.name_arabic}
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold tracking-wide">
              {currentSurah.name_simple}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-md mx-auto">
              "{currentSurah.name_english}" • Revealed in {currentSurah.revelation_place.toUpperCase()} • {currentSurah.verses_count} Verses
            </p>

            {/* Bismillah Banner (All Surahs except Surah At-Tawbah 9) */}
            {selectedSurahId !== 9 && (
              <div className="pt-4 border-t border-emerald-600/40 mt-4">
                <p className="font-arabic text-2xl sm:text-3xl text-emerald-100/95">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading verified Quranic text...</p>
        </div>
      )}

      {error && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-center text-red-700 dark:text-red-300 text-xs">
          <p className="font-bold">Error loading Surah</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Verses Container */}
      {!loading && !error && (
        <>
          {tajweedEnabled && <TajweedLegendBar />}

          {/* Hifz Active Recall Notification Banner */}
          {hifzMode && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200 text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-200/70 dark:bg-amber-900/60 flex items-center justify-center text-sm font-bold shadow-xs">
                  🎯
                </span>
                <div>
                  <p className="font-bold">Hifz Active Recall Mode Enabled</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80">
                    Arabic verses are hidden. Recite from memory and tap any verse card to reveal and test your accuracy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHifzMode(false)}
                className="px-3 py-1.5 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-300 text-xs font-bold text-amber-900 dark:text-amber-100 transition-colors shrink-0 shadow-xs"
              >
                Exit Hifz Mode
              </button>
            </div>
          )}

          {viewMode === 'ayah' ? (
            /* Ayah-by-Ayah Mode */
            <div className="space-y-4">
              {ayahs.map((ayah) => (
                <AyahCard
                  key={ayah.verse_key}
                  ayah={ayah}
                  surahNameSimple={currentSurah?.name_simple || ''}
                  surahNameArabic={currentSurah?.name_arabic || ''}
                  selectedTranslation={selectedTranslation}
                  secondaryTranslation={secondaryTranslation}
                  arabicFontSize={arabicFontSize}
                  tajweedEnabled={tajweedEnabled}
                  isPlaying={playingAyahKey === ayah.verse_key}
                  onPlayAudio={onPlayAudio}
                  onSelectWord={(w) => setSelectedWord(w)}
                  onOpenTafsir={onOpenTafsir}
                  onOpenNote={onOpenNote}
                  onToggleBookmark={onToggleBookmark}
                  onOpenQuoteCard={(a) => setActiveQuoteCardAyah(a)}
                  isBookmarked={bookmarkedKeys.has(ayah.verse_key)}
                  hideArabicText={hifzMode}
                />
              ))}
            </div>
          ) : (
            /* Continuous Mushaf Reading View */
            <div className="p-6 sm:p-10 rounded-3xl bg-[#fdfbf7] dark:bg-slate-900 border border-emerald-950/15 dark:border-slate-800 shadow-sm leading-loose">
              <div
                className="font-arabic text-justify text-slate-900 dark:text-slate-100"
                style={{ fontSize: `${arabicFontSize + 2}px`, lineHeight: 2.6 }}
                dir="rtl"
              >
                {ayahs.map((ayah) => (
                  <span
                    key={ayah.verse_key}
                    onClick={() => onPlayAudio(ayah)}
                    className={`inline cursor-pointer px-1 rounded-sm hover:bg-emerald-100/60 dark:hover:bg-slate-800 transition-colors ${
                      playingAyahKey === ayah.verse_key ? 'bg-amber-100/70 dark:bg-amber-950/40' : ''
                    }`}
                  >
                    {tajweedEnabled ? renderTajweedText(ayah.text_uthmani) : ayah.text_uthmani}
                    <span className="inline-block mx-1.5 text-xs font-sans text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40 align-middle">
                      ۝ {ayah.verse_number}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Surah Selector Modal */}
      {showSurahModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-emerald-950/15 dark:border-slate-800 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#064e3b] dark:text-[#fbbf24]" />
                Select Surah (114 Chapters)
              </h3>
              <button
                onClick={() => setShowSurahModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Search filter input */}
            <div className="my-3 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, number, or Arabic..."
                value={surahFilter}
                onChange={(e) => setSurahFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#064e3b]"
              />
            </div>

            {/* Surahs Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
              {filteredSurahs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSurahId(s.id);
                    setShowSurahModal(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    s.id === selectedSurahId
                      ? 'bg-emerald-50 dark:bg-slate-800 border-[#064e3b] text-[#064e3b] dark:text-[#fbbf24] font-bold shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {s.id}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                        {s.name_simple}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {s.verses_count} ayahs • {s.revelation_place}
                      </p>
                    </div>
                  </div>
                  <span className="font-arabic text-sm text-[#064e3b] dark:text-[#fbbf24]">
                    {s.name_arabic}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Word Popover */}
      <WordPopover
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        onExploreRoot={onExploreRoot}
      />

      {/* Ayah Quote Card HD Generator Modal */}
      {activeQuoteCardAyah && (
        <AyahQuoteCardModal
          ayah={activeQuoteCardAyah}
          surahName={currentSurah?.name_simple}
          onClose={() => setActiveQuoteCardAyah(null)}
        />
      )}

      {/* Tilawat Zen Mode (Distraction-Free Immersion) */}
      {zenMode && (
        <div className="fixed inset-0 z-50 bg-[#021811] text-emerald-50 flex flex-col backdrop-blur-xl animate-fade-in">
          {/* Top Zen Floating Bar */}
          <header className="p-4 sm:px-8 border-b border-emerald-900/60 bg-[#01100b]/80 backdrop-blur-md flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZenMode(false)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/50 text-xs font-semibold transition-all shadow-sm"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Exit Zen Mode</span>
              </button>
              <div className="hidden sm:block">
                <span className="font-arabic text-xl text-[#fbbf24] font-bold mr-2">
                  {currentSurah?.name_arabic}
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  {currentSurah?.name_simple} • {currentSurah?.verses_count} Ayahs
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-sans hidden md:inline">
                {playingAyahKey ? `Reciting: ${playingAyahKey}` : 'Tap Ayah to Listen'}
              </span>
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  autoScroll
                    ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50'
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                }`}
              >
                Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
              </button>
            </div>
          </header>

          {/* Centered Zen Recitation Flow */}
          <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-16 max-w-4xl mx-auto w-full space-y-12">
            {/* Zen Bismillah Banner */}
            {selectedSurahId !== 9 && (
              <div className="text-center py-6">
                <p className="font-arabic text-3xl sm:text-4xl text-[#fbbf24] tracking-wide">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#fbbf24]/50 to-transparent mx-auto mt-4" />
              </div>
            )}

            {/* Ayahs Stream */}
            <div className="space-y-8">
              {ayahs.map((ayah) => {
                const isPlaying = playingAyahKey === ayah.verse_key;
                const translation = ayah.translations?.find(
                  (t) => t.edition_identifier === selectedTranslation
                );

                return (
                  <article
                    key={ayah.verse_key}
                    id={`zen-ayah-${ayah.verse_key}`}
                    onClick={() => onPlayAudio(ayah)}
                    className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 cursor-pointer text-right border ${
                      isPlaying
                        ? 'bg-emerald-900/30 border-[#fbbf24]/70 shadow-2xl ring-1 ring-[#fbbf24]/40'
                        : 'bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-700/50 hover:bg-emerald-950/35'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-900/40 text-xs">
                      <div className="flex items-center gap-2">
                        {isPlaying && (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fbbf24]/20 border border-[#fbbf24]/40 text-[#fbbf24] text-[11px] font-bold animate-pulse">
                            <Sparkles className="w-3 h-3" /> Playing
                          </span>
                        )}
                        <span className="text-emerald-400 font-sans">
                          Ayah {ayah.verse_key}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveQuoteCardAyah(ayah);
                        }}
                        className="p-1 rounded-lg text-emerald-400 hover:text-[#fbbf24] hover:bg-emerald-900/50 transition-colors"
                        title="Share as Quote Card"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <p
                      className="font-arabic text-emerald-100 leading-loose select-text"
                      style={{ fontSize: `${arabicFontSize + 6}px`, lineHeight: 2.4 }}
                      dir="rtl"
                    >
                      {ayah.text_uthmani}
                      <span className="inline-block mr-3 text-sm font-sans text-[#fbbf24] bg-emerald-900/70 px-2.5 py-0.5 rounded-full border border-emerald-700/60 align-middle">
                        ۝ {ayah.verse_number}
                      </span>
                    </p>

                    {/* Subtle Translation Subtitle */}
                    {translation && (
                      <p className="mt-4 pt-3 border-t border-emerald-900/30 text-sm text-emerald-300/80 leading-relaxed font-sans text-left">
                        {translation.text}
                      </p>
                    )}
                    {!translation && (
                      <p className="mt-4 pt-3 border-t border-emerald-900/30 text-sm text-emerald-200/80 leading-relaxed font-sans text-left">
                        This translation is not available for this Ayah yet.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
