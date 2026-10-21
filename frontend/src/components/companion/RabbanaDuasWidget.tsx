import React, { useState, useMemo } from 'react';
import {
  Heart,
  Search,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { RABBANA_DUAS, type RabbanaDua } from '../../data/rabbanaDuas';

interface RabbanaDuasWidgetProps {
  onOpenAyahInReader: (verseKey: string) => void;
}

type DuaCategoryFilter = 'all' | 'forgiveness' | 'guidance' | 'patience' | 'family' | 'protection' | 'success';

export const RabbanaDuasWidget: React.FC<RabbanaDuasWidgetProps> = ({ onOpenAyahInReader }) => {
  const [selectedCategory, setSelectedCategory] = useState<DuaCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories: { id: DuaCategoryFilter; label: string; arabic: string }[] = [
    { id: 'all', label: 'All 40 Duas', arabic: 'الكل' },
    { id: 'forgiveness', label: 'Forgiveness', arabic: 'المغفرة والتوبة' },
    { id: 'guidance', label: 'Guidance & Faith', arabic: 'الهداية والثبات' },
    { id: 'patience', label: 'Patience & Victory', arabic: 'الصبر والنصر' },
    { id: 'family', label: 'Family & Children', arabic: 'الوالدين والذرية' },
    { id: 'protection', label: 'Protection from Fire', arabic: 'الوقاية من النار' },
    { id: 'success', label: 'Goodness & Success', arabic: 'الخير والتوفيق' },
  ];

  const filteredDuas = useMemo(() => {
    return RABBANA_DUAS.filter((dua) => {
      const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        dua.arabic.includes(q) ||
        dua.transliteration.toLowerCase().includes(q) ||
        dua.translation_en.toLowerCase().includes(q) ||
        dua.translation_ur.includes(q) ||
        dua.surah_name.toLowerCase().includes(q) ||
        dua.verse_key.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (dua: RabbanaDua) => {
    const text = `[Rabbana Dua #${dua.id} • ${dua.surah_name} ${dua.verse_key}]\n${dua.arabic}\n\n"${dua.transliteration}"\n\nEnglish: "${dua.translation_en}"\n\nUrdu: "${dua.translation_ur}"\n\n— Verified via Noor-ul-Quran (نور القرآن)`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              The 40 Quranic "Rabbana" Duas
            </h3>
            <span className="text-xs font-arabic text-amber-600 dark:text-[#fbbf24]">
              الأدعية القرآنية الأربعون
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authentic divine supplications revealed in the Quran beginning with "Rabbana" (Our Lord).
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by keyword, surah, or meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Thematic Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[10px] opacity-75 font-arabic ml-1">({cat.arabic})</span>
          </button>
        ))}
      </div>

      {/* Duas Grid */}
      <div className="space-y-4">
        {filteredDuas.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No Rabbana Duas match your search criteria.
          </div>
        ) : (
          filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-slate-700 transition-all space-y-4"
            >
              {/* Card Top: Identifier Badge & Quick Actions */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center">
                    #{dua.id}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {dua.surah_name}
                    </span>
                    <span className="text-slate-400 ml-1.5 font-mono">
                      Ayah {dua.verse_key}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                    title="Copy Dua"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onOpenAyahInReader(dua.verse_key)}
                    className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-[#064e3b] text-[#064e3b] dark:text-[#fbbf24] hover:text-white text-[11px] font-bold flex items-center gap-1 border border-emerald-200/60 dark:border-slate-700 transition-colors shadow-xs"
                    title="Open in Quran Reader"
                  >
                    <span>Read in Context</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Arabic Script */}
              <div className="text-center py-2">
                <p className="font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 font-bold leading-loose select-text" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="font-serif italic text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {dua.transliteration}
                </p>
              </div>

              {/* Dual Translations (English & Urdu) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {/* English */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    English Translation
                  </span>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                    "{dua.translation_en}"
                  </p>
                </div>

                {/* Urdu */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 space-y-1 text-right" dir="rtl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    اردو ترجمہ
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-arabic text-sm leading-relaxed">
                    {dua.translation_ur}
                  </p>
                </div>
              </div>

              {/* Virtue & Revelation Context */}
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-700/60 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {dua.virtue}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
