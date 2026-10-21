// Authentic Classical Islamic Book Chapters with Complete Texts in Arabic, English, and Urdu
// Designed for 100% In-App, Zero-Login, Offline-First Instant Reading

export interface BookSection {
  id: string;
  heading?: string;
  heading_ar?: string;
  arabic: string;
  english: string;
  urdu: string;
  reference?: string;
}

export interface BookChapter {
  id: string;
  chapter_number: number;
  title: string;
  title_ar: string;
  title_ur?: string;
  summary: string;
  sections: BookSection[];
}

export const BOOK_CHAPTERS_MAP: Record<string, BookChapter[]> = {
  // ==========================================
  // 1. TAFSIR IBN KATHIR (تفسير ابن كثير)
  // ==========================================
  tafsir_ibn_kathir: [
    {
      id: 'tik_chap_1',
      chapter_number: 1,
      title: 'Introduction to the Foundations & Methodology of Tafsir',
      title_ar: 'مقدمة في أصول التفسير وقواعده',
      title_ur: 'اصولِ تفسیر اور تفسیری منہج کا بیان',
      summary: 'Imam Ibn Kathir outlines the golden standard of orthodox Quranic exegesis: interpreting Quran by Quran, then by authentic Sunnah, followed by statements of the Sahabah.',
      sections: [
        {
          id: 'tik_1_1',
          heading: 'The Most Sound Method of Tafsir',
          heading_ar: 'أصح طرق التفسير',
          arabic: 'فَإِنْ قَالَ قَائِلٌ: فَمَا أَحْسَنُ طُرُقِ التَّفْسِيرِ؟ فَالْجَوَابُ: إِنَّ أَصَحَّ الطُّرُقِ فِي ذَلِكَ أَنْ يُفَسَّرَ الْقُرْآنُ بِالْقُرْآنِ؛ فَمَا أُجْمِلَ فِي مَكَانٍ فَإِنَّهُ قَدْ بُسِطَ فِي مَوْضِعٍ آخَرَ، وَمَا اخْتُصِرَ فِي مَكَانٍ فَإِنَّهُ قَدْ أُوعِبَ فِي مَوْضِعٍ آخَرَ.',
          english: 'If someone asks: "What is the best methodology of Tafsir?" The answer is: Verily, the most sound method is to explain the Quran with the Quran itself. What is mentioned in brief in one passage is clarified and detailed in another, and what is condensed in one place is expounded in another.',
          urdu: 'اگر کوئی دریافت کرے کہ تفسیر کا سب سے عمدہ طریقہ کیا ہے؟ تو جواب یہ ہے کہ سب سے مستند اور صحیح طریقہ یہ ہے کہ قرآن مجید کی تفسیر خود قرآن سے کی جائے؛ کیونکہ جو بات ایک جگہ اجمالاً کہی گئی ہے وہ دوسری جگہ تفصیل سے بیان ہوئی ہے۔',
          reference: 'Muqaddimah Tafsir Ibn Kathir'
        },
        {
          id: 'tik_1_2',
          heading: 'Explaining the Quran with the Authentic Sunnah',
          heading_ar: 'تفسير القرآن بالسنة النبوية',
          arabic: 'فَإِنْ أَعْيَاكَ ذَلِكَ فَعَلَيْكَ بِالسُّنَّةِ؛ فَإِنَّهَا شَارِحَةٌ لِلْقُرْآنِ وَمُوَضِّحَةٌ لَهُ، بَلْ قَدْ قَالَ الإِمَامُ أَبُو عَبْدِ اللَّهِ مُحَمَّدُ بْنُ إِدْرِيسَ الشَّافِعِيُّ رَحِمَهُ اللَّهُ: كُلُّ مَا حَكَمَ بِهِ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فَهُوَ مِمَّا فَهِمَهُ مِنَ الْقُرْآنِ.',
          english: 'If this cannot be found, then you must turn to the authentic Sunnah of the Prophet ﷺ; for verily the Sunnah is the authoritative explanation and clarification of the Quran. Indeed, Imam Al-Shafi\'i said: "Everything that the Messenger of Allah ﷺ ruled upon was derived from his profound understanding of the Quran."',
          urdu: 'اگر قرآن سے براہِ راست تفسیر نہ ملے تو پھر سنتِ نبویہ ﷺ کی طرف رجوع کرنا لازم ہے؛ کیونکہ سنت قرآن کی شارح اور اس کی تشریح کرنے والی ہے۔ امام شافعی رحمہ اللہ فرماتے ہیں کہ رسول اللہ ﷺ نے جو بھی فیصلہ فرمایا وہ قرآن ہی کی فہم کا نتیجہ تھا۔',
          reference: 'Muqaddimah Tafsir Ibn Kathir'
        },
        {
          id: 'tik_1_3',
          heading: 'Relying upon the Consensus of the Sahabah (Companions)',
          heading_ar: 'الرجوع إلى أقوال الصحابة الكرام',
          arabic: 'إِذَا لَمْ نَجِدِ التَّفْسِيرَ فِي الْقُرْآنِ وَلَا فِي السُّنَّةِ، رَجَعْنَا فِي ذَلِكَ إِلَى أَقْوَالِ الصَّحَابَةِ؛ فَإِنَّهُمْ أَدْرَى بِذَلِكَ لِمَا شَاهَدُوهُ مِنَ الْقَرَائِنِ وَالأَحْوَالِ الَّتِي اخْتُصُّوا بِهَا، وَلِمَا لَهُمْ مِنَ الْفَهْمِ التَّامِّ، وَالْعِلْمِ الصَّحِيحِ، وَالْعَمَلِ الصَّالِحِ.',
          english: 'When we do not find the explanation in the Quran nor in the Sunnah, we refer to the statements of the Sahabah (Companions). For they are the most knowledgeable of this, having witnessed the circumstances of revelation and possessing complete understanding, sound knowledge, and righteous deeds.',
          urdu: 'اور جب قرآن اور سنت دونوں میں صریح تفسیر نہ ملے تو پھر صحابہ کرام رضی اللہ عنہم کے اقوال کی طرف رجوع کرنا چاہیے؛ کیونکہ وہ نزولِ وحی کے عینی شاہد تھے اور کامل فہم، علمِ صحیح اور عملِ صالح کے حامل تھے۔',
          reference: 'Muqaddimah Tafsir Ibn Kathir'
        }
      ]
    },
    {
      id: 'tik_chap_2',
      chapter_number: 2,
      title: 'Tafsir of Surah Al-Fatihah (The Mother of the Book)',
      title_ar: 'تفسير سورة الفاتحة (أم الكتاب)',
      title_ur: 'تفسیر سورۃ الفاتحہ (ام الکتاب)',
      summary: 'Comprehensive analysis of the seven oft-repeated verses, the meanings of Rububiyyah, Rahmaniyyah, and the Straight Path (Sirat al-Mustaqim).',
      sections: [
        {
          id: 'tik_2_1',
          heading: 'Virtues and Names of Al-Fatihah',
          heading_ar: 'فضائل سورة الفاتحة وأسماؤها',
          arabic: 'سُورَةُ الْفَاتِحَةِ تُسَمَّى أُمَّ الْقُرْآنِ، وَأُمَّ الْكِتَابِ، وَالسَّبْعَ الْمَثَانِيَ، وَالشِّفَاءَ. وَقَدْ ثَبَتَ فِي صَحِيحِ الْبُخَارِيِّ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ لأَبِي سَعِيدِ بْنِ الْمُعَلَّى: «لأُعَلِّمَنَّكَ سُورَةً هِيَ أَعْظَمُ سُورَةٍ فِي الْقُرْآنِ: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، هِيَ السَّبْعُ الْمَثَانِي، وَالْقُرْآنُ الْعَظِيمُ الَّذِي أُوتِيتُهُ».',
          english: 'Surah Al-Fatihah is named the Mother of the Quran, the Mother of the Book, the Seven Oft-Repeated Verses, and the Cure. It is authentically established in Sahih al-Bukhari that the Messenger of Allah ﷺ said to Abu Sa\'id ibn al-Mu\'alla: "I will surely teach you a Surah that is the greatest Surah in the Quran: \'Al-Hamdu lillahi Rabbil-\'Alamin\'; it is the Seven Oft-Repeated Verses and the Grand Quran that I have been granted."',
          urdu: 'سورۃ الفاتحہ کو ام القرآن، ام الکتاب، السبع المثانی اور الشفاء بھی کہا جاتا ہے۔ صحیح بخاری میں ثابت ہے کہ رسول اللہ ﷺ نے ابو سعید بن معلی رضی اللہ عنہ سے فرمایا: "میں تمہیں قرآن کی سب سے عظیم سورت سکھاؤں گا: الحمد للہ رب العالمین، یہی وہ سات بار بار دہرائی جانے والی آیات ہیں اور قرآنِ عظیم ہے جو مجھے دیا گیا۔"',
          reference: 'Sahih al-Bukhari #4474 / Tafsir Ibn Kathir'
        },
        {
          id: 'tik_2_2',
          heading: 'The Meaning of "Al-Hamdulillah" (All Praise is for Allah)',
          heading_ar: 'معنى الحمد لله رب العالمين',
          arabic: 'مَعْنَى «الْحَمْدُ لِلَّهِ»: الشُّكْرُ لِلَّهِ خَالِصًا دُونَ سَائِرِ مَا يُعْبَدُ مِنْ دُونِهِ، بِمَا أَنْعَمَ عَلَى عِبَادِهِ مِنْ النِّعَمِ الَّتِي لَا يُحْصِيهَا عَدَدٌ، وَتَفَرَّدَ بِالْخَلْقِ وَالتَّدْبِيرِ، فَهُوَ الْمُسْتَحِقُّ لِلْحَمْدِ كُلِّهِ أَوَّلًا وَآخِرًا.',
          english: 'The meaning of "Al-Hamdu Lillah" is: all praise, gratitude, and thankfulness belong exclusively to Allah alone to the exclusion of everything else worshipped beside Him, on account of the countless blessings He has bestowed upon His servants, and for His unique majesty in creation and universal sustenance.',
          urdu: 'الحمد للہ کا مفہوم یہ ہے کہ تمام تر شکر اور ستائش خالصتاً اللہ تعالیٰ ہی کے لیے ہے نہ کہ اس کے سوا کسی اور معبود کے لیے، ان بے شمار نعمتوں کے عوض جو اس نے اپنے بندوں پر فرمائیں اور اس کائنات کی یکتا تخلیق اور تدبیر کے سبب۔',
          reference: 'Tafsir Ibn Kathir (1:2)'
        },
        {
          id: 'tik_2_3',
          heading: 'The Straight Path (Ihdinas-Sirat al-Mustaqim)',
          heading_ar: 'اهدنا الصراط المستقيم',
          arabic: '«الصِّرَاطُ الْمُسْتَقِيمُ»: هُوَ طَرِيقُ الْحَقِّ الَّذِي لَا اعْوِجَاجَ فِيهِ، وَهُوَ اتِّبَاعُ كِتَابِ اللَّهِ وَسُنَّةِ رَسُولِهِ، صِرَاطُ الَّذِينَ أَنْعَمَ اللَّهُ عَلَيْهِمْ مِنَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ وَالصَّالِحِينَ، غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ.',
          english: '"The Straight Path": It is the clear path of truth in which there is no crookedness or deviation; it is adherence to the Book of Allah and the Sunnah of His Messenger ﷺ. The path of those upon whom Allah has bestowed favor — the Prophets, the Steadfast Affirmers of Truth, the Martyrs, and the Righteous.',
          urdu: 'صراطِ مستقیم سے مراد حق کا وہ سیدھا راستہ ہے جس میں کوئی کجی اور انحراف نہیں۔ یہ اللہ کی کتاب اور اس کے رسول ﷺ کی سنت کی پیروی ہے، ان لوگوں کا راستہ جن پر اللہ نے انعام فرمایا یعنی انبیاء، صدیقین، شہداء اور صالحین۔',
          reference: 'Tafsir Ibn Kathir (1:6-7)'
        }
      ]
    },
    {
      id: 'tik_chap_3',
      chapter_number: 3,
      title: 'Tafsir of Ayat al-Kursi (The Greatest Verse in the Quran)',
      title_ar: 'تفسير آية الكرسي (سورة البقرة: 255)',
      title_ur: 'تفسیر آیۃ الکرسی (قرآن کی عظیم ترین آیت)',
      summary: 'Ten distinct theological declarations of absolute Monotheism (Tawhid), Divine Life (Hayat), Sustenance (Qayyumiyyah), and Universal Sovereignty.',
      sections: [
        {
          id: 'tik_3_1',
          heading: 'Virtue of Ayat al-Kursi',
          heading_ar: 'فضل آية الكرسي',
          arabic: 'هَذِهِ آيَةُ الْكُرْسِيِّ، وَلَهَا شَأْنٌ عَظِيمٌ؛ قَدْ صَحَّ الْحَدِيثُ عَنْ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ بِأَنَّهَا «أَعْظَمُ آيَةٍ فِي كِتَابِ اللَّهِ». عَنْ أُبَيِّ بْنِ كَعْبٍ أَنَّ النَّبِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ سَأَلَهُ: «أَيُّ آيَةٍ فِي كِتَابِ اللَّهِ أَعْظَمُ؟» قَالَ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، فَضَرَبَ فِي صَدْرِهِ وَقَالَ: «لِيَهْنِكَ الْعِلْمُ أَبَا الْمُنْذِرِ».',
          english: 'This is Ayat al-Kursi, and it possesses an immense stature. It is authentic from the Messenger of Allah ﷺ that it is "the greatest verse in the Book of Allah". When the Prophet ﷺ asked Ubayy ibn Ka\'b which verse in Allah\'s Book was the greatest, Ubayy answered: "Allahu la ilaha illa Huwal-Hayyul-Qayyum." The Prophet struck him gently on his chest and said: "May knowledge bring you joy, O Abu al-Mundhir!"',
          urdu: 'یہ آیت الکرسی ہے اور اس کی شان نہایت بلند ہے۔ صحیح حدیث میں وارد ہے کہ یہ کتاب اللہ کی سب سے عظیم آیت ہے۔ حضرت ابی بن کعب رضی اللہ عنہ سے رسول اللہ ﷺ نے دریافت فرمایا کہ قرآن کی سب سے بڑی آیت کون سی ہے؟ انہوں نے جواب دیا: اللہ لا الہ الا ھو الحی القیوم، تو آپ ﷺ نے ان کے سینے پر ہاتھ رکھ کر فرمایا: "اے ابو منذر! تمہیں یہ علم مبارک ہو۔"',
          reference: 'Sahih Muslim #810'
        },
        {
          id: 'tik_3_2',
          heading: 'The Living and Self-Sustaining Lord',
          heading_ar: 'الله لا إله إلا هو الحي القيوم',
          arabic: 'قَوْلُهُ: ﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ﴾ إِخْبَارٌ بِأَنَّهُ الْمُنْفَرِدُ بِالإِلَهِيَّةِ لِجَمِيعِ الْخَلائِقِ. ﴿الْحَيُّ الْقَيُّومُ﴾ أَيِ: الْحَيُّ فِي نَفْسِهِ الَّذِي لَا يَمُوتُ أَبَدًا، الْقَيِّمُ لِغَيْرِهِ، فَجَمِيعُ الْمَوْجُودَاتِ فَقِيرَةٌ إِلَيْهِ، وَهُوَ غَنِيٌّ عَنْهَا، لَا قِوَامَ لَهَا إِلَّا بِأَمْرِهِ.',
          english: 'His statement: "Allah! There is no deity except Him" is an assertion of His exclusive right to divinity over all creation. "The Ever-Living, the Sustainer of all existence": He is living in Himself and never dies; He sustains all other creations. Every existing entity is in desperate need of Him, while He is free of all needs from them.',
          urdu: 'فرمانِ الٰہی: "اللہ کے سوا کوئی معبود نہیں" اس بات کا اعلان ہے کہ کائنات کے تمام معاملات میں وہی تنہا معبودِ برحق ہے۔ "وہ زندہ ہے اور سب کو تھامنے والا ہے" یعنی وہ خود زندہ ہے جسے کبھی موت نہیں اور تمام مخلوقات کو قائم رکھنے والا ہے، ساری کائنات اس کی محتاج ہے اور وہ سب سے بے نیاز ہے۔',
          reference: 'Tafsir Ibn Kathir (2:255)'
        }
      ]
    }
  ],

  // ==========================================
  // 2. SAHIH AL-BUKHARI (صحيح البخاري)
  // ==========================================
  sahih_al_bukhari: [
    {
      id: 'sab_chap_1',
      chapter_number: 1,
      title: 'Book 1: How the Divine Revelation Began (كتاب بدء الوحي)',
      title_ar: 'كتاب بدء الوحي إلى رسول الله صلى الله عليه وسلم',
      title_ur: 'کتاب بدء الوحی - وحی کے آغاز کا بیان',
      summary: 'The inaugural chapter of Sahih al-Bukhari, establishing sincerity of intention as the prerequisite for all spiritual deeds, and documenting the first descent of revelation upon the Prophet ﷺ in Cave Hira.',
      sections: [
        {
          id: 'sab_1_1',
          heading: 'Hadith 1: Actions are Judged by Intentions (الأعمال بالنيات)',
          heading_ar: 'إنما الأعمال بالنيات',
          arabic: 'عَنْ عَلْقَمَةَ بْنِ وَقَّاصٍ اللَّيْثِيِّ، قَالَ: سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا، أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».',
          english: 'Narrated by \'Umar ibn al-Khattab (RA) on the Minbar: I heard the Messenger of Allah ﷺ say: "Actions are judged only by intentions, and every person will have only that which he intended. So whoever migrated for some worldly gain or to take a woman in marriage, his migration will be for that to which he migrated."',
          urdu: 'حضرت عمر بن خطاب رضی اللہ عنہ نے منبر پر خطبہ دیتے ہوئے فرمایا: میں نے رسول اللہ ﷺ کو فرماتے ہوئے سنا: "تمام اعمال کا دارومدار صرف اور صرف نیتوں پر ہے، اور ہر انسان کے لیے وہی اجر ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت دنیا حاصل کرنے کے لیے ہو یا کسی عورت سے نکاح کی غرض سے ہو، تو اس کی ہجرت اسی مقصد کے لیے شمار ہوگی جس کے لیے اس نے ہجرت کی۔"',
          reference: 'Sahih al-Bukhari, Hadith #1'
        },
        {
          id: 'sab_1_2',
          heading: 'Hadith 2: The Ways Divine Revelation Was Received',
          heading_ar: 'كيفية نزول الوحي',
          arabic: 'عَنْ عَائِشَةَ أُمِّ الْمُؤْمِنِينَ رَضِيَ اللَّهُ عَنْهَا، أَنَّ الْحَارِثَ بْنَ هِشَامٍ سَأَلَ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: يَا رَسُولَ اللَّهِ، كَيْفَ يَأْتِيكَ الْوَحْيُ؟ فَقَالَ: «أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الْجَرَسِ، وَهُوَ أَشَدُّهُ عَلَيَّ، فَيُفْصَمُ عَنِّي وَقَدْ وَعَيْتُ عَنْهُ مَا قَالَ، وَأَحْيَانًا يَتَمَثَّلُ لِيَ الْمَلَكُ رَجُلاً فَيُكَلِّمُنِي فَأَعِي مَا يَقُولُ».',
          english: 'Narrated by \'A\'ishah, Mother of the Believers: Al-Harith ibn Hisham asked the Messenger of Allah ﷺ: "O Messenger of Allah, how does revelation come to you?" He replied: "Sometimes it comes to me like the ringing of a bell, and that is the hardest on me; it departs from me only when I have retained what was said. And sometimes the Angel takes the form of a man and speaks to me, and I comprehend what he says."',
          urdu: 'ام المومنین حضرت عائشہ صدیقہ رضی اللہ عنہا سے روایت ہے کہ حارث بن ہشام نے رسول اللہ ﷺ سے دریافت کیا: یا رسول اللہ! آپ پر وحی کس طرح نازل ہوتی ہے؟ آپ ﷺ نے فرمایا: "کبھی تو یہ میرے پاس گھنٹی کی جھنکار کی طرح آتی ہے، اور یہ مجھ پر سب سے زیادہ سخت ہوتی ہے، پھر جب مجھ سے یہ کیفیت ختم ہوتی ہے تو فرشتے کا کہا ہوا سب مجھے یاد ہو چکا ہوتا ہے۔ اور کبھی فرشتہ انسانی صورت میں میرے سامنے آتا ہے اور مجھ سے کلام کرتا ہے اور میں اس کا کہا یاد کر لیتا ہوں۔"',
          reference: 'Sahih al-Bukhari, Hadith #2'
        },
        {
          id: 'sab_1_3',
          heading: 'Hadith 3: The First Words in Cave Hira (Iqra\')',
          heading_ar: 'أول ما نزل في غار حراء',
          arabic: 'عَنْ عَائِشَةَ قَالَتْ: حَتَّى جَاءَهُ الْحَقُّ وَهُوَ فِي غَارِ حِرَاءٍ، فَجَاءَهُ الْمَلَكُ فَقَالَ: اقْرَأْ. قَالَ: «مَا أَنَا بِقَارِئٍ»، قَالَ: «فَأَخَذَنِي فَغَطَّنِي حَتَّى بَلَغَ مِنِّي الْجَهْدَ ثُمَّ أَرْسَلَنِي، فَقَالَ: اقْرَأْ، قُلْتُ: مَا أَنَا بِقَارِئٍ»، فَقَالَ فِي الثَّالِثَةِ: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ۝ خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ ۝ اقْرَأْ وَرَبُّكَ الْأَكْرَمُ﴾.',
          english: 'Narrated by \'A\'ishah: Until suddenly the Truth came to him while he was in Cave Hira. The Angel Jibril came to him and said: "Read!" The Prophet ﷺ replied: "I cannot read." The Prophet said: "He took hold of me and pressed me so hard that I could endure it no longer, then released me and said: \'Read!\' I said: \'I cannot read.\'" On the third time he said: "Read in the name of your Lord who created! Created man from a clinging clot. Read, and your Lord is the Most Generous!"',
          urdu: 'ام المومنین عائشہ رضی اللہ عنہا بیان کرتی ہیں: یہاں تک کہ اچانک غارِ حرا میں آپ پر حق کا نزول ہوا۔ فرشتہ آپ کے پاس آیا اور کہا: "پڑھیے!" آپ نے فرمایا: "میں پڑھا ہوا نہیں ہوں۔" آپ فرماتے ہیں: "فرشتے نے مجھے پکڑ کر زور سے بھینچا یہاں تک کہ میری طاقت جواب دینے لگی، پھر چھوڑ کر کہا: پڑھیے! میں نے کہا: میں پڑھا ہوا نہیں ہوں۔" تیسری بار اس نے کہا: "پڑھیے اپنے رب کے نام کے ساتھ جس نے پیدا کیا! جس نے انسان کو جمے ہوئے خون کے لوتھڑے سے پیدا کیا۔ پڑھیے اور آپ کا رب سب سے زیادہ کریم ہے!"',
          reference: 'Sahih al-Bukhari, Hadith #3'
        }
      ]
    },
    {
      id: 'sab_chap_2',
      chapter_number: 2,
      title: 'Book 2: The Book of Faith (كتاب الإيمان)',
      title_ar: 'كتاب الإيمان وبيان أركانه',
      title_ur: 'کتاب الایمان - ایمان کے ارکان اور تقاضے',
      summary: 'Establishing that true faith comprises belief in the heart, speech of the tongue, and deeds of the limbs, increasing with obedience and decreasing with sins.',
      sections: [
        {
          id: 'sab_2_1',
          heading: 'Islam is Built on Five Pillars',
          heading_ar: 'بني الإسلام على خمس',
          arabic: 'عَنِ ابْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لا إِلَهَ إِلا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ».',
          english: 'Narrated by Ibn \'Umar (RA): The Messenger of Allah ﷺ said: "Islam is built upon five pillars: Testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing the prayer, paying the Zakat, performing the Hajj pilgrimage, and fasting in the month of Ramadan."',
          urdu: 'حضرت عبداللہ بن عمر رضی اللہ عنہما سے روایت ہے کہ رسول اللہ ﷺ نے فرمایا: "اسلام کی بنیاد پانچ ستونوں پر رکھی گئی ہے: اس بات کی گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ ادا کرنا، حج کرنا، اور رمضان المبارک کے روزے رکھنا۔"',
          reference: 'Sahih al-Bukhari, Hadith #8'
        },
        {
          id: 'sab_2_2',
          heading: 'A True Muslim is One from Whose Tongue and Hand Others Are Safe',
          heading_ar: 'المسلم من سلم المسلمون من لسانه ويده',
          arabic: 'عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو رَضِيَ اللَّهُ عَنْهُمَا، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ».',
          english: 'Narrated by \'Abdullah ibn \'Amr: The Prophet ﷺ said: "A true Muslim is the one from whose tongue and hand other Muslims are completely safe; and a true emigrant (Muhajir) is the one who abandons all that Allah has prohibited."',
          urdu: 'حضرت عبداللہ بن عمرو رضی اللہ عنہما سے روایت ہے کہ نبی کریم ﷺ نے فرمایا: "کامل مسلمان وہ ہے جس کی زبان اور ہاتھ کے شر سے دوسرے مسلمان محفوظ رہیں؛ اور حقیقی مہاجر وہ ہے جو ان تمام باتوں کو چھوڑ دے جن سے اللہ تعالیٰ نے منع فرمایا ہے۔"',
          reference: 'Sahih al-Bukhari, Hadith #10'
        }
      ]
    }
  ],

  // ==========================================
  // 3. RIYAD AS-SALIHIN (رياض الصالحين)
  // ==========================================
  riyad_as_salihin: [
    {
      id: 'ras_chap_1',
      chapter_number: 1,
      title: 'Chapter 1: Sincerity & Intention in All Deeds (باب الإخلاص)',
      title_ar: 'باب الإخلاص وإحضار النية في جميع الأعمال الظاهرة والباطنة',
      title_ur: 'اخلاص اور نیت کا بیان - ظاہری اور باطنی اعمال میں',
      summary: 'Imam Nawawi demonstrates that without pure devotion to Allah, no charity, prayer, or sacrifice holds weight on the Day of Judgment.',
      sections: [
        {
          id: 'ras_1_1',
          heading: 'Allah Looks at Your Hearts, Not Your Appearances',
          heading_ar: 'إن الله لا ينظر إلى صوركم وأموالكم',
          arabic: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «إِنَّ اللَّهَ لا يَنْظُرُ إِلَى أَجْسَادِكُمْ، وَلا إِلَى صُوَرِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ».',
          english: 'Narrated by Abu Hurairah (RA): The Messenger of Allah ﷺ said: "Verily, Allah does not look at your outward bodies, nor at your appearances or wealth, but rather He looks deeply into your hearts and into your deeds."',
          urdu: 'حضرت ابوہریرہ رضی اللہ عنہ سے روایت ہے کہ رسول اللہ ﷺ نے فرمایا: "بیشک اللہ تعالیٰ تمہارے جسموں اور تمہاری ظاہری صورتوں اور مال و دولت کو نہیں دیکھتا، بلکہ وہ تو تمہارے دلوں کے اخلاص اور تمہارے اعمال کو دیکھتا ہے۔"',
          reference: 'Sahih Muslim #2564 / Riyad as-Salihin #7'
        },
        {
          id: 'ras_1_2',
          heading: 'Reaching the Reward of Martyrs through Sincere Heart',
          heading_ar: 'من سأل الله الشهادة بصدق',
          arabic: 'عَنْ أَبِي سَهْلٍ سَهْلِ بْنِ حُنَيْفٍ رَضِيَ اللَّهُ عَنْهُ، أَنَّ النَّبِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «مَنْ سَأَلَ اللَّهَ الشَّهَادَةَ بِصِدْقٍ، بَلَّغَهُ اللَّهُ مَنَازِلَ الشُّهَدَاءِ، وَإِنْ مَاتَ عَلَى فِرَاشِهِ».',
          english: 'Narrated by Sahl ibn Hunaif: The Prophet ﷺ said: "Whoever sincerely asks Allah for martyrdom with true sincerity from his heart, Allah will grant him the lofty status of the martyrs, even if he dies peacefully upon his own bed."',
          urdu: 'حضرت سہل بن حنیف رضی اللہ عنہ سے روایت ہے کہ نبی کریم ﷺ نے فرمایا: "جس شخص نے سچے دل اور اخلاص کے ساتھ اللہ سے شہادت کی دعا مانگی، تو اللہ تعالیٰ اسے شہداء کے بلند مرتبے پر پہنچا دے گا خواہ وہ اپنے بستر پر ہی فوت کیوں نہ ہو۔"',
          reference: 'Sahih Muslim #1909 / Riyad as-Salihin #10'
        }
      ]
    },
    {
      id: 'ras_chap_2',
      chapter_number: 2,
      title: 'Chapter 2: Patience & Steadfastness (باب الصبر)',
      title_ar: 'باب الصبر على طاعة الله واجتناب معاصيه',
      title_ur: 'صبر اور استقامت کا بیان',
      summary: 'The beauty of patience (Sabr) across three dimensions: persevering in obedience, refraining from sins, and enduring worldly hardships without despair.',
      sections: [
        {
          id: 'ras_2_1',
          heading: 'The Wonder of the Believer\'s Entire Life',
          heading_ar: 'عجباً لأمر المؤمن',
          arabic: 'عَنْ صُهَيْبٍ الرُّومِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «عَجَبًا لأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لأَحَدٍ إِلا لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ».',
          english: 'Narrated by Suhaib: The Messenger of Allah ﷺ said: "How wonderful is the affair of the believer! Verily all his affairs are good for him, and this is true for no one except the believer: if prosperity comes to him he is grateful, which is good for him; and if adversity befalls him he is patient, which is good for him."',
          urdu: 'حضرت صہیب رضی اللہ عنہ سے مروی ہے کہ رسول اللہ ﷺ نے فرمایا: "مومن کا معاملہ بھی کتنا عجیب ہے! اس کے ہر معاملے میں اس کے لیے خیر ہی خیر ہے۔ اور یہ فضیلت مومن کے علاوہ کسی کو حاصل نہیں: اگر اسے کوئی خوشی پہنچے تو وہ شکر ادا کرتا ہے جو اس کے لیے خیر ہے؛ اور اگر اسے کوئی تکلیف پہنچے تو وہ صبر کرتا ہے جو اس کے لیے سراسر خیر ہے۔"',
          reference: 'Sahih Muslim #2999 / Riyad as-Salihin #27'
        }
      ]
    }
  ],

  // ==========================================
  // 4. 40 HADITH OF IMAM NAWAWI (الأربعون النووية)
  // ==========================================
  forty_hadith_nawawi: [
    {
      id: 'fhn_chap_1',
      chapter_number: 1,
      title: 'Hadiths 1 to 5: The Pillars of Faith, Innovation, and Sincerity',
      title_ar: 'الأحاديث 1 إلى 5: النية، حديث جبريل، وأركان الإسلام',
      title_ur: 'احادیث 1 تا 5: نیت، حدیثِ جبریل اور ارکانِ دین',
      summary: 'The bedrock foundations of Islam: the definition of Islam, Iman, Ihsan, and the rejection of innovations in faith.',
      sections: [
        {
          id: 'fhn_1_1',
          heading: 'Hadith 2: The Magnificent Hadith of Jibril (Islam, Iman, Ihsan)',
          heading_ar: 'حديث جبريل عليه السلام في بيان مراتب الدين',
          arabic: 'عَنْ عُمَرَ بْنِ الْخَطَّابِ قَالَ: بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللَّهِ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعَرِ، فَقَالَ: يَا مُحَمَّدُ، أَخْبِرْنِي عَنِ الإِسْلامِ؟ فَقَالَ: «أَنْ تَشْهَدَ أَنْ لا إِلَهَ إِلا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ». قَالَ: صَدَقْتَ. قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ؟ قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ». قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ؟ قَالَ: «أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ».',
          english: 'Narrated by \'Umar ibn al-Khattab: While we were sitting with the Messenger of Allah ﷺ, a man appeared before us with intensely white clothes and intensely black hair. He said: "O Muhammad, tell me about Islam." He replied: "That you testify that there is no god but Allah and Muhammad is His Messenger, establish prayer, pay Zakat, fast Ramadan, and perform pilgrimage to the House." The man said: "You spoke the truth." He said: "Tell me about Iman." He said: "That you believe in Allah, His angels, His books, His messengers, the Last Day, and divine destiny, both its good and its bad." He said: "Tell me about Ihsan." The Prophet said: "That you worship Allah as though you see Him, and even though you do not see Him, He sees you."',
          urdu: 'حضرت عمر بن خطاب رضی اللہ عنہ فرماتے ہیں: ایک دن ہم رسول اللہ ﷺ کی خدمت میں حاضر تھے کہ اچانک ایک شخص نمودار ہوا جس کے کپڑے انتہائی سفید اور بال نہایت سیاہ تھے۔ اس نے پوچھا: اے محمد! مجھے بتائیے کہ اسلام کیا ہے؟ آپ ﷺ نے فرمایا: "یہ کہ تم گواہی دو کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اس کے رسول ہیں، نماز قائم کرو، زکوٰۃ ادا کرو، رمضان کے روزے رکھو اور بیت اللہ کا حج کرو۔" اس نے کہا: آپ نے سچ فرمایا۔ پھر اس نے پوچھا: مجھے ایمان کے بارے میں بتائیے۔ آپ نے فرمایا: "یہ کہ تم اللہ پر، اس کے فرشتوں پر، اس کی کتابوں پر، اس کے رسولوں پر، قیامت کے دن پر، اور اچھی اور بری تقدیر پر یقین رکھو۔" اس نے کہا: مجھے احسان کے بارے میں بتائیے۔ آپ نے فرمایا: "یہ کہ تم اللہ کی عبادت اس طرح کرو گویا تم اسے دیکھ رہے ہو، اور اگر تم اسے نہیں دیکھ رہے تو وہ یقیناً تمہیں دیکھ رہا ہے۔"',
          reference: 'Sahih Muslim #8 / Forty Hadith Nawawi #2'
        },
        {
          id: 'fhn_1_2',
          heading: 'Hadith 6: The Halal is Clear and the Haram is Clear',
          heading_ar: 'الحلال بين والحرام بين وبينهما مشتبهات',
          arabic: 'عَنْ أَبِي عَبْدِ اللَّهِ النُّعْمَانِ بْنِ بَشِيرٍ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ يَقُولُ: «إِنَّ الْحَلالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لا يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ... أَلا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلا وَهِيَ الْقَلْبُ».',
          english: 'Narrated by An-Nu\'man ibn Bashir: I heard the Messenger of Allah ﷺ say: "Verily, that which is lawful is clear and that which is unlawful is clear, and between them are ambiguous matters about which many people do not know. Thus he who avoids doubtful matters clears himself in regard to his religion and his honor... Beware, truly in the body there is a lump of flesh: if it be sound, the whole body is sound; and if it be diseased, the whole body is diseased. Beware, it is the heart!"',
          urdu: 'حضرت نعمان بن بشیر رضی اللہ عنہما فرماتے ہیں کہ میں نے رسول اللہ ﷺ کو فرماتے سنا: "حلال بھی بالکل واضح ہے اور حرام بھی واضح ہے، اور ان دونوں کے درمیان کچھ مشتبہ چیزیں ہیں جنہیں بہت سے لوگ نہیں جانتے۔ پس جس نے شبہات والی چیزوں سے پرہیز کیا اس نے اپنے دین اور اپنی عزت کو محفوظ کر لیا... خبردار! جسم کے اندر گوشت کا ایک ٹکڑا ہے، اگر وہ درست ہو جائے تو سارا جسم درست ہو جاتا ہے، اور اگر وہ بگڑ جائے تو پورا جسم بگڑ جاتا ہے؛ سن لو! وہ دل ہے۔"',
          reference: 'Sahih al-Bukhari #52 / Forty Hadith Nawawi #6'
        }
      ]
    },
    {
      id: 'fhn_chap_2',
      chapter_number: 2,
      title: 'Hadith 19: Safeguard Allah and He Will Safeguard You (احفظ الله يحفظك)',
      title_ar: 'الحديث التاسع عشر: حفظ حدود الله والتوكل التام',
      title_ur: 'حدیث 19: اللہ کے حدود کی حفاظت اور کامل توکل',
      summary: 'The masterclass of prophetic spiritual counseling delivered to young Ibn Abbas regarding divine providence, prayer, and absolute reliance on Allah alone.',
      sections: [
        {
          id: 'fhn_2_1',
          heading: 'If the Entire World Gathers to Harm You, They Cannot',
          heading_ar: 'واعلم أن الأمة لو اجتمعت على أن ينفعوك لم ينفعوك إلا بشيء قد كتبه الله لك',
          arabic: 'عَنْ أَبِي الْعَبَّاسِ عَبْدِ اللَّهِ بْنِ عَبَّاسٍ قَالَ: كُنْتُ خَلْفَ النَّبِيِّ يَوْمًا، فَقَالَ: «يَا غُلامُ، إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَإِنِ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إِلا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ، رُفِعَتِ الأَقْلامُ وَجَفَّتِ الصُّحُفُ».',
          english: 'Narrated by Ibn \'Abbas: One day I was riding behind the Prophet ﷺ when he said to me: "O young boy, I shall teach you some words: Safeguard Allah (His commands) and He will safeguard you. Safeguard Allah and you will find Him before you. When you ask, ask of Allah alone; and when you seek assistance, seek assistance from Allah alone. And know that if the whole world were to gather together in order to benefit you with something, they could not benefit you except with something that Allah had already written for you; and if they were to gather together to harm you with something, they could not harm you except with something that Allah had already written against you. The pens have been lifted and the pages have dried."',
          urdu: 'حضرت عبداللہ بن عباس رضی اللہ عنہما بیان کرتے ہیں: ایک دن میں نبی کریم ﷺ کی سواری کے پیچھے بیٹھا ہوا تھا کہ آپ نے مجھ سے فرمایا: "اے بچے! میں تمہیں چند اہم باتیں سکھاتا ہوں: اللہ کے احکام کی حفاظت کرو، اللہ تمہاری حفاظت کرے گا۔ اللہ کے حقوق کا پاس رکھو، تم اسے اپنے سامنے پاؤ گے۔ جب مانگنا ہو تو صرف اللہ سے مانگو؛ اور جب مدد طلب کرنی ہو تو صرف اللہ ہی سے مدد چاہو۔ اور یاد رکھو کہ اگر ساری دنیا مل کر بھی تمہیں کوئی فائدہ پہنچانا چاہے تو نہیں پہنچا سکتی سوائے اس کے جو اللہ نے تمہارے لیے لکھ دیا ہے؛ اور اگر ساری دنیا مل کر بھی تمہیں کوئی نقصان پہنچانا چاہے تو نہیں پہنچا سکتی سوائے اس کے جو اللہ نے تمہارے مقدر میں لکھ دیا ہے۔ قلمیں اٹھا لی گئیں اور صحیفے خشک ہو چکے۔"',
          reference: 'Jami` at-Tirmidhi #2516 / Forty Hadith Nawawi #19'
        }
      ]
    }
  ],

  // ==========================================
  // 5. AR-RAHEEQ AL-MAKHTUM (الرحيق المختوم)
  // ==========================================
  ar_raheeq_al_makhtum: [
    {
      id: 'rhm_chap_1',
      chapter_number: 1,
      title: 'Chapter 1: The First Dawn of Prophethood in Cave Hira',
      title_ar: 'في ظلال النبوة والرسالة: غار حراء والوحي الأول',
      title_ur: 'غارِ حرا اور وحی کا پہلا سویرا',
      summary: 'How the Prophet ﷺ secluded himself in devotion, saw true visions, and received the historical commission that transformed world history.',
      sections: [
        {
          id: 'rhm_1_1',
          heading: 'Solitude in Cave Hira and True Dreams',
          heading_ar: 'الخلوة في غار حراء والرؤيا الصادقة',
          arabic: 'لَمَّا تَقَارَبَتْ سِنُّ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ الأَرْبَعِينَ، حُبِّبَتْ إِلَيْهِ الْخَلْوَةُ؛ فَكَانَ يَأْخُذُ السَّوِيقَ وَالْمَاءَ وَيَذْهَبُ إِلَى غَارِ حِرَاءٍ فِي جَبَلِ النُّورِ، فَيَتَحَنَّثُ فِيهِ — وَهُوَ التَّعَبُّدُ اللَّيَالِيَ ذَوَاتِ الْعَدَدِ — قَبْلَ أَنْ يَرْجِعَ إِلَى أَهْلِهِ.',
          english: 'As the Messenger of Allah ﷺ approached forty years of age, seclusion became beloved to him. He would take parched barley provisions and water and retreat to Cave Hira in the Mountain of Light (Jabal al-Nour), engaging in Tahannuth — which is solitary worship for nights on end — contemplating the universe before returning to his family.',
          urdu: 'جب رسول اللہ ﷺ کی عمر مبارک چالیس سال کے قریب پہنچی تو تنہائی آپ کو محبوب ہو گئی۔ آپ ستو اور پانی لے کر جبلِ نور کے غارِ حرا میں تشریف لے جاتے اور وہاں کئی کئی راتیں مسلسل اللہ کی عبادت اور تفکر میں گزارتے۔',
          reference: 'Ar-Raheeq Al-Makhtum, Section: Dawn of Prophethood'
        },
        {
          id: 'rhm_1_2',
          heading: 'Comforted by Khadijah (The First Believer)',
          heading_ar: 'مواساة خديجة رضي الله عنها',
          arabic: 'فَرَجَعَ بِهَا رَسُولُ اللَّهِ تَرْجُفُ بَوَادِرُهُ، فَدَخَلَ عَلَى خَدِيجَةَ فَقَالَ: «زَمِّلُونِي زَمِّلُونِي». فَقَالَتْ لَهُ: كَلاَّ، أَبْشِرْ! فَوَاللَّهِ لَا يُخْزِيكَ اللَّهُ أَبَدًا؛ إِنَّكَ لَتَصِلُ الرَّحِمَ، وَتَصْدُقُ الْحَدِيثَ، وَتَحْمِلُ الْكَلَّ، وَتَكْسِبُ الْمَعْدُومَ، وَتَقْرِي الضَّيْفَ، وَتُعِينُ عَلَى نَوَائِبِ الْحَقِّ.',
          english: 'The Messenger of Allah returned with the revelation, his heart trembling with awe. He entered upon his noble wife Khadijah and said: "Wrap me up! Wrap me up!" She consoled him with eternal words: "Never! Rejoice! By Allah, Allah will never disgrace you; for you uphold the ties of kinship, you always speak the truth, you bear the burdens of the weary, you give to the destitute, you honor the guest, and you assist those afflicted by genuine calamities."',
          urdu: 'رسول اللہ ﷺ وحی کی ہیبت سے لرزتے ہوئے گھر تشریف لائے اور حضرت خدیجہ رضی اللہ عنہا سے فرمایا: "مجھے چادر اوڑھا دو! مجھے چادر اوڑھا دو!" حضرت خدیجہ نے آپ کو تسلی دیتے ہوئے وہ تاریخی کلمات کہے: "ہرگز نہیں! آپ کو بشارت ہو۔ اللہ کی قسم! اللہ آپ کو کبھی رسوا نہیں کرے گا؛ آپ تو رشتہ داروں سے حسنِ سلوک کرتے ہیں، ہمیشہ سچ بولتے ہیں، بے سہاروں کا بوجھ اٹھاتے ہیں، ناداروں کی مدد کرتے ہیں، مہمان نوازی کرتے ہیں، اور حق کی راہ میں پیش آنے والی مصیبتوں میں مددگار بنتے ہیں۔"',
          reference: 'Sahih al-Bukhari #3 / Ar-Raheeq Al-Makhtum'
        }
      ]
    },
    {
      id: 'rhm_chap_2',
      chapter_number: 2,
      title: 'Chapter 2: The Farewell Pilgrimage & The Eternal Universal Sermon',
      title_ar: 'حجة الوداع وخطبة الوداع الخالدة',
      title_ur: 'حجۃ الوداع اور آپ ﷺ کا آخری تاریخی خطبہ',
      summary: 'The supreme declaration of human rights, abolition of racial superiority, protection of women, and sanctity of life and wealth delivered on the plains of Arafat.',
      sections: [
        {
          id: 'rhm_2_1',
          heading: 'Universal Equality: No Superiority of an Arab over a Non-Arab',
          heading_ar: 'لا فضل لعربي على أعجمي إلا بالتقوى',
          arabic: 'قَالَ رَسُولُ اللَّهِ فِي خُطْبَةِ الْوَدَاعِ: «يَا أَيُّهَا النَّاسُ، إِنَّ رَبَّكُمْ وَاحِدٌ، وَإِنَّ أَبَاكُمْ وَاحِدٌ، أَلا لا فَضْلَ لِعَرَبِيٍّ عَلَى أَعْجَمِيٍّ، وَلا لِعَجَمِيٍّ عَلَى عَرَبِيٍّ، وَلا لأَحْمَرَ عَلَى أَسْوَدَ، وَلا لأَسْوَدَ عَلَى أَحْمَرَ إِلا بِالتَّقْوَى. إِنَّ دِمَاءَكُمْ وَأَمْوَالَكُمْ وَأَعْرَاضَكُمْ عَلَيْكُمْ حَرَامٌ كَحُرْمَةِ يَوْمِكُمْ هَذَا فِي شَهْرِكُمْ هَذَا فِي بَلَدِكُمْ هَذَا».',
          english: 'The Messenger of Allah declared in his Farewell Sermon: "O people! Verily your Lord is One, and your father (Adam) is one. Behold, there is no superiority for an Arab over a non-Arab, nor for a non-Arab over an Arab, nor for a white man over a black man, nor for a black man over a white man, except through God-consciousness (Taqwa). Verily your blood, your property, and your honor are sacred and inviolable to each other, like the sacredness of this day of yours, in this month of yours, in this city of yours!"',
          urdu: 'رسول اللہ ﷺ نے خطبہ حجۃ الوداع میں ارشاد فرمایا: "اے لوگو! بیشک تمہارا رب ایک ہے اور تمہارا باپ (آدم) ایک ہے۔ سن لو! کسی عربی کو کسی عجمی پر، اور کسی عجمی کو کسی عربی پر، اور کسی گورے کو کسی کالے پر، اور کسی کالے کو کسی گورے پر کوئی فضیلت نہیں مگر صرف تقویٰ کے سبب۔ بیشک تمہارے خون، تمہارے اموال اور تمہاری عزتیں ایک دوسرے پر اسی طرح حرام ہیں جس طرح تمہارے اس دن کی، تمہارے اس مہینے کی اور تمہارے اس شہر (مکہ) کی حرمت ہے!"',
          reference: 'Musnad Ahmad #23489 / Ar-Raheeq Al-Makhtum'
        }
      ]
    }
  ],

  // ==========================================
  // 7. SAHIH MUSLIM (صحيح مسلم)
  // ==========================================
  sahih_muslim: [
    {
      id: 'sml_chap_1',
      chapter_number: 1,
      title: 'The Book of Faith: Sincerity and Foundations (كتاب الإيمان)',
      title_ar: 'كتاب الإيمان وبيان حقيقة الإسلام',
      title_ur: 'کتاب الایمان - اسلام کی حقیقت اور ارکان',
      summary: 'Authentic ahadith on the definition of true faith, the rights of a Muslim upon another Muslim, and the guarantee of Paradise for those who die upon Tawhid.',
      sections: [
        {
          id: 'sml_1_1',
          heading: 'Religion is Sincerity (الدين النصيحة)',
          heading_ar: 'الدين النصيحة لله ولكتابه ولرسوله',
          arabic: 'عَنْ تَمِيمٍ الدَّارِيِّ رَضِيَ اللَّهُ عَنْهُ، أَنَّ النَّبِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «الدِّينُ النَّصِيحَةُ». قُلْنَا: لِمَنْ؟ قَالَ: «لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلأَئِمَّةِ الْمُسْلِمِينَ، وَعَامَّتِهِمْ».',
          english: 'Narrated by Tamim ad-Dari: The Prophet ﷺ said: "The religion is sincerity (goodwill and devotion)." We asked: "To whom?" He said: "To Allah, to His Book, to His Messenger, and to the leaders of the Muslims and their common folk."',
          urdu: 'حضرت تمیم داری رضی اللہ عنہ سے روایت ہے کہ نبی کریم ﷺ نے ارشاد فرمایا: "دین خیر خواہی اور اخلاص کا نام ہے۔" ہم نے عرض کیا: کس کے لیے؟ آپ ﷺ نے فرمایا: "اللہ کے لیے، اس کی کتاب کے لیے، اس کے رسول کے لیے، اور مسلمانوں کے حکمرانوں اور عام مسلمانوں کے لیے۔"',
          reference: 'Sahih Muslim, Hadith #55'
        },
        {
          id: 'sml_1_2',
          heading: 'Six Rights of a Muslim over Another Muslim',
          heading_ar: 'حق المسلم على المسلم ست',
          arabic: 'عَنْ أَبِي هُرَيْرَةَ أَنَّ رَسُولَ اللَّهِ قَالَ: «حَقُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ سِتٌّ». قِيلَ: مَا هُنَّ يَا رَسُولَ اللَّهِ؟ قَالَ: «إِذَا لَقِيتَهُ فَسَلِّمْ عَلَيْهِ، وَإِذَا دَعَاكَ فَأَجِبْهُ، وَإِذَا اسْتَنْصَحَكَ فَانْصَحْ لَهُ، وَإِذَا عَطَسَ فَحَمِدَ اللَّهَ فَشَمِّتْهُ، وَإِذَا مَرِضَ فَعُدْهُ، وَإِذَا مَاتَ فَاتَّبِعْهُ».',
          english: 'Narrated by Abu Hurairah: The Messenger of Allah ﷺ said: "The rights of a Muslim upon another Muslim are six." It was asked: "What are they, O Messenger of Allah?" He said: "When you meet him, greet him with Salam; when he invites you, accept his invitation; when he seeks your sincere counsel, advise him; when he sneezes and praises Allah, invoke Allah\'s mercy upon him (Yarhamukallah); when he falls ill, visit him; and when he passes away, follow his funeral procession."',
          urdu: 'حضرت ابوہریرہ رضی اللہ عنہ بیان کرتے ہیں کہ رسول اللہ ﷺ نے فرمایا: "ایک مسلمان کے دوسرے مسلمان پر چھ حقوق ہیں: جب اس سے ملو تو اسے سلام کرو؛ جب وہ تمہیں دعوت دے تو قبول کرو؛ جب وہ تم سے مشورہ اور خیر خواہی چاہے تو اسے نیک مشورہ دو؛ جب وہ چھینکے اور الحمد للہ کہے تو اس کا جواب (یرحمک اللہ سے) دو؛ جب وہ بیمار ہو جائے تو اس کی عیادت کرو؛ اور جب وہ وفات پا جائے تو اس کے جنازے کے ساتھ جاؤ۔"',
          reference: 'Sahih Muslim, Hadith #2162'
        }
      ]
    }
  ],

  // ==========================================
  // 8. QISAS AL-ANBIYA (قصص الأنبياء - ابن كثير)
  // ==========================================
  qisas_al_anbiya: [
    {
      id: 'qaa_chap_1',
      chapter_number: 1,
      title: 'Story of Adam (AS) - The First Prophet and the Covenant of Humanity',
      title_ar: 'قصة خلق آدم عليه السلام وبدء البشرية',
      title_ur: 'حضرت آدم علیہ السلام کی تخلیق اور سجدہ ملائکہ کا بیان',
      summary: 'The miraculous creation of Adam from clay, the prostration of angels, the haughty rebellion of Iblis, and the divine repentance granted by Allah.',
      sections: [
        {
          id: 'qaa_1_1',
          heading: 'The Divine Declaration to the Angels',
          heading_ar: 'إني جاعل في الأرض خليفة',
          arabic: 'قَالَ اللَّهُ تَعَالَى: ﴿وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً﴾. خَلَقَ اللَّهُ تَعَالَى آدَمَ بِيَدِهِ مِنْ طِينٍ لَازِبٍ، وَنَفَخَ فِيهِ مِنْ رُوحِهِ، وَعَلَّمَهُ الْأَسْمَاءَ كُلَّهَا، ثُمَّ أَمَرَ الْمَلَائِكَةَ بِالسُّجُودِ لَهُ سُجُودَ تَكْرِيمٍ وَتَعْظِيمٍ لِأَمْرِ اللَّهِ، فَسَجَدُوا كُلُّهُمْ أَجْمَعُونَ إِلَّا إِبْلِيسَ أَبَى وَاسْتَكْبَرَ.',
          english: 'Allah Almighty said: "And when your Lord said to the angels: Verily I am placing a vicegerent on earth." Allah created Adam with His Hands from altered clay, breathed into him of His created spirit, taught him the names of all things, and commanded the angels to prostrate to him in veneration and obedience to Allah\'s command. They all prostrated together except Iblis, who refused and was arrogant.',
          urdu: 'اللہ تعالیٰ کا ارشاد ہے: "اور جب تیرے رب نے فرشتوں سے فرمایا کہ میں زمین میں ایک خلیفہ بنانے والا ہوں۔" اللہ تعالیٰ نے حضرت آدم علیہ السلام کو اپنے دستِ قدرت سے مٹی سے پیدا فرمایا، اس میں اپنی پیدا کردہ روح پھونکی، تمام چیزوں کے نام سکھائے اور فرشتوں کو ان کے لیے سجدۂ تعظیمی کا حکم دیا۔ تمام فرشتوں نے سجدہ کیا سوائے ابلیس کے جس نے تکبر کیا اور انکار کیا۔',
          reference: 'Surah Al-Baqarah (2:30-34) / Qisas al-Anbiya'
        },
        {
          id: 'qaa_1_2',
          heading: 'The Word of Repentance that Saved Humanity',
          heading_ar: 'فتلقى آدم من ربه كلمات فتاب عليه',
          arabic: '﴿فَتَلَقَّىٰ آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ ۚ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ﴾. قَالَا: ﴿رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ﴾. فَهَذِهِ الْكَلِمَاتُ هِيَ مِفْتَاحُ كُلِّ تَوْبَةٍ إِلَى يَوْمِ الْقِيَامَةِ، فَمَنِ اعْتَرَفَ بِذَنْبِهِ وَنَدِمَ رَحِمَهُ اللَّهُ.',
          english: '"Then Adam received from his Lord words of repentance, and He accepted his repentance; verily He is the Accepter of Repentance, the Merciful." Adam and Hawwa said: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we shall certainly be of the losers." These words are the golden key to every repentance until the Day of Resurrection.',
          urdu: '"پھر آدم نے اپنے رب سے چند کلمات سیکھے تو اللہ نے ان کی توبہ قبول فرمائی؛ بیشک وہی توبہ قبول کرنے والا اور رحم فرمانے والا ہے۔" انہوں نے عرض کیا: "اے ہمارے رب! ہم نے اپنی جانوں پر ظلم کیا، اور اگر تو نے ہمیں معاف نہ فرمایا اور ہم پر رحم نہ کیا تو ہم یقیناً نقصان پانے والوں میں سے ہو جائیں گے۔" یہ دعا قیامت تک توبہ کی سب سے بڑی کنجی ہے۔',
          reference: 'Surah Al-A\'raf (7:23) / Qisas al-Anbiya'
        }
      ]
    }
  ],

  // ==========================================
  // 9. AL-AQEEDAH AL-TAHAWIYYAH (العقيدة الطحاوية)
  // ==========================================
  aqeedah_al_tahawiyyah: [
    {
      id: 'aat_chap_1',
      chapter_number: 1,
      title: 'The Declaration of Absolute Monotheism & The Uncreated Quran',
      title_ar: 'بيان عقيدة أهل السنة والجماعة في التوحيد والقرآن',
      title_ur: 'عقیدہ طحاویہ - توحید اور کلامِ الٰہی کا مستند بیان',
      summary: 'The consensus of the early Muslim generations (Salaf) regarding the transcendence of Allah, His uncreated speech, and the finality of Prophethood.',
      sections: [
        {
          id: 'aat_1_1',
          heading: 'Allah is Absolutely One Without Partner',
          heading_ar: 'الله واحد لا شريك له',
          arabic: 'نَقُولُ فِي تَوْحِيدِ اللَّهِ مُعْتَقِدِينَ بِتَوْفِيقِ اللَّهِ: إِنَّ اللَّهَ وَاحِدٌ لَا شَرِيكَ لَهُ، وَلَا شَيْءَ مِثْلُهُ، وَلَا شَيْءَ يُعْجِزُهُ، وَلَا إِلَهَ غَيْرُهُ. قَدِيمٌ بِلَا ابْتِدَاءٍ، دَائِمٌ بِلَا انْتِهَاءٍ، لَا يَفْنَى وَلَا يَبِيدُ، وَلَا يَكُونُ إِلَّا مَا يُرِيدُ.',
          english: 'We say concerning Allah\'s Oneness — believing by Allah\'s guidance — that Allah is One, without any partner; there is nothing like unto Him; nothing is impossible for Him; and there is no deity worthy of worship except Him. Eternal without a beginning, everlasting without an end; He never perishes nor ceases to exist, and nothing happens except what He wills.',
          urdu: 'ہم اللہ تعالیٰ کی توفیق پر بھروسا کرتے ہوئے اس کی توحید کے بارے میں اقرار کرتے ہیں کہ: بیشک اللہ ایک ہے، اس کا کوئی شریک نہیں، کوئی چیز اس کے مشابہ نہیں، کوئی چیز اسے عاجز نہیں کر سکتی، اور اس کے سوا کوئی معبود نہیں۔ وہ ازلی ہے بغیر کسی آغاز کے، اور ابدی ہے بغیر کسی انتہا کے؛ وہ کبھی فنا نہیں ہوگا اور نہ معدوم ہوگا، اور کائنات میں وہی ہوتا ہے جو وہ چاہتا ہے۔',
          reference: 'Al-Aqeedah Al-Tahawiyyah, Paragraphs 1-5'
        },
        {
          id: 'aat_1_2',
          heading: 'The Holy Quran is the True Uncreated Speech of Allah',
          heading_ar: 'القرآن كلام الله غير مخلوق',
          arabic: 'وَإِنَّ الْقُرْآنَ كَلَامُ اللَّهِ؛ مِنْهُ بَدَأَ بِلَا كَيْفِيَّةٍ قَوْلًا، وَأَنْزَلَهُ عَلَى رَسُولِهِ وَحْيًا، وَصَدَّقَهُ الْمُؤْمِنُونَ عَلَى ذَلِكَ حَقًّا، وَأَيْقَنُوا أَنَّهُ كَلَامُ اللَّهِ تَعَالَى بِالْحَقِيقَةِ، لَيْسَ بِمَخْلُوقٍ كَكَلَامِ الْبَرِيَّةِ، فَمَنْ سَمِعَهُ فَزَعَمَ أَنَّهُ كَلَامُ الْبَشَرِ فَقَدْ كَفَرَ.',
          english: 'And verily the Quran is the speech of Allah. It originated from Him without modality as spoken word, and He sent it down upon His Messenger ﷺ as revelation. The believers accept it as such in absolute truth, convinced that it is the real speech of Allah Almighty, not created like the speech of created beings. Whoever hears it and claims that it is the speech of man has indeed disbelieved.',
          urdu: 'اور بیشک قرآن مجید اللہ کا کلام ہے جو اسی کی طرف سے نازل ہوا، اور اللہ نے اپنے رسول ﷺ پر اسے وحی کے ذریعے اتارا۔ اہل ایمان اس بات پر کامل یقین رکھتے ہیں کہ یہ حقیقتاً اللہ ہی کا کلام ہے اور مخلوق کے کلام کی طرح مخلوق نہیں ہے۔ جس نے بھی یہ دعویٰ کیا کہ یہ انسان کا کلام ہے تو اس نے صریح کفر کیا۔',
          reference: 'Al-Aqeedah Al-Tahawiyyah, Paragraphs 23-25'
        }
      ]
    }
  ],

  // ==========================================
  // 10. TAFSIR AL-JALALAYN (تفسير الجلالين)
  // ==========================================
  tafsir_al_jalalayn: [
    {
      id: 'taj_chap_1',
      chapter_number: 1,
      title: 'Concise Grammatical Exegesis of Surah Al-Fatihah',
      title_ar: 'تفسير سورة الفاتحة للإمامين المحلي والسيوطي',
      title_ur: 'تفسیر سورۃ الفاتحہ از جلالین - لفظی و نحوی تشریح',
      summary: 'Word-by-word grammatical commentary clarifying the meaning of Basmalah, Divine Names, and the distinction between Divine Grace and Misguidance.',
      sections: [
        {
          id: 'taj_1_1',
          heading: 'Bismillah and the Scope of Divine Mercy',
          heading_ar: 'تفسير البسملة والحمدلة',
          arabic: '﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾: أَيْ أَبْدَأُ بِاسْمِ اللَّهِ، وَهُوَ عَلَمٌ عَلَى الذَّاتِ الْوَاجِبِ الْوُجُودِ. ﴿الرَّحْمَٰنِ الرَّحِيمِ﴾: صِفَتَانِ بُنِيَتَا لِلْمُبَالَغَةِ، وَالرَّحْمَنُ أَبْلَغُ مِنَ الرَّحِيمِ؛ لِأَنَّ زِيَادَةَ الْبِنَاءِ تَدُلُّ عَلَى زِيَادَةِ الْمَعْنَى.',
          english: '"In the name of Allah, the Entirely Merciful, the Especially Merciful": Meaning: "I begin with the name of Allah", which is the proper name of the Necessary Being. "Al-Rahman, Al-Rahim": Two descriptive attributes constructed for intensive emphasis; and Al-Rahman conveys a more comprehensive, expansive mercy than Al-Rahim, because an increase in word structure indicates an increase in meaning.',
          urdu: '"اللہ کے نام سے جو بے حد مہربان نہایت رحم والا ہے": یعنی میں اللہ کے نام سے شروع کرتا ہوں جو ذات واجب الوجود کا اسمِ اعظم ہے۔ "الرحمٰن الرحیم": یہ دونوں صفات مبالغہ پر دلالت کرتی ہیں، اور لفظِ رحمٰن لفظِ رحیم سے زیادہ وسیع رحمت پر مشتمل ہے کیونکہ عربی قاعدے کے مطابق لفظ کی وسعت معنی کی کثرت کو ظاہر کرتی ہے۔',
          reference: 'Tafsir al-Jalalayn, Surah 1:1'
        }
      ]
    }
  ],

  // ==========================================
  // 11. MA\'ARIFUL QURAN (معارف القرآن)
  // ==========================================
  maariful_quran: [
    {
      id: 'mqn_chap_1',
      chapter_number: 1,
      title: 'Surah Al-\'Asr: The Four Inviolable Principles of Human Salvation',
      title_ar: 'معارف سورة العصر: الأركان الأربعة للنجاة من الخسران',
      title_ur: 'معارف سورۃ العصر - خسارے سے بچنے اور کامیابی کے چار ارکان',
      summary: 'Mufti Muhammad Shafi explains Imam Shafi\'i\'s famous maxim: "If people were only to reflect upon Surah Al-\'Asr, it would be sufficient for their guidance in this life and the Next."',
      sections: [
        {
          id: 'mqn_1_1',
          heading: 'Time is the Capital of Human Existence',
          heading_ar: 'القسم بالزمان ورأس مال الإنسان',
          arabic: '﴿وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ﴾. قَالَ الشَّافِعِيُّ: «لَوْ تَدَبَّرَ النَّاسُ هَذِهِ السُّورَةَ لَكَفَتْهُمْ». رَأْسُ مَالِ الإِنْسَانِ هُوَ عُمُرُهُ، فَكُلُّ نَفَسٍ يَمْضِي يَذْهَبُ بِجُزْءٍ مِنْ حَيَاتِهِ، فَمَنْ لَمْ يَسْتَثْمِرْهُ فِي الإِيمَانِ وَالْعَمَلِ الصَّالِحِ فَهُوَ فِي خَسَارَةٍ مُحَقَّقَةٍ.',
          english: '"By time! Verily man is in profound loss, except those who have faith, do righteous deeds, exhort one another to truth, and exhort one another to patience." Imam Al-Shafi\'i said: "If mankind were to ponder only upon this Surah, it would suffice them." Time is the fundamental capital of human existence; every breath that elapses carries away a portion of one\'s life. Whoever does not invest it in faith and righteous deeds is inevitably in ruin.',
          urdu: '"قسم ہے زمانے کی! بیشک تمام انسان خسارے میں ہیں، سوائے ان لوگوں کے جو ایمان لائے، نیک عمل کیے، اور ایک دوسرے کو حق کی وصیت کی اور صبر کی تلقین کی۔" امام شافعی فرماتے ہیں کہ اگر لوگ صرف اسی سورت پر غور کر لیں تو ان کی ہدایت کے لیے کافی ہے۔ انسان کا اصل سرمایہ اس کی عمر اور وقت ہے، جو شخص اسے ایمان اور عملِ صالح میں خرچ نہیں کرتا وہ قطعی تباہی میں ہے۔',
          reference: 'Ma\'ariful Quran, Tafsir Surah Al-\'Asr'
        }
      ]
    }
  ],

  // ==========================================
  // 12. TAFHIM-UL-QURAN (تفهيم القرآن)
  // ==========================================
  tafhim_ul_quran: [
    {
      id: 'tuq_chap_1',
      chapter_number: 1,
      title: 'The Four Essential Quranic Terms (چار بنیادی اصطلاحات)',
      title_ar: 'المصطلحات الأربعة الأساسية في القرآن الكريم',
      title_ur: 'قرآن کی چار بنیادی اصطلاحات: الٰہ، رب، عبادت اور دین',
      summary: 'Maududi\'s profound treatise elucidating how understanding the core Quranic terms — Ilah, Rabb, Ibadah, and Deen — unlocks the true living message of the Holy Quran.',
      sections: [
        {
          id: 'tuq_1_1',
          heading: 'Why Understanding "Ilah" and "Rabb" Unlocks the Quran',
          heading_ar: 'أهمية فهم معنى الإله والرب',
          arabic: 'إِنَّ الْقُرْآنَ نَزَلَ بِلِسَانٍ عَرَبِيٍّ مُبِينٍ، وَأَسَاسُ هِدَايَتِهِ يَدُورُ حَوْلَ مَعْرِفَةِ مَعْنَى «الإِلَهِ» الْمَعْبُودِ بِحَقٍّ، وَ«الرَّبِّ» الْخَالِقِ الْمُدَبِّرِ الْمُطَاعِ، وَ«الْعِبَادَةِ» الْخَالِصَةِ لَهُ وَحْدَهُ، وَ«الدِّينِ» الَّذِي هُوَ نِظَامُ الطَّاعَةِ وَالانْقِيَادِ لِأَمْرِ اللَّهِ فِي كُلِّ شُئُونِ الْحَيَاةِ.',
          english: 'The Holy Quran was revealed in clear, eloquent Arabic, and the foundation of its guidance revolves around understanding the true meaning of "Ilah" (the only deity worthy of worship and ultimate loyalty), "Rabb" (the supreme Sovereign, Sustainer, and Ruler), "Ibadah" (complete submission and servitude to Him alone), and "Deen" (the comprehensive system of divine obedience governing all aspects of life).',
          urdu: 'قرآن مجید عربی مبین میں نازل ہوا اور اس کی پوری دعوت کا مدار چار بنیادی اصطلاحات کی تفہیم پر قائم ہے: "الٰہ" یعنی وہ ہستی جو تمام محبت، بندگی اور اطاعت کی تنہا مستحق ہو؛ "رب" یعنی حقیقی مالک، مدبر اور حاکمِ اعلیٰ؛ "عبادت" یعنی اس کے سامنے مکمل سپردگی اور اطاعت؛ اور "دین" یعنی زندگی کے تمام شعبوں میں اللہ کے احکام کے آگے سر تسلیمِ خم کر دینا۔',
          reference: 'Tafhim-ul-Quran, Introduction'
        }
      ]
    }
  ],

  // ==========================================
  // 13. HISN AL-MUSLIM (حصن المسلم)
  // ==========================================
  hisn_al_muslim: [
    {
      id: 'ham_chap_1',
      chapter_number: 1,
      title: 'Morning & Evening Invocations (أذكار الصباح والمساء)',
      title_ar: 'أذكار الصباح والمساء لحفظ النفس والروح',
      title_ur: 'صبح اور شام کے مسنون اذکار - حفاظت اور برکت کا حصار',
      summary: 'The essential daily spiritual fortress established by Prophet Muhammad ﷺ for protection against evil, distress, and spiritual harm from dawn until nightfall.',
      sections: [
        {
          id: 'ham_1_1',
          heading: 'We Have Reached the Morning (أصبحنا وأصبح الملك لله)',
          heading_ar: 'دعاء الصباح والاعتراف بالملك لله وحده',
          arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ.',
          english: 'We have reached the morning, and with it the kingdom belongs to Allah; all praise is due to Allah. There is no deity worthy of worship except Allah alone, without partner; to Him belongs all sovereignty and praise, and He has power over all things. My Lord, I ask You for the good of this day and what follows it, and I seek refuge in You from the evil of this day and what follows it.',
          urdu: 'ہم نے صبح کی اور اللہ کے سارے ملک نے صبح کی، اور تمام تعریف اللہ کے لیے ہے، اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف، اور وہ ہر چیز پر قادر ہے۔ اے میرے رب! میں تجھ سے اس دن کی بھلائی اور اس کے بعد کی بھلائی کا سوال کرتا ہوں، اور اس دن کے شر اور اس کے بعد کے شر سے تیری پناہ مانگتا ہوں۔',
          reference: 'Sahih Muslim #2723 / Hisn al-Muslim #75'
        },
        {
          id: 'ham_1_2',
          heading: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
          heading_ar: 'سيد الاستغفار وفضله العظيم',
          arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
          english: 'O Allah, You are my Lord; none has the right to be worshipped except You. You created me and I am Your slave, and I abide by Your covenant and promise as best as I am able. I seek refuge in You from the evil of what I have done. I acknowledge before You Your blessing upon me, and I acknowledge my sin, so forgive me; for verily none forgives sins except You.',
          urdu: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی استطاعت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، میں اپنے اوپر تیری نعمتوں کا اقرار کرتا ہوں اور اپنے گناہوں کا اعتراف کرتا ہوں، پس مجھے معاف فرما دے کیونکہ تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا۔',
          reference: 'Sahih al-Bukhari #6306 / Hisn al-Muslim #78'
        },
        {
          id: 'ham_1_3',
          heading: 'Protection with the Name of Allah (باسم الله الذي لا يضر مع اسمه شيء)',
          heading_ar: 'الاستعاذة باسم الله من كل ضرر',
          arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ. (ثَلَاثَ مَرَّاتٍ)',
          english: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing. (Recite 3 times morning & evening: whoever says it, no affliction will touch them).',
          urdu: 'اللہ کے نام کے ساتھ جس کے نام کی برکت سے زمین اور آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا اور جاننے والا ہے۔ (صبح اور شام 3 مرتبہ پڑھنے سے ہر قسم کے نقصان سے حفاظت رہتی ہے)۔',
          reference: 'Sunan Abi Dawud #5088 / Jami` at-Tirmidhi #3388'
        }
      ]
    },
    {
      id: 'ham_chap_2',
      chapter_number: 2,
      title: 'Duas for Distress, Sorrow, and Hardship (دعاء الكرب والهم)',
      title_ar: 'دعاء الكرب والهم والحزن وقضاء الدين',
      title_ur: 'پریشانی، غم، فکر اور قرض کی ادائیگی کی مسنون دعائیں',
      summary: 'Authentic prophetic prayers that dispel depression, lift anxiety, settle burdensome debts, and grant inner tranquility in trying circumstances.',
      sections: [
        {
          id: 'ham_2_1',
          heading: 'Prophetic Supplication in Severe Distress (دعاء الكرب العظيم)',
          heading_ar: 'لا إله إلا الله العظيم الحليم',
          arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.',
          english: 'There is no deity worthy of worship except Allah, the Magnificent, the Forbearing. There is no deity worthy of worship except Allah, Lord of the Mighty Throne. There is no deity worthy of worship except Allah, Lord of the heavens and Lord of the earth and Lord of the Noble Throne.',
          urdu: 'اللہ کے سوا کوئی معبود نہیں جو عظمت والا اور بردبار ہے، اللہ کے سوا کوئی معبود نہیں جو عرشِ عظیم کا رب ہے، اللہ کے سوا کوئی معبود نہیں جو آسمانوں کا رب اور زمین کا رب اور عرشِ کریم کا رب ہے۔',
          reference: 'Sahih al-Bukhari #6346 / Sahih Muslim #2730'
        },
        {
          id: 'ham_2_2',
          heading: 'Supplication of Prophet Yunus (Jonah AS) in the Whale',
          heading_ar: 'دعوة ذي النون عليه السلام في بطن الحوت',
          arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.',
          english: 'There is no deity worthy of worship except You; exalted are You, truly I have been of the wrongdoers. (The Prophet ﷺ said: No Muslim ever supplicates with this in any difficulty except that Allah answers him).',
          urdu: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بیشک میں ہی قصورواروں میں سے ہوں۔ (رسول اللہ ﷺ نے فرمایا: کوئی بھی مسلمان کسی مشکل میں یہ دعا نہیں مانگتا مگر اللہ اس کی دعا قبول فرما لیتا ہے)۔',
          reference: 'Jami` at-Tirmidhi #3505 / Surah Al-Anbiya (21:87)'
        }
      ]
    }
  ]
};


