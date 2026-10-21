import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Library,
  GraduationCap,
  Search,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookMarked,
  ChevronRight,
  ChevronLeft,
  Layers,
  Award,
  ArrowLeft,
  Copy,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import {
  ISLAMIC_BOOKS,
  QURAN_EDITIONS,
  QAIDA_ALPHABET,
  QAIDA_LESSONS,
  QAIDA_QUIZ_QUESTIONS,
  type IslamicBook,
  type QuranEdition,
  type QaidaLetter,
  type QaidaLesson
} from '../../data/islamicLibraryData';
import {
  BOOK_CHAPTERS_MAP,
  type BookChapter,
  type BookSection
} from '../../data/islamicBookChapters';

interface IslamicLibraryViewProps {
  onOpenAyahInReader?: (verseKey: string) => void;
  initialTab?: 'books' | 'mushafs' | 'qaida';
}

export type MaktabahTab = 'books' | 'mushafs' | 'qaida';

export const IslamicLibraryView: React.FC<IslamicLibraryViewProps> = ({
  initialTab = 'books'
}) => {
  const [activeTab, setActiveTab] = useState<MaktabahTab>(() => {
    if (initialTab && initialTab !== 'books') return initialTab;
    try {
      const stored = localStorage.getItem('noor_maktabah_active_tab') as MaktabahTab;
      if (['books', 'mushafs', 'qaida'].includes(stored)) return stored;
    } catch {}
    return initialTab;
  });

  // Tab 1 (Books) States
  const [bookCategory, setBookCategory] = useState<string>('all');
  const [bookSearch, setBookSearch] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<IslamicBook | null>(null);

  // In-App Book Reader States (100% Open-Source & Zero-Login)
  const [readingBook, setReadingBook] = useState<IslamicBook | null>(() => {
    try {
      const storedId = localStorage.getItem('noor_maktabah_reading_book_id');
      if (storedId) {
        const found = ISLAMIC_BOOKS.find((b) => b.id === storedId);
        if (found) return found;
      }
    } catch {}
    return null;
  });
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('noor_maktabah_reading_chapter_index');
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    } catch {}
    return 0;
  });
  const [readerFontSize, setReaderFontSize] = useState<number>(20);
  const [readerLanguageFilter, setReaderLanguageFilter] = useState<'all' | 'arabic' | 'english' | 'urdu'>('all');
  const [playingSectionId, setPlayingSectionId] = useState<string | null>(null);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [chapterSearch, setChapterSearch] = useState<string>('');
  const [showChapterDrawer, setShowChapterDrawer] = useState<boolean>(false);

  // Persist reading position and tab across refreshes
  useEffect(() => {
    try {
      localStorage.setItem('noor_maktabah_active_tab', activeTab);
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    try {
      if (readingBook) {
        localStorage.setItem('noor_maktabah_reading_book_id', readingBook.id);
        localStorage.setItem('noor_maktabah_reading_chapter_index', activeChapterIndex.toString());
      } else {
        localStorage.removeItem('noor_maktabah_reading_book_id');
        localStorage.removeItem('noor_maktabah_reading_chapter_index');
      }
    } catch {}
  }, [readingBook, activeChapterIndex]);

  // Helper to retrieve chapters or safe structured fallback
  const getBookChapters = (book: IslamicBook): BookChapter[] => {
    if (BOOK_CHAPTERS_MAP[book.id] && BOOK_CHAPTERS_MAP[book.id].length > 0) {
      return BOOK_CHAPTERS_MAP[book.id];
    }
    return [
      {
        id: `${book.id}_ch1`,
        chapter_number: 1,
        title: book.key_chapters[0] || 'Foundations & Core Principles',
        title_ar: book.title_ar,
        title_ur: book.title,
        summary: book.significance,
        sections: [
          {
            id: `${book.id}_sec1`,
            heading: book.key_chapters[0] || 'Selected Classical Excerpt',
            heading_ar: 'النص المختار من الكتاب',
            arabic: book.sample_passage.arabic,
            english: book.sample_passage.english,
            urdu: book.sample_passage.urdu,
            reference: `${book.title} • ${book.volumes}`
          }
        ]
      }
    ];
  };

  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // High-fidelity Arabic Audio Player (Cloud TTS + SpeechSynthesis Fallback)
  const playArabicAudio = (text: string, onStart?: () => void, onEnd?: () => void) => {
    try {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (onStart) onStart();

      const safeUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(text)}`;
      const audio = new Audio(safeUrl);
      activeAudioRef.current = audio;

      audio.onended = () => {
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        // Fallback to local SpeechSynthesis if offline
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.82;
          utterance.onend = () => { if (onEnd) onEnd(); };
          utterance.onerror = () => { if (onEnd) onEnd(); };
          window.speechSynthesis.speak(utterance);
        } else {
          if (onEnd) onEnd();
        }
      };

      audio.play().catch(() => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.82;
          utterance.onend = () => { if (onEnd) onEnd(); };
          utterance.onerror = () => { if (onEnd) onEnd(); };
          window.speechSynthesis.speak(utterance);
        } else {
          if (onEnd) onEnd();
        }
      });
    } catch {
      if (onEnd) onEnd();
    }
  };

  // Pronounce Arabic Section in Book Reader
  const playSectionAudio = (sectionId: string, arabicText: string) => {
    if (playingSectionId === sectionId) {
      if (activeAudioRef.current) activeAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingSectionId(null);
      return;
    }

    playArabicAudio(
      arabicText,
      () => setPlayingSectionId(sectionId),
      () => setPlayingSectionId(null)
    );
  };

  // Copy Section Content to Clipboard
  const handleCopySection = (section: BookSection, bookTitle: string) => {
    const textToCopy = `📖 ${bookTitle}
${section.heading ? `\n[${section.heading}]\n` : ''}
${section.arabic}

English:
${section.english}

Urdu:
${section.urdu}

Reference: ${section.reference || bookTitle}
— Read via Noor-ul-Quran (نور القرآن)`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSectionId(section.id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  // Tab 2 (Mushaf) States
  const [selectedEdition, setSelectedEdition] = useState<QuranEdition>(QURAN_EDITIONS[0]);

  // Tab 3 (Qaida) States

  const [qaidaSubTab, setQaidaSubTab] = useState<'alphabet' | 'lessons' | 'quiz'>('alphabet');
  const [selectedLesson, setSelectedLesson] = useState<QaidaLesson>(QAIDA_LESSONS[0]);
  const [alphabetFilter, setAlphabetFilter] = useState<'all' | 'heavy' | 'qalqalah'>('all');
  const [playingLetterId, setPlayingLetterId] = useState<number | null>(null);
  const [playingWordText, setPlayingWordText] = useState<string | null>(null);

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Pronounce Arabic Letter in Noorani Qaida Alphabet
  const playLetterAudio = (letter: QaidaLetter) => {
    if (playingLetterId === letter.id) {
      if (activeAudioRef.current) activeAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingLetterId(null);
      return;
    }
    playArabicAudio(
      letter.arabic,
      () => setPlayingLetterId(letter.id),
      () => setPlayingLetterId(null)
    );
  };

  // Pronounce Arabic Practice Word or Lesson Example
  const playWordAudio = (wordArabic: string) => {
    if (playingWordText === wordArabic) {
      if (activeAudioRef.current) activeAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingWordText(null);
      return;
    }
    playArabicAudio(
      wordArabic,
      () => setPlayingWordText(wordArabic),
      () => setPlayingWordText(null)
    );
  };

  // Filtered Books
  const filteredBooks = ISLAMIC_BOOKS.filter((b) => {
    const matchCat = bookCategory === 'all' || b.category === bookCategory;
    const matchSearch =
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.title_ar.includes(bookSearch) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.description.toLowerCase().includes(bookSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filtered Letters
  const filteredLetters = QAIDA_ALPHABET.filter((l) => {
    if (alphabetFilter === 'heavy') return l.is_heavy;
    if (alphabetFilter === 'qalqalah') return l.is_qalqalah;
    return true;
  });

  // Calculate Quiz Score
  const calculateScore = () => {
    let score = 0;
    QAIDA_QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correct_index) score += 1;
    });
    return score;
  };

  // ==========================================================================
  // IN-APP NATIVE BOOK READER (100% FREE • OPEN SOURCE • ZERO LOGIN)
  // ==========================================================================
  if (readingBook) {
    const chapters = getBookChapters(readingBook);
    const safeChapterIndex = Math.min(Math.max(0, activeChapterIndex), Math.max(0, chapters.length - 1));
    const currentChapter = chapters[safeChapterIndex] || chapters[0];

    // Filter sections by search term in current chapter
    const filteredSections = currentChapter.sections.filter((sec) => {
      if (!chapterSearch.trim()) return true;
      const q = chapterSearch.toLowerCase();
      return (
        (sec.heading && sec.heading.toLowerCase().includes(q)) ||
        (sec.heading_ar && sec.heading_ar.includes(chapterSearch)) ||
        sec.arabic.includes(chapterSearch) ||
        sec.english.toLowerCase().includes(q) ||
        sec.urdu.includes(chapterSearch) ||
        (sec.reference && sec.reference.toLowerCase().includes(q))
      );
    });

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-200">
        {/* Top Breadcrumb & Quick Exit */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setReadingBook(null);
              setPlayingSectionId(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
            <span>Back to Islamic Library (العودة إلى المكتبة)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-[11px] font-bold border border-emerald-200/80 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>100% Free Open Edition • No Sign-In Needed</span>
            </span>

            {readingBook.open_access_url && (
              <a
                href={readingBook.open_access_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#064e3b] dark:hover:text-[#fbbf24] transition-colors shadow-2xs"
                title="View on External Archive (Archive.org / Sunnah.com)"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Book Header Banner */}
        <div className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#047857] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#fbbf24] font-bold border border-white/15 uppercase tracking-wider">
                {readingBook.category.replace('_', ' & ')}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-medium border border-white/15">
                {readingBook.volumes}
              </span>
              <span className="text-emerald-100 font-medium">
                d. {readingBook.death_year_ah} AH / {readingBook.death_year_ce} CE
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {readingBook.title}
                </h1>
                <p className="font-arabic text-xl sm:text-2xl text-[#fbbf24] mt-1" dir="rtl">
                  {readingBook.title_ar}
                </p>
                <p className="text-xs sm:text-sm text-emerald-100 mt-2 font-medium">
                  By <span className="font-bold text-white">{readingBook.author}</span> ({readingBook.author_ar})
                </p>
              </div>

              <button
                onClick={() => setShowChapterDrawer(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto shadow-sm"
              >
                <Layers className="w-4 h-4 text-[#fbbf24]" />
                <span>All Chapters ({chapters.length})</span>
              </button>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed border-t border-white/15 pt-3 max-w-3xl">
              {readingBook.significance}
            </p>
          </div>
        </div>

        {/* Floating / Sticky Reading Controls Toolbar */}
        <div className="sticky top-2 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
          {/* Chapter Selector Dropdown */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <BookMarked className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24] shrink-0" />
            <select
              value={safeChapterIndex}
              onChange={(e) => {
                setActiveChapterIndex(Number(e.target.value));
                setChapterSearch('');
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#064e3b]"
            >
              {chapters.map((ch, idx) => (
                <option key={ch.id} value={idx}>
                  Chapter {ch.chapter_number}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Font Resizer */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">Font</span>
            <button
              onClick={() => setReaderFontSize((prev) => Math.max(16, prev - 2))}
              disabled={readerFontSize <= 16}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"
              title="Decrease Arabic font size"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-[#064e3b] dark:text-[#fbbf24] px-1">
              {readerFontSize}px
            </span>
            <button
              onClick={() => setReaderFontSize((prev) => Math.min(34, prev + 2))}
              disabled={readerFontSize >= 34}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"
              title="Increase Arabic font size"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language Toggle Pills */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'all', label: 'All (الكل)' },
              { id: 'arabic', label: 'Arabic' },
              { id: 'english', label: 'English' },
              { id: 'urdu', label: 'Urdu (اردو)' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setReaderLanguageFilter(lang.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  readerLanguageFilter === lang.id
                    ? 'bg-[#064e3b] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Search in Chapter */}
          <div className="relative min-w-[150px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in chapter..."
              value={chapterSearch}
              onChange={(e) => setChapterSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>
        </div>

        {/* Current Chapter Hero Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-xs font-extrabold border border-emerald-100 dark:border-slate-700 uppercase">
              Chapter {currentChapter.chapter_number} of {chapters.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {currentChapter.sections.length} Verified {currentChapter.sections.length === 1 ? 'Section' : 'Sections'}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentChapter.title}
            </h2>
            <p className="font-arabic text-xl sm:text-2xl text-[#064e3b] dark:text-[#fbbf24] mt-1.5" dir="rtl">
              {currentChapter.title_ar}
            </p>
            {currentChapter.title_ur && (
              <p className="font-urdu text-base text-slate-600 dark:text-slate-300 mt-1" dir="rtl">
                {currentChapter.title_ur}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">
              Chapter Synopsis & Scholarly Theme:
            </span>
            <p>{currentChapter.summary}</p>
          </div>
        </div>

        {/* Sections Reading Cards */}
        <div className="space-y-5">
          {filteredSections.map((sec, idx) => (
            <div
              key={sec.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group"
            >
              {/* Section Header with Actions */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    {sec.heading && (
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {sec.heading}
                      </h3>
                    )}
                  </div>
                  {sec.heading_ar && (
                    <p className="font-arabic text-sm text-[#064e3b] dark:text-[#fbbf24]" dir="rtl">
                      {sec.heading_ar}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Listen Pronunciation */}
                  <button
                    onClick={() => playSectionAudio(sec.id, sec.arabic)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      playingSectionId === sec.id
                        ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Pronounce Arabic Text (استمع للنطق العربي)"
                  >
                    {playingSectionId === sec.id ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span className="hidden sm:inline">Playing...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
                        <span className="hidden sm:inline">Listen</span>
                      </>
                    )}
                  </button>

                  {/* Copy Text */}
                  <button
                    onClick={() => handleCopySection(sec, readingBook.title)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Copy Text & Translations"
                  >
                    {copiedSectionId === sec.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  {/* Reference Badge */}
                  {sec.reference && (
                    <span className="hidden md:inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {sec.reference}
                    </span>
                  )}
                </div>
              </div>

              {/* Arabic Vocalized Script */}
              {(readerLanguageFilter === 'all' || readerLanguageFilter === 'arabic') && (
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200/50 dark:border-slate-700/80">
                  <p
                    className="font-arabic text-slate-900 dark:text-slate-100 text-right leading-loose select-text"
                    style={{ fontSize: `${readerFontSize}px` }}
                    dir="rtl"
                  >
                    {sec.arabic}
                  </p>
                </div>
              )}

              {/* English Translation */}
              {(readerLanguageFilter === 'all' || readerLanguageFilter === 'english') && (
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans pl-2 border-l-2 border-emerald-500/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    English Translation:
                  </span>
                  <p className="select-text">{sec.english}</p>
                </div>
              )}

              {/* Urdu Translation */}
              {(readerLanguageFilter === 'all' || readerLanguageFilter === 'urdu') && (
                <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-urdu leading-loose text-right pr-2 border-r-2 border-[#fbbf24] space-y-1" dir="rtl">
                  <span className="text-[10px] font-bold text-slate-400 font-sans block text-left" dir="ltr">
                    اردو ترجمہ و تشریح:
                  </span>
                  <p className="select-text">{sec.urdu}</p>
                </div>
              )}

              {/* Mobile Reference Footer if not on top */}
              {sec.reference && (
                <div className="md:hidden text-[11px] text-slate-400 italic pt-2 border-t border-slate-100 dark:border-slate-800">
                  Ref: {sec.reference}
                </div>
              )}
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No sections matched "{chapterSearch}"
              </p>
              <button
                onClick={() => setChapterSearch('')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#064e3b] dark:text-[#fbbf24]"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Bottom Pagination & Navigation Stepper */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              if (safeChapterIndex > 0) {
                setActiveChapterIndex(safeChapterIndex - 1);
                setChapterSearch('');
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }
            }}
            disabled={safeChapterIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter (الباب السابق)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#064e3b] dark:text-[#fbbf24]">
              Chapter {safeChapterIndex + 1} of {chapters.length}
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-xs font-bold transition-colors"
              title="Scroll to Top"
            >
              ↑ Top
            </button>
          </div>

          <button
            onClick={() => {
              if (safeChapterIndex < chapters.length - 1) {
                setActiveChapterIndex(safeChapterIndex + 1);
                setChapterSearch('');
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }
            }}
            disabled={safeChapterIndex >= chapters.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#064e3b] hover:bg-[#047857] disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white transition-colors shadow-xs"
          >
            <span>Next Chapter (الباب التالي)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Chapter Selection Drawer / Modal */}
        {showChapterDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#064e3b] dark:text-[#fbbf24]" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Select Book Chapter ({chapters.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowChapterDrawer(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setShowChapterDrawer(false);
                      setChapterSearch('');
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                      safeChapterIndex === idx
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        safeChapterIndex === idx
                          ? 'bg-[#064e3b] text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {ch.chapter_number}
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {ch.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ch.sections.length} sections
                        </span>
                      </div>
                      <p className="font-arabic text-xs text-[#064e3b] dark:text-[#fbbf24]" dir="rtl">
                        {ch.title_ar}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {ch.summary}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#047857] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#fbbf24] text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المكتبة الإسلامية الكبرى وأكاديمية القرآن</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Grand Islamic Maktabah & Quran Academy
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-medium">
              Explore classic Islamic masterpieces (Tafsir, Hadith, Sirah, Fiqh), different historical Quranic Mushafs & scripts, and complete step-by-step Noorani Qaida lessons for beginners.
            </p>
          </div>

          {/* 3 Main Pillar Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex-wrap">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'books'
                  ? 'bg-white text-[#064e3b] shadow-lg'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Islamic Books</span>
            </button>

            <button
              onClick={() => setActiveTab('mushafs')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'mushafs'
                  ? 'bg-white text-[#064e3b] shadow-lg'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Quran Editions</span>
            </button>

            <button
              onClick={() => setActiveTab('qaida')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'qaida'
                  ? 'bg-white text-[#064e3b] shadow-lg'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learn Quran Basics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================
          TAB 1: GRAND ISLAMIC BOOKS (كتب التراث الإسلامي)
         ======================================================================== */}
      {activeTab === 'books' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Controls Bar: Search & Category Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or keyword..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#064e3b]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Classics' },
                { id: 'tafsir', label: 'Tafsir (Exegesis)' },
                { id: 'hadith', label: 'Hadith Collections' },
                { id: 'sirah', label: 'Sirah & History' },
                { id: 'aqeedah_fiqh', label: 'Aqeedah & Fiqh' },
                { id: 'spirituality', label: 'Spiritual Adhkar' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setBookCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    bookCategory === c.id
                      ? 'bg-[#064e3b] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Category & Era Badge */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] font-bold border border-emerald-100 dark:border-slate-700 uppercase tracking-wider">
                      {book.category.replace('_', ' & ')}
                    </span>
                    <span className="text-slate-400 font-medium">
                      d. {book.death_year_ah} AH / {book.death_year_ce} CE
                    </span>
                  </div>

                  {/* Title & Arabic */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#064e3b] dark:group-hover:text-[#fbbf24] transition-colors">
                      {book.title}
                    </h3>
                    <p className="font-arabic text-sm text-[#064e3b] dark:text-[#fbbf24] mt-1" dir="rtl">
                      {book.title_ar}
                    </p>
                  </div>

                  {/* Author */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="text-slate-400 font-normal">Author:</span> {book.author}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Languages & Volumes */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    <span>{book.volumes}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {book.languages.map((lang) => (
                        <span key={lang} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setReadingBook(book);
                      setActiveChapterIndex(0);
                      setChapterSearch('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 group/btn"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-200 group-hover/btn:scale-110 transition-transform" />
                    <span>Read Book (اقرأ الكتاب)</span>
                  </button>

                  <button
                    onClick={() => setSelectedBook(book)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Book Overview & Scholarly Info"
                  >
                    <BookMarked className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
                  </button>

                  {book.open_access_url && (
                    <a
                      href={book.open_access_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-500 hover:text-[#064e3b] dark:text-slate-400 transition-colors"
                      title="External Source Archive"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-xs font-bold border border-emerald-100 dark:border-slate-700 uppercase">
                  {selectedBook.category} • {selectedBook.volumes}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedBook.title}
                </h3>
                <p className="font-arabic text-base text-[#064e3b] dark:text-[#fbbf24] mt-0.5" dir="rtl">
                  {selectedBook.title_ar}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  By {selectedBook.author} ({selectedBook.author_ar}) • Passed away {selectedBook.death_year_ah} AH
                </p>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Significance */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Scholarly Status & Historical Significance:</span>
              </p>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {selectedBook.significance}
              </p>
            </div>

            {/* Key Chapters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
                <span>Major Sections & Core Chapters:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedBook.key_chapters.map((chap, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="truncate">{chap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Classical Excerpt */}
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Verified Classical Excerpt • نص مقتطف
              </span>
              <p className="font-arabic text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-loose text-right" dir="rtl">
                {selectedBook.sample_passage.arabic}
              </p>
              <div className="pt-2 border-t border-amber-200/50 dark:border-slate-700 text-xs space-y-2">
                <p className="text-slate-700 dark:text-slate-300 italic">
                  <span className="font-semibold text-slate-900 dark:text-white not-italic">English:</span> {selectedBook.sample_passage.english}
                </p>
                <p className="font-urdu text-slate-700 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                  <span className="font-semibold text-slate-900 dark:text-white">اردو:</span> {selectedBook.sample_passage.urdu}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedBook.open_access_url && (
                  <a
                    href={selectedBook.open_access_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#064e3b] text-xs font-bold transition-colors"
                    title="External Archive Source (Optional)"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => {
                    const b = selectedBook;
                    setSelectedBook(null);
                    setReadingBook(b);
                    setActiveChapterIndex(0);
                    setChapterSearch('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-200" />
                  <span>Read Book Inside App (100% Free • No Login)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          TAB 2: QURAN EDITIONS & HISTORICAL CODICES (المصاحف والرسم)
         ======================================================================== */}
      {activeTab === 'mushafs' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Edition Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {QURAN_EDITIONS.map((ed) => (
              <button
                key={ed.id}
                onClick={() => setSelectedEdition(ed)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedEdition.id === ed.id
                    ? 'bg-[#064e3b] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{ed.name.split('(')[0]}</span>
              </button>
            ))}
          </div>

          {/* Selected Edition Display Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-xs font-bold border border-emerald-100 dark:border-slate-700">
                  {selectedEdition.lines_per_page} • {selectedEdition.region}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {selectedEdition.name}
                </h2>
                <p className="font-arabic text-lg text-[#064e3b] dark:text-[#fbbf24] mt-1" dir="rtl">
                  {selectedEdition.name_ar}
                </p>
                {selectedEdition.historical_era && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
                    Era: {selectedEdition.historical_era}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-600 dark:text-slate-300 shrink-0">
                <p><span className="font-bold text-slate-900 dark:text-white">Script Category:</span> {selectedEdition.script_type}</p>
                <p><span className="font-bold text-slate-900 dark:text-white">Lines / Layout:</span> {selectedEdition.lines_per_page}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedEdition.description}
            </p>

            {/* Characteristic Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
                <span>Script Nuances & Hallmarks:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedEdition.features.map((feat, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-100/70 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Verse Preview in Script Style */}
            <div className="p-6 rounded-3xl bg-[#fdfbf7] dark:bg-slate-950 border border-amber-950/15 dark:border-slate-800 shadow-inner text-center space-y-4">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
                Script Rendering Preview: {selectedEdition.sample_ayah.surah}
              </span>
              <p
                className="font-arabic text-2xl sm:text-4xl text-slate-900 dark:text-slate-100 leading-loose py-2 select-text"
                dir="rtl"
              >
                {selectedEdition.sample_ayah.text}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto italic">
                "{selectedEdition.sample_ayah.translation}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          TAB 3: LEARN QURAN BASICS & NOORANI QAIDA (تعلم القرآن من الصفر)
         ======================================================================== */}
      {activeTab === 'qaida' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Sub-Tabs: Alphabet vs Step Lessons vs Beginner Quiz */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQaidaSubTab('alphabet')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  qaidaSubTab === 'alphabet'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                1. 29 Arabic Letters & Sounds
              </button>

              <button
                onClick={() => setQaidaSubTab('lessons')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  qaidaSubTab === 'lessons'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                2. Step-by-Step Lessons (Harakaat to Tajweed)
              </button>

              <button
                onClick={() => setQaidaSubTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  qaidaSubTab === 'quiz'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                3. Beginner Knowledge Test
              </button>
            </div>

            {qaidaSubTab === 'alphabet' && (
              <div className="flex items-center gap-1 pr-2">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Filter:</span>
                {[
                  { id: 'all', label: 'All 29' },
                  { id: 'heavy', label: 'Heavy (مفخمة)' },
                  { id: 'qalqalah', label: 'Qalqalah (قلقلة)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAlphabetFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      alphabetFilter === f.id
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SUB-SECTION 1: ALPHABET & SOUNDBOARD */}
          {qaidaSubTab === 'alphabet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24] shrink-0" />
                  <span>
                    <strong>Interactive Soundboard:</strong> Click on any letter card to hear authentic Arabic pronunciation out loud, learn its anatomical makhraj, and observe its connected cursive forms.
                  </span>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700 shrink-0">
                  Total: {filteredLetters.length} Letters
                </span>
              </div>

              {/* Letters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {filteredLetters.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => playLetterAudio(l)}
                    className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md flex flex-col items-center justify-between gap-3 text-center group ${
                      playingLetterId === l.id
                        ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    {/* Top Meta: Number & Audio Icon */}
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold">#{l.id}</span>
                      <Volume2 className={`w-3.5 h-3.5 ${playingLetterId === l.id ? 'text-emerald-600 animate-pulse' : 'opacity-40 group-hover:opacity-100'}`} />
                    </div>

                    {/* Big Arabic Letter */}
                    <span className="font-arabic text-4xl sm:text-5xl text-slate-900 dark:text-white font-bold group-hover:scale-110 transition-transform">
                      {l.arabic}
                    </span>

                    {/* Name & Sound */}
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                        {l.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        /{l.transliteration}/
                      </p>
                    </div>

                    {/* Connected Forms Preview */}
                    <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs font-arabic text-slate-500" dir="rtl">
                      <span title="Initial (Start)">{l.initial}</span>
                      <span title="Medial (Middle)">{l.medial}</span>
                      <span title="Final (End)">{l.final}</span>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1 text-[9px] font-bold">
                      {l.is_heavy && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200">
                          Heavy (مفخم)
                        </span>
                      )}
                      {l.is_qalqalah && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200">
                          Echo (قلقلة)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-SECTION 2: STEP-BY-STEP LESSONS */}
          {qaidaSubTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lessons Sidebar Menu */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                  Quran Foundation Curriculum (8 Lessons)
                </h3>
                {QAIDA_LESSONS.map((les) => (
                  <button
                    key={les.id}
                    onClick={() => setSelectedLesson(les)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      selectedLesson.id === les.id
                        ? 'bg-[#064e3b] text-white border-emerald-700 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold opacity-75">
                        Lesson {les.id}
                      </span>
                      <h4 className="font-bold text-xs truncate max-w-[200px]">
                        {les.title.split('(')[0]}
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>

              {/* Active Lesson Content Panel */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-xs font-bold border border-emerald-100 dark:border-slate-700">
                    Lesson {selectedLesson.id} of 8
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                    {selectedLesson.title}
                  </h2>
                  <p className="font-arabic text-base text-[#064e3b] dark:text-[#fbbf24] mt-0.5" dir="rtl">
                    {selectedLesson.title_ar}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    {selectedLesson.subtitle}
                  </p>
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedLesson.explanation}
                </p>

                {/* Core Rules */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Rules & Guidelines:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {selectedLesson.rule_points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                        <span className="font-bold text-[#064e3b] dark:text-[#fbbf24] shrink-0">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practice Examples */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Interactive Practice Examples:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLesson.examples.map((ex, i) => {
                      const isPlaying = playingWordText === ex.arabic;
                      return (
                        <div
                          key={i}
                          onClick={() => playWordAudio(ex.arabic)}
                          className={`p-4 rounded-2xl border space-y-2 text-center cursor-pointer transition-all hover:shadow-md group/word relative select-none ${
                            isPlaying
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                              : 'bg-[#fdfbf7] dark:bg-slate-950 border-amber-900/15 dark:border-slate-800 hover:border-emerald-400'
                          }`}
                          title="Click to hear authentic Arabic pronunciation"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-mono text-[9px] font-bold">#{i + 1}</span>
                            <span className="flex items-center gap-1 text-emerald-700 dark:text-[#fbbf24] text-[10px] font-bold">
                              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-emerald-600' : 'opacity-60 group-hover/word:opacity-100'}`} />
                              <span className="opacity-0 group-hover/word:opacity-100 transition-opacity">Listen</span>
                            </span>
                          </div>
                          <p className={`font-arabic text-3xl font-bold transition-colors ${isPlaying ? 'text-[#064e3b] dark:text-[#fbbf24]' : 'text-slate-900 dark:text-slate-100 group-hover/word:text-[#064e3b] dark:group-hover/word:text-[#fbbf24]'}`} dir="rtl">
                            {ex.arabic}
                          </p>
                          <p className="text-xs font-mono font-bold text-[#064e3b] dark:text-[#fbbf24]">
                            {ex.transliteration}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {ex.note}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-SECTION 3: BEGINNER KNOWLEDGE QUIZ */}
          {qaidaSubTab === 'quiz' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#064e3b] dark:text-[#fbbf24]" />
                    <span>Beginner Quran Reading Assessment</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Test your understanding of Arabic alphabet rules, short vowels, and fundamental Tajweed concepts.
                  </p>
                </div>
                {quizSubmitted && (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] font-extrabold text-xs">
                    Score: {calculateScore()} / {QAIDA_QUIZ_QUESTIONS.length}
                  </span>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {QAIDA_QUIZ_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {idx + 1}. {q.question}
                    </p>
                    <p className="font-arabic text-sm text-[#064e3b] dark:text-[#fbbf24] text-right" dir="rtl">
                      {q.question_ar}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = q.correct_index === optIdx;
                        let optionStyle = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 border-emerald-500 font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-100 border-red-400 line-through';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-[#064e3b] text-white border-emerald-600 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`p-3 rounded-xl border text-xs text-left transition-all ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {quizSubmitted && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700">
                        <strong className="text-slate-800 dark:text-slate-200">Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit / Reset Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(quizAnswers).length < QAIDA_QUIZ_QUESTIONS.length}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit & Check Answers</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
