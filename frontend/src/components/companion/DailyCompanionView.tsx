import React, { useState } from 'react';
import {
  Clock,
  Compass,
  Heart,
  CalendarDays,
  Sparkles,
  CircleDot
} from 'lucide-react';
import { PrayerTimesWidget } from './PrayerTimesWidget';
import { QiblaCompassWidget } from './QiblaCompassWidget';
import { RabbanaDuasWidget } from './RabbanaDuasWidget';
import { DigitalTasbeehWidget } from './DigitalTasbeehWidget';
import { IslamicCalendarView } from '../calendar/IslamicCalendarView';

interface DailyCompanionViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
  initialTab?: 'prayers' | 'qibla' | 'duas' | 'tasbeeh' | 'calendar';
}

export type CompanionTab = 'prayers' | 'qibla' | 'duas' | 'tasbeeh' | 'calendar';

export const DailyCompanionView: React.FC<DailyCompanionViewProps> = ({
  onOpenAyahInReader,
  initialTab = 'prayers'
}) => {
  const [activeTab, setActiveTab] = useState<CompanionTab>(() => {
    if (initialTab && initialTab !== 'prayers') return initialTab;
    try {
      const stored = localStorage.getItem('noor_companion_active_tab') as CompanionTab;
      if (['prayers', 'qibla', 'duas', 'tasbeeh', 'calendar'].includes(stored)) {
        return stored;
      }
    } catch {}
    return initialTab;
  });

  const handleTabChange = (tab: CompanionTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('noor_companion_active_tab', tab);
    } catch {}
  };

  const tabs: { id: CompanionTab; label: string; arabic: string; icon: any }[] = [
    { id: 'prayers', label: 'Prayer Times', arabic: 'مواقيت الصلاة', icon: Clock },
    { id: 'qibla', label: 'Qibla Compass', arabic: 'بوصلة القبلة', icon: Compass },
    { id: 'duas', label: '40 Rabbana Duas', arabic: 'أدعية ربنا', icon: Heart },
    { id: 'tasbeeh', label: 'Digital Tasbeeh', arabic: 'السبحة الإلكترونية', icon: CircleDot },
    { id: 'calendar', label: 'Hijri Calendar', arabic: 'التقويم الهجري', icon: CalendarDays },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* View Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] text-xs font-bold mb-2 border border-emerald-100 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spiritual Daily Companion • الرفيق اليومي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Daily Companion & Prayers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accurate Solar Prayer Times, Live Qibla Compass, 40 Rabbana Duas, Digital Tasbeeh, and Hijri Calendar.
          </p>
        </div>

        {/* Tab Switcher Pills */}
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

      {/* Tab Panels */}
      {activeTab === 'prayers' && (
        <div className="space-y-8">
          <PrayerTimesWidget />
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <QiblaCompassWidget />
          </div>
        </div>
      )}

      {activeTab === 'qibla' && (
        <QiblaCompassWidget />
      )}

      {activeTab === 'duas' && (
        <RabbanaDuasWidget onOpenAyahInReader={onOpenAyahInReader} />
      )}

      {activeTab === 'tasbeeh' && (
        <DigitalTasbeehWidget />
      )}

      {activeTab === 'calendar' && (
        <IslamicCalendarView onOpenAyahInReader={onOpenAyahInReader} />
      )}
    </div>
  );
};
