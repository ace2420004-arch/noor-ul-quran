import React, { useState } from 'react';
import { Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { TAJWEED_RULES, type TajweedRuleInfo } from '../../utils/tajweed';

interface TajweedLegendBarProps {
  onToggleTajweed?: () => void;
  isOpen?: boolean;
}

export const TajweedLegendBar: React.FC<TajweedLegendBarProps> = () => {
  const [selectedRule, setSelectedRule] = useState<TajweedRuleInfo | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs mb-4 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>Interactive Tajweed Engine</span>
              <span className="text-[10px] font-arabic font-normal text-emerald-600 dark:text-[#fbbf24]">
                أحكام التجويد الملونة
              </span>
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Click any colored badge or letter to learn the pronunciation rule.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Show rules' : 'Hide rules'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rules Chips */}
      {!isCollapsed && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          {TAJWEED_RULES.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border ${rule.bgClass} ${rule.borderClass} hover:scale-105 active:scale-95 shadow-xs`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: rule.hexColor }}
              />
              <span className={`${rule.colorClass} text-[11px]`}>{rule.nameEn}</span>
              <span className="text-[10px] font-arabic text-slate-500 dark:text-slate-400">
                ({rule.nameAr})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Rule Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full shadow-xs"
                  style={{ backgroundColor: selectedRule.hexColor }}
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedRule.nameEn}
                  </h3>
                  <span className="font-arabic text-sm text-emerald-700 dark:text-[#fbbf24]">
                    {selectedRule.nameAr}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation Body */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Rule Definition
                </span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedRule.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Duration (Harakat)
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedRule.duration}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Visual Mark
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedRule.hexColor }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Color-Coded
                    </span>
                  </div>
                </div>
              </div>

              {/* Quranic Example */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-200/60 dark:border-slate-700 space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                  Quranic Examples
                </span>
                <p className="font-arabic text-2xl font-bold text-slate-900 dark:text-white py-1" dir="rtl">
                  {selectedRule.example}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedRule(null)}
                className="w-full py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
