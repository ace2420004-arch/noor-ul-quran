import React, { useState, useEffect } from 'react';
import { Repeat, Eye, EyeOff, CheckCircle2, RotateCcw, Play } from 'lucide-react';
import type { Ayah, SurahSummary } from '../../types';
import { api } from '../../services/api';

interface MemorisationAudioViewProps {
  surahs: SurahSummary[];
  onPlayAudio: (ayah: Ayah) => void;
  playingAyahKey: string | null;
}

export const MemorisationAudioView: React.FC<MemorisationAudioViewProps> = ({
  surahs,
  onPlayAudio,
  playingAyahKey,
}) => {
  const [selectedSurahId, setSelectedSurahId] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('noor_hifz_surah_id');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 114) return parsed;
      }
    } catch {}
    return 1;
  });
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hideArabic, setHideArabic] = useState<boolean>(true);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [repetitionCount, setRepetitionCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('noor_hifz_repetition_count');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 1) return parsed;
      }
    } catch {}
    return 3;
  });
  const [completedAyahs, setCompletedAyahs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem('noor_hifz_surah_id', selectedSurahId.toString());
      localStorage.setItem('noor_hifz_repetition_count', repetitionCount.toString());
    } catch {}
  }, [selectedSurahId, repetitionCount]);

  useEffect(() => {
    setLoading(true);
    api.getSurahAyahs(selectedSurahId)
      .then((data) => {
        setAyahs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedSurahId]);

  const toggleReveal = (key: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleComplete = (key: string) => {
    setCompletedAyahs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    // Record in API
    api.updateHifzProgress(selectedSurahId, 1, 1, 'memorised', repetitionCount).catch(() => {});
  };

  const currentSurah = surahs.find((s) => s.id === selectedSurahId) || surahs[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <Repeat className="w-4 h-4" />
              <span>Hifz & Memorisation Studio • {currentSurah ? currentSurah.name_arabic : ''}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Spaced Repetition & Audio Memorisation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Practice active recall with hide/reveal text, customizable repetition loops, and private revision tracking.
            </p>
          </div>

          {/* Surah Selector */}
          <select
            value={selectedSurahId}
            onChange={(e) => {
              setSelectedSurahId(Number(e.target.value));
              setRevealedKeys(new Set());
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#064e3b] dark:text-[#fbbf24] focus:outline-hidden"
          >
            {surahs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.name_simple} ({s.verses_count} v)
              </option>
            ))}
          </select>
        </div>

        {/* Memorisation Toolbar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHideArabic(!hideArabic);
                setRevealedKeys(new Set());
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all border ${
                hideArabic
                  ? 'bg-emerald-50 dark:bg-slate-800 border-[#064e3b] text-[#064e3b] dark:text-[#fbbf24]'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-600'
              }`}
            >
              {hideArabic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{hideArabic ? 'Arabic Text Hidden' : 'Arabic Text Visible'}</span>
            </button>

            <span className="text-[11px] text-slate-400">
              (Click individual verses to peek)
            </span>
          </div>

          {/* Repetition Loop Target */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Loop Repetitions:</span>
            <div className="flex items-center gap-1">
              {[1, 3, 5, 10].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setRepetitionCount(cnt)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    repetitionCount === cnt
                      ? 'bg-[#064e3b] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cnt}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Counter */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 flex items-center justify-between text-xs">
        <span className="font-bold text-[#064e3b] dark:text-[#fbbf24]">
          Memorisation Progress: {completedAyahs.size} / {ayahs.length} ayahs marked memorised
        </span>
        <button
          onClick={() => {
            setCompletedAyahs(new Set());
            setRevealedKeys(new Set());
          }}
          className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Ayahs List */}
      <div className="space-y-4">
        {loading && (
          <div className="py-12 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading Surah verses for memorisation...</p>
          </div>
        )}
        {!loading && ayahs.map((ayah) => {
          const isRevealed = revealedKeys.has(ayah.verse_key) || !hideArabic;
          const isMemorised = completedAyahs.has(ayah.verse_key);
          const isPlaying = playingAyahKey === ayah.verse_key;

          return (
            <div
              key={ayah.verse_key}
              className={`p-5 rounded-2xl border transition-all ${
                isMemorised
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-[#064e3b] dark:text-[#fbbf24]">
                    {ayah.verse_key}
                  </span>
                  <button
                    onClick={() => onPlayAudio(ayah)}
                    className={`p-1 transition-colors ${isPlaying ? 'text-[#047857] font-bold' : 'text-slate-400 hover:text-[#064e3b]'}`}
                    title="Listen with loop"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleComplete(ayah.verse_key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    isMemorised
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isMemorised ? 'Memorised' : 'Mark Memorised'}</span>
                </button>
              </div>

              {/* Arabic text with hide/reveal */}
              <div className="my-4 text-center">
                {isRevealed ? (
                  <p className="font-arabic text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 font-bold leading-relaxed" dir="rtl">
                    {ayah.text_uthmani}
                  </p>
                ) : (
                  <button
                    onClick={() => toggleReveal(ayah.verse_key)}
                    className="w-full py-6 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:bg-slate-200/70 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <EyeOff className="w-4 h-4 text-slate-400" />
                    <span>Hidden for recall — Click or tap to reveal</span>
                  </button>
                )}
              </div>

              {/* Translation snippet for semantic grounding */}
              {ayah.translations && ayah.translations[0] && (
                <div className="pt-2 text-xs text-slate-500 italic text-center">
                  "{ayah.translations[0].text}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
