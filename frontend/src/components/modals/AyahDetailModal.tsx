import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Bookmark,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  Scroll,
} from 'lucide-react';
import type { Ayah, Word } from '../../types';
import { api } from '../../services/api';

interface AyahDetailModalProps {
  verseKey: string;
  onClose: () => void;
  onPlayAudio: (ayah: Ayah) => void;
  onToggleBookmark: (verseKey: string) => void;
  isBookmarked: boolean;
  onSelectWord: (word: Word) => void;
}

export const AyahDetailModal: React.FC<AyahDetailModalProps> = ({
  verseKey,
  onClose,
  onPlayAudio,
  onToggleBookmark,
  isBookmarked,
  onSelectWord,
}) => {
  const [ayah, setAyah] = useState<Ayah | null>(null);
  const [tafsirs, setTafsirs] = useState<any[]>([]);
  const [asbab, setAsbab] = useState<any>(null);
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getAyah(verseKey),
      api.getAyahTafsir(verseKey),
      api.getAsbabNuzul(verseKey),
      api.getRelatedHadiths(verseKey),
    ])
      .then(([aData, tData, asbData, hData]) => {
        setAyah(aData);
        setTafsirs(tData);
        setAsbab(asbData);
        setHadiths(hData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [verseKey]);

  const handleCopy = () => {
    if (!ayah) return;
    const textToCopy = `[Quran Ayah ${verseKey}]\n${ayah.text_uthmani}\n\nTranslation:\n"${ayah.translations?.[0]?.text || ''}"\n\n— Verified via Noor-ul-Quran (نور القرآن)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-950/15 dark:border-slate-800 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-[#064e3b] dark:text-[#fbbf24]">
              {verseKey}
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Ayah Evidence Card • Ayah {verseKey}
              </h3>
              <p className="text-xs text-slate-400">
                Full Arabic, Word Breakdown, Classical Tafsir, Asbab an-Nuzul & Hadith
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="py-16 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Gathering comprehensive evidence card...</p>
          </div>
        )}

        {!loading && ayah && (
          <div className="space-y-6">
            {/* 1. Canonical Arabic Text */}
            <div className="p-6 rounded-2xl bg-emerald-50/40 dark:bg-slate-800/40 border border-emerald-100 dark:border-slate-700 text-center">
              <p className="font-arabic text-3xl sm:text-4xl text-[#064e3b] dark:text-[#fbbf24] font-bold leading-loose" dir="rtl">
                {ayah.text_uthmani}
                <span className="inline-block mr-2 text-xs font-sans text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40 align-middle">
                  ۝ {ayah.verse_number}
                </span>
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPlayAudio(ayah)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Listen Recitation</span>
                </button>

                <button
                  onClick={() => onToggleBookmark(verseKey)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isBookmarked
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-800 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600' : ''}`} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Citation'}</span>
              </button>
            </div>

            {/* 2. Word-by-Word Analysis */}
            {ayah.words && ayah.words.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
                  Word-by-Word Linguistic Breakdown (Tap word to inspect root):
                </h4>
                <div className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
                  {ayah.words.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => onSelectWord(w)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 hover:border-[#064e3b] text-center transition-all cursor-pointer"
                    >
                      <span className="font-arabic font-bold text-sm text-slate-800 dark:text-slate-100 block">
                        {w.text_uthmani}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block mt-0.5" dir="ltr">
                        {w.translation_en}
                      </span>
                      {w.root_letters && (
                        <span className="text-[9px] text-[#b45309] font-arabic font-bold block" dir="rtl">
                          {w.root_letters}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Published Translations */}
            {ayah.translations && ayah.translations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Verified Published Translations:
                </h4>
                <div className="space-y-2">
                  {ayah.translations.map((tr) => (
                    <div
                      key={tr.edition_id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs"
                    >
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        "{tr.text}"
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {tr.edition_name} • {tr.author_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Classical Tafsir Passages */}
            {tafsirs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Classical Tafsir Passages ({tafsirs.length}):
                </h4>
                <div className="space-y-3">
                  {tafsirs.map((tf) => (
                    <div
                      key={tf.id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-[#064e3b] dark:text-[#fbbf24]">
                        <span>{tf.edition.name}</span>
                        <span className="text-[10px] text-slate-400">{tf.edition.era}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {tf.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Asbab an-Nuzul (Occasions of Revelation) */}
            {asbab?.reports && asbab.reports.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5" />
                  Historical Context (Asbab an-Nuzul):
                </h4>
                {asbab.reports.map((rep: any, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 text-xs space-y-1"
                  >
                    <span className="font-bold text-amber-900 dark:text-amber-300 block">
                      {rep.source}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rep.report_text}
                    </p>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-medium">
                      Status: {rep.authenticity_assessment}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Hadith Cross-References */}
            {hadiths.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Related Hadith References:
                </h4>
                {hadiths.map((h: any) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-[#064e3b] dark:text-[#fbbf24]">
                      <span>{h.collection_name} #{h.hadith_number}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {h.grade} ({h.grading_authority})
                      </span>
                    </div>
                    {h.text_ar && (
                      <p className="font-arabic text-sm text-slate-800 dark:text-slate-200 text-right my-1" dir="rtl">
                        {h.text_ar}
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 italic">
                      "{h.text_en}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-colors"
          >
            Close Evidence Card
          </button>
        </div>
      </div>
    </div>
  );
};
