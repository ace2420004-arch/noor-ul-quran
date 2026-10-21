import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import type { Word } from '../../types';

interface WordPopoverProps {
  word: Word | null;
  onClose: () => void;
  onExploreRoot?: (rootLetters: string) => void;
}

export const WordPopover: React.FC<WordPopoverProps> = ({ word, onClose, onExploreRoot }) => {
  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-emerald-950/15 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24]">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Word Analysis & Morphology
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Word Display */}
        <div className="py-4 text-center bg-emerald-50/50 dark:bg-slate-800/50 rounded-xl my-3 border border-emerald-100/60 dark:border-slate-700/60">
          <p className="font-arabic text-3xl text-[#064e3b] dark:text-[#fbbf24] mb-1 font-bold">
            {word.text_uthmani}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {word.transliteration}
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-white mt-1">
            "{word.translation_en}"
          </p>
          {word.translation_ur && (
            <p className="text-xs font-arabic text-slate-600 dark:text-slate-300 mt-0.5">
              {word.translation_ur}
            </p>
          )}
        </div>

        {/* Linguistic Breakdown */}
        <div className="space-y-2 text-xs">
          {word.root_letters && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Arabic Root (الجذر):</span>
              <div className="flex items-center gap-2">
                <span className="font-arabic font-bold text-sm text-[#064e3b] dark:text-[#fbbf24]">
                  {word.root_letters}
                </span>
                {onExploreRoot && (
                  <button
                    onClick={() => {
                      onExploreRoot(word.root_letters!);
                      onClose();
                    }}
                    className="text-[11px] text-[#b45309] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <BookOpen className="w-3 h-3" />
                    Concordance
                  </button>
                )}
              </div>
            </div>
          )}

          {word.lemma && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Lemma (الأصل):</span>
              <span className="font-arabic font-semibold text-slate-800 dark:text-slate-200">
                {word.lemma}
              </span>
            </div>
          )}

          {word.pos && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Part of Speech:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 bg-emerald-100/60 dark:bg-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                {word.pos}
              </span>
            </div>
          )}

          {word.grammar_desc && (
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-0.5">Grammar / I'rab:</span>
              {word.grammar_desc}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
