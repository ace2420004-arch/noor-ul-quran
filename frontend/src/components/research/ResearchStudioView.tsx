import React, { useState, useEffect } from 'react';
import {
  Search,
  Languages,
  Scroll,
  Sparkles,
  Share2,
} from 'lucide-react';
import { UniversalSearchView } from '../search/UniversalSearchView';
import { ResearchLabView } from './ResearchLabView';
import { HadithSourcesView } from '../hadith/HadithSourcesView';
import { KnowledgeGraphView } from './KnowledgeGraphView';
import type { SurahSummary } from '../../types';
import type { InterfaceLanguage } from '../../preferences';

interface ResearchStudioViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
  initialTab?: 'search' | 'graph' | 'linguistics' | 'hadith';
  initialSearchQuery?: string;
  initialRoot?: string;
  surahs?: SurahSummary[];
  selectedSurahId?: number;
  onSelectSurahId?: (id: number) => void;
  interfaceLanguage?: InterfaceLanguage;
  onRetrySurahList?: () => void;
  surahListError?: string | null;
  surahListLoading?: boolean;
}

export type ResearchTab = 'search' | 'graph' | 'linguistics' | 'hadith';

export const ResearchStudioView: React.FC<ResearchStudioViewProps> = ({
  onOpenAyahInReader,
  initialTab = 'search',
  initialSearchQuery = '',
  initialRoot,
  surahs = [],
  selectedSurahId = 1,
  onSelectSurahId = () => {},
  interfaceLanguage = 'en',
  onRetrySurahList = () => {},
  surahListError = null,
  surahListLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<ResearchTab>(() => {
    if (initialTab && initialTab !== 'search') return initialTab;
    try {
      const stored = localStorage.getItem('noor_research_active_tab') as ResearchTab;
      if (['search', 'graph', 'linguistics', 'hadith'].includes(stored)) {
        return stored;
      }
    } catch {}
    return 'search';
  });

  useEffect(() => {
    if (initialTab && initialTab !== 'search') {
      setActiveTab(initialTab);
      try {
        localStorage.setItem('noor_research_active_tab', initialTab);
      } catch {}
    }
  }, [initialTab]);

  const handleTabChange = (tab: ResearchTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('noor_research_active_tab', tab);
    } catch {}
  };

  const tabs: { id: ResearchTab; label: string; arabic: string; icon: any }[] = [
    { id: 'search', label: 'Universal Search', arabic: 'البحث الموحد', icon: Search },
    { id: 'graph', label: 'Knowledge Graph', arabic: 'الرسم المعرفي', icon: Share2 },
    { id: 'linguistics', label: 'Arabic Roots & Grammar', arabic: 'علم اللغة والإعراب', icon: Languages },
    { id: 'hadith', label: 'Hadith & Islamic Sources', arabic: 'الحديث والمصادر', icon: Scroll },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-xs font-bold mb-2 border border-emerald-100 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Islamic Research Hub • مركز البحوث والدراسات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Research & AI Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Diacritic-Tolerant Search, Source-Grounded AI Assistant, Triliteral Roots, and Authentic Hadith Collections.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#064e3b] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sub-Module Panel */}
      {activeTab === 'search' && (
        <UniversalSearchView
          onOpenAyahInReader={onOpenAyahInReader}
          initialQuery={initialSearchQuery}
        />
      )}

      {activeTab === 'graph' && (
        <KnowledgeGraphView
          surahs={surahs}
          selectedSurahId={selectedSurahId}
          onSelectSurahId={onSelectSurahId}
          onOpenAyahInReader={onOpenAyahInReader}
          interfaceLanguage={interfaceLanguage}
          onRetrySurahList={onRetrySurahList}
          surahListError={surahListError}
          surahListLoading={surahListLoading}
        />
      )}

      {activeTab === 'linguistics' && (
        <ResearchLabView
          onOpenAyahInReader={onOpenAyahInReader}
          initialRoot={initialRoot}
        />
      )}

      {activeTab === 'hadith' && (
        <HadithSourcesView
          onOpenAyahInReader={onOpenAyahInReader}
        />
      )}
    </div>
  );
};
