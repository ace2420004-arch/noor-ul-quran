import React from 'react';

/**
 * Tajweed rule types supported by Noor-ul-Quran
 */
export type TajweedRuleType =
  | 'madd'
  | 'ghunnah'
  | 'qalqalah'
  | 'ikhfa'
  | 'idgham'
  | 'iqlab';

export interface TajweedRuleInfo {
  id: TajweedRuleType;
  nameEn: string;
  nameAr: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  hexColor: string;
  description: string;
  duration: string;
  example: string;
}

export const TAJWEED_RULES: TajweedRuleInfo[] = [
  {
    id: 'madd',
    nameEn: 'Madd (Prolongation)',
    nameAr: 'حروف المد',
    colorClass: 'text-rose-600 dark:text-rose-400 font-bold',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-300 dark:border-rose-800',
    hexColor: '#e11d48',
    description: 'Elongation of the sound of a Madd letter (Alif, Waw, Yaa) when followed by Hamzah or Sukoon.',
    duration: '2, 4, or 6 counts (harakat)',
    example: 'السَّمَآءِ • جَآءَ • الضَّآلِّينَ',
  },
  {
    id: 'ghunnah',
    nameEn: 'Ghunnah (Nasalization)',
    nameAr: 'الغُنَّة',
    colorClass: 'text-amber-600 dark:text-amber-400 font-bold',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-300 dark:border-amber-800',
    hexColor: '#d97706',
    description: 'Nasal resonance produced through the nasal cavity for Noon and Meem carrying a Shaddah (نّ / مّ).',
    duration: '2 counts (harakat)',
    example: 'إِنَّ • ثُمَّ • أَنَّهُمْ',
  },
  {
    id: 'qalqalah',
    nameEn: 'Qalqalah (Echoing Bounce)',
    nameAr: 'القَلْقَلَة',
    colorClass: 'text-blue-600 dark:text-blue-400 font-bold',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-300 dark:border-blue-800',
    hexColor: '#2563eb',
    description: 'An echoing or bouncing vibration when one of the 5 letters (ق, ط, ب, ج, د - Qutb Jad) has a Sukoon or stop.',
    duration: 'Quick explosive release',
    example: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ • ٱلْفَلَقِ • حَبْلٌ',
  },
  {
    id: 'ikhfa',
    nameEn: 'Ikhfa (Concealment)',
    nameAr: 'الإِخْفَاء',
    colorClass: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-300 dark:border-emerald-800',
    hexColor: '#059669',
    description: 'Pronouncing Noon Sakinah or Tanween in a hidden state between Izhar and Idgham with Ghunnah when followed by 15 letters.',
    duration: '2 counts with soft nasal sound',
    example: 'مِن قَبْلُ • أَنفُسَهُمْ • كِتَـٰبٌ كَرِيمٌ',
  },
  {
    id: 'idgham',
    nameEn: 'Idgham (Assimilation/Merging)',
    nameAr: 'الإِدْغَام',
    colorClass: 'text-cyan-600 dark:text-cyan-400 font-semibold',
    bgClass: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderClass: 'border-cyan-300 dark:border-cyan-800',
    hexColor: '#0891b2',
    description: 'Merging Noon Sakinah or Tanween into one of the 6 letters of Yarmaloon (ي، ر، م، ل، و، ن).',
    duration: 'Merged with or without Ghunnah',
    example: 'مَن يَقُولُ • مِن رَّبِّهِمْ • غَفُورٌ رَّحِيمٌ',
  },
  {
    id: 'iqlab',
    nameEn: 'Iqlab (Conversion to Meem)',
    nameAr: 'الإِقْلَاب',
    colorClass: 'text-purple-600 dark:text-purple-400 font-semibold',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-300 dark:border-purple-800',
    hexColor: '#7c3aed',
    description: 'Converting Noon Sakinah or Tanween into a hidden Meem with Ghunnah when followed by the letter Baa (ب). Marked by a small Meem (ۢ).',
    duration: '2 counts with light lip contact',
    example: 'مِنۢ بَعْدِ • عَلِيمٌۢ بِذَاتِ',
  },
];

// Qalqalah letters: ق ط ب ج د
const QALQALAH_CHARS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);
// Yarmaloon for Idgham: ي ر م ل و ن
const YARMALOON_CHARS = new Set(['ي', 'ر', 'م', 'ل', 'و', 'ن']);
// Ikhfa 15 letters: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك
const IKHFA_CHARS = new Set([
  'ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'
]);

/**
 * Parses and renders Uthmani Arabic text with authentic color-coded Tajweed highlights.
 */
export function renderTajweedText(
  text: string,
  onRuleClick?: (rule: TajweedRuleInfo) => void
): React.ReactNode {
  if (!text) return text;

  const words = text.split(' ');
  const renderedWords: React.ReactNode[] = [];

  words.forEach((word, wordIdx) => {
    const chars = Array.from(word);
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < chars.length) {
      const char = chars[i];
      const next1 = chars[i + 1] || '';
      const next2 = chars[i + 2] || '';

      // 1. Check for Iqlab (small meem marker ۢ)
      if (char === 'ۢ' || next1 === 'ۢ') {
        const seg = (char === 'ۢ' ? char : char + next1);
        const rule = TAJWEED_RULES.find((r) => r.id === 'iqlab')!;
        elements.push(
          <span
            key={`${wordIdx}-${i}-iqlab`}
            className={`${rule.colorClass} underline decoration-purple-400/40 cursor-help transition-all hover:opacity-80`}
            title="Iqlab: Converted to Meem before Ba"
            onClick={onRuleClick ? () => onRuleClick(rule) : undefined}
          >
            {seg}
          </span>
        );
        i += (char === 'ۢ' ? 1 : 2);
        continue;
      }

      // 2. Check for Maddah (Madd) — marked with ٓ or ~
      if (char === 'ٓ' || next1 === 'ٓ' || char === 'آ') {
        const seg = char === 'آ' ? char : (char === 'ٓ' ? char : char + next1);
        const rule = TAJWEED_RULES.find((r) => r.id === 'madd')!;
        elements.push(
          <span
            key={`${wordIdx}-${i}-madd`}
            className={`${rule.colorClass} transition-all hover:opacity-80 cursor-help`}
            title="Madd: Prolongation (4-6 counts)"
            onClick={onRuleClick ? () => onRuleClick(rule) : undefined}
          >
            {seg}
          </span>
        );
        i += (char === 'آ' || char === 'ٓ' ? 1 : 2);
        continue;
      }

      // 3. Check for Ghunnah: Noon or Meem with Shaddah (نّ or مّ)
      if ((char === 'ن' || char === 'م') && (next1 === 'ّ' || (next1 === 'َ' && next2 === 'ّ') || (next1 === 'ِ' && next2 === 'ّ') || (next1 === 'ُ' && next2 === 'ّ'))) {
        let spanLen = 2;
        if (next2 === 'ّ') spanLen = 3;
        const seg = chars.slice(i, i + spanLen).join('');
        const rule = TAJWEED_RULES.find((r) => r.id === 'ghunnah')!;
        elements.push(
          <span
            key={`${wordIdx}-${i}-ghunnah`}
            className={`${rule.colorClass} transition-all hover:opacity-80 cursor-help`}
            title="Ghunnah: Nasalization (2 counts)"
            onClick={onRuleClick ? () => onRuleClick(rule) : undefined}
          >
            {seg}
          </span>
        );
        i += spanLen;
        continue;
      }

      // 4. Check for Qalqalah (ق ط ب ج د with Sukoon ْ)
      if (QALQALAH_CHARS.has(char) && (next1 === 'ْ' || (i === chars.length - 1 && chars.length > 2))) {
        const seg = next1 === 'ْ' ? char + next1 : char;
        const rule = TAJWEED_RULES.find((r) => r.id === 'qalqalah')!;
        elements.push(
          <span
            key={`${wordIdx}-${i}-qalqalah`}
            className={`${rule.colorClass} transition-all hover:opacity-80 cursor-help`}
            title="Qalqalah: Echoing bounce on consonant"
            onClick={onRuleClick ? () => onRuleClick(rule) : undefined}
          >
            {seg}
          </span>
        );
        i += next1 === 'ْ' ? 2 : 1;
        continue;
      }

      // 5. Check for Idgham or Ikhfa markers:
      // Noon Sakinah (نْ) or Tanween (ً, ٍ, ٌ)
      if (char === 'ن' && next1 === 'ْ') {
        // Next character in the word or next word
        const afterSukoon = chars[i + 2] || '';
        let targetRule: TajweedRuleInfo | null = null;
        if (IKHFA_CHARS.has(afterSukoon)) {
          targetRule = TAJWEED_RULES.find((r) => r.id === 'ikhfa') || null;
        } else if (YARMALOON_CHARS.has(afterSukoon)) {
          targetRule = TAJWEED_RULES.find((r) => r.id === 'idgham') || null;
        }

        if (targetRule) {
          elements.push(
            <span
              key={`${wordIdx}-${i}-${targetRule.id}`}
              className={`${targetRule.colorClass} transition-all hover:opacity-80 cursor-help`}
              title={`${targetRule.nameEn}: ${targetRule.description}`}
              onClick={onRuleClick ? () => onRuleClick(targetRule!) : undefined}
            >
              {char + next1}
            </span>
          );
          i += 2;
          continue;
        }
      }

      // Default plain character
      elements.push(char);
      i++;
    }

    renderedWords.push(
      <span key={`word-${wordIdx}`} className="inline-block mx-[1px]">
        {elements}
      </span>
    );
    if (wordIdx < words.length - 1) {
      renderedWords.push(' ');
    }
  });

  return <>{renderedWords}</>;
}
