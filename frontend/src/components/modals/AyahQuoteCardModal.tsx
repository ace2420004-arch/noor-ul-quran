import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon, Sliders } from 'lucide-react';
import type { Ayah } from '../../types';

interface AyahQuoteCardModalProps {
  ayah: Ayah | null;
  surahName?: string;
  onClose: () => void;
}

type CardTheme = 'emerald' | 'midnight' | 'obsidian' | 'sepia' | 'ruby';
type CardRatio = 'story' | 'square' | 'landscape';

export const AyahQuoteCardModal: React.FC<AyahQuoteCardModalProps> = ({
  ayah,
  surahName,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<CardTheme>('emerald');
  const [ratio, setRatio] = useState<CardRatio>('story');
  const [includeTranslation, setIncludeTranslation] = useState<boolean>(true);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);

  useEffect(() => {
    if (!ayah || !canvasRef.current) return;
    drawCard();
  }, [ayah, theme, ratio, includeTranslation, includeWatermark]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ayah) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on selected Aspect Ratio
    let width = 1080;
    let height = 1920; // Default Story 9:16

    if (ratio === 'square') {
      width = 1080;
      height = 1080;
    } else if (ratio === 'landscape') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    // Palette Configuration
    let bgStart = '#022c22';
    let bgMid = '#064e3b';
    let bgEnd = '#022c22';
    let borderGold = '#d97706';
    let borderAccent = '#fbbf24';
    let arabicText = '#fef3c7';
    let transText = '#e2e8f0';
    let watermarkColor = '#f59e0b';
    let badgeBg = 'rgba(217, 119, 6, 0.2)';

    if (theme === 'midnight') {
      bgStart = '#020617';
      bgMid = '#0f172a';
      bgEnd = '#020617';
      borderGold = '#38bdf8';
      borderAccent = '#7dd3fc';
      arabicText = '#ffffff';
      transText = '#cbd5e1';
      watermarkColor = '#38bdf8';
      badgeBg = 'rgba(56, 189, 248, 0.2)';
    } else if (theme === 'obsidian') {
      bgStart = '#09090b';
      bgMid = '#18181b';
      bgEnd = '#09090b';
      borderGold = '#a1a1aa';
      borderAccent = '#e4e4e7';
      arabicText = '#ffffff';
      transText = '#a1a1aa';
      watermarkColor = '#d4d4d8';
      badgeBg = 'rgba(161, 161, 170, 0.2)';
    } else if (theme === 'sepia') {
      bgStart = '#fbf7ee';
      bgMid = '#f1e6cf';
      bgEnd = '#e8d9b8';
      borderGold = '#854d0e';
      borderAccent = '#b45309';
      arabicText = '#291e10';
      transText = '#574128';
      watermarkColor = '#854d0e';
      badgeBg = 'rgba(180, 83, 9, 0.15)';
    } else if (theme === 'ruby') {
      bgStart = '#4c0519';
      bgMid = '#881337';
      bgEnd = '#4c0519';
      borderGold = '#f59e0b';
      borderAccent = '#fde68a';
      arabicText = '#fff1f2';
      transText = '#fecdd3';
      watermarkColor = '#f59e0b';
      badgeBg = 'rgba(245, 158, 11, 0.25)';
    }

    // 1. Background Gradient with Radial Glow in Center
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, bgStart);
    grad.addColorStop(0.5, bgMid);
    grad.addColorStop(1, bgEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Glow
    const glow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
    glow.addColorStop(0, badgeBg);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Double Islamic Border
    const pad = ratio === 'story' ? 60 : 48;
    ctx.strokeStyle = borderGold;
    ctx.lineWidth = 4;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.strokeStyle = borderAccent;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

    // 3. Islamic 8-Pointed Star (Rub-el-Hizb) Corner Crests
    const drawIslamicStar = (cx: number, cy: number, size: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = borderAccent;
      ctx.beginPath();
      for (let s = 0; s < 2; s++) {
        ctx.rotate((Math.PI / 4) * s);
        ctx.rect(-size / 2, -size / 2, size, size);
      }
      ctx.fill();
      // Center circle cutout
      ctx.fillStyle = bgMid;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const starSize = ratio === 'story' ? 24 : 20;
    drawIslamicStar(pad + 12, pad + 12, starSize);
    drawIslamicStar(width - (pad + 12), pad + 12, starSize);
    drawIslamicStar(pad + 12, height - (pad + 12), starSize);
    drawIslamicStar(width - (pad + 12), height - (pad + 12), starSize);

    // 4. Header: Surah & Ayah Badge
    const headerY = ratio === 'story' ? 180 : (ratio === 'square' ? 130 : 120);
    const sName = surahName || `Surah ${ayah.verse_key.split(':')[0]}`;

    // Badge Pill
    const badgeText = `${sName.toUpperCase()} • AYAH ${ayah.verse_key} • JUZ ${ayah.juz_number}`;
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    const badgeMetrics = ctx.measureText(badgeText);
    const badgeWidth = badgeMetrics.width + 48;

    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.roundRect(width / 2 - badgeWidth / 2, headerY - 32, badgeWidth, 44, 22);
    ctx.fill();
    ctx.strokeStyle = borderAccent;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = borderAccent;
    ctx.fillText(badgeText, width / 2, headerY - 2);

    // Calligraphic Bismillah Ornament
    const bismillahY = headerY + (ratio === 'story' ? 80 : 55);
    ctx.fillStyle = borderGold;
    ctx.font = '28px "Amiri", "Scheherazade New", serif';
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillText('— بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ —', width / 2, bismillahY);

    // 5. Quranic Arabic Script with Auto-Wrap & Vertical Centering
    ctx.fillStyle = arabicText;
    const arabicFontSize = ratio === 'story' ? 52 : (ratio === 'square' ? 44 : 42);
    ctx.font = `bold ${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';

    const maxTextWidth = width - (pad * 2 + 100);
    const words = ayah.text_uthmani.split(' ');
    const lines: string[] = [];
    let curLine = '';

    for (let n = 0; n < words.length; n++) {
      const test = curLine ? curLine + ' ' + words[n] : words[n];
      if (ctx.measureText(test).width > maxTextWidth && n > 0) {
        lines.push(curLine);
        curLine = words[n];
      } else {
        curLine = test;
      }
    }
    lines.push(curLine);

    // Arabic line height & vertical position
    const arabicLineHeight = arabicFontSize * 1.65;
    const totalArabicHeight = lines.length * arabicLineHeight;

    let arabicStartY = ratio === 'story'
      ? Math.max(bismillahY + 120, (height / 2) - (totalArabicHeight / 2) - 100)
      : (ratio === 'square' ? 320 : 250);

    // Render Arabic lines with Ayah ending symbol on last line
    lines.forEach((line, idx) => {
      const isLast = idx === lines.length - 1;
      const textToRender = isLast ? `${line} ۝` : line;
      ctx.fillText(textToRender, width / 2, arabicStartY + idx * arabicLineHeight);
    });

    // 6. Translation Text (if enabled)
    if (includeTranslation && ayah.translations && ayah.translations.length > 0) {
      ctx.fillStyle = transText;
      const transFontSize = ratio === 'story' ? 24 : 21;
      ctx.font = `italic ${transFontSize}px sans-serif`;
      ctx.direction = 'ltr';
      ctx.textAlign = 'center';

      const transRaw = `“${ayah.translations[0].text}”`;
      const transWords = transRaw.split(' ');
      const transLines: string[] = [];
      let curTrans = '';

      for (let m = 0; m < transWords.length; m++) {
        const test = curTrans ? curTrans + ' ' + transWords[m] : transWords[m];
        if (ctx.measureText(test).width > maxTextWidth && m > 0) {
          transLines.push(curTrans);
          curTrans = transWords[m];
        } else {
          curTrans = test;
        }
      }
      transLines.push(curTrans);

      const transLineHeight = transFontSize * 1.5;
      const transStartY = ratio === 'story'
        ? height - (pad + 180 + transLines.length * transLineHeight)
        : (ratio === 'square' ? height - 250 : height - 180);

      // Render translation lines (up to 4 lines)
      transLines.slice(0, 5).forEach((line, idx) => {
        ctx.fillText(line, width / 2, transStartY + idx * transLineHeight);
      });

      // Translator Attribution
      ctx.font = '14px sans-serif';
      ctx.fillStyle = borderAccent;
      const author = ayah.translations[0].author_name || 'Verified Translation';
      ctx.fillText(`— ${author}`, width / 2, transStartY + Math.min(transLines.length, 5) * transLineHeight + 20);
    }

    // 7. Watermark Footer (if enabled)
    if (includeWatermark) {
      const footerY = height - (pad + 35);
      ctx.fillStyle = watermarkColor;
      ctx.font = 'bold 16px sans-serif';
      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      ctx.fillText('NOOR-UL-QURAN • نور القرآن الكريم', width / 2, footerY);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !ayah) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `NoorUlQuran_Ayah_${ayah.verse_key.replace(':', '_')}_${ratio}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2200);
      }, 'image/png');
    } catch {
      // Fallback: copy formatted text
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    if (!ayah) return;
    const trans = ayah.translations?.[0]?.text || '';
    const text = `[Ayah ${ayah.verse_key}]\n${ayah.text_uthmani}\n\n"${trans}"\n\n— Verified via Noor-ul-Quran (نور القرآن)`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  if (!ayah) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Social Ayah Quote Card Studio
              </h3>
              <p className="text-[11px] text-slate-500">
                Ayah {ayah.verse_key} • {surahName || `Surah ${ayah.verse_key.split(':')[0]}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="flex justify-center items-center bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner overflow-hidden min-h-[300px]">
          <canvas
            ref={canvasRef}
            className={`rounded-xl shadow-2xl transition-all duration-200 max-h-[380px] w-auto border border-white/10 ${
              ratio === 'story' ? 'aspect-[9/16]' : (ratio === 'square' ? 'aspect-square' : 'aspect-video')
            }`}
          />
        </div>

        {/* Controls Grid */}
        <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
          {/* Aspect Ratio Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-[#fbbf24]" />
                Format / Aspect Ratio:
              </span>
              <span className="text-[10px] text-slate-400">
                {ratio === 'story' ? 'WhatsApp Status / Instagram Story' : (ratio === 'square' ? 'Instagram Post (1:1)' : 'Desktop / Banner (16:9)')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'story' as CardRatio, label: '📱 Story (9:16)', desc: 'Status / Reels' },
                { id: 'square' as CardRatio, label: '🔲 Square (1:1)', desc: 'Feed Post' },
                { id: 'landscape' as CardRatio, label: '🖥️ Banner (16:9)', desc: 'Wallpaper' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRatio(r.id)}
                  className={`py-2 px-2.5 rounded-xl text-center transition-all font-semibold border ${
                    ratio === r.id
                      ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs">{r.label}</span>
                  <span className="text-[9px] opacity-80">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette Selector */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Luxury Theme Palette:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'emerald' as CardTheme, label: 'Royal Emerald', color: '#064e3b' },
                { id: 'midnight' as CardTheme, label: 'Midnight Sapphire', color: '#0f172a' },
                { id: 'obsidian' as CardTheme, label: 'Obsidian Luxe', color: '#18181b' },
                { id: 'sepia' as CardTheme, label: 'Andalusian Sepia', color: '#f1e6cf' },
                { id: 'ruby' as CardTheme, label: 'Sunset Ruby', color: '#881337' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all border ${
                    theme === t.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeTranslation}
                onChange={(e) => setIncludeTranslation(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#064e3b]"
              />
              <span>Include Translation Text</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#064e3b]"
              />
              <span>Show Noor-ul-Quran Crest</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied Text!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleCopyImage}
              className="px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy image directly to clipboard to paste into WhatsApp / Telegram / Word"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-amber-700" /> : <ImageIcon className="w-3.5 h-3.5" />}
              <span>{copiedImage ? 'Image Copied!' : 'Copy Image'}</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Ultra-HD PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
