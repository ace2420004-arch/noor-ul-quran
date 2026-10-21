import React, { useState } from 'react';
import {
  Bookmark,
  BookMarked,
  History,
  Sparkles,
} from 'lucide-react';
import { BookmarksHistoryView } from '../bookmarks/BookmarksHistoryView';
import { ResearchNotebookView } from '../notebook/ResearchNotebookView';

interface MyLibraryViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
  initialTab?: 'bookmarks' | 'notebook' | 'history';
}

export type LibraryTab = 'bookmarks' | 'notebook' | 'history';

export const MyLibraryView: React.FC<MyLibraryViewProps> = ({
  onOpenAyahInReader,
  initialTab = 'bookmarks',
}) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);

  const tabs: { id: LibraryTab; label: string; arabic: string; icon: any }[] = [
    { id: 'bookmarks', label: 'Bookmarks & Collections', arabic: 'المحفوظات', icon: Bookmark },
    { id: 'notebook', label: 'Reflection Journal', arabic: 'دفتر التأملات', icon: BookMarked },
    { id: 'history', label: 'Reading History', arabic: 'سجل القراءة', icon: History },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-[#fbbf24] text-xs font-bold mb-2 border border-amber-200 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Quran Space • مكتبتي الخاصة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Library & Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your saved Ayahs, private spiritual reflections, and recent reading history.
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
                onClick={() => setActiveTab(tab.id)}
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

      {/* Sub-Views */}
      {activeTab === 'bookmarks' && (
        <BookmarksHistoryView
          onOpenAyahInReader={onOpenAyahInReader}
          initialTab="bookmarks"
        />
      )}

      {activeTab === 'notebook' && (
        <ResearchNotebookView
          onOpenAyahInReader={onOpenAyahInReader}
        />
      )}

      {activeTab === 'history' && (
        <BookmarksHistoryView
          onOpenAyahInReader={onOpenAyahInReader}
          initialTab="history"
        />
      )}
    </div>
  );
};
