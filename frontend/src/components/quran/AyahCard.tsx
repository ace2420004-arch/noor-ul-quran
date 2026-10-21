import React, { useState } from 'react';
import {
  Play,
  Pause,
  Bookmark,
  BookOpen,
  Edit3,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import type { Ayah, Word } from '../../types';
import { renderTajweedText } from '../../utils/tajweed';

interface AyahCardProps {
  ayah: Ayah;
  surahNameSimple: string;
  surahNameArabic: string;
  selectedTranslation: string;
  secondaryTranslation?: string;
  arabicFontSize: number;
  tajweedEnabled: boolean;
  isPlaying: boolean;
  onPlayAudio: (ayah: Ayah) => void;
  onSelectWord: (word: Word) => void;
  onOpenTafsir: (verseKey: string) => void;
  onOpenNote: (verseKey: string) => void;
  onToggleBookmark: (verseKey: string) => void;
  onOpenQuoteCard?: (ayah: Ayah) => void;
  isBookmarked: boolean;
  hideArabicText?: boolean;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahNameSimple,
  surahNameArabic,
  selectedTranslation,
  secondaryTranslation,
  arabicFontSize,
  tajweedEnabled,
  isPlaying,
  onPlayAudio,
  onSelectWord,
  onOpenTafsir,
  onOpenNote,
  onToggleBookmark,
  onOpenQuoteCard,
  isBookmarked,
  hideArabicText = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Find primary translation
  const translationItem = ayah.translations?.find(
    (t) => t.edition_identifier === selectedTranslation
  );

  // Find secondary translation (if enabled and different)
  const secondaryItem = secondaryTranslation && secondaryTranslation !== 'none' && secondaryTranslation !== selectedTranslation
    ? (ayah.translations?.find(
        (t) => t.edition_identifier === secondaryTranslation || t.language_code === secondaryTranslation
      ) || (secondaryTranslation === 'ur' && ayah.translations?.find(t => t.language_code === 'ur' || t.edition_identifier.includes('urdu')))
        || (secondaryTranslation === 'en' && ayah.translations?.find(t => t.language_code === 'en' || t.edition_identifier.includes('english'))))
    : null;

  const handleCopy = () => {
    const textToCopy = `[Quran ${surahNameSimple} ${ayah.verse_key}]\n${ayah.text_uthmani}\n\nTranslation (${translationItem?.author_name || 'Verified'}):\n"${translationItem?.text || ''}"\n\n— Verified via Noor-ul-Quran (نور القرآن)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldHide = hideArabicText && !isRevealed;

  return (
    <article
      id={`ayah-${ayah.verse_key}`}
      className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
        isPlaying
          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-[#047857]/60 shadow-md ring-1 ring-[#047857]/30'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Bar: Verse Key & Quick Actions */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200/60 dark:border-slate-700 flex items-center justify-center font-bold text-[#064e3b] dark:text-[#fbbf24] shadow-xs">
            {ayah.verse_key}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            {surahNameSimple} • {surahNameArabic} • Juz {ayah.juz_number} • Page {ayah.page_number}
          </span>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-slate-500 dark:text-slate-400">
          {/* Audio Recitation */}
          <button
            onClick={() => onPlayAudio(ayah)}
            className={`p-1.5 rounded-lg transition-colors ${
              isPlaying
                ? 'bg-[#064e3b] text-white shadow-xs'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isPlaying ? 'Pause recitation' : 'Listen to recitation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(ayah.verse_key)}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-[#d97706] hover:bg-amber-50 dark:hover:bg-amber-950/30'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Bookmark this Ayah"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#d97706]' : ''}`} />
          </button>

          {/* Tafsir */}
          <button
            onClick={() => onOpenTafsir(ayah.verse_key)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Read scholarly Tafsir commentary"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Reflection Note */}
          <button
            onClick={() => onOpenNote(ayah.verse_key)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Add private reflection note"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Share Quote Card */}
          {onOpenQuoteCard && (
            <button
              onClick={() => onOpenQuoteCard(ayah)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-500 hover:text-[#064e3b] dark:hover:text-[#fbbf24] transition-colors"
              title="Create & Download HD Quote Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Copy verse with verified citation"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Arabic Text */}
      <div className="my-4">
        {shouldHide ? (
          <div
            onClick={() => setIsRevealed(true)}
            className="p-6 text-center rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              🔒 Arabic Text Hidden for Hifz Practice
            </p>
            <p className="text-xs text-slate-400 mt-1">Tap or click to reveal and test your memorisation</p>
          </div>
        ) : (
          <div>
            <p
              className={`font-arabic text-slate-900 dark:text-slate-100 leading-loose transition-all select-text ${
                tajweedEnabled ? 'tracking-wide font-medium' : ''
              }`}
              style={{ fontSize: `${arabicFontSize}px` }}
              dir="rtl"
            >
              {tajweedEnabled ? renderTajweedText(ayah.text_uthmani) : ayah.text_uthmani}
              <span className="inline-block mr-2 text-xs font-sans text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40 align-middle">
                ۝ {ayah.verse_number}
              </span>
            </p>

            {hideArabicText && isRevealed && (
              <button
                onClick={() => setIsRevealed(false)}
                className="mt-2 text-[11px] text-slate-500 hover:underline"
              >
                Hide text again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Word-by-Word Interactive Pills */}
      {ayah.words && ayah.words.length > 0 && !shouldHide && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 justify-end" dir="rtl">
          {ayah.words.map((w) => (
            <button
              key={w.id}
              onClick={() => onSelectWord(w)}
              className="group flex flex-col items-center px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 transition-all cursor-pointer text-center"
              title={`Meaning: "${w.translation_en}" | Root: ${w.root_letters || 'N/A'}`}
            >
              <span className="font-arabic text-base text-slate-800 dark:text-slate-200 group-hover:text-[#064e3b] dark:group-hover:text-[#fbbf24] font-semibold">
                {w.text_uthmani}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans tracking-tight max-w-[80px] truncate" dir="ltr">
                {w.translation_en}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Primary Translation Display */}
      {translationItem && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {translationItem.text}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{translationItem.edition_name}</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800/70 dark:text-emerald-400">
              Primary Translation
            </span>
          </div>
        </div>
      )}
      {!translationItem && (
        <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          This translation is not available for this Ayah yet.
        </p>
      )}

      {/* Secondary Dual Translation Display */}
      {secondaryItem && (
        <div className="mt-3 pt-3 border-t border-dashed border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-3 rounded-xl">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans italic">
            {secondaryItem.text}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400">
            <span className="font-medium">{secondaryItem.edition_name}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
              Dual Comparison
            </span>
          </div>
        </div>
      )}
    </article>
  );
};
