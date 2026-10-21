import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import type { SearchResultItem } from '../../types';
import { api } from '../../services/api';

interface UniversalSearchViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
  initialQuery?: string;
}

export const UniversalSearchView: React.FC<UniversalSearchViewProps> = ({
  onOpenAyahInReader,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'all' | 'arabic_text' | 'translation' | 'arabic_root'>('all');
  const [totalMatches, setTotalMatches] = useState<number>(0);

  const handleSearch = (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setTotalMatches(0);
      return;
    }
    setLoading(true);
    api
      .search(q)
      .then((res) => {
        setResults(res.results);
        setTotalMatches(res.total_matches);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const filteredResults = results.filter((r) => {
    if (filterType === 'all') return true;
    return r.match_type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Universal Search Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Search Across Quran, Translations & Roots
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Diacritic-tolerant Arabic search, multi-language translation keyword search, and root concordance.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search Arabic (الرحمن), English (mercy), Urdu (رحمت), or Root (ر ح م)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#064e3b] text-slate-900 dark:text-white"
          />
          <button
            onClick={() => handleSearch(query)}
            className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Search
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span>Try searching:</span>
          {['2:255', 'Al-Mulk', 'الرحمن', 'mercy', 'praise', 'ر ح م', 'Ayat al-Kursi'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setQuery(sample);
                handleSearch(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Results Count */}
      {results.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          <p className="text-xs font-semibold text-slate-500">
            Found <span className="text-[#064e3b] dark:text-[#fbbf24] font-bold">{totalMatches}</span> matches for "{query}"
          </p>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setFilterType('arabic_text')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'arabic_text'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Arabic Text
            </button>
            <button
              onClick={() => setFilterType('translation')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'translation'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Translations
            </button>
            <button
              onClick={() => setFilterType('arabic_root')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterType === 'arabic_root'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Roots
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Searching Quranic repository...</p>
        </div>
      )}

      {/* Results List */}
      {!loading && (
        <div className="space-y-4">
          {filteredResults.map((item) => (
            <div
              key={item.verse_key}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#064e3b] transition-all group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#064e3b] dark:text-[#fbbf24]">
                    Surah {item.surah_name_simple} ({item.verse_key})
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400">
                    {item.match_type.replace('_', ' ')}
                  </span>
                </div>

                <button
                  onClick={() => onOpenAyahInReader(item.verse_key)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#064e3b] dark:text-[#fbbf24] hover:underline"
                >
                  <span>Read in Context</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Arabic text snippet */}
              <div className="my-3 text-right">
                <p className="font-arabic text-xl sm:text-2xl text-slate-900 dark:text-slate-100 font-bold leading-relaxed" dir="rtl">
                  {item.text_uthmani}
                </p>
              </div>

              {/* Translation snippet */}
              {item.translation_text && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="leading-relaxed">"{item.translation_text}"</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Source: {item.translation_author}
                  </p>
                </div>
              )}
            </div>
          ))}

          {!loading && query && results.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">No matching verses found</p>
              <p>Try searching with another spelling, English translation keyword, or Arabic root.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
