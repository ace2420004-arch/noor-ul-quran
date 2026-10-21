import {
  BookOpen,
  Library,
  Sparkles,
  BookMarked,
  GraduationCap,
  Repeat,
  ArrowRight,
  Play,
  Compass,
  CalendarDays,
} from 'lucide-react';
import type { SurahSummary, Ayah } from '../../types';
import type { NavSection } from '../layout/Sidebar';
import type { InterfaceLanguage } from '../../preferences';
import { t } from '../../i18n';

interface DashboardViewProps {
  surahs: SurahSummary[];
  onNavigate: (section: NavSection) => void;
  onSelectSurahId: (id: number) => void;
  onOpenAyahModal: (verseKey: string) => void;
  onPlayAudio: (ayah: Ayah) => void;
  interfaceLanguage: InterfaceLanguage;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  surahs,
  onNavigate,
  onSelectSurahId,
  onOpenAyahModal,
  onPlayAudio,
  interfaceLanguage,
}) => {
  const popularSurahs = [
    { id: 1, name: 'Al-Fatihah', ar: 'الفاتحة', ayahs: 7, desc: 'The Opening Chapter • Mother of the Book' },
    { id: 2, name: 'Al-Baqarah', ar: 'البقرة', ayahs: 286, desc: 'The Cow • Contains Ayat al-Kursi' },
    { id: 36, name: 'Ya-Sin', ar: 'يس', ayahs: 83, desc: 'The Heart of the Quran' },
    { id: 55, name: 'Ar-Rahman', ar: 'الرحمن', ayahs: 78, desc: 'The Beneficent • Which favors will you deny?' },
    { id: 67, name: 'Al-Mulk', ar: 'الملك', ayahs: 30, desc: 'The Sovereignty • Protection of the grave' },
    { id: 112, name: 'Al-Ikhlas', ar: 'الإخلاص', ayahs: 4, desc: 'Purity of Faith • Equivalent to 1/3 Quran' },
  ];

  const quickFeatures = [
    {
      id: 'reader' as NavSection,
      title: 'Quran Reader',
      ar: 'المصحف الشريف',
      desc: 'Authentic Hafs Uthmani script with word-by-word analysis and translations.',
      icon: BookOpen,
      color: 'from-emerald-700 to-emerald-900',
    },
    {
      id: 'tafsir' as NavSection,
      title: 'Tafsir Library',
      ar: 'مكتبة التفاسير',
      desc: 'Side-by-side comparative exegesis: Ibn Kathir, Al-Jalalayn, and Maududi.',
      icon: Library,
      color: 'from-amber-600 to-amber-800',
    },
    {
      id: 'research' as NavSection,
      title: 'Quran Research Lab',
      ar: 'مختبر البحوث',
      desc: 'Arabic root concordance, lemma frequencies, and interactive knowledge graph.',
      icon: Sparkles,
      color: 'from-teal-700 to-teal-900',
    },
    {
      id: 'hadith' as NavSection,
      title: 'Hadith & Islamic Sources',
      ar: 'الحديث الشريف والسنة النبوية',
      desc: 'Authentic prophetic narrations (Bukhari, Muslim) cross-referenced with Quranic verses and revelation context.',
      icon: BookMarked,
      color: 'from-emerald-800 to-slate-900',
    },
    {
      id: 'maktabah' as NavSection,
      title: 'Islamic Maktabah & Academy',
      ar: 'المكتبة الإسلامية وتعلم القرآن',
      desc: 'Classical Islamic books (Ibn Kathir, Bukhari, Sirah), historical Quran scripts, and step-by-step Noorani Qaida basics.',
      icon: GraduationCap,
      color: 'from-cyan-700 to-emerald-900',
    },
    {
      id: 'hifz' as NavSection,
      title: 'Memorisation Studio',
      ar: 'الحفظ والتلاوة',
      desc: 'Active recall hide/reveal, audio loop repetition, and revision tracking.',
      icon: Repeat,
      color: 'from-emerald-600 to-teal-800',
    },
    {
      id: 'calendar' as NavSection,
      title: 'Islamic Calendar & Sacred Months',
      ar: 'التقويم الهجري والأشهر الحرم',
      desc: '12 Hijri months, 4 Sacred Months virtues, live Islamic date, Sirah milestones & Khatmah planner.',
      icon: CalendarDays,
      color: 'from-amber-700 to-emerald-950',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#047857] p-8 sm:p-12 text-white shadow-xl overflow-hidden islamic-pattern">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#fbbf24] font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{t(interfaceLanguage, 'multilingual')}</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-arabic text-4xl sm:text-5xl text-[#fbbf24] font-bold">
              نُورُ الْقُرْآنِ
            </h1>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Noor-ul-Quran
            </h2>
          </div>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
            Understand the Quran. Reflect deeply. Live by its guidance. Authentic Uthmani scripture, scholarly exegesis, Arabic linguistics, and source-grounded research.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('reader')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:brightness-110 text-white text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t(interfaceLanguage, 'openReader')}</span>
            </button>

            <button
              onClick={() => onNavigate('tafsir')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-colors flex items-center gap-2"
            >
              <BookMarked className="w-4 h-4 text-[#fbbf24]" />
              <span>{t(interfaceLanguage, 'tafsir')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Verse: Ayat al-Kursi (2:255) Daily Contemplation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t(interfaceLanguage, 'dailyAyah')} • Ayat al-Kursi (2:255)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlayAudio({
                id: 262,
                surah_id: 2,
                verse_number: 255,
                verse_key: '2:255',
                juz_number: 3,
                hizb_number: 5,
                rub_number: 9,
                page_number: 42,
                ruku_number: 34,
                manzil_number: 1,
                sajdah: false,
                text_uthmani: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ',
                text_simple: 'الله لا اله الا هو الحي القيوم',
                audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
              })}
              className="text-xs text-[#064e3b] dark:text-[#fbbf24] font-bold hover:underline flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t(interfaceLanguage, 'listen')}</span>
            </button>
            <button
              onClick={() => onOpenAyahModal('2:255')}
              className="text-xs text-[#064e3b] dark:text-[#fbbf24] font-bold hover:underline flex items-center gap-1"
            >
              <span>{t(interfaceLanguage, 'evidenceCard')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Arabic verse */}
        <div className="text-center py-2">
          <p className="font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 font-bold leading-relaxed" dir="rtl">
            ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ
          </p>
        </div>

        {/* Translation */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-100/60 dark:border-slate-700/60 text-center">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep..."
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Surah Al-Baqarah (2:255) • Verified Saheeh International
          </span>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {t(interfaceLanguage, 'ecosystemModules')}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">14 integrated research sections</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigate(feat.id)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#064e3b] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 flex items-center justify-center text-[#064e3b] dark:text-[#fbbf24] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-arabic text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {feat.ar}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#064e3b] dark:group-hover:text-[#fbbf24] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#064e3b] dark:text-[#fbbf24]">
                  <span>{t(interfaceLanguage, 'exploreModule')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequently Studied Surahs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {t(interfaceLanguage, 'dailyChapters')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">{t(interfaceLanguage, 'quickAccess')}</p>
          </div>

          <button
            onClick={() => onNavigate('reader')}
            className="text-xs font-bold text-[#064e3b] dark:text-[#fbbf24] hover:underline flex items-center gap-1"
          >
            <span>{t(interfaceLanguage, 'allSurahs')} {surahs.length || 114}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularSurahs.map((surah) => (
            <button
              key={surah.id}
              onClick={() => {
                onSelectSurahId(surah.id);
                onNavigate('reader');
              }}
              className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-[#064e3b] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-300">
                  {surah.id}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#064e3b] dark:group-hover:text-[#fbbf24] transition-colors">
                    {surah.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{surah.desc}</p>
                </div>
              </div>

              <span className="font-arabic text-base font-bold text-[#064e3b] dark:text-[#fbbf24]">
                {surah.ar}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
