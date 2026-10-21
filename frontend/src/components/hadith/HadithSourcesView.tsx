import React, { useState, useEffect } from 'react';
import { Scroll, Search, BookOpen, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

interface HadithSourcesViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
}

export const HadithSourcesView: React.FC<HadithSourcesViewProps> = ({ onOpenAyahInReader }) => {
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [asbabRecords, setAsbabRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'hadith' | 'asbab'>('hadith');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.browseHadiths(),
      api.getAsbabNuzulRecords()
    ])
      .then(([hList, aList]) => {
        setHadiths(hList);
        setAsbabRecords(aList);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const collections = [
    { id: 'all', label: 'All Collections' },
    { id: 'Bukhari', label: 'Sahih al-Bukhari' },
    { id: 'Muslim', label: 'Sahih Muslim' },
    { id: 'Tirmidhi', label: 'Jami` at-Tirmidhi' },
    { id: 'Dawud', label: 'Sunan Abi Dawud' }
  ];

  const filteredHadiths = hadiths.filter((h) => {
    const matchesCollection =
      selectedCollection === 'all' ||
      h.collection_name.toLowerCase().includes(selectedCollection.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      h.text_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.text_ar.includes(searchQuery) ||
      (h.narrator && h.narrator.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (h.related_verse_key && h.related_verse_key.includes(searchQuery));
    return matchesCollection && matchesSearch;
  });

  const filteredAsbab = asbabRecords.filter((a) => {
    return (
      !searchQuery ||
      a.report_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.source_work.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.verse_key.includes(searchQuery)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <Scroll className="w-4 h-4" />
              <span>Hadith & Classical Islamic Sources</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Prophetic Traditions & Historical Revelation Context
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verified Hadith cross-references and classical Asbab an-Nuzul reports with authentic scholarly grading.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('hadith')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'hadith'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Hadith References ({hadiths.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('asbab')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'asbab'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Asbab an-Nuzul ({asbabRecords.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Collection Filter Bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'hadith' ? "Search Hadith text, narrator (e.g. Abu Hurairah), or Ayah (e.g. 1:1, 2:255)..." : "Search Asbab text, classical scholar, or Ayah..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>

          {activeTab === 'hadith' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCollection === col.id
                      ? 'bg-[#064e3b] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Feed */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading classical sources and verified traditions...</p>
        </div>
      ) : activeTab === 'hadith' ? (
        <div className="space-y-4">
          {filteredHadiths.map((h) => (
            <div
              key={h.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:border-[#064e3b]/50 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#064e3b] dark:text-[#fbbf24] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                    {h.collection_name} #{h.hadith_number}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                    Grade: {h.grade} ({h.grading_authority})
                  </span>
                </div>

                {h.related_verse_key && (
                  <button
                    onClick={() => onOpenAyahInReader(h.related_verse_key)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] font-semibold text-xs transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cross-Reference: Ayah {h.related_verse_key}</span>
                  </button>
                )}
              </div>

              {/* Narrator */}
              {h.narrator && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Narrated by: <span className="text-slate-800 dark:text-slate-200">{h.narrator}</span>
                </p>
              )}

              {/* Arabic Matn */}
              {h.text_ar && (
                <p
                  className="font-arabic text-xl sm:text-2xl text-right leading-loose text-slate-900 dark:text-slate-100 font-medium py-1"
                  dir="rtl"
                >
                  {h.text_ar}
                </p>
              )}

              {/* English Translation */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                "{h.text_en}"
              </p>
            </div>
          ))}

          {filteredHadiths.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <Scroll className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">No Hadiths match your filter</p>
              <p>Try clearing search or selecting a different collection.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAsbab.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-[#064e3b] dark:text-[#fbbf24] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                  Source: {a.source_work}
                </span>

                <button
                  onClick={() => onOpenAyahInReader(a.verse_key)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] font-semibold text-xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Linked Verse: Ayah {a.verse_key}</span>
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Occasion Report:</h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {a.report_text}
                </p>
              </div>

              {a.authenticity_assessment && (
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Scholarly Authenticity Assessment:</span>
                  </span>
                  <p className="text-amber-800 dark:text-amber-300">
                    {a.authenticity_assessment}
                  </p>
                  {a.scholarly_notes && (
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
                      Note: {a.scholarly_notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredAsbab.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">No Asbab records found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
