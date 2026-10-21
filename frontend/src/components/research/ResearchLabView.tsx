import React, { useState, useEffect } from 'react';
import { Sparkles, Search, ArrowRight, Layers } from 'lucide-react';
import type { ArabicRoot } from '../../types';
import { api } from '../../services/api';

interface ResearchLabViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
  initialRoot?: string;
}

export const ResearchLabView: React.FC<ResearchLabViewProps> = ({
  onOpenAyahInReader,
  initialRoot,
}) => {
  const [roots, setRoots] = useState<ArabicRoot[]>([]);
  const [selectedRoot, setSelectedRoot] = useState<ArabicRoot | null>(null);
  const [concordance, setConcordance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [concordanceLoading, setConcordanceLoading] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    api.getRoots()
      .then((data) => {
        setRoots(data);
        setLoading(false);
        if (data.length > 0) {
          const match = initialRoot
            ? data.find((r) => r.root_letters === initialRoot) || data[0]
            : data[0];
          setSelectedRoot(match);
          loadConcordance(match.root_letters);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [initialRoot]);

  const loadConcordance = (rootLetters: string) => {
    setConcordanceLoading(true);
    api.getRootConcordance(rootLetters)
      .then((data) => {
        setConcordance(data);
        setConcordanceLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setConcordanceLoading(false);
      });
  };

  const handleSelectRoot = (root: ArabicRoot) => {
    setSelectedRoot(root);
    loadConcordance(root.root_letters);
  };

  const filteredRoots = roots.filter(
    (r) =>
      r.root_letters.includes(searchFilter) ||
      r.transliteration.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.primary_meanings.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Quran Research Lab & Arabic Morphology Studio</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Triliteral Roots & Semantic Concordance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore Arabic root occurrences across the Quranic corpus, lexical derivations, lemma frequencies, and morphological structures.
        </p>
      </div>

      {/* Main Grid: Left Roots List, Right Concordance Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Roots Directory */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#064e3b]" />
              Roots Directory
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {loading ? 'Loading...' : `${roots.length} roots`}
            </span>
          </div>

          {/* Search root input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search root (e.g. ر ح م or RHM)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#064e3b]"
            />
          </div>

          {/* Roots List */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredRoots.map((root) => {
              const isSelected = selectedRoot?.id === root.id;
              return (
                <button
                  key={root.id}
                  onClick={() => handleSelectRoot(root)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-slate-800 border-[#064e3b] shadow-xs'
                      : 'border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-arabic font-bold text-base text-[#064e3b] dark:text-[#fbbf24]">
                        {root.root_letters}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        ({root.transliteration})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {root.primary_meanings}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {root.occurrences_count}x
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Concordance Detail */}
        <div className="lg:col-span-8 space-y-6">
          {selectedRoot && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              {/* Root Showcase */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-arabic text-4xl text-[#064e3b] dark:text-[#fbbf24] font-bold">
                      {selectedRoot.root_letters}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        Root {selectedRoot.transliteration}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Triliteral Arabic Root • Total {selectedRoot.occurrences_count} Quranic occurrences
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-semibold">
                  Semantic Field: Mercy & Grace
                </div>
              </div>

              {/* Primary Lexical Meanings */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Lexical Meanings:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedRoot.primary_meanings}
                </p>
              </div>

              {/* Quranic Word Derivations */}
              {selectedRoot.derivatives && selectedRoot.derivatives.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Key Quranic Derivations:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRoot.derivatives.map((d, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-arabic font-bold text-lg text-[#064e3b] dark:text-[#fbbf24]">
                            {d.word}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2">({d.type})</span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                            {d.meaning}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concordance Occurrences in Ayahs */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Corpus Concordance Occurrences:
                  </h4>
                  {concordance && (
                    <span className="text-xs text-slate-400 font-semibold">
                      {concordance.occurrences_count} sampled passages
                    </span>
                  )}
                </div>

                {concordanceLoading && (
                  <div className="py-8 text-center text-xs text-slate-400">Loading occurrences...</div>
                )}

                {!concordanceLoading && concordance?.occurrences && (
                  <div className="space-y-2.5">
                    {concordance.occurrences.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#064e3b] bg-white dark:bg-slate-900 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs">
                            {item.verse_key}
                          </span>
                          <div>
                            <span className="font-arabic font-bold text-base text-slate-900 dark:text-white mr-2">
                              {item.text_uthmani}
                            </span>
                            <span className="text-xs text-slate-500">"{item.translation_en}"</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {item.pos} {item.grammar_desc ? `• ${item.grammar_desc}` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenAyahInReader(item.verse_key)}
                          className="flex items-center gap-1 text-xs font-semibold text-[#064e3b] dark:text-[#fbbf24] hover:underline shrink-0"
                        >
                          <span>View Ayah</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
