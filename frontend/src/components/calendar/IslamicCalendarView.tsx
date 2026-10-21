import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Moon,
  BookOpen,
  ShieldCheck,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

interface IslamicCalendarViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
}

interface IslamicMonthData {
  number: number;
  name_en: string;
  name_ar: string;
  meaning: string;
  is_sacred: boolean;
  virtues: string;
  historical_events: { title: string; year: string; desc: string; verse_key?: string }[];
  sunnah_deeds: string[];
  key_verse_key: string;
  verse_snippet: string;
}

export const IslamicCalendarView: React.FC<IslamicCalendarViewProps> = ({ onOpenAyahInReader }) => {
  const [selectedMonthNum, setSelectedMonthNum] = useState<number>(1);
  const [khatmahDays, setKhatmahDays] = useState<number>(30);
  const [liveHijriStr, setLiveHijriStr] = useState<string>('');
  const [liveHijriAr, setLiveHijriAr] = useState<string>('');
  const [currentHijriMonthNum, setCurrentHijriMonthNum] = useState<number>(1);

  // Compute live Hijri date using native Intl
  useEffect(() => {
    try {
      const now = new Date();
      const enFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const arFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setLiveHijriStr(enFormatter.format(now));
      setLiveHijriAr(arFormatter.format(now));

      // Attempt to identify month number
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric' }).formatToParts(now);
      const mPart = parts.find((p) => p.type === 'month');
      if (mPart && !isNaN(Number(mPart.value))) {
        const mNum = Number(mPart.value);
        setCurrentHijriMonthNum(mNum);
        setSelectedMonthNum(mNum);
      }
    } catch {
      setLiveHijriStr('Hijri 1448 AH');
      setLiveHijriAr('١٤٤٨ هـ');
    }
  }, []);

  const islamicMonths: IslamicMonthData[] = [
    {
      number: 1,
      name_en: 'Al-Muharram',
      name_ar: 'المُحَرَّم',
      meaning: 'The Sacred Month, in which warfare was historically forbidden',
      is_sacred: true,
      virtues: 'Known as "Shahrullah al-Muharram" (The Month of Allah). Fasting in Muharram is the most virtuous after Ramadan according to Sahih Muslim #1163.',
      historical_events: [
        { title: 'Day of Ashura (10th Muharram)', year: 'Prophetic Era', desc: 'Allah saved Prophet Musa (a.s.) and Bani Israel from Pharaoh and the Red Sea.', verse_key: '26:63' },
        { title: 'The Islamic New Year (Hijri Calendar Start)', year: '16 AH', desc: 'Caliph Umar ibn al-Khattab established the Islamic calendar beginning with the Prophet’s migration (Hijrah).' }
      ],
      sunnah_deeds: [
        'Fasting the 9th and 10th of Muharram (Tasu\'a and Ashura) expiates the sins of the preceding year (Sahih Muslim).',
        'Abundant voluntary fasts and increased charity throughout the month.',
        'Refraining completely from injustice and disputes in honour of its sacredness.'
      ],
      key_verse_key: '9:36',
      verse_snippet: 'إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ مِنْهَا أَرْبَعَةٌ حُرُمٌ'
    },
    {
      number: 2,
      name_en: 'Safar',
      name_ar: 'صَفَر',
      meaning: 'The Month of Emptiness, as ancient homes were left empty when people set out',
      is_sacred: false,
      virtues: 'The Prophet ﷺ eradicated pre-Islamic superstitious beliefs about bad luck in Safar, declaring: "There is no bad omen in Safar" (Sahih al-Bukhari #5707).',
      historical_events: [
        { title: 'Marriage of Prophet Muhammad ﷺ to Sayyidah Khadijah (r.a.)', year: 'Pre-Prophethood', desc: 'A blessed union that anchored the dawn of Islam.' },
        { title: 'The Battle of Al-Abwa (Waddan)', year: '2 AH', desc: 'The first military expedition led by the Prophet ﷺ to secure treaties.' }
      ],
      sunnah_deeds: [
        'Affirming pure Tawhid (reliance solely on Allah against superstitions).',
        'Fasting Ayyam al-Beed (13th, 14th, 15th of the lunar month).',
        'Steadfast daily morning and evening Adhkar from Hisn al-Muslim.'
      ],
      key_verse_key: '9:51',
      verse_snippet: 'قُل لَّن يُصِيبَنَآ إِلَّا مَا كَتَبَ ٱللَّهُ لَنَا هُوَ مَوْلَىٰنَا ۚ وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ ٱلْمُؤْمِنُونَ'
    },
    {
      number: 3,
      name_en: "Rabi' al-Awwal",
      name_ar: 'رَبِيع الأوّل',
      meaning: 'The First Spring, denoting the season of blooming and spiritual awakening',
      is_sacred: false,
      virtues: 'The month in which the final Messenger of Allah, Muhammad ﷺ, was born as a mercy to all creation (Rahmatan lil-Alamin), and in which he made the Great Hijrah.',
      historical_events: [
        { title: 'Birth of Prophet Muhammad ﷺ', year: 'Year of the Elephant (571 CE)', desc: 'The arrival of the final seal of the prophets.', verse_key: '21:107' },
        { title: 'The Great Hijrah & Arrival in Madinah', year: '1 AH (622 CE)', desc: 'Arrival at Quba and establishment of the first Islamic commonwealth.', verse_key: '9:40' },
        { title: 'Building of Masjid Quba', year: '1 AH', desc: 'The first mosque founded upon Taqwa (piety) from its very first day.', verse_key: '9:108' }
      ],
      sunnah_deeds: [
        'Sending abundant Salawat (blessings) upon the Prophet Muhammad ﷺ (Surah Al-Ahzab 33:56).',
        'Deep study of the Prophet’s Sirah (biography) and embodying his noble character.',
        'Fasting on Mondays (the day the Prophet ﷺ was born and received revelation - Sahih Muslim).'
      ],
      key_verse_key: '21:107',
      verse_snippet: 'وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةًۭ لِّلْعَـٰلَمِينَ'
    },
    {
      number: 4,
      name_en: "Rabi' al-Thani",
      name_ar: 'رَبِيع الآخِر',
      meaning: 'The Second Spring, the continuation of the fertile season',
      is_sacred: false,
      virtues: 'A month of strengthening the foundational Muslim community, learning Quranic injunctions, and fostering brotherhood.',
      historical_events: [
        { title: 'Consolidation of the Madinan Constitution', year: '1-2 AH', desc: 'Strengthening internal solidarity between Muhajirun and Ansar.' },
        { title: 'Expedition of Dhat ar-Riqa\'', year: '4 AH', desc: 'Where Salat al-Khawf (prayer in times of fear) was established.', verse_key: '4:102' }
      ],
      sunnah_deeds: [
        'Regular Quranic study circles and reflection (Tadabbur).',
        'Fasting the White Days (13, 14, 15).',
        'Strengthening family ties and charitable brotherhood.'
      ],
      key_verse_key: '3:103',
      verse_snippet: 'وَٱعْتَصِمُوا۟ بِحَبْلِ ٱللَّهِ جَمِيعًۭا وَلَا تَفَرَّقُوا۟'
    },
    {
      number: 5,
      name_en: 'Jumada al-Ula',
      name_ar: 'جُمَادَى الأُولَى',
      meaning: 'The First Freeze / Solidification, indicating calm winter perseverance',
      is_sacred: false,
      virtues: 'A month remembered for immense courage, strategic discipline, and dedication in defending Islamic values.',
      historical_events: [
        { title: 'The Battle of Mu\'tah', year: '8 AH', desc: 'The historic standoff where Zayd ibn Harithah, Ja\'far ibn Abi Talib, and Abdullah ibn Rawahah (r.a.) achieved martyrdom, followed by Khalid ibn al-Walid\'s brilliant leadership.' }
      ],
      sunnah_deeds: [
        'Making Dua for the Ummah and upholding moral perseverance.',
        'Cultivating bravery, truthfulness, and honesty in daily dealings.',
        'Regular Tahajjud (night prayer) and Istighfar.'
      ],
      key_verse_key: '3:139',
      verse_snippet: 'وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ'
    },
    {
      number: 6,
      name_en: 'Jumada al-Akhirah',
      name_ar: 'جُمَادَى الآخِرَة',
      meaning: 'The Second Freeze, preceding the sacred month of Rajab',
      is_sacred: false,
      virtues: 'A month of reflection, honoring the legacy of the Rightly-Guided Caliphs, and preparing one’s heart for the spiritual season.',
      historical_events: [
        { title: 'Passing of Caliph Abu Bakr as-Siddiq (r.a.)', year: '13 AH', desc: 'The closest companion to the Prophet ﷺ and first Caliph passed away, appointing Umar ibn al-Khattab (r.a.).' }
      ],
      sunnah_deeds: [
        'Reflecting on the transience of life and the certainty of the Hereafter.',
        'Studying the justice, humility, and governance of the Sahabah.',
        'Clearing pending obligations and giving Sadaqah.'
      ],
      key_verse_key: '9:100',
      verse_snippet: 'وَٱلسَّـٰبِقُونَ ٱلْأَوَّلُونَ مِنَ ٱلْمُهَـٰجِرِينَ وَٱلْأَنصَارِ وَٱلَّذِينَ ٱتَّبَعُوهُم بِإِحْسَـٰنٍۢ رَّضِىَ ٱللَّهُ عَنْهُمْ'
    },
    {
      number: 7,
      name_en: 'Rajab',
      name_ar: 'رَجَب',
      meaning: 'To Respect and Hold in Awe, one of the four sacred months',
      is_sacred: true,
      virtues: 'A sacred month (Rajab Mudar). Sins are graver and good deeds carry amplified reward. Early scholars said: "Rajab is the month of planting the seeds, Sha\'ban is watering them, and Ramadan is harvesting the crop."',
      historical_events: [
        { title: 'Al-Isra\' wal-Mi\'raj (The Night Journey & Ascension)', year: '10th Year of Prophethood', desc: 'The miraculous night journey from Makkah to Jerusalem, and ascension through the seven heavens where the 5 daily prayers were gifted.', verse_key: '17:1' },
        { title: 'Tabuk Expedition Preparations', year: '9 AH', desc: 'Testing the sincerity of believers in standing firmly for truth.' }
      ],
      sunnah_deeds: [
        'Intensifying Istighfar (seeking forgiveness) and repenting from all sins.',
        'Protecting the tongue, heart, and limbs from all wrongdoing.',
        'Preparing for Ramadan with gradual voluntary fasting and increased Quran recitation.'
      ],
      key_verse_key: '17:1',
      verse_snippet: 'سُبْحَـٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًۭا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا'
    },
    {
      number: 8,
      name_en: "Sha'ban",
      name_ar: 'شَعْبَان',
      meaning: 'The Month of Branching Out, when tribes would scatter to seek water',
      is_sacred: false,
      virtues: 'The month in which deeds are raised to the Lord of the Worlds. Aisha (r.a.) reported that the Prophet ﷺ fasted more in Sha\'ban than in any other month except Ramadan (Sahih al-Bukhari #1969).',
      historical_events: [
        { title: 'Tahweel al-Qiblah (Direction of Prayer Changed to Kaaba)', year: '2 AH', desc: 'The Qiblah was redirected from Al-Aqsa to the Sacred Mosque in Makkah.', verse_key: '2:144' },
        { title: 'Prescription of Ramadan Fasting', year: '2 AH', desc: 'Fasting in Ramadan was made obligatory as a pillar of Islam.', verse_key: '2:183' }
      ],
      sunnah_deeds: [
        'Frequent voluntary fasting in the first half of Sha\'ban to condition the soul for Ramadan.',
        'Completing any missed fasts from the previous year.',
        'Increasing daily recitation of the Quran ("The Month of the Reciters").'
      ],
      key_verse_key: '2:144',
      verse_snippet: 'قَدْ نَرَىٰ تَقَلُّبَ وَجْهِكَ فِى ٱلسَّمَآءِ ۖ فَلَنُوَلِّيَنَّكَ قِبْلَةًۭ تَرْضَىٰهَا ۚ فَوَلِّ وَجْهَكَ شَطْرَ ٱلْمَسْجِدِ ٱلْحَرَامِ'
    },
    {
      number: 9,
      name_en: 'Ramadan',
      name_ar: 'رَمَضَان',
      meaning: 'Intense Heat and Scorching, burning away sins through devotion',
      is_sacred: false,
      virtues: 'The Crown of all months! The month in which the Quran was sent down. The gates of Paradise are opened, the gates of Hellfire closed, and devils chained (Sahih al-Bukhari). Contains Laylatul Qadr, better than 1,000 months.',
      historical_events: [
        { title: 'First Revelation of the Holy Quran', year: '610 CE (Ramadan)', desc: 'Archangel Jibril appeared in the Cave of Hira with Surah Al-Alaq: "Iqra!".', verse_key: '96:1' },
        { title: 'The Great Battle of Badr', year: '17th Ramadan, 2 AH', desc: 'The decisive victory of truth over falsehood (Yawm al-Furqan).', verse_key: '3:123' },
        { title: 'The Peaceful Conquest of Makkah (Fath Makkah)', year: '20th Ramadan, 8 AH', desc: 'The Kaaba was purified from idols without bloodshed.', verse_key: '110:1' }
      ],
      sunnah_deeds: [
        'Obligatory daytime fasting with mindfulness and pure intention.',
        'Nightly Taraweeh and Tahajjud (Qiyam al-Layl) prayers.',
        'Completing a full recitation (Khatmah) of the Quran.',
        'Itikaf (spiritual retreat) in the last ten nights seeking Laylatul Qadr.',
        'Paying Zakat al-Fitr before the Eid prayer.'
      ],
      key_verse_key: '2:185',
      verse_snippet: 'شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ هُدًۭى لِّلنَّاسِ وَبَيِّنَـٰتٍۢ مِّنَ ٱلْهُدَىٰ وَٱلْفُرْقَانِ'
    },
    {
      number: 10,
      name_en: 'Shawwal',
      name_ar: 'شَوَّال',
      meaning: 'Lifting and Carrying, representing lightness and joy',
      is_sacred: false,
      virtues: 'Begins with Eid al-Fitr. Fasting six days of Shawwal after Ramadan yields the divine reward of fasting the entire year (Sahih Muslim #1164).',
      historical_events: [
        { title: 'Eid al-Fitr (Celebration of Fast-Breaking)', year: '2 AH onwards', desc: 'Gratitude for completing the blessed month of fasting.', verse_key: '2:185' },
        { title: 'The Battle of Uhud', year: '3 AH', desc: 'Endurance, obedience to prophetic command, and steadfastness.', verse_key: '3:152' },
        { title: 'The Battle of Hunayn', year: '8 AH', desc: 'Learning that true victory comes solely from Allah, not numbers.', verse_key: '9:25' }
      ],
      sunnah_deeds: [
        'Celebrating Eid al-Fitr with Takbirat, community greetings, and festive joy.',
        'Fasting the Six Sunnah Days of Shawwal (consecutive or scattered).',
        'Maintaining the pious habits (Salah, Quran reading) developed in Ramadan.'
      ],
      key_verse_key: '2:185',
      verse_snippet: 'وَلِتُكَبِّرُوا۟ ٱللَّهَ عَلَىٰ مَا هَدَىٰكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ'
    },
    {
      number: 11,
      name_en: "Dhu al-Qi'dah",
      name_ar: 'ذُو القَعْدَة',
      meaning: 'The Month of Sitting and Ceasing War, the first of three consecutive sacred months',
      is_sacred: true,
      virtues: 'A sacred month (Ashhur al-Hurum). All four Umrahs performed by Prophet Muhammad ﷺ were conducted in the month of Dhu al-Qi\'dah (Sahih al-Bukhari #1778).',
      historical_events: [
        { title: 'Treaty of Hudaybiyyah (Sulh al-Hudaybiyyah)', year: '6 AH', desc: 'A monumental turning point celebrated in the Quran as a "clear victory".', verse_key: '48:1' },
        { title: 'Bay\'at ar-Ridwan (Pledge of the Tree)', year: '6 AH', desc: 'The blessed pledge under the tree pleasing to Allah.', verse_key: '48:18' },
        { title: 'Umrat al-Qada (The Fulfilled Umrah)', year: '7 AH', desc: 'The peaceful return of Muslims to perform Umrah in Makkah.' }
      ],
      sunnah_deeds: [
        'Refraining completely from quarreling and disputes.',
        'Preparing spiritually, physically, and financially for Hajj.',
        'Increasing Quranic recitation and voluntary charity.'
      ],
      key_verse_key: '48:1',
      verse_snippet: 'إِنَّا فَتَحْنَا لَكَ فَتْحًۭا مُّبِينًۭا'
    },
    {
      number: 12,
      name_en: 'Dhu al-Hijjah',
      name_ar: 'ذُو الحِجَّة',
      meaning: 'The Month of the Pilgrimage (Hajj), honoring the legacy of Prophet Ibrahim (a.s.)',
      is_sacred: true,
      virtues: 'The first ten days of Dhu al-Hijjah are the most beloved days of righteous action to Allah in the entire year (Sahih al-Bukhari #969). Allah swears by them in Surah Al-Fajr: "By the dawn, and by ten nights."',
      historical_events: [
        { title: 'The Day of Arafah (9th Dhu al-Hijjah)', year: 'Annual Peak of Hajj', desc: 'The day sins are forgiven more than any other day; fasting expiates two years of sins.', verse_key: '9:3' },
        { title: 'Hajjat al-Wada\' (The Farewell Pilgrimage)', year: '10 AH', desc: 'The Prophet’s farewell sermon on universal human rights and equality, and the completion of religion.', verse_key: '5:3' },
        { title: 'Eid al-Adha & Udhiyyah (Sacrifice)', year: '10th-13th Dhu al-Hijjah', desc: 'Honoring Ibrahim (a.s.) and Ismail (a.s.)’s absolute devotion to Allah.', verse_key: '22:37' }
      ],
      sunnah_deeds: [
        'Fasting the first 9 days of Dhu al-Hijjah, especially the Day of Arafah.',
        'Abundant Takbir (Allahu Akbar), Tahmid (Alhamdulillah), and Tahlil (La ilaha illallah).',
        'Offering the sacrificial animal (Qurbani / Udhiyyah) for those able.',
        'Performing Hajj pilgrimage with humility and sincerity.'
      ],
      key_verse_key: '89:1-2',
      verse_snippet: 'وَٱلْفَجْرِ • وَلَيَالٍ عَشْرٍۢ'
    }
  ];

  const selectedMonth = islamicMonths.find((m) => m.number === selectedMonthNum) || islamicMonths[0];

  // Daily Khatmah calculation
  const totalQuranPages = 604;
  const totalAyahs = 6236;
  const pagesPerDay = (totalQuranPages / khatmahDays).toFixed(1);
  const ayahsPerDay = Math.ceil(totalAyahs / khatmahDays);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Live Hijri Date Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#047857] p-6 sm:p-10 text-white shadow-xl overflow-hidden islamic-pattern">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#fbbf24] font-semibold">
              <Moon className="w-3.5 h-3.5" />
              <span>The Sacred Lunar System • التقويم الهجري</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Islamic Calendar & The 12 Sacred Months
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              «إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا» — Surah At-Tawbah (9:36). Explore the spiritual virtues, prophetic milestones, and divine rulings of each lunar month.
            </p>
          </div>

          {/* Current Live Hijri Clock Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[220px] shadow-lg">
            <span className="text-[11px] font-bold text-[#fbbf24] uppercase tracking-wider block mb-1">
              Current Live Hijri Date
            </span>
            <p className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {liveHijriStr || '10 Jumada al-Ula 1448 AH'}
            </p>
            <p className="font-arabic text-lg text-[#fbbf24] mt-0.5" dir="rtl">
              {liveHijriAr || '١٠ جمادى الأولى ١٤٤٨ هـ'}
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lunar Orbit Synchronized</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Sacred Months Quick Highlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { num: 1, name: 'Muharram', ar: 'المحرّم', desc: 'Day of Ashura & Shahrullah' },
          { num: 7, name: 'Rajab', ar: 'رجب', desc: 'Al-Isra\' wal-Mi\'raj' },
          { num: 11, name: 'Dhu al-Qi\'dah', ar: 'ذو القعدة', desc: 'Sulh al-Hudaybiyyah' },
          { num: 12, name: 'Dhu al-Hijjah', ar: 'ذو الحجة', desc: '10 Best Days & Hajj' }
        ].map((sm) => (
          <div
            key={sm.num}
            onClick={() => setSelectedMonthNum(sm.num)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedMonthNum === sm.num
                ? 'bg-amber-50 dark:bg-amber-950/30 border-[#d97706] shadow-md ring-2 ring-[#d97706]/40'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-[#d97706]/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#d97706]/15 text-[#b45309] dark:text-[#fbbf24]">
                <ShieldCheck className="w-3 h-3" />
                Sacred Month
              </span>
              <span className="font-arabic text-xs font-bold text-slate-500">{sm.ar}</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
              {sm.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {sm.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 12 Months Horizontal Selector Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
            Select Islamic Month
          </span>
          <span className="text-slate-400 text-[11px]">
            Active: Month {selectedMonth.number} of 12
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {islamicMonths.map((m) => {
            const isSelected = selectedMonthNum === m.number;
            const isCurrent = currentHijriMonthNum === m.number;
            return (
              <button
                key={m.number}
                onClick={() => setSelectedMonthNum(m.number)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{m.number}. {m.name_en}</span>
                <span className="font-arabic opacity-75 text-[11px]">({m.name_ar})</span>
                {m.is_sacred && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" title="Sacred Month" />
                )}
                {isCurrent && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                    Now
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Month Deep-Dive Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile & Quran Scripture */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Month Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-[#064e3b] dark:text-[#fbbf24]">
                    #{selectedMonth.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                      {selectedMonth.name_en}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Meaning: "{selectedMonth.meaning}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-arabic text-2xl font-bold text-[#064e3b] dark:text-[#fbbf24]">
                  {selectedMonth.name_ar}
                </span>
                {selectedMonth.is_sacred && (
                  <span className="block text-[10px] font-bold text-[#d97706] uppercase tracking-wider">
                    ★ Ashhur al-Hurum
                  </span>
                )}
              </div>
            </div>

            {/* Virtues Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#064e3b] dark:text-[#fbbf24]" />
                Spiritual Virtues & Authentic Sunnah
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700/60">
                {selectedMonth.virtues}
              </p>
            </div>

            {/* Key Quranic Scripture Box */}
            <div className="p-5 rounded-2xl bg-[#064e3b]/5 dark:bg-slate-800/80 border border-[#064e3b]/20 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#064e3b] dark:text-[#fbbf24] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Related Scripture • Ayah {selectedMonth.key_verse_key}
                </span>
                <button
                  onClick={() => onOpenAyahInReader(selectedMonth.key_verse_key)}
                  className="px-2.5 py-1 rounded-lg bg-[#064e3b] hover:bg-[#047857] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Open in Quran Reader</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <p className="font-arabic text-xl sm:text-2xl text-slate-900 dark:text-slate-100 font-bold leading-relaxed text-center py-2" dir="rtl">
                {selectedMonth.verse_snippet}
              </p>
            </div>

            {/* Recommended Sunnah Deeds */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#d97706]" />
                Recommended Monthly Deeds & Sunan
              </h4>
              <ul className="space-y-2">
                {selectedMonth.sunnah_deeds.map((deed, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{deed}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Milestones & Khatmah Planner */}
        <div className="lg:col-span-5 space-y-6">
          {/* Historical Sirah Milestones */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#064e3b] dark:text-[#fbbf24]" />
                Historical Milestones in {selectedMonth.name_en}
              </h3>
            </div>

            <div className="space-y-3">
              {selectedMonth.historical_events.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ev.title}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      {ev.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ev.desc}
                  </p>
                  {ev.verse_key && (
                    <button
                      onClick={() => onOpenAyahInReader(ev.verse_key!)}
                      className="text-[11px] font-semibold text-[#064e3b] dark:text-[#fbbf24] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Read Revelation Ayah {ev.verse_key}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Khatmah Goal Calculator Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#d97706]" />
              <span>Quran Khatmah Target Planner</span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Complete the Quran in Your Chosen Days
            </h3>
            <p className="text-xs text-slate-500">
              Calculate your daily reading quota to complete a full Khatmah of the Quran.
            </p>

            {/* Target Days Selector */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[15, 30, 60, 180].map((days) => (
                <button
                  key={days}
                  onClick={() => setKhatmahDays(days)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    khatmahDays === days
                      ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-center border border-emerald-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Reading</span>
                <p className="text-xl font-bold text-[#064e3b] dark:text-[#fbbf24] mt-0.5">
                  {pagesPerDay} Pages
                </p>
                <span className="text-[10px] text-slate-500">(~{Math.ceil(Number(pagesPerDay) / 5)} pgs/Salah)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-center border border-emerald-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Verses</span>
                <p className="text-xl font-bold text-[#064e3b] dark:text-[#fbbf24] mt-0.5">
                  {ayahsPerDay} Ayahs
                </p>
                <span className="text-[10px] text-slate-500">(Of 6,236 Total)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
