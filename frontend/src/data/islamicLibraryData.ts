// Comprehensive Data for Grand Islamic Library, Quran Editions, and Noorani Qaida Basics

export interface IslamicBook {
  id: string;
  title: string;
  title_ar: string;
  author: string;
  author_ar: string;
  death_year_ah: number;
  death_year_ce: number;
  category: 'tafsir' | 'hadith' | 'sirah' | 'aqeedah_fiqh' | 'spirituality';
  languages: ('Arabic' | 'English' | 'Urdu')[];
  volumes: number | string;
  description: string;
  significance: string;
  key_chapters: string[];
  sample_passage: {
    arabic: string;
    english: string;
    urdu: string;
  };
  open_access_url?: string;
}

export interface QuranEdition {
  id: string;
  name: string;
  name_ar: string;
  script_type: string;
  lines_per_page: number | string;
  region: string;
  description: string;
  features: string[];
  sample_ayah: {
    surah: string;
    verse: string;
    text: string;
    translation: string;
  };
  historical_era?: string;
  location?: string;
}

export interface QaidaLetter {
  id: number;
  arabic: string;
  name: string;
  transliteration: string;
  makhraj: string;
  makhraj_ur: string;
  is_heavy: boolean; // Tafkheem
  is_qalqalah: boolean;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  example: string;
}

export interface QaidaLesson {
  id: number;
  title: string;
  title_ar: string;
  subtitle: string;
  explanation: string;
  rule_points: string[];
  examples: {
    arabic: string;
    transliteration: string;
    note: string;
  }[];
}

export interface QaidaQuizQuestion {
  id: number;
  question: string;
  question_ar: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

// 1. Classical & Contemporary Islamic Books
export const ISLAMIC_BOOKS: IslamicBook[] = [
  // --- TAFSIR ---
  {
    id: 'tafsir_ibn_kathir',
    title: 'Tafsir Ibn Kathir (Tafsir al-Qur\'an al-\'Azim)',
    title_ar: 'تفسير القرآن العظيم (ابن كثير)',
    author: 'Imam Hafiz Ibn Kathir',
    author_ar: 'الإمام الحافظ إسماعيل بن كثير الدمشقي',
    death_year_ah: 774,
    death_year_ce: 1373,
    category: 'tafsir',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '4–10 Volumes',
    description: 'The golden standard of classical traditional exegesis (Tafsir bil-Ma\'thur). Ibn Kathir interprets Quran by Quran first, then by authentic Sunnah, followed by consensus of the Sahabah (Companions) and Tabi\'in.',
    significance: 'Considered by Islamic orthodoxy to be the most reliable, comprehensive, and authentic Quranic exegesis throughout the centuries.',
    key_chapters: [
      'Muqaddimah (Introduction to the Methodology of Tafsir)',
      'Tafsir of Surah Al-Fatihah (The Opening)',
      'Tafsir of Ayat al-Kursi (2:255)',
      'Tafsir of Surah Ya-Sin (36)',
      'Tafsir of Juz \'Amma (Chapters 78–114)'
    ],
    sample_passage: {
      arabic: 'فَإِنْ قَالَ قَائِلٌ: فَمَا أَحْسَنُ طُرُقِ التَّفْسِيرِ؟ فَالْجَوَابُ: إِنَّ أَصَحَّ الطُّرُقِ فِي ذَلِكَ أَنْ يُفَسَّرَ الْقُرْآنُ بِالْقُرْآنِ، فَمَا أُجْمِلَ فِي مَكَانٍ فَإِنَّهُ قَدْ فُسِّرَ فِي مَوْضِعٍ آخَرَ.',
      english: 'If someone asks: "What is the best methodology of Tafsir?" The answer is: Verily, the most sound method is to explain the Quran with the Quran itself. What is mentioned in brief in one passage is clarified and detailed in another.',
      urdu: 'اگر کوئی پوچھے کہ تفسیر کا بہترین طریقہ کیا ہے؟ تو جواب یہ ہے کہ سب سے مستند طریقہ یہ ہے کہ قرآن کی تفسیر خود قرآن سے کی جائے، کیونکہ جو بات ایک جگہ اجمالی ہو وہ دوسری جگہ تفصیل سے بیان ہوئی ہے۔'
    },
    open_access_url: 'https://archive.org/details/tafsir-ibn-kathir-english'
  },
  {
    id: 'tafsir_al_jalalayn',
    title: 'Tafsir al-Jalalayn',
    title_ar: 'تفسير الجلالين',
    author: 'Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti',
    author_ar: 'جلال الدين المحلي وجلال الدين السيوطي',
    death_year_ah: 911,
    death_year_ce: 1505,
    category: 'tafsir',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1 Volume (Concise)',
    description: 'A celebrated masterpiece written by two eminent Egyptian scholars (both named Jalal al-Din). Renowned for its brevity, word-by-word grammatical clarity, and identification of implicit meanings and abrogated verses.',
    significance: 'The most widely taught introductory Tafsir across traditional Islamic seminaries (Madaris) and Al-Azhar University.',
    key_chapters: [
      'Al-Fatihah to Al-Isra (Completed by Al-Suyuti)',
      'Al-Kahf to An-Nas (Authored by Al-Mahalli)',
      'Detailed Grammatical Analysis of Omitted Pronouns'
    ],
    sample_passage: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ: أَيْ أَبْدَأُ مُسْتَعِينًا بِاسْمِ اللَّهِ، وَهُوَ عَلَمٌ عَلَى الذَّاتِ الْوَاجِبِ الْوُجُودِ الْمُسْتَحِقِّ لِكُلِّ حَمْدٍ.',
      english: 'Bismillah al-Rahman al-Rahim: Meaning, "I begin seeking assistance through the name of Allah", which is the supreme proper name of the Necessary Being deserving of all praise.',
      urdu: 'بسم الله الرحمن الرحيم: یعنی میں اللہ کے نام سے مدد لیتے ہوئے شروع کرتا ہوں، جو کہ اس ذات واجب الوجود کا نام ہے جو تمام تعریفوں کی مستحق ہے۔'
    },
    open_access_url: 'https://archive.org/details/TafsirAlJalalaynEnglish'
  },
  {
    id: 'maariful_quran',
    title: 'Ma\'ariful Quran (Wisdom of the Quran)',
    title_ar: 'معارف القرآن (المفتي محمد شفيع)',
    author: 'Grand Mufti Muhammad Shafi Deobandi',
    author_ar: 'مفتي الديار الباكستانية محمد شفيع العثماني',
    death_year_ah: 1396,
    death_year_ce: 1976,
    category: 'tafsir',
    languages: ['Urdu', 'English'],
    volumes: '8 Volumes',
    description: 'A profound 8-volume exegesis combining classical orthodox scholasticism with deep answers to contemporary socio-moral, legal, and spiritual challenges.',
    significance: 'Regarded as the most authoritative, accessible, and beloved comprehensive Urdu exegesis of the 20th century.',
    key_chapters: [
      'Legal Injunctions of Inheritance (Surah An-Nisa)',
      'Economic Justice and Prohibition of Usury (Surah Al-Baqarah)',
      'Spiritual Wisdoms of Surah Yusuf',
      'The Virtues and Miracles of Ayat al-Kursi'
    ],
    sample_passage: {
      arabic: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
      english: 'The Prophet Muhammad (peace be upon him) was sent as a universal mercy not only to human beings but to all creations, believers and disbelievers alike, by showing them the straight path to eternal salvation.',
      urdu: 'حضور اقدس صلی اللہ علیہ وسلم صرف انسانوں ہی کے لیے نہیں بلکہ تمام کائنات کے لیے رحمت بنا کر بھیجے گئے ہیں، یہاں تک کہ کافروں پر سے وہ اجتماعی عذاب ہٹا دیا گیا جو پچھلی امتوں پر آیا کرتا تھا۔'
    },
    open_access_url: 'https://archive.org/details/MaarifulQuranEnglish'
  },
  {
    id: 'tafhim_ul_quran',
    title: 'Tafhim-ul-Quran (Towards Understanding the Quran)',
    title_ar: 'تفهيم القرآن (سيد أبو الأعلى المودودي)',
    author: 'Sayyid Abul A\'la Maududi',
    author_ar: 'سيد أبو الأعلى المودودي',
    death_year_ah: 1399,
    death_year_ce: 1979,
    category: 'tafsir',
    languages: ['Urdu', 'English'],
    volumes: '6 Volumes',
    description: 'A monument of Islamic revivalist literature focusing on the Quran as a practical living blueprint for dynamic personal reformation and societal governance.',
    significance: 'Has inspired millions of modern students and intellectuals across the globe to engage with the Quran as an active guide for life.',
    key_chapters: [
      'Comprehensive Historical Introductions to each of the 114 Surahs',
      'The Four Fundamental Quranic Terms: Ilah, Rabb, Ibadah, Deen',
      'Context of the Battle of Badr in Surah Al-Anfal'
    ],
    sample_passage: {
      arabic: 'إِنَّ هَـٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ',
      english: 'The Quran is not an abstract theoretical treatise; it is the living speech of the Lord of the Universe addressing mankind to guide them onto the straightest, most balanced and enduring path of justice and righteousness.',
      urdu: 'قرآن مجید محض فلسفیانہ یا خشک کتاب نہیں ہے بلکہ کائنات کے خالق و مالک کا وہ زندہ کلام ہے جو انسانوں کو زندگی کے اس راستے کی طرف رہنمائی کرتا ہے جو سب سے سیدھا، مستحکم اور باوقار ہے۔'
    },
    open_access_url: 'https://archive.org/details/tafheem-ul-quran-english'
  },

  // --- HADITH COLLECTIONS ---
  {
    id: 'sahih_al_bukhari',
    title: 'Sahih al-Bukhari (Al-Jami\' al-Sahih)',
    title_ar: 'الجامع المسند الصحيح (صحيح البخاري)',
    author: 'Imam Muhammad bin Ismail al-Bukhari',
    author_ar: 'الإمام محمد بن إسماعيل البخاري',
    death_year_ah: 256,
    death_year_ce: 870,
    category: 'hadith',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '9 Volumes (7,563 Ahadith)',
    description: 'The pinnacle of prophetic tradition compilation. Imam Bukhari spent 16 years verifying each chain of narration under the most rigorous standards of transmitter memory, integrity, and direct continuous meeting.',
    significance: 'Consensually recognized by all Muslim scholars as the most authentic book in existence after the Holy Quran (أصح كتاب بعد كتاب الله).',
    key_chapters: [
      'Kitab Bad\' al-Wahy (Beginning of Revelation)',
      'Kitab al-Iman (Book of Faith)',
      'Kitab al-\'Ilm (Book of Knowledge)',
      'Kitab al-Salah (Book of Prayer)',
      'Kitab al-Tawhid (Book of Monotheism)'
    ],
    sample_passage: {
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
      english: 'Actions are judged strictly by intentions, and every person will receive only that which they intended. Thus, he whose migration was for Allah and His Messenger, his migration is for Allah and His Messenger...',
      urdu: 'تمام اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کے لیے وہی کچھ ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت اللہ اور اس کے رسول کے لیے ہو تو اس کی ہجرت اللہ اور اس کے رسول کے لیے سمجھی جائے گی...'
    },
    open_access_url: 'https://sunnah.com/bukhari'
  },
  {
    id: 'sahih_muslim',
    title: 'Sahih Muslim',
    title_ar: 'صحيح مسلم',
    author: 'Imam Muslim ibn al-Hajjaj al-Naysaburi',
    author_ar: 'الإمام مسلم بن الحجاج القشيري النيسابوري',
    death_year_ah: 261,
    death_year_ce: 875,
    category: 'hadith',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '7 Volumes (7,500 Ahadith)',
    description: 'The second authentic compilation of the Sahihayn. Renowned for its unparalleled thematic arrangement, where all variations and chains (turuq) of a hadith are grouped together in one coherent place.',
    significance: 'Revered for its methodological perfection, profound introduction on Hadith criticism, and legal precision.',
    key_chapters: [
      'Introduction to the Methodology of Hadith Authenticity',
      'Hadith of Jibril (Islam, Iman, Ihsan, Signs of the Hour)',
      'Kitab al-Qadr (Book of Divine Decree)',
      'Kitab al-Zikr wa al-Du\'a (Book of Remembrance)'
    ],
    sample_passage: {
      arabic: 'مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ.',
      english: 'Whoever introduces an act of worship into our religion that does not conform to our command, it shall be rejected.',
      urdu: 'جس شخص نے کوئی ایسا عمل کیا جس پر ہمارا حکم نہیں ہے، تو وہ مردود اور نا مقبول ہے۔'
    },
    open_access_url: 'https://sunnah.com/muslim'
  },
  {
    id: 'riyad_as_salihin',
    title: 'Riyad as-Salihin (Gardens of the Righteous)',
    title_ar: 'رياض الصالحين من كلام سيد المرسلين',
    author: 'Imam Yahya bin Sharaf al-Nawawi',
    author_ar: 'الإمام محيي الدين يحيى بن شرف النووي',
    death_year_ah: 676,
    death_year_ce: 1277,
    category: 'hadith',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1–2 Volumes (1,896 Ahadith)',
    description: 'A curated manual of spiritual purification, moral conduct, and noble ethics. Each chapter begins with relevant Quranic verses followed by authenticated Prophetic ahadith.',
    significance: 'Read daily in homes and masjids worldwide as the premier practical guide to living a righteous prophetic lifestyle.',
    key_chapters: [
      'Bab al-Ikhlas (Sincerity in all Secret and Open Deeds)',
      'Bab al-Sabr (Patience and Steadfastness in Trials)',
      'Bab al-Sidq (Truthfulness in Speech and Conduct)',
      'Bab al-Tawbah (Repentance and Turning to Allah)'
    ],
    sample_passage: {
      arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ.',
      english: 'How wonderful is the affair of the believer! Verily all his affairs are good for him, and this is true for no one except the believer: if prosperity comes to him he is grateful, which is good for him; and if adversity befalls him he is patient, which is good for him.',
      urdu: 'مومن کا معاملہ بھی کتنا عجیب ہے! اس کے ہر معاملے میں اس کے لیے خیر ہی خیر ہے۔ اور یہ فضیلت مومن کے علاوہ کسی کو حاصل نہیں۔ اگر اسے خوشی ملے تو شکر کرتا ہے، یہ اس کے لیے بہتر ہے؛ اور اگر مصیبت آئے تو صبر کرتا ہے، یہ بھی اس کے لیے بہتر ہے۔'
    },
    open_access_url: 'https://sunnah.com/riyadussalihin'
  },
  {
    id: 'forty_hadith_nawawi',
    title: 'The 40 Hadith of Imam Nawawi',
    title_ar: 'الأربعون النووية',
    author: 'Imam Yahya bin Sharaf al-Nawawi',
    author_ar: 'الإمام النووي',
    death_year_ah: 676,
    death_year_ce: 1277,
    category: 'hadith',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1 Pocket Volume (42 Ahadith)',
    description: '42 pivotal ahadith that embody the foundational principles of Islam (Jawami\' al-Kalim). Scholars state that entire Islamic jurisprudence and theology revolve around these selected sayings.',
    significance: 'The universally memorized core curriculum for every student of sacred Islamic knowledge.',
    key_chapters: [
      'Hadith 1: Sincerity of Intention',
      'Hadith 2: The Three Dimensions of Religion (Islam, Iman, Ihsan)',
      'Hadith 6: The Halal is Clear and the Haram is Clear',
      'Hadith 16: The Prohibition of Anger',
      'Hadith 19: Safeguard Allah and He Will Safeguard You'
    ],
    sample_passage: {
      arabic: 'احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ.',
      english: 'Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. When you ask, ask of Allah; and when you seek help, seek help from Allah alone.',
      urdu: 'اللہ کے احکام کی حفاظت کر، وہ تیری حفاظت کرے گا۔ اللہ کو یاد رکھ، تو اسے اپنے سامنے پائے گا۔ جب تو مانگے تو صرف اللہ سے مانگ، اور جب مدد چاہے تو صرف اللہ ہی سے مدد طلب کر۔'
    },
    open_access_url: 'https://sunnah.com/nawawi40'
  },

  // --- SIRAH & HISTORY ---
  {
    id: 'ar_raheeq_al_makhtum',
    title: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
    title_ar: 'الرحيق المختوم (سيرة النبي صلى الله عليه وسلم)',
    author: 'Sheikh Safi-ur-Rahman Mubarakpuri',
    author_ar: 'الشيخ صفي الرحمن المباركفوري',
    death_year_ah: 1427,
    death_year_ce: 2006,
    category: 'sirah',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1 Comprehensive Volume',
    description: 'Awarded 1st Prize by the Muslim World League in Makkah out of 1,182 manuscripts submitted from around the world. A chronological, rigorously authenticated biography of Prophet Muhammad ﷺ.',
    significance: 'The modern gold standard of Sirah studies, written in lucid, inspiring, and historically unassailable prose.',
    key_chapters: [
      'Pre-Islamic Arabia and Religious Conditions',
      'Lineage, Birth, and Childhood of the Prophet ﷺ',
      'The First Dawn of Prophethood in Cave Hira',
      'The Boycott in Shi\'b Abi Talib and Year of Sorrow',
      'The Great Hijrah to Madinah al-Munawwarah',
      'The Treaty of Hudaybiyyah and Conquest of Makkah',
      'The Farewell Pilgrimage (Hajjat al-Wada\')'
    ],
    sample_passage: {
      arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ — لَمْ يَكُنْ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فَاحِشًا وَلَا مُتَفَحِّشًا، وَكَانَ أَجْوَدَ النَّاسِ بِالْخَيْرِ.',
      english: 'The Prophet ﷺ was the most generous of all people, the bravest, the most truthful in speech, and the most gentle in disposition. He was the walking Quran in human form.',
      urdu: 'آپ صلی اللہ علیہ وسلم تمام انسانوں میں سب سے زیادہ سخی، سب سے زیادہ بہادر اور سب سے سچے انسان تھے۔ آپ کا اخلاق ہی مجسم قرآن تھا جس نے تاریخ انسانی کا رخ ہمیشہ کے لیے بدل دیا۔'
    },
    open_access_url: 'https://archive.org/details/TheSealedNectar-Ar-raheeqAl-makhtum'
  },
  {
    id: 'qisas_al_anbiya',
    title: 'Qisas al-Anbiya (Stories of the Prophets)',
    title_ar: 'قصص الأنبياء (ابن كثير)',
    author: 'Imam Hafiz Ibn Kathir',
    author_ar: 'الإمام ابن كثير',
    death_year_ah: 774,
    death_year_ce: 1373,
    category: 'sirah',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1–2 Volumes',
    description: 'The definitive chronicle of the 25 Prophets mentioned in the Holy Quran, drawn directly from Quranic verses, authentic hadith, and separating fact from unverified Isra\'iliyyat tales.',
    significance: 'Essential reading to understand the unified thread of Tawhid (monotheism) throughout human history from Adam (AS) to Prophet Muhammad ﷺ.',
    key_chapters: [
      'Creation of Adam (AS) and the Covenant of Souls',
      'Nuh (Noah AS) and the Great Ark of Salvation',
      'Ibrahim (Abraham AS) — The Friend of Allah and Builder of the Ka\'bah',
      'Yusuf (Joseph AS) — The Best of Stories',
      'Musa (Moses AS) and the Exodus from Pharaoh',
      'Isa ibn Maryam (Jesus AS) and the Divine Miracle of his Birth'
    ],
    sample_passage: {
      arabic: 'لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِّأُولِي الْأَلْبَابِ ۗ مَا كَانَ حَدِيثًا يُفْتَرَىٰ',
      english: 'There was certainly in their stories a profound lesson for those endowed with understanding. It is not an invented story, but a confirmation of what was before it and a detailed explanation of all things.',
      urdu: 'یقیناً ان انبیاء کے واقعات میں عقل والوں کے لیے بڑی عبرت ہے۔ یہ کوئی گھڑی ہوئی بات نہیں بلکہ ان کتابوں کی تصدیق ہے جو پہلے آچکی ہیں اور ہر چیز کی تفصیل ہے۔'
    },
    open_access_url: 'https://archive.org/details/storiesoftheprophets_202003'
  },

  // --- AQEEDAH & FIQH ---
  {
    id: 'aqeedah_al_tahawiyyah',
    title: 'Al-Aqeedah Al-Tahawiyyah',
    title_ar: 'العقيدة الطحاوية (بيان عقيدة أهل السنة والجماعة)',
    author: 'Imam Abu Ja\'far al-Tahawi',
    author_ar: 'الإمام أبو جعفر أحمد بن محمد الطحاوي الحنفي',
    death_year_ah: 321,
    death_year_ce: 933,
    category: 'aqeedah_fiqh',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1 Concise Treatise',
    description: 'The landmark articulation of the unanimous orthodox Islamic creed (Ahl as-Sunnah wal-Jama\'ah) formulated by the great 3rd-century Egyptian jurist.',
    significance: 'Accepted by Hanafi, Maliki, Shafi\'i, and Hanbali scholars as a pure, dispute-free summary of prophetic belief.',
    key_chapters: [
      'Affirmation of Allah\'s Absolute Oneness and Incomparability',
      'The Finality of the Prophethood of Muhammad ﷺ',
      'The Quran as the Uncreated Speech of Allah',
      'Belief in Divine Decree (Al-Qadr)',
      'The Intercession (Shafa\'ah) and the Pool (Al-Kawthar)'
    ],
    sample_passage: {
      arabic: 'نَقُولُ فِي تَوْحِيدِ اللَّهِ مُعْتَقِدِينَ بِتَوْفِيقِ اللَّهِ: إِنَّ اللَّهَ وَاحِدٌ لَا شَرِيكَ لَهُ، وَلَا شَيْءَ مِثْلُهُ، وَلَا شَيْءَ يُعْجِزُهُ، وَلَا إِلَهَ غَيْرُهُ.',
      english: 'We say concerning Allah\'s Oneness — believing by Allah\'s guidance — that Allah is One, without any partner; there is nothing like unto Him; nothing is impossible for Him; and there is no deity worthy of worship except Him.',
      urdu: 'ہم اللہ کی توفیق پر یقین رکھتے ہوئے اس کی توحید کے بارے میں کہتے ہیں: بیشک اللہ ایک ہے، اس کا کوئی شریک نہیں، کوئی چیز اس کے مانند نہیں، کوئی چیز اسے عاجز نہیں کر سکتی، اور اس کے سوا کوئی معبود نہیں۔'
    },
    open_access_url: 'https://archive.org/details/Al-aqidahAl-tahawiyyah-English'
  },
  {
    id: 'hisn_al_muslim',
    title: 'Hisn al-Muslim (Fortress of the Muslim)',
    title_ar: 'حصن المسلم من أذكار الكتاب والسنة',
    author: 'Dr. Sa\'id bin Ali bin Wahf al-Qahtani',
    author_ar: 'الشيخ الدكتور سعيد بن علي بن وهف القحطاني',
    death_year_ah: 1440,
    death_year_ce: 2018,
    category: 'spirituality',
    languages: ['Arabic', 'English', 'Urdu'],
    volumes: '1 Pocket Companion (267 Duas)',
    description: 'The most popular modern collection of authentic daily invocations and supplications extracted strictly from the Holy Quran and Sahih Sunnah.',
    significance: 'Translated into over 75 languages; serves as the daily spiritual shield for believers across the globe.',
    key_chapters: [
      'Morning and Evening Adhkar (أذكار الصباح والمساء)',
      'Duas for Sleeping and Waking Up',
      'Duas in Times of Distress, Sorrow, and Anxiety',
      'Supplications for Entering and Exiting the Home/Masjid',
      'The Ruqyah for Healing from Illness and Evil Eye'
    ],
    sample_passage: {
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
      english: 'We have reached the morning, and with it the kingdom belongs to Allah; all praise is due to Allah. There is no deity worthy of worship except Allah alone, without partner; to Him belongs all sovereignty and to Him belongs all praise, and He has power over all things.',
      urdu: 'ہم نے صبح کی اور اللہ کے سارے ملک نے صبح کی، اور تمام تعریف اللہ کے لیے ہے، اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف، اور وہ ہر چیز پر قادر ہے۔'
    },
    open_access_url: 'https://archive.org/details/HisnulMuslimUrduEnglish'
  }
];

// 2. Quran Editions & Historical Manuscripts
export const QURAN_EDITIONS: QuranEdition[] = [
  {
    id: 'indopak_script',
    name: 'Indo-Pak / Persian-Arabic Script (13 & 16 Lines)',
    name_ar: 'رسم المصحف الهندي الباكستاني (الخط النستعليق/النسخ)',
    script_type: 'Nastaliq / Bold Indo-Pak Naskh',
    lines_per_page: '13 or 16 Lines',
    region: 'South Asia (India, Pakistan, Bangladesh), Afghanistan, Central Asia',
    description: 'The distinguished, bold calligraphic script deeply familiar to over 500 million Muslims. Designed with clear vowel markings, distinctive stop symbols (Rumuz al-Awqaf), and fixed line endings per page.',
    features: [
      'Fixed Line Layout: 13-line (widely used in Madaris for Hifz) and 16-line editions',
      'Distinctive Stop Symbols: م (Compulsory Stop), ط (Absolute Stop), ج (Permissible), ز (Licensed), لا (Do not stop)',
      'Subtle ligatures that mirror South Asian handwritten Nastaliq aesthetics',
      'Pronounced Noon Ghunnah and Tanween indicators'
    ],
    sample_ayah: {
      surah: 'Al-Fatihah (1:1-2)',
      verse: '1:1',
      text: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِیْمِ ۝۱ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِیْنَ ۝۲',
      translation: 'In the name of Allah, the Most Compassionate, the Most Merciful. All praise is due to Allah, Lord of all the worlds.'
    }
  },
  {
    id: 'madani_uthmani',
    name: 'Madani Standard Uthmani (15 Lines)',
    name_ar: 'مصحف المدينة النبوية (مجمع الملك فهد)',
    script_type: 'King Fahd Complex Classic Uthmani Naskh',
    lines_per_page: '15 Lines',
    region: 'Saudi Arabia, Arab World, Global Standard',
    description: 'The universally standardized printed Mushaf written by the master Syrian calligrapher Uthman Taha. Each page ends exactly on the completion of an Ayah (Ayah-stop alignment).',
    features: [
      'Strict Hafs \'an \'Asim standard with official Medina vocalization marks',
      'Every Surah starts on a new distinct decorative banner',
      'Complete Juz, Hizb, and Quarter markings in borders',
      'Exact 604-page layout corresponding with global printing norms'
    ],
    sample_ayah: {
      surah: 'Al-Baqarah (2:255)',
      verse: '2:255',
      text: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ',
      translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep.'
    }
  },
  {
    id: 'tajweed_color_coded',
    name: 'Tajweed Color-Coded Rule Mushaf',
    name_ar: 'مصحف التجويد الملون مع بيان مخارج الحروف',
    script_type: 'Standard Uthmani with 6-color Phonetic Coding',
    lines_per_page: '15 Lines',
    region: 'Worldwide / Tajweed Learners',
    description: 'An educational breakthrough that colors Arabic letters according to their scientific recitation rule (Madd elongation, Ghunnah nasalization, Qalqalah echo, and Ikhfa concealment).',
    features: [
      'Red/Orange hues indicate Madd duration (2, 4, 6 counts)',
      'Green shades highlight Ghunnah and Ikhfa nasal resonance',
      'Blue tones designate Qalqalah echo letters (ق ط ب ج د)',
      'Gray letters indicate unpronounced letters (Idgham / Silent Wasl)'
    ],
    sample_ayah: {
      surah: 'Al-Ikhlas (112:1-4)',
      verse: '112:1-4',
      text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      translation: 'Say, "He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent."'
    }
  },
  {
    id: 'birmingham_manuscript',
    name: 'The Birmingham Quran Manuscript (Early Hijazi Script)',
    name_ar: 'مخطوطة برمنغهام القرآنية (الخط الحجازي المبكر)',
    script_type: 'Ancient Hijazi / Ma\'il Script on Parchment',
    lines_per_page: 'Parchment Folio (~24 lines)',
    region: 'Hejaz (Makkah/Madinah) • Preserved in University of Birmingham',
    historical_era: 'c. 568–645 CE (Carbon-dated with 95.4% accuracy to the era of the Prophet ﷺ and early Sahabah)',
    description: 'One of the oldest surviving Quranic manuscripts in the world. Written on parchment leaves in early slanted Hijazi script, containing portions of Surahs Maryam (19), Taha (20), and Al-Kahf (18).',
    features: [
      'Radiocarbon dating confirms proximity to the lifetime of Prophet Muhammad ﷺ',
      'Text contains the exact same words and order as the modern Quran read today',
      'Written without modern diacritical dots (I\'jam) or vowel marks (Tashkeel)',
      'Physical evidence of 1,400+ years of letter-for-letter preservation'
    ],
    sample_ayah: {
      surah: 'Taha (20:1-3)',
      verse: '20:1-3',
      text: 'طه ۝ مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ ۝ إِلَّا تَذْكِرَةً لِّمَن يَخْشَىٰ',
      translation: 'Ta-Ha. We have not sent down to you the Quran that you be distressed, but only as a reminder for those who fear Allah.'
    }
  },
  {
    id: 'topkapi_codex',
    name: 'Topkapi Palace Codex (Early Kufic Monumental Script)',
    name_ar: 'مصحف طوب قابي (القرن الأول الهجري)',
    script_type: 'Early Monumental Kufic Script',
    lines_per_page: '18 Lines per Folio',
    region: 'Ottoman Treasury • Topkapi Palace Museum, Istanbul',
    historical_era: 'c. 1st Century AH (Attributed to Caliph Uthman ibn Affan RA)',
    description: 'An ancient illuminated codex containing more than 99% of the complete Quranic text. Written in majestic Kufic calligraphy on fine vellum parchment.',
    features: [
      'Comprehensive codex demonstrating early standardized Mushaf compilation',
      'Consonants written in dark brown carbon ink with red dots marking early vocalization',
      'Decorative geometric bands between Surahs',
      'Scientific analysis confirms zero substantive textual variants'
    ],
    sample_ayah: {
      surah: 'Al-Baqarah (2:1-5)',
      verse: '2:1-5',
      text: 'الۤمۤ ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
      translation: 'Alif, Lam, Meem. This is the Book about which there is no doubt, a guidance for those mindful of Allah.'
    }
  }
];

// 3. Noorani Qaida & Basics of Learning Quran
export const QAIDA_ALPHABET: QaidaLetter[] = [
  { id: 1, arabic: 'ا', name: 'Alif', transliteration: 'a', makhraj: 'Empty cavity of mouth & throat (Jawf)', makhraj_ur: 'منہ اور گلے کا خالی حصہ (جوف)', is_heavy: false, is_qalqalah: false, isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا', example: 'أَمَل' },
  { id: 2, arabic: 'ب', name: 'Baa', transliteration: 'b', makhraj: 'Moist inner part of both lips meeting', makhraj_ur: 'دونوں ہونٹوں کی تری والا حصہ ملنے سے', is_heavy: false, is_qalqalah: true, isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب', example: 'بَيْت' },
  { id: 3, arabic: 'ت', name: 'Taa', transliteration: 't', makhraj: 'Tip of tongue touching base of upper front 2 teeth', makhraj_ur: 'زبان کی نوک اور اوپر کے دو دانتوں کی جڑ', is_heavy: false, is_qalqalah: false, isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت', example: 'تِين' },
  { id: 4, arabic: 'ث', name: 'Thaa', transliteration: 'th (soft)', makhraj: 'Tip of tongue touching edge of upper front 2 teeth', makhraj_ur: 'زبان کا سرا اور اوپر کے دو دانتوں کا کنارہ', is_heavy: false, is_qalqalah: false, isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث', example: 'ثَمَر' },
  { id: 5, arabic: 'ج', name: 'Jeem', transliteration: 'j', makhraj: 'Middle of tongue touching upper palate', makhraj_ur: 'زبان کا درمیانی حصہ اور اس کے مقابل تالو', is_heavy: false, is_qalqalah: true, isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج', example: 'جَنَّة' },
  { id: 6, arabic: 'ح', name: 'Haa (Throaty)', transliteration: 'ḥ', makhraj: 'Middle of the throat (Wasat al-Halq)', makhraj_ur: 'حلق کا درمیانی حصہ', is_heavy: false, is_qalqalah: false, isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح', example: 'حَمْد' },
  { id: 7, arabic: 'خ', name: 'Khaa', transliteration: 'kh', makhraj: 'Upper part of the throat near mouth', makhraj_ur: 'حلق کا وہ حصہ جو منہ کی طرف ہے', is_heavy: true, is_qalqalah: false, isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ', example: 'خَيْر' },
  { id: 8, arabic: 'د', name: 'Daal', transliteration: 'd', makhraj: 'Tip of tongue touching base of upper front teeth', makhraj_ur: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کی جڑ', is_heavy: false, is_qalqalah: true, isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد', example: 'دِين' },
  { id: 9, arabic: 'ذ', name: 'Dhaal', transliteration: 'dh (soft)', makhraj: 'Tip of tongue touching edge of upper front teeth', makhraj_ur: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کا سرا', is_heavy: false, is_qalqalah: false, isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ', example: 'ذِكْر' },
  { id: 10, arabic: 'ر', name: 'Raa', transliteration: 'r', makhraj: 'Tip of tongue with slight curve to upper palate', makhraj_ur: 'زبان کا سرا اور پشت تالو کے ساتھ ملنے سے', is_heavy: true, is_qalqalah: false, isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر', example: 'رَحْمَة' },
  { id: 11, arabic: 'ز', name: 'Zaa', transliteration: 'z', makhraj: 'Tip of tongue near lower front teeth with whistle sound', makhraj_ur: 'زبان کی نوک نیچے کے دانتوں کے اندرونی کنارے سے', is_heavy: false, is_qalqalah: false, isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز', example: 'زَكَاة' },
  { id: 12, arabic: 'س', name: 'Seen', transliteration: 's', makhraj: 'Tip of tongue near lower teeth (whistling light sound)', makhraj_ur: 'زبان کی نوک اور سامنے والے دانتوں کے اندرونی حصے سے', is_heavy: false, is_qalqalah: false, isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس', example: 'سَلَام' },
  { id: 13, arabic: 'ش', name: 'Sheen', transliteration: 'sh', makhraj: 'Middle of tongue with spreading sound (Tafash-shi)', makhraj_ur: 'زبان کا درمیانی حصہ اور تالو، ہوا کے پھیلاؤ کے ساتھ', is_heavy: false, is_qalqalah: false, isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش', example: 'شَمْس' },
  { id: 14, arabic: 'ص', name: 'Saad (Heavy S)', transliteration: 'ṣ', makhraj: 'Tip of tongue with back of tongue raised (Tafkheem)', makhraj_ur: 'زبان کی نوک سامنے دانتوں سے اور پچھلا حصہ تالو کی طرف اٹھا کر', is_heavy: true, is_qalqalah: false, isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص', example: 'صِرَاط' },
  { id: 15, arabic: 'ض', name: 'Daad (Heavy D)', transliteration: 'ḍ', makhraj: 'Side/edge of tongue against upper molars (unique to Arabic)', makhraj_ur: 'زبان کی کروٹ اوپر کی داڑھوں سے ملنے سے (لغت الضاد)', is_heavy: true, is_qalqalah: false, isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض', example: 'ضِيَاء' },
  { id: 16, arabic: 'ط', name: 'Taa (Heavy T)', transliteration: 'ṭ', makhraj: 'Tip of tongue touching base of upper front teeth (Heavy & Elevated)', makhraj_ur: 'زبان کی نوک اور سامنے کے دانتوں کی جڑ (موٹا پڑھیں)', is_heavy: true, is_qalqalah: true, isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط', example: 'طَيِّب' },
  { id: 17, arabic: 'ظ', name: 'Zaa (Heavy Z)', transliteration: 'ẓ', makhraj: 'Tip of tongue on edge of upper front teeth (Heavy & Elevated)', makhraj_ur: 'زبان کا سرا اوپر کے دانتوں کے کنارے سے (موٹا اور پر آواز)', is_heavy: true, is_qalqalah: false, isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', example: 'ظِلّ' },
  { id: 18, arabic: 'ع', name: '\'Ayn', transliteration: '‘', makhraj: 'Middle of throat (deep throaty squeeze)', makhraj_ur: 'حلق کے عین درمیانی حصے سے نکھار کر', is_heavy: false, is_qalqalah: false, isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع', example: 'عِلْم' },
  { id: 19, arabic: 'غ', name: 'Ghayn', transliteration: 'gh', makhraj: 'Top of throat near uvula (gargling sound)', makhraj_ur: 'حلق کا اوپر والا حصہ جہاں سے غرغرہ کیا جاتا ہے', is_heavy: true, is_qalqalah: false, isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ', example: 'غَيْب' },
  { id: 20, arabic: 'ف', name: 'Faa', transliteration: 'f', makhraj: 'Edge of upper front teeth touching wet inside of bottom lip', makhraj_ur: 'اوپر کے سامنے والے دانتوں کے کنارے نچلے ہونٹ کے اندرونی تری سے', is_heavy: false, is_qalqalah: false, isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف', example: 'فَجْر' },
  { id: 21, arabic: 'ق', name: 'Qaaf', transliteration: 'q', makhraj: 'Back of tongue touching soft palate (deep & heavy)', makhraj_ur: 'زبان کی جڑ اور کوے کے قریب نرم تالو (موٹا اور پر آواز)', is_heavy: true, is_qalqalah: true, isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق', example: 'قَلْب' },
  { id: 22, arabic: 'ك', name: 'Kaaf', transliteration: 'k', makhraj: 'Back of tongue slightly forward from Qaaf (light sound)', makhraj_ur: 'زبان کی جڑ ذرا آگے ہٹ کر سخت تالو سے (باریک آواز)', is_heavy: false, is_qalqalah: false, isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك', example: 'كِتَاب' },
  { id: 23, arabic: 'ل', name: 'Laam', transliteration: 'l', makhraj: 'Side and tip of tongue to upper gums', makhraj_ur: 'زبان کا اگلا کنارہ اوپر کے مسوڑھوں سے', is_heavy: false, is_qalqalah: false, isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل', example: 'لَيْل' },
  { id: 24, arabic: 'م', name: 'Meem', transliteration: 'm', makhraj: 'Dry outer parts of both lips closing together', makhraj_ur: 'دونوں ہونٹوں کا خشک بیرونی حصہ ملنے سے', is_heavy: false, is_qalqalah: false, isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم', example: 'مَسْجِد' },
  { id: 25, arabic: 'ن', name: 'Noon', transliteration: 'n', makhraj: 'Tip of tongue to gums behind upper front teeth', makhraj_ur: 'زبان کی نوک سامنے کے دانتوں کے مسوڑھوں سے', is_heavy: false, is_qalqalah: false, isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن', example: 'نُور' },
  { id: 26, arabic: 'و', name: 'Waw', transliteration: 'w', makhraj: 'Rounding of both lips leaving a small opening', makhraj_ur: 'دونوں ہونٹوں کو گول کر کے تھوڑا سا سوراخ چھوڑنے سے', is_heavy: false, is_qalqalah: false, isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو', example: 'وَقْت' },
  { id: 27, arabic: 'هـ', name: 'Haa (Chest/Deep)', transliteration: 'h', makhraj: 'Deepest bottom part of the throat near chest (Aqsa al-Halq)', makhraj_ur: 'حلق کا سینے سے ملا ہوا سب سے نچلا حصہ', is_heavy: false, is_qalqalah: false, isolated: 'هـ', initial: 'هـ', medial: 'ـهـ', final: 'ـه', example: 'هُدًى' },
  { id: 28, arabic: 'ء', name: 'Hamzah', transliteration: '\'', makhraj: 'Bottom of the throat (firm glottal stop)', makhraj_ur: 'حلق کا آخری نچلا حصہ (جھٹکے کے ساتھ ادا ہونے والی آواز)', is_heavy: false, is_qalqalah: false, isolated: 'ء', initial: 'أ', medial: 'ـئـ', final: 'ء', example: 'أَمْر' },
  { id: 29, arabic: 'ي', name: 'Yaa', transliteration: 'y', makhraj: 'Middle of tongue touching upper palate', makhraj_ur: 'زبان کا درمیانی حصہ اور تالو ملنے سے', is_heavy: false, is_qalqalah: false, isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي', example: 'يَوْم' },
];

// 4. Structured Lessons: From Zero to Fluent Recitation
export const QAIDA_LESSONS: QaidaLesson[] = [
  {
    id: 1,
    title: 'The Arabic Alphabet & Makharij (حروف الهجاء ومخارجها)',
    title_ar: 'الدرس الأول: حروف الهجاء المفردة',
    subtitle: 'Learn the 29 isolated letters, correct phonetic points of articulation, and heavy/light properties.',
    explanation: 'Arabic is read strictly from right to left. Unlike Latin letters, 7 Arabic letters are ALWAYS pronounced with a full, heavy mouth (Tafkheem / حروف الاستعلاء: خ, ص, ض, غ, ط, ق, ظ - Khussa Daghtin Qiz).',
    rule_points: [
      'There are 29 letters in the Arabic alphabet.',
      'Alif (ا) is always an empty vowel carrier; when it has a diacritic it is Hamzah (أ).',
      'Learn the 5 main articulation zones: 1) Throat (الحلق), 2) Tongue (اللسان), 3) Lips (الشفتان), 4) Nasal Cavity (الخيشوم), 5) Empty space (الجوف).',
      'Never confuse similar sounds: ت (light t) vs ط (heavy ṭ); س (light s) vs ص (heavy ṣ); د (light d) vs ض (heavy ḍ).'
    ],
    examples: [
      { arabic: 'بَ - ت - ث', transliteration: 'Baa, Taa, Thaa', note: 'Notice the one dot below for Baa, two dots above for Taa, three dots for Thaa.' },
      { arabic: 'ج - ح - خ', transliteration: 'Jeem, Haa, Khaa', note: 'Jeem has dot inside, Haa has no dots (throaty), Khaa has dot on top (gargle sound).' },
      { arabic: 'ص - ض - ط - ظ', transliteration: 'Saad, Daad, Taa, Zaa', note: 'All four letters require lifting the back of your tongue to produce full heavy resonance.' }
    ]
  },
  {
    id: 2,
    title: 'Joined Letters & Compound Forms (حروف المركبات)',
    title_ar: 'الدرس الثاني: الحروف المركبة وأشكالها',
    subtitle: 'Understand how Arabic letters change shape when joined at the beginning, middle, and end of a word.',
    explanation: 'Arabic is a cursive language where letters connect like cursive English handwriting. Most letters have 4 shapes: Isolated (alone), Initial (at the start), Medial (in the middle), and Final (at the end).',
    rule_points: [
      'Six "Stubborn" non-connecting letters only join from the right, never to the left: (ا, د, ذ, ر, ز, و).',
      'Letters share identical "body stems" and are differentiated primarily by their dot positions (Nuqat).',
      'Lam-Alif (لا) is a special ligated combination of Lam (ل) and Alif (ا).'
    ],
    examples: [
      { arabic: 'بَتَ = بـ + ـتـ + ـت', transliteration: 'Ba-Ta-Ta', note: 'Notice how the initial Baa keeps just the first notch with one dot underneath.' },
      { arabic: 'يَعْلَمُ = يـ + ـعـ + ـلـ + ـم', transliteration: 'Ya\'lamu', note: 'The letter Ayn (ع) becomes closed and filled in when in the middle of a word (ـعـ).' },
      { arabic: 'نَحْنُ = نـ + ـحـ + ـن', transliteration: 'Nahnu', note: 'Noon has one dot above, Haa joins in the center without dots.' }
    ]
  },
  {
    id: 3,
    title: 'Short Vowels / Harakaat (الحركات الثلاث: الفتحة والكسرة والضمة)',
    title_ar: 'الدرس الثالث: الحركات (زبر، زير، پيش)',
    subtitle: 'The 3 fundamental movement marks that give voice to consonants without stretching.',
    explanation: 'In Arabic, vowels are diacritical marks placed above or below letters. They are short and must never be stretched into long vowels.',
    rule_points: [
      'Fathah (Zabar / ـَ): A small slanted stroke above the letter. Produces a short "a" sound (like "u" in "cup"). Duration: 1 count.',
      'Kasrah (Zer / ـِ): A slanted stroke below the letter. Produces a short "i" sound (like "i" in "pin"). Duration: 1 count.',
      'Dammah (Pesh / ـُ): A tiny comma-shaped mark above the letter. Produces a short "u" sound (like "u" in "put"). Duration: 1 count.',
      'Crucial Mistake to Avoid: Do not stretch short vowels into long vowels (do not say "baaa" for بَ).'
    ],
    examples: [
      { arabic: 'دَرَسَ', transliteration: 'da-ra-sa', note: 'All 3 letters have Fathah (Zabar). Pronounce crisply in equal single beats.' },
      { arabic: 'كُتِبَ', transliteration: 'ku-ti-ba', note: 'Kaaf with Dammah (ku), Taa with Kasrah (ti), Baa with Fathah (ba).' },
      { arabic: 'سَمِعَ', transliteration: 'sa-mi-\'a', note: 'Seen with Fathah (sa), Meem with Kasrah (mi), Ayn with Fathah (\'a).' }
    ]
  },
  {
    id: 4,
    title: 'Double Vowels / Tanween (التنوين: تنوين الفتح والكسر والضم)',
    title_ar: 'الدرس الرابع: التنوين (دو زبر، دو زير، دو پيش)',
    subtitle: 'Double stroke vowels that produce a hidden Noon Saakin sound at the end of nouns.',
    explanation: 'Tanween represents nunation — a silent or non-written Noon sound attached to the end of a word.',
    rule_points: [
      'Fathatayn (Do Zabar / ـً): Two slanted strokes on top. Sounds like "-an". (Usually accompanied by an unpronounced Alif: كِتَابًا = Kitaaban).',
      'Kasratayn (Do Zer / ـٍ): Two slanted strokes below. Sounds like "-in" (e.g. كِتَابٍ = Kitaabin).',
      'Dammatayn (Do Pesh / ـٌ): Double comma mark above. Sounds like "-un" (e.g. كِتَابٌ = Kitaabun).',
      'When stopping at the end of an Ayah on Fathatayn (ـً), convert it to a 2-count Alif Madd: عَلِيمًا becomes \'Aleemaa.'
    ],
    examples: [
      { arabic: 'رَحِيمٌ', transliteration: 'Ra-hee-mun', note: 'Ends with Dammatayn (Do Pesh), producing an "-un" ending.' },
      { arabic: 'عَذَابٍ', transliteration: '\'A-dhaa-bin', note: 'Ends with Kasratayn (Do Zer), producing an "-in" ending.' },
      { arabic: 'غَفُورًا', transliteration: 'Gha-foo-ran', note: 'Ends with Fathatayn (Do Zabar) with supportive Alif.' }
    ]
  },
  {
    id: 5,
    title: 'Sukoon / Jazm & The Resting Letter (السكون والجزم)',
    title_ar: 'الدرس الخامس: السكون (جزم) ووقف الحرف',
    subtitle: 'The circle or crescent mark representing zero movement, connecting consonant sounds together.',
    explanation: 'A letter with Sukoon (ـْ) has no vowel. It cannot be started on its own; it must always be connected to the moving letter preceding it.',
    rule_points: [
      'Sukoon joins two letters into one syllable: أ + بْ = أَبْ (ab).',
      'Five letters produce an echo/bounce when they have Sukoon: Qutb Jad (قُطْبُ جَدّ: ق, ط, ب, ج, د) — this is QALQALAH.',
      'Never add an extra vowel sound when stopping on a Sukoon (do not say "ab-a", just a clean "ab").'
    ],
    examples: [
      { arabic: 'قُلْ', transliteration: 'Qul', note: 'Qaaf with Dammah connects to Laam with Sukoon: "Qul" (Say!).' },
      { arabic: 'مَنْ', transliteration: 'Man', note: 'Meem with Fathah connects to Noon with Sukoon.' },
      { arabic: 'أَلَمْ نَشْرَحْ', transliteration: 'A-lam nash-raḥ', note: 'Meem, Sheen, and Haa all have Sukoon, forming crisp resting syllables.' }
    ]
  },
  {
    id: 6,
    title: 'Letters of Madd & Soft Letters / Leen (حروف المد واللين)',
    title_ar: 'الدرس السادس: حروف المد (الألف والواو والياء) وحروف اللين',
    subtitle: 'Natural elongation rules to stretch vowel sounds for 2, 4, or 6 rhythmic counts.',
    explanation: 'Madd means lengthening or stretching. There are 3 Natural Madd letters (Huroof al-Madd al-Tabi\'i): Alif, Waw, and Yaa.',
    rule_points: [
      'Alif Madd: Empty Alif preceded by a Fathah: بَا (Baa) — stretch for 2 counts.',
      'Waw Madd: Waw with Sukoon preceded by a Dammah: بُو (Boo) — stretch for 2 counts.',
      'Yaa Madd: Yaa with Sukoon preceded by a Kasrah: بِي (Bee) — stretch for 2 counts.',
      'Huroof al-Leen (Soft Vowels): Waw or Yaa with Sukoon preceded by a FATHAH (خَوْف = Khawf; بَيْت = Bayt). Read gently without excessive stretching.'
    ],
    examples: [
      { arabic: 'نُوحِيهَا', transliteration: 'Noo-ḥee-haa', note: 'Contains all three Madd letters: Waw Madd (Noo), Yaa Madd (hee), and Alif Madd (haa)!' },
      { arabic: 'قَالَ - يَقُولُ - قِيلَ', transliteration: 'Qaa-la, Ya-qoo-lu, Qee-la', note: 'Observe Alif Madd (Qaa), Waw Madd (qoo), and Yaa Madd (qee).' }
    ]
  },
  {
    id: 7,
    title: 'Shaddah / Tashdeed (الشدة والتشديد)',
    title_ar: 'الدرس السابع: الشدة وتضعيف الحرف',
    subtitle: 'The 3-toothed crown mark (ـّ) that doubles a letter into a resting and moving sound.',
    explanation: 'Tashdeed indicates that a letter is written once but pronounced twice with emphasis: the first occurrence has a Sukoon, and the second has a vowel.',
    rule_points: [
      'Formula: مّ = مْ + مَ (First letter is static, second is moving).',
      'When Tashdeed falls on Noon (نّ) or Meem (مّ), you MUST hold an audible nasal resonance (Ghunnah) for 2 counts.',
      'Pronounce firmly without hesitation or splitting the word.'
    ],
    examples: [
      { arabic: 'رَبِّ', transliteration: 'Rab-bi', note: 'Baa is doubled: رَبْ + بِ = Rab-bi.' },
      { arabic: 'إِنَّ', transliteration: 'In-na', note: 'Noon with Tashdeed: hold the nasal Ghunnah for 2 full beats!' },
      { arabic: 'ثُمَّ', transliteration: 'Thum-ma', note: 'Meem with Tashdeed: hold the humming nasal Ghunnah sound.' }
    ]
  },
  {
    id: 8,
    title: 'Essential Tajweed Rules for Beginners (قواعد التجويد للمبتدئين)',
    title_ar: 'الدرس الثامن: أحكام النون الساكنة والتنوين والقلقلة',
    subtitle: 'Master the 4 core rules of Noon Saakin/Tanween, Meem Saakin, and Qalqalah.',
    explanation: 'Tajweed literally means "to make beautiful". It ensures that the Holy Quran is recited exactly as revealed by Angel Jibril to Prophet Muhammad ﷺ.',
    rule_points: [
      '1. Izhar (إظهار - Clear): Pronounce Noon clearly when followed by 6 throat letters: ء, هـ, ع, ح, غ, خ.',
      '2. Idgham (إدغام - Merging): Merge Noon into 6 letters of YARMALOON (ي, ر, م, ل, و, ن). With Ghunnah in (ي, ن, م, و), without Ghunnah in (ل, ر).',
      '3. Iqlab (إقلاب - Conversion): When Noon Saakin meets Baa (ب), convert it into a soft Meem with Ghunnah: مَن يَبْخَلْ or أَنۢبِئْهُم.',
      '4. Ikhfa (إخفاء - Concealment): Hide the Noon sound in the nasal passage before the remaining 15 letters with 2-count Ghunnah.',
      '5. Qalqalah: Echo/bounce the letters of قُطْبُ جَدّ (ق, ط, ب, ج, د) when they carry Sukoon or are stopped upon.'
    ],
    examples: [
      { arabic: 'مَنْ آمَنَ (إظهار)', transliteration: 'Man aamana', note: 'Izhar: Noon is followed by Hamzah (throat letter), pronounce Noon crisp and clear.' },
      { arabic: 'مَن يَقُولُ (إدغام)', transliteration: 'May-yaqoolu', note: 'Idgham with Ghunnah: Noon merges into Yaa smoothly.' },
      { arabic: 'مِن بَعْدِ (إقلاب)', transliteration: 'Mim-ba\'di', note: 'Iqlab: The Noon turns into a subtle Meem before Baa.' },
      { arabic: 'مِن قَبْلِ (إخفاء)', transliteration: 'Ming-qabli', note: 'Ikhfa: Conceal Noon with a deep nasal resonance before Qaaf.' },
      { arabic: 'الْفَلَقِ ۝ (قلقلة)', transliteration: 'Al-Falaq (echo on Q)', note: 'Qalqalah: When stopping on Qaaf, bounce the ending consonant with energy!' }
    ]
  }
];

// 5. Interactive Practice & Assessment Quiz
export const QAIDA_QUIZ_QUESTIONS: QaidaQuizQuestion[] = [
  {
    id: 1,
    question: 'How many letters in the Arabic alphabet are permanently Heavy (Tafkheem / حروف الاستعلاء)?',
    question_ar: 'كم عدد حروف الاستعلاء (الحروف المفخمة دائماً) في اللغة العربية؟',
    options: ['3 Letters', '5 Letters', '7 Letters (خ, ص, ض, غ, ط, ق, ظ)', '10 Letters'],
    correct_index: 2,
    explanation: 'There are 7 permanently heavy letters collected in the mnemonic phrase: خُصَّ ضَغْطٍ قِظْ (Khussa Daghtin Qiz).'
  },
  {
    id: 2,
    question: 'Which of the following marks represents "Fathah" (Zabar)?',
    question_ar: 'أي من الحركات التالية تمثل الفتحة؟',
    options: ['A stroke below the letter (ـِ)', 'A small slanted stroke ABOVE the letter (ـَ)', 'A loop symbol above the letter (ـُ)', 'A small circle (ـْ)'],
    correct_index: 1,
    explanation: 'Fathah (Zabar) is a small slanted line placed above the letter, producing a short "a" sound for 1 count.'
  },
  {
    id: 3,
    question: 'What are the 5 Qalqalah (Echo / Bouncing) letters when they carry a Sukoon?',
    question_ar: 'ما هي حروف القلقلة الخمسة عند السكون؟',
    options: ['ي ر م ل ن', 'ق ط ب ج د (قطب جد)', 'ء هـ ع ح غ', 'ا و ي'],
    correct_index: 1,
    explanation: 'The five Qalqalah letters are summarized in the famous phrase: قُطْبُ جَدّ (Qaaf, Taa, Baa, Jeem, Daal).'
  },
  {
    id: 4,
    question: 'What rule occurs when Noon Saakin or Tanween is followed by the letter Baa (ب)?',
    question_ar: 'ما هو الحكم التجويدي عند وقوع حرف الباء بعد النون الساكنة أو التنوين؟',
    options: ['Izhar (Clear Pronunciation)', 'Idgham (Merging)', 'Iqlab (Conversion to Meem with Ghunnah)', 'Tafkheem (Full mouth)'],
    correct_index: 2,
    explanation: 'Iqlab (إقلاب) occurs exclusively with the letter Baa (ب), converting the Noon into a soft Meem with 2 counts of Ghunnah (e.g. مِّنۢ بَعْدِ -> Mim-ba\'di).'
  },
  {
    id: 5,
    question: 'What must you do when pronouncing a Noon (نّ) or Meem (مّ) that has a Tashdeed (Shaddah)?',
    question_ar: 'ماذا يجب عند نطق النون أو الميم المشددتين؟',
    options: ['Pronounce it without any voice', 'Hold an audible nasal Ghunnah for 2 rhythmic counts', 'Pronounce it as an echo (Qalqalah)', 'Drop the letter completely'],
    correct_index: 1,
    explanation: 'A Noon or Meem with Tashdeed is known as "Noon Mushaddadah / Meem Mushaddadah" and requires mandatory Ghunnah (nasal humming) held for 2 counts.'
  }
];
