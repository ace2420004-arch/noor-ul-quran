import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowRight, Trash2, History, RotateCcw } from 'lucide-react';
import type { Bookmark as BookmarkType } from '../../types';
import { api } from '../../services/api';

interface BookmarksHistoryViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
  initialTab?: 'bookmarks' | 'history';
}

interface ReadingHistoryItem {
  verse_key: string;
  surah: string;
  snippet?: string;
  timestamp: number;
}

export const BookmarksHistoryView: React.FC<BookmarksHistoryViewProps> = ({
  onOpenAyahInReader,
  initialTab = 'bookmarks',
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>(initialTab);
  const [historyItems, setHistoryItems] = useState<ReadingHistoryItem[]>([]);

  const loadBookmarks = () => {
    api.getBookmarks().then(setBookmarks).catch(console.error);
  };

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('noor_reading_history');
      if (raw) {
        setHistoryItems(JSON.parse(raw));
      } else {
        // Default initial items
        const defaults: ReadingHistoryItem[] = [
          { verse_key: '1:1', surah: 'Al-Fatihah', snippet: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', timestamp: Date.now() - 3600000 },
          { verse_key: '2:255', surah: 'Al-Baqarah (Ayat al-Kursi)', snippet: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', timestamp: Date.now() - 7200000 },
          { verse_key: '112:1', surah: 'Al-Ikhlas', snippet: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', timestamp: Date.now() - 86400000 }
        ];
        localStorage.setItem('noor_reading_history', JSON.stringify(defaults));
        setHistoryItems(defaults);
      }
    } catch {
      setHistoryItems([]);
    }
  };

  useEffect(() => {
    loadBookmarks();
    loadHistory();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleDelete = (id: number) => {
    api.deleteBookmark(id).then(loadBookmarks).catch(console.error);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('noor_reading_history');
    setHistoryItems([]);
  };

  const formatTimestamp = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <Bookmark className="w-4 h-4" />
              <span>Study Collections</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Saved Bookmarks & Reading History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Quickly resume previous reading sessions and access favorite Ayahs.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'bookmarks'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Bookmarks ({bookmarks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Reading History ({historyItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'bookmarks' ? (
          <>
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 group hover:border-[#064e3b] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-[#064e3b] dark:text-[#fbbf24]">
                    {bm.verse_key}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Ayah {bm.verse_key}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Collection: {bm.collection_name} {bm.note ? `• "${bm.note}"` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAyahInReader(bm.verse_key)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 text-[#064e3b] dark:text-[#fbbf24] text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(bm.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {bookmarks.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-xs space-y-1">
                <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No bookmarks saved</p>
                <p>Click the bookmark icon on any verse while reading to save it here.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {historyItems.length > 0 && (
              <div className="flex justify-end pb-1">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              </div>
            )}

            {historyItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 group hover:border-[#064e3b]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-[#064e3b] dark:text-[#fbbf24]">
                    {item.verse_key}
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800 dark:text-white">
                      {item.surah} ({item.verse_key})
                    </h4>
                    {item.snippet && (
                      <p className="font-arabic text-xs text-[#064e3b] dark:text-[#fbbf24] truncate max-w-xs sm:max-w-md my-0.5">
                        {item.snippet}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">Read: {formatTimestamp(item.timestamp)}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAyahInReader(item.verse_key)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 text-[#064e3b] dark:text-[#fbbf24] text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <span>Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {historyItems.length === 0 && (
              <div className="py-16 text-center text-slate-400 text-xs space-y-1">
                <History className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No reading history yet</p>
                <p>Start reading or playing audio in the Quran Reader to build your personal reading log.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
