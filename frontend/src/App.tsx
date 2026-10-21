import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { NavSection } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AudioPlayerBar } from './components/layout/AudioPlayerBar';
import { DashboardView } from './components/home/DashboardView';
import { QuranReader } from './components/quran/QuranReader';
import { TafsirLibraryView } from './components/tafsir/TafsirLibraryView';
import { MemorisationAudioView } from './components/audio/MemorisationAudioView';
import { IslamicLibraryView } from './components/maktabah/IslamicLibraryView';
import { AdminIntegrityView } from './components/admin/AdminIntegrityView';
import { DailyCompanionView } from './components/companion/DailyCompanionView';
import { ResearchStudioView } from './components/research/ResearchStudioView';
import { MyLibraryView } from './components/library/MyLibraryView';
import { AyahDetailModal } from './components/modals/AyahDetailModal';
import { WordPopover } from './components/quran/WordPopover';
import type { SurahSummary, Ayah, Reciter, Word } from './types';
import { api } from './services/api';
import {
  isFontSize,
  isInterfaceLanguage,
  isNavSection,
  isSurahId,
  isTheme,
  isTranslation,
  usePersistentState,
} from './preferences';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = usePersistentState<NavSection>(
    'noor_current_section',
    'home',
    isNavSection,
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [surahsError, setSurahsError] = useState<string | null>(null);
  const [surahsRetry, setSurahsRetry] = useState(0);
  const [selectedSurahId, setSelectedSurahId] = usePersistentState('noor_selected_surah', 1, isSurahId);
  const [currentTheme, setCurrentTheme] = usePersistentState<'light' | 'dark' | 'sepia'>('noor_theme', 'light', isTheme);
  const [arabicFontSize, setArabicFontSize] = usePersistentState('noor_arabic_font_size', 28, isFontSize);
  const [tajweedEnabled, setTajweedEnabled] = usePersistentState(
    'noor_tajweed_enabled',
    false,
    (value): value is boolean => typeof value === 'boolean',
  );
  const [selectedTranslation, setSelectedTranslation] = usePersistentState(
    'noor_translation',
    'en.saheeh',
    isTranslation,
  );
  const [interfaceLanguage, setInterfaceLanguage] = usePersistentState(
    'noor_interface_language',
    'en',
    isInterfaceLanguage,
  );

  // Audio State
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<string>(() => {
    try {
      return localStorage.getItem('noor_selected_reciter') || 'alafasy';
    } catch {
      return 'alafasy';
    }
  });
  const [playingAyah, setPlayingAyah] = useState<Ayah | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(1);

  useEffect(() => {
    try {
      localStorage.setItem('noor_selected_reciter', selectedReciter);
    } catch {}
  }, [selectedReciter]);

  // Bookmarks & Modals
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(new Set());
  const [activeEvidenceKey, setActiveEvidenceKey] = useState<string | null>(null);
  const [activeWordPopover, setActiveWordPopover] = useState<Word | null>(null);
  const [initialRoot, setInitialRoot] = useState<string | undefined>(undefined);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    api.getReciters().then(setReciters).catch(console.error);
    api.getBookmarks()
      .then((bms) => {
        setBookmarkedKeys(new Set(bms.map((b) => b.verse_key)));
      })
      .catch(console.error);

    // URL Hash handling for deep linking and refresh persistence
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') as NavSection;
      if (isNavSection(hash)) {
        setCurrentSection(hash);
      }
    };

    const initialHash = window.location.hash.replace(/^#\/?/, '') as NavSection;
    if (isNavSection(initialHash)) {
      setCurrentSection(initialHash);
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Keep URL hash in sync with active section
  useEffect(() => {
    if (currentSection && window.location.hash.replace(/^#\/?/, '') !== currentSection) {
      try {
        window.history.replaceState(null, '', `#${currentSection}`);
      } catch {}
    }
  }, [currentSection]);

  useEffect(() => {
    let active = true;
    api.getSurahs()
      .then((data) => {
        if (!active) return;
        setSurahs(data);
        setSurahsError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error(error);
        setSurahsError(error instanceof Error ? error.message : 'Unable to load Surahs.');
      })
      .finally(() => {
        if (active) setSurahsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [surahsRetry]);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia');
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme === 'sepia') {
      root.classList.add('sepia');
    }
  }, [currentTheme]);

  useEffect(() => {
    document.documentElement.lang = interfaceLanguage;
  }, [interfaceLanguage]);

  // Reading History Persistence
  const recordReadingHistory = (verseKey: string, surahName?: string, snippet?: string) => {
    try {
      const raw = localStorage.getItem('noor_reading_history');
      const list = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((item: any) => item.verse_key !== verseKey);
      const updated = [
        {
          verse_key: verseKey,
          surah: surahName || `Surah ${verseKey.split(':')[0]}`,
          snippet: snippet || '',
          timestamp: Date.now()
        },
        ...filtered
      ].slice(0, 30);
      localStorage.setItem('noor_reading_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Audio Controls
  const handlePlayAudio = (ayah: Ayah) => {
    recordReadingHistory(ayah.verse_key, undefined, ayah.text_uthmani);
    if (playingAyah?.verse_key === ayah.verse_key) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingAyah(ayah);
      setIsPlaying(true);
    }
  };

  const handleSelectReciter = (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (playingAyah) {
      api.getAyah(playingAyah.verse_key, reciterId)
        .then((updatedAyah) => {
          setPlayingAyah(updatedAyah);
        })
        .catch(console.error);
    }
  };

  const handleNextAyah = () => {
    if (!playingAyah) return;
    const parts = playingAyah.verse_key.split(':');
    const sId = parseInt(parts[0]);
    const vNum = parseInt(parts[1]);
    const nextKey = `${sId}:${vNum + 1}`;
    api.getAyah(nextKey, selectedReciter)
      .then((nextAyah) => {
        setPlayingAyah(nextAyah);
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const handlePrevAyah = () => {
    if (!playingAyah) return;
    const parts = playingAyah.verse_key.split(':');
    const sId = parseInt(parts[0]);
    const vNum = parseInt(parts[1]);
    if (vNum <= 1) return;
    const prevKey = `${sId}:${vNum - 1}`;
    api.getAyah(prevKey, selectedReciter)
      .then((prevAyah) => {
        setPlayingAyah(prevAyah);
        setIsPlaying(true);
      })
      .catch(() => {});
  };

  const handleToggleBookmark = (verseKey: string) => {
    if (bookmarkedKeys.has(verseKey)) {
      setBookmarkedKeys((prev) => {
        const next = new Set(prev);
        next.delete(verseKey);
        return next;
      });
    } else {
      api.addBookmark(verseKey, 'Favorites').catch(console.error);
      setBookmarkedKeys((prev) => new Set(prev).add(verseKey));
    }
  };

  const handleOpenAyahInReader = (verseKey: string) => {
    recordReadingHistory(verseKey);
    const parts = verseKey.split(':');
    if (parts.length === 2 && !isNaN(Number(parts[0]))) {
      setSelectedSurahId(Number(parts[0]));
      setCurrentSection('reader');
      setTimeout(() => {
        const el = document.getElementById(`ayah-${verseKey}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const handleExploreRoot = (rootLetters: string) => {
    setInitialRoot(rootLetters);
    setCurrentSection('linguistics');
  };

  return (
    <div className={`min-h-screen bg-[#fcfbf9] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors ${currentTheme === 'sepia' ? 'bg-[#f4ecd8] text-[#3d2e1e]' : ''}`}>
      {/* 5-Pillar Focused Responsive Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        interfaceLanguage={interfaceLanguage}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 pb-28">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => {
            setSearchInitialQuery('');
            setCurrentSection('search');
          }}
          currentTheme={currentTheme}
          onChangeTheme={setCurrentTheme}
          arabicFontSize={arabicFontSize}
          onChangeArabicFontSize={setArabicFontSize}
          tajweedEnabled={tajweedEnabled}
          onToggleTajweed={() => setTajweedEnabled(!tajweedEnabled)}
          selectedTranslation={selectedTranslation}
          onChangeTranslation={setSelectedTranslation}
          interfaceLanguage={interfaceLanguage}
          onChangeInterfaceLanguage={setInterfaceLanguage}
          onOpenCalendar={() => setCurrentSection('companion')}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentSection === 'home' && (
            <DashboardView
              surahs={surahs}
              interfaceLanguage={interfaceLanguage}
              onNavigate={(sec) => setCurrentSection(sec)}
              onSelectSurahId={setSelectedSurahId}
              onOpenAyahModal={(vk) => setActiveEvidenceKey(vk)}
              onPlayAudio={handlePlayAudio}
            />
          )}

          {currentSection === 'reader' && (
            <QuranReader
              surahs={surahs}
              selectedSurahId={selectedSurahId}
              onSelectSurahId={setSelectedSurahId}
              selectedTranslation={selectedTranslation}
              arabicFontSize={arabicFontSize}
              tajweedEnabled={tajweedEnabled}
              playingAyahKey={playingAyah?.verse_key || null}
              onPlayAudio={handlePlayAudio}
              onOpenTafsir={(vk) => setActiveEvidenceKey(vk)}
              onOpenNote={(_vk) => {
                setCurrentSection('notebook');
              }}
              onToggleBookmark={handleToggleBookmark}
              bookmarkedKeys={bookmarkedKeys}
              onExploreRoot={handleExploreRoot}
            />
          )}

          {(currentSection === 'companion' || currentSection === 'calendar') && (
            <DailyCompanionView
              onOpenAyahInReader={handleOpenAyahInReader}
              initialTab={currentSection === 'calendar' ? 'calendar' : 'prayers'}
            />
          )}

          {(currentSection === 'research' || currentSection === 'search' || currentSection === 'linguistics' || currentSection === 'hadith') && (
            <ResearchStudioView
              onOpenAyahInReader={handleOpenAyahInReader}
              initialTab={
                currentSection === 'linguistics'
                  ? 'linguistics'
                  : currentSection === 'hadith'
                  ? 'hadith'
                  : currentSection === 'search'
                  ? 'search'
                  : 'graph'
              }
              initialSearchQuery={searchInitialQuery}
              initialRoot={initialRoot}
              surahs={surahs}
              selectedSurahId={selectedSurahId}
              onSelectSurahId={setSelectedSurahId}
              interfaceLanguage={interfaceLanguage}
              onRetrySurahList={() => {
                setSurahsLoading(true);
                setSurahsError(null);
                setSurahsRetry((attempt) => attempt + 1);
              }}
              surahListError={surahsError}
              surahListLoading={surahsLoading}
            />
          )}

          {(currentSection === 'library' || currentSection === 'bookmarks' || currentSection === 'notebook' || currentSection === 'history') && (
            <MyLibraryView
              onOpenAyahInReader={handleOpenAyahInReader}
              initialTab={
                currentSection === 'notebook'
                  ? 'notebook'
                  : currentSection === 'history'
                  ? 'history'
                  : 'bookmarks'
              }
            />
          )}

          {currentSection === 'tafsir' && (
            <TafsirLibraryView
              surahs={surahs}
              initialVerseKey={playingAyah?.verse_key || '1:1'}
              onOpenAyahInReader={handleOpenAyahInReader}
            />
          )}

          {currentSection === 'hifz' && (
            <MemorisationAudioView
              surahs={surahs}
              onPlayAudio={handlePlayAudio}
              playingAyahKey={playingAyah?.verse_key || null}
            />
          )}

          {(currentSection === 'maktabah' || currentSection === 'academy') && (
            <IslamicLibraryView
              onOpenAyahInReader={handleOpenAyahInReader}
            />
          )}

          {currentSection === 'admin' && (
            <AdminIntegrityView />
          )}
        </main>
      </div>

      {/* Sticky Bottom Audio Player */}
      <AudioPlayerBar
        currentAyah={playingAyah}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        reciters={reciters}
        selectedReciter={selectedReciter}
        onSelectReciter={handleSelectReciter}
        repeatCount={repeatCount}
        onChangeRepeatCount={setRepeatCount}
        onClose={() => {
          setIsPlaying(false);
          setPlayingAyah(null);
        }}
      />

      {/* Comprehensive Ayah Evidence Card Modal */}
      {activeEvidenceKey && (
        <AyahDetailModal
          verseKey={activeEvidenceKey}
          onClose={() => setActiveEvidenceKey(null)}
          onPlayAudio={handlePlayAudio}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={bookmarkedKeys.has(activeEvidenceKey)}
          onSelectWord={(w) => setActiveWordPopover(w)}
        />
      )}

      {/* Word Morphology Popover */}
      {activeWordPopover && (
        <WordPopover
          word={activeWordPopover}
          onClose={() => setActiveWordPopover(null)}
          onExploreRoot={handleExploreRoot}
        />
      )}
    </div>
  );
};

export default App;
