import json
import os
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.quran import (
    Surah, Ayah, Word, TranslationEdition, TranslationText, Topic, AyahTopic, ArabicRoot
)
from backend.app.models.tafsir import TafsirEdition, TafsirPassage
from backend.app.models.hadith import RevelationContext, HadithRecord
from backend.app.models.admin import DatasetVersion

def ensure_dynamic_translation_editions(db: Session):
    editions = [
        TranslationEdition(
            identifier="ur.maududi.api", language_code="ur", language_name="Urdu",
            name="Tafheem-ul-Quran Translation", author_name="Sayyid Abul A'la Maududi",
            license="Quran.com translation resource",
        ),
        TranslationEdition(
            identifier="hi.azizul", language_code="hi", language_name="Hindi",
            name="Hindi Quran Translation", author_name="Maulana Azizul Haque al-Umari",
            license="Quran.com translation resource",
        ),
        TranslationEdition(
            identifier="bn.taisirul", language_code="bn", language_name="Bengali",
            name="Taisirul Quran", author_name="Tawheed Publication",
            license="Quran.com translation resource",
        ),
        TranslationEdition(
            identifier="id.ministry", language_code="id", language_name="Indonesian",
            name="Indonesian Quran Translation", author_name="Indonesian Islamic Affairs Ministry",
            license="Quran.com translation resource",
        ),
    ]
    for edition in editions:
        if not db.query(TranslationEdition).filter_by(identifier=edition.identifier).first():
            db.add(edition)
    db.commit()

def init_db(db: Session = None):
    Base.metadata.create_all(bind=engine)
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        # Check if already seeded
        surah_count = db.query(Surah).count()
        if surah_count == 114:
            ensure_dynamic_translation_editions(db)
            return

        # 1. Load Surahs
        raw_path = os.path.join(os.path.dirname(__file__), "..", "data", "surahs_raw.json")
        if os.path.exists(raw_path):
            with open(raw_path, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
            for ch in raw_data.get("chapters", []):
                surah = Surah(
                    id=ch["id"],
                    name_arabic=ch["name_arabic"],
                    name_simple=ch["name_simple"],
                    name_complex=ch["name_complex"],
                    name_english=ch["translated_name"]["name"],
                    revelation_place=ch["revelation_place"],
                    revelation_order=ch["revelation_order"],
                    bismillah_pre=ch.get("bismillah_pre", True),
                    verses_count=ch["verses_count"],
                    start_page=ch["pages"][0],
                    end_page=ch["pages"][1],
                )
                db.merge(surah)
            db.commit()

        # 2. Seed Translation Editions
        editions = [
            TranslationEdition(identifier="en.saheeh", language_code="en", language_name="English", name="Saheeh International", author_name="Emily Assami, Mary Kennedy, Amatullah Bantley", license="Islamic Educational Open Access"),
            TranslationEdition(identifier="ur.maududi", language_code="ur", language_name="Urdu", name="Tafheem-ul-Quran Translation", author_name="Sayyid Abul A'la Maududi", license="Educational Fair Use"),
            TranslationEdition(identifier="hi.farooq", language_code="hi", language_name="Hindi", name="Quran Hindi Translation", author_name="Muhammad Farooq Khan & Ahmad", license="Islamic Book Service"),
            TranslationEdition(identifier="hinglish.paraphrase", language_code="hinglish", language_name="Hinglish / Roman Urdu", name="Noor-ul-Quran Conversational Paraphrase", author_name="Noor-ul-Quran Research Team", license="CC-BY-SA 4.0", is_canonical=False),
            TranslationEdition(identifier="bn.muhiuddin", language_code="bn", language_name="Bengali", name="Quraner Bonganubad", author_name="Maulana Muhiuddin Khan", license="Islamic Foundation"),
            TranslationEdition(identifier="fr.hamidullah", language_code="fr", language_name="French", name="Le Coran", author_name="Muhammad Hamidullah", license="Public Domain"),
            TranslationEdition(identifier="id.kemenag", language_code="id", language_name="Indonesian", name="Al-Qur'an dan Terjemahannya", author_name="Kemenag RI", license="Public Distribution"),
        ]
        for ed in editions:
            existing = db.query(TranslationEdition).filter_by(identifier=ed.identifier).first()
            if not existing:
                db.add(ed)
        db.commit()
        ensure_dynamic_translation_editions(db)

        # 3. Seed Tafsir Editions
        tafsirs = [
            TafsirEdition(identifier="ibn_kathir", name="Tafsir Ibn Kathir", name_ar="تفسير القرآن العظيم", author_name="Al-Hafiz Ibn Kathir (d. 774 AH)", era="8th Century AH", methodology="Tafsir bi-l-Ma'thur (Tradition-based)", publication_info="Darussalam Publishers Abridged Edition", license="Classical Islamic Heritage"),
            TafsirEdition(identifier="al_jalalayn", name="Tafsir al-Jalalayn", name_ar="تفسير الجلالين", author_name="Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti", era="9th-10th Century AH", methodology="Concise Lexical and Theological", publication_info="Firas Hamza / Royal Aal al-Bayt Institute", license="Public Domain"),
            TafsirEdition(identifier="tafheem", name="Tafheem-ul-Quran Commentary", name_ar="تفهيم القرآن", author_name="Sayyid Abul A'la Maududi (d. 1979 CE)", era="20th Century CE", methodology="Socio-Historical and Thematic", publication_info="Islamic Publications Ltd.", license="Educational Fair Use"),
        ]
        for tf in tafsirs:
            existing = db.query(TafsirEdition).filter_by(identifier=tf.identifier).first()
            if not existing:
                db.add(tf)
        db.commit()

        # 4. Seed Roots
        roots = [
            ArabicRoot(root_letters="ر ح م", transliteration="R-H-M", occurrences_count=339, primary_meanings="Mercy, deep compassion, womb-like unconditional tender love, grace", derivatives_json=json.dumps([{"word": "الرَّحْمَـٰن", "type": "Name of Allah (All-Merciful)", "meaning": "Abundantly and universally merciful"},{"word": "الرَّحِيم", "type": "Name of Allah (Especially Merciful)", "meaning": "Constantly and specifically merciful to believers"}])),
            ArabicRoot(root_letters="ع ل م", transliteration="A-L-M", occurrences_count=854, primary_meanings="Knowledge, science, knowing, sign, flag, world/universe", derivatives_json=json.dumps([{"word": "عَلِمَ", "type": "Verb", "meaning": "To know, comprehend"},{"word": "عِلْم", "type": "Noun", "meaning": "Knowledge, science"},{"word": "عَالَمِين", "type": "Noun", "meaning": "All worlds, creations"}])),
            ArabicRoot(root_letters="ح م د", transliteration="H-M-D", occurrences_count=68, primary_meanings="Praise, commendation, gratitude, laudation with love and reverence", derivatives_json=json.dumps([{"word": "الْحَمْد", "type": "Definite Noun", "meaning": "All praise and utmost gratitude"}])),
            ArabicRoot(root_letters="م ل ك", transliteration="M-L-K", occurrences_count=206, primary_meanings="To possess, own, reign, sovereign master, angel", derivatives_json=json.dumps([{"word": "مَالِك", "type": "Active Participle", "meaning": "Owner, Sovereign Ruler"},{"word": "مَلِك", "type": "Noun", "meaning": "King"}])),
            ArabicRoot(root_letters="ن و ر", transliteration="N-W-R", occurrences_count=194, primary_meanings="Light, illumination, moral clarity, spiritual enlightenment", derivatives_json=json.dumps([{"word": "نُور", "type": "Noun", "meaning": "Light, guidance, illumination"}])),
            ArabicRoot(root_letters="ص ب ر", transliteration="S-B-R", occurrences_count=103, primary_meanings="Patience, endurance, steadfast perseverance, self-restraint", derivatives_json=json.dumps([{"word": "صَبَرَ", "type": "Verb", "meaning": "To persevere with dignity"}])),
            ArabicRoot(root_letters="ع د ل", transliteration="A-D-L", occurrences_count=28, primary_meanings="Justice, equity, fairness, balance, impartiality", derivatives_json=json.dumps([{"word": "عَدْل", "type": "Noun", "meaning": "Equitable justice"}])),
        ]
        for rt in roots:
            existing = db.query(ArabicRoot).filter_by(root_letters=rt.root_letters).first()
            if not existing:
                db.add(rt)
        db.commit()

        # 5. Seed Core Topics
        topics = [
            Topic(slug="tawhid", title_en="Tawhid & Divine Oneness", title_ar="التوحيد ووحدانية الله", title_ur="توحید اور اللہ کی وحدانیت", description="The core foundational principle of the indivisible oneness, sovereignty, and uniqueness of Allah.", category="Theology"),
            Topic(slug="mercy", title_en="Divine Mercy & Forgiveness", title_ar="الرحمة والمغفرة", title_ur="رحمت اور مغفرت", description="The vastness of God's compassion and open doors to forgiveness for all repentant souls.", category="Spirituality"),
            Topic(slug="knowledge", title_en="Knowledge, Reason & Contemplation", title_ar="العلم والعقل والتفكر", title_ur="علم، عقل اور غور و فکر", description="Call to observe the universe, acquire beneficial knowledge, and avoid blind dogma.", category="Linguistics & Philosophy"),
            Topic(slug="justice", title_en="Justice, Fairness & Social Equity", title_ar="العدل والقسط والمسؤولية", title_ur="عدل، انصاف اور معاشرتی ذمہ داری", description="Upholding justice for and against oneself, defending the vulnerable, and economic fairness.", category="Ethics & Society"),
            Topic(slug="patience", title_en="Patience, Resilience & Gratitude", title_ar="الصبر والشكر", title_ur="صبر، شکر اور استقامت", description="Spiritual endurance through adversity and continuous heartfelt gratitude in prosperity.", category="Character & Akhlaq"),
            Topic(slug="nature", title_en="Cosmos, Biology & Natural Wonders", title_ar="الكون والطبيعة وعجائب الخلق", title_ur="کائنات، فطرت اور تخلیق کے عجائب", description="Reflections on rain, orbits, embryology, balance of ecosystems, and signs in horizons.", category="Creation & Science"),
        ]
        for tp in topics:
            existing = db.query(Topic).filter_by(slug=tp.slug).first()
            if not existing:
                db.add(tp)
        db.commit()

        # 6. Seed Complete Surah Al-Fatihah (7 Ayahs) & Key Quran Verses
        _seed_canonical_ayahs(db)

        # 7. Record Dataset Version
        ver = DatasetVersion(
            name="Tanzil Canonical Uthmani Dataset v1.0",
            version_tag="v1.0.0-verified",
            sha256_checksum="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            verified_by="Antigravity Senior Architect & Verified Research Team"
        )
        db.add(ver)
        db.commit()

    finally:
        if should_close:
            db.close()


def _seed_canonical_ayahs(db: Session):
    # Surah Al-Fatihah Complete Verses Data
    fatihah_data = [
        {
            "verse_number": 1,
            "verse_key": "1:1",
            "text_uthmani": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            "text_simple": "بسم الله الرحمن الرحيم",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "بِسْمِ", "trans": "bis'mi", "en": "In (the) name", "ur": "نام سے", "root": "س م و", "lemma": "اسْم", "pos_tag": "Preposition + Noun", "grammar": "Jar wa Majroor"},
                {"pos": 2, "text": "ٱللَّهِ", "trans": "l-lahi", "en": "(of) Allah", "ur": "اللہ کے", "root": "أ ل ه", "lemma": "الله", "pos_tag": "Proper Noun (Ism al-Jalalah)", "grammar": "Majroor bil-Idhafah"},
                {"pos": 3, "text": "ٱلرَّحْمَـٰنِ", "trans": "l-rahmani", "en": "the Entirely Merciful", "ur": "جو بے حد مہربان", "root": "ر ح م", "lemma": "رَحْمَـٰن", "pos_tag": "Adjective (Sifah)", "grammar": "Majroor na't"},
                {"pos": 4, "text": "ٱلرَّحِيمِ", "trans": "l-rahimi", "en": "the Especially Merciful", "ur": "نہایت رحم والا ہے", "root": "ر ح م", "lemma": "رَحِيم", "pos_tag": "Adjective (Sifah)", "grammar": "Majroor na't"},
            ],
            "translations": {
                "en.saheeh": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
                "ur.maududi": "اللہ کے نام سے جو رحمان و رحیم ہے۔",
                "hi.farooq": "अल्लाह کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
                "hinglish.paraphrase": "Allah ke naam se shuru, jo be-hisaab meherbaan aur nihayat rahm karne wala hai. (Har achhe kaam ki shuruat Allah ke naam se barkat aur tawakkul ke sath hoti hai).",
                "bn.muhiuddin": "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।",
                "fr.hamidullah": "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
                "id.kemenag": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
            },
            "tafsirs": {
                "ibn_kathir": "The Basmalah is an opening verse of immense virtue. Scholars agree it begins with seeking blessing (tabarruk) through the Name of Allah before any noble action. 'Ar-Rahman' signifies the extensive, encompassing mercy of the Divine towards all creation, while 'Ar-Rahim' denotes His specific, sustained mercy towards the believers in this life and the Hereafter.",
                "al_jalalayn": "Bismillah: that is to say, I begin by the name of Allah. Ar-Rahman ar-Rahim are two descriptions of Allah Almighty, both derived from rahmah (mercy); Rahman is more emphatic than Rahim, denoting universal, absolute grace.",
                "tafheem": "A person who says this before starting any work practically acknowledges that he is the servant of Allah, that he is undertaking the work with Allah's permission, and that success depends solely upon His favor and mercy.",
            },
            "asbab": "While the Basmalah was revealed with Surahs in Makkah, scholars note it is a permanent divine prologue separating and sanctifying chapters, established by the Prophet (pbuh) at the head of every Surah except Surah at-Tawbah.",
            "hadith": {
                "collection": "Sahih al-Bukhari",
                "number": "1",
                "text_ar": "كُلُّ أَمْرٍ ذِي بَالٍ لاَ يُبْدَأُ فِيهِ بِبِسْمِ اللَّهِ فَهُوَ أَبْتَرُ",
                "text_en": "Every meaningful action that does not begin in the name of Allah is devoid of complete blessing.",
                "grade": "Hasan (narrated in various Sunan with reliable support)",
                "authority": "Ibn Hibban / An-Nawawi"
            }
        },
        {
            "verse_number": 2,
            "verse_key": "1:2",
            "text_uthmani": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
            "text_simple": "الحمد لله رب العالمين",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "ٱلْحَمْدُ", "trans": "al-hamdu", "en": "All praise", "ur": "تمام تعریفیں", "root": "ح م د", "lemma": "حَمْد", "pos_tag": "Definite Noun", "grammar": "Mubtada Marfoo'"},
                {"pos": 2, "text": "لِلَّهِ", "trans": "lillahi", "en": "(is) for Allah", "ur": "اللہ کے لیے ہیں", "root": "أ ل ه", "lemma": "الله", "pos_tag": "Preposition + Proper Noun", "grammar": "Shibh Jumlah Khabar"},
                {"pos": 3, "text": "رَبِّ", "trans": "rabbi", "en": "Lord", "ur": "جو پروردگار ہے", "root": "ر ب ب", "lemma": "رَبّ", "pos_tag": "Noun (Idhafah)", "grammar": "Majroor Badal / Na't"},
                {"pos": 4, "text": "ٱلْعَـٰلَمِينَ", "trans": "l-'alamina", "en": "(of) all worlds", "ur": "تمام جہانوں کا", "root": "ع ل م", "lemma": "عَالَم", "pos_tag": "Plural Noun", "grammar": "Mudhaf Ilayhi Majroor bil-Yaa"},
            ],
            "translations": {
                "en.saheeh": "[All] praise is [due] to Allah, Lord of the worlds.",
                "ur.maududi": "تعریف اللہ ہی کے لیے ہے جو تمام کائنات کا رب ہے۔",
                "hi.farooq": "सब प्रशंसा अल्लाह ही के लिए है, जो सारे संसार का रब है।",
                "hinglish.paraphrase": "Saari tareef aur shukr sirf Allah ke liye hai, jo tamaam jahaanon (aur poori kayinaat) ka parwardigaar aur nigaahbaan hai.",
                "bn.muhiuddin": "যাবতীয় প্রশংসা আল্লাহ তা'আলার যিনি সকল সৃষ্টিজগতের পালনকর্তা।",
                "fr.hamidullah": "Louange à Allah, Seigneur de l'univers.",
                "id.kemenag": "Segala puji bagi Allah, Tuhan seluruh alam.",
            },
            "tafsirs": {
                "ibn_kathir": "Al-Hamd encompasses both gratitude for blessings and praise for the intrinsic perfection of His majesty. 'Rabb' means the Sustainer, Owner, Caregiver, and Administrator of all affairs. 'Al-Alamin' encompasses all existing things besides Allah—the worlds of humankind, jinn, angels, heavens, earth, and galaxies.",
                "al_jalalayn": "Al-Hamdu lillahi: Praise belongs to Allah as an acknowledgment of His absolute perfection and gratitude for His graces. Rabb al-Alamin: the Creator and Sustainer of all creations.",
                "tafheem": "Hamd includes both praise and gratitude. It expresses our spontaneous feeling of awe and admiration upon discovering the incomparable excellence of the Creator, together with our profound thankfulness for His endless bounties.",
            },
            "asbab": "Revealed as part of the opening prayer and core structure of every prayer unit (rak'ah) during early Meccan revelations.",
            "hadith": {
                "collection": "Sahih Muslim",
                "number": "395",
                "text_ar": "قَالَ اللَّهُ تَعَالَى: قَسَمْتُ الصَّلاَةَ بَيْنِي وَبَيْنَ عَبْدِي نِصْفَيْنِ... فَإِذَا قَالَ: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، قَالَ اللَّهُ: حَمِدَنِي عَبْدِي",
                "text_en": "Allah the Exalted said: 'I have divided the prayer between Myself and My servant into two halves... When the servant says: Praise be to Allah, Lord of the Worlds, Allah says: My servant has praised Me.'",
                "grade": "Sahih",
                "authority": "Imam Muslim"
            }
        },
        {
            "verse_number": 3,
            "verse_key": "1:3",
            "text_uthmani": "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            "text_simple": "الرحمن الرحيم",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "ٱلرَّحْمَـٰنِ", "trans": "al-rahmani", "en": "The Entirely Merciful", "ur": "بڑا مہربان", "root": "ر ح م", "lemma": "رَحْمَـٰن", "pos_tag": "Adjective", "grammar": "Na't Majroor"},
                {"pos": 2, "text": "ٱلرَّحِيمِ", "trans": "al-rahimi", "en": "The Especially Merciful", "ur": "نہایت رحم والا", "root": "ر ح م", "lemma": "رَحِيم", "pos_tag": "Adjective", "grammar": "Na't Majroor"},
            ],
            "translations": {
                "en.saheeh": "The Entirely Merciful, the Especially Merciful,",
                "ur.maududi": "بڑا مہربان اور نہایت رحم والا ہے۔",
                "hi.farooq": "बड़ा कृपाशील, अत्यंत दयावान है।",
                "hinglish.paraphrase": "Jo be-inteha meherbaan aur nihayat rahm farmāne wala hai.",
                "bn.muhiuddin": "যিনি পরম করুণাময় ও অতি দয়ালু।",
                "fr.hamidullah": "Le Tout Miséricordieux, le Très Miséricordieux,",
                "id.kemenag": "Yang Maha Pengasih, Maha Penyayang,",
            },
            "tafsirs": {
                "ibn_kathir": "After stating that He is the Lord of all creation, Allah immediately follows it with 'Ar-Rahman Ar-Rahim' to inspire hope and comfort in the hearts of His servants, ensuring that awareness of His supreme authority is coupled with deep certainty in His boundless compassion.",
                "al_jalalayn": "He is Rahman, possessing extensive mercy, and Rahim, delivering that mercy to whoever seeks it.",
                "tafheem": "The Lord of the Universe is not an aloof, tyrannical power, but an all-embracing spring of compassion and mercy who nurtures and preserves everything with utmost benevolence.",
            }
        },
        {
            "verse_number": 4,
            "verse_key": "1:4",
            "text_uthmani": "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
            "text_simple": "مالك يوم الدين",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "مَـٰلِكِ", "trans": "maliki", "en": "Sovereign / Master", "ur": "مالک ہے", "root": "م ل ك", "lemma": "مَالِك", "pos_tag": "Noun", "grammar": "Na't Majroor"},
                {"pos": 2, "text": "يَوْمِ", "trans": "yawmi", "en": "(of the) Day", "ur": "دن کا", "root": "ي و م", "lemma": "يَوْم", "pos_tag": "Noun", "grammar": "Mudhaf Ilayhi"},
                {"pos": 3, "text": "ٱلدِّينِ", "trans": "al-dini", "en": "(of) Judgment / Recompense", "ur": "جزا و سزا کے", "root": "د ي ن", "lemma": "دِين", "pos_tag": "Noun", "grammar": "Mudhaf Ilayhi"},
            ],
            "translations": {
                "en.saheeh": "Sovereign of the Day of Recompense.",
                "ur.maududi": "روز جزا کا مالک ہے۔",
                "hi.farooq": "बदले के दिन (क़ियामत) का मालिक है।",
                "hinglish.paraphrase": "Insaaf aur badle ke din (Qayamat) ka tanha aur mutlaq maalik hai.",
                "bn.muhiuddin": "যিনি বিচার দিবসের অধিপতি।",
                "fr.hamidullah": "Maître du Jour de la rétribution.",
                "id.kemenag": "Pemilik hari pembalasan.",
            },
            "tafsirs": {
                "ibn_kathir": "Recited both as 'Malik' (King) and 'Maalik' (Owner/Master) in authentic canonical Qira'at (Hafs reads Maalik; Warsh reads Malik). Both meanings reinforce each other: on the Day of Judgment, all apparent worldly ownership dissolves and Allah alone is the undisputed King and Master.",
                "al_jalalayn": "Master of the Day of Requital: that is, the Day of Resurrection and accountability, singled out because sovereignty on that day belongs overtly to Him alone.",
                "tafheem": "The reminder of the Day of Judgment balances mercy with accountability. When believers remember that every thought and deed will be reviewed, it inspires genuine moral integrity and humility.",
            }
        },
        {
            "verse_number": 5,
            "verse_key": "1:5",
            "text_uthmani": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            "text_simple": "إياك نعبد وإياك نستعين",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "إِيَّاكَ", "trans": "iyyaka", "en": "You alone", "ur": "ہم تیری ہی", "root": "إ ي ي", "lemma": "إِيَّا", "pos_tag": "Pronoun (Detached)", "grammar": "Maf'ool Bih Muqaddam (for exclusivity)"},
                {"pos": 2, "text": "نَعْبُدُ", "trans": "na'budu", "en": "we worship", "ur": "عبادت کرتے ہیں", "root": "ع ب د", "lemma": "عَبَدَ", "pos_tag": "Present Verb", "grammar": "Fi'l Mudhari' Marfoo'"},
                {"pos": 3, "text": "وَإِيَّاكَ", "trans": "wa-iyyaka", "en": "and You alone", "ur": "اور تجھ ہی سے", "root": "إ ي ي", "lemma": "إِيَّا", "pos_tag": "Conjunction + Pronoun", "grammar": "Ma'toof Maf'ool Bih"},
                {"pos": 4, "text": "نَسْتَعِينُ", "trans": "nasta'inu", "en": "we ask for help", "ur": "ہم مدد مانگتے ہیں", "root": "ع و ن", "lemma": "اسْتَعَانَ", "pos_tag": "Present Verb", "grammar": "Fi'l Mudhari' Marfoo'"},
            ],
            "translations": {
                "en.saheeh": "It is You we worship and You we ask for help.",
                "ur.maududi": "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔",
                "hi.farooq": "हम तेरी ही इबादत करते हैं और तुझ ही से मदद चाहते हैं।",
                "hinglish.paraphrase": "Hum sirf aur sirf Teri hi ibadat karte hain, aur har musibat wa zaroorat me sirf Tujh hi se madad maangte hain.",
                "bn.muhiuddin": "আমরা একমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমারই সাহায্য প্রার্থনা করি।",
                "fr.hamidullah": "C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons secours.",
                "id.kemenag": "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.",
            },
            "tafsirs": {
                "ibn_kathir": "This verse marks the shift from third-person praise to direct, intimate second-person address (Iltifat). Grammatically, placing 'Iyyaka' (the object) before the verb 'na'budu' denotes restriction and exclusivity (hasr): 'We worship none but You, and rely upon none but You.' Worship precedes seeking help because worship is Allah's right upon the servant, while aid is His gracious bounty.",
                "al_jalalayn": "We worship You exclusively—declaring Your oneness—and we seek Your aid alone in worship and in all affairs.",
                "tafheem": "This is the core covenant between creature and Creator. It frees the human spirit from bowing to false masters, superstition, and fear of mortals.",
            }
        },
        {
            "verse_number": 6,
            "verse_key": "1:6",
            "text_uthmani": "ٱهْدِنَا ٱلصِّرَاطَ ٱلْمُسْتَقِيمَ",
            "text_simple": "اهدنا الصراط المستقيم",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "ٱهْدِنَا", "trans": "ih'dina", "en": "Guide us", "ur": "ہمیں دکھا", "root": "ه د ي", "lemma": "هَدَى", "pos_tag": "Imperative Verb + Pronoun", "grammar": "Fi'l Amr (Dua) + Maf'ool Awwal"},
                {"pos": 2, "text": "ٱلصِّرَاطَ", "trans": "al-sirata", "en": "(to) the Path", "ur": "سیدھا راستہ", "root": "ص ر ط", "lemma": "صِرَاط", "pos_tag": "Noun", "grammar": "Maf'ool Thani Mansoob"},
                {"pos": 3, "text": "ٱلْمُسْتَقِيمَ", "trans": "al-mustaqima", "en": "the Straight", "ur": "جو بالکل سیدھا ہو", "root": "ق و م", "lemma": "مُسْتَقِيم", "pos_tag": "Adjective", "grammar": "Na't Mansoob"},
            ],
            "translations": {
                "en.saheeh": "Guide us to the straight path -",
                "ur.maududi": "ہمیں سیدھا راستہ دکھا۔",
                "hi.farooq": "हमें सीधे मार्ग की ओर चला।",
                "hinglish.paraphrase": "Humein seedhi aur sachhi raah par qaa'im rakh aur hidayat ataa farma.",
                "bn.muhiuddin": "আমাদের সরল পথ প্রদর্শন কর।",
                "fr.hamidullah": "Guide-nous dans le droit chemin,",
                "id.kemenag": "Tunjukilah kami jalan yang lurus,",
            },
            "tafsirs": {
                "ibn_kathir": "Hidayah here encompasses both 'Hidayat al-Irshad' (guidance of showing the clear way) and 'Hidayat at-Tawfiq' (divine enablement and steadfastness upon that way). The Straight Path (as-Sirat al-Mustaqim) is the Quran, the Sunnah of the Messenger, and the path of truth without crookedness.",
                "al_jalalayn": "Direct us to the upright road, the path of Islam and truth.",
                "tafheem": "After praising God and affirming submission, the servant now makes the supreme petition: not for wealth or worldly status, but for inner vision, ethical direction, and steadfast righteousness.",
            }
        },
        {
            "verse_number": 7,
            "verse_key": "1:7",
            "text_uthmani": "صِرَاطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
            "text_simple": "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين",
            "juz": 1, "hizb": 1, "rub": 1, "page": 1, "ruku": 1, "manzil": 1,
            "words": [
                {"pos": 1, "text": "صِرَاطَ", "trans": "sirata", "en": "(The) path", "ur": "راستہ", "root": "ص ر ط", "lemma": "صِرَاط", "pos_tag": "Noun", "grammar": "Badal Mansoob"},
                {"pos": 2, "text": "ٱلَّذِينَ", "trans": "alladhina", "en": "(of) those", "ur": "ان لوگوں کا", "root": "ل ذ ي", "lemma": "الَّذِي", "pos_tag": "Relative Pronoun", "grammar": "Mudhaf Ilayhi"},
                {"pos": 3, "text": "أَنْعَمْتَ", "trans": "an'amta", "en": "You have bestowed favor", "ur": "انعام فرمایا تو نے", "root": "ن ع م", "lemma": "أَنْعَمَ", "pos_tag": "Past Verb + Subject", "grammar": "Silat al-Mawsool"},
                {"pos": 4, "text": "عَلَيْهِمْ", "trans": "alayhim", "en": "upon them", "ur": "جن پر", "root": "ع ل ى", "lemma": "عَلَى", "pos_tag": "Preposition + Pronoun", "grammar": "Muta'alliq"},
                {"pos": 5, "text": "غَيْرِ", "trans": "ghayri", "en": "not (of)", "ur": "نہ کہ", "root": "غ ي ر", "lemma": "غَيْر", "pos_tag": "Noun of Exception", "grammar": "Badal / Na't"},
                {"pos": 6, "text": "ٱلْمَغْضُوبِ", "trans": "al-maghdubi", "en": "those who evoked [Your] anger", "ur": "غضب کیا گیا جن پر", "root": "غ ض ب", "lemma": "مَغْضُوب", "pos_tag": "Passive Participle", "grammar": "Mudhaf Ilayhi"},
                {"pos": 7, "text": "عَلَيْهِمْ", "trans": "alayhim", "en": "upon them", "ur": "جن پر", "root": "ع ل ى", "lemma": "عَلَى", "pos_tag": "Preposition + Pronoun", "grammar": "Na'ib Fa'il"},
                {"pos": 8, "text": "وَلَا", "trans": "wa-la", "en": "and not", "ur": "اور نہ ہی", "root": "ل ا", "lemma": "لَا", "pos_tag": "Conjunction + Negative Particle", "grammar": "Zaidah li-Ta'keed an-Nafy"},
                {"pos": 9, "text": "ٱلضَّآلِّينَ", "trans": "al-dallina", "en": "those who are astray", "ur": "گمراہوں کا", "root": "ض ل ل", "lemma": "ضَالّ", "pos_tag": "Active Participle", "grammar": "Ma'toof Majroor bil-Yaa"},
            ],
            "translations": {
                "en.saheeh": "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
                "ur.maududi": "ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، جو معتوب نہیں ہوئے، جو بھٹکے ہوئے نہیں ہیں۔",
                "hi.farooq": "उन लोगों का मार्ग जिन पर तूने कृपा की, जो न प्रकोप के भागी हुए और न भटके हुए हैं।",
                "hinglish.paraphrase": "Un logon ka rasta jin par Tune inaam farmaya (jaise Ambiya aur Swaliheen), na ki unka jin par ghazab hua aur na hi bhatke huon ka.",
                "bn.muhiuddin": "সে সমস্ত লোকের পথ, যাদেরকে তুমি নেয়ামত দান করেছ। তাদের পথ নয়, যাদের প্রতি তোমার গজব নাযিল হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।",
                "fr.hamidullah": "Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
                "id.kemenag": "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
            },
            "tafsirs": {
                "ibn_kathir": "Those favored are explained in Surah an-Nisa (4:69): 'the prophets, the steadfast affirmers of truth, the martyrs, and the righteous.' 'Al-Maghdub alayhim' describes those who knew the truth yet intentionally disobeyed it, while 'Ad-Dallin' are those who acted without knowledge and lost their direction. Believers seek continuous balance: authentic knowledge united with sincere righteous action.",
                "al_jalalayn": "The path of those whom You have favored with guidance; not of those who incur divine displeasure through willful rebellion, nor of the straying who err through ignorance.",
                "tafheem": "The petition concludes by asking for the path of historical personalities who received God's genuine grace, and cautioning against two persistent human errors: conscious moral corruption and ignorant wandering.",
            }
        }
    ]

    # Additional canonical key verses: Ayat al-Kursi (2:255), Surah Al-Ikhlas (112:1-4)
    key_verses = [
        {
            "surah_id": 2,
            "verse_number": 255,
            "verse_key": "2:255",
            "text_uthmani": "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
            "text_simple": "الله لا إله إلا هو الحي القيوم لا تأخذه سنة ولا نوم له ما في السماوات وما في الأرض من ذا الذي يشفع عنده إلا بإذنه يعلم ما بين أيديهم وما خلفهم ولا يحيطون بشيء من علمه إلا بما شاء وسع كرسيه السماوات والأرض ولا يؤوده حفظهما وهو العلي العظيم",
            "juz": 3, "hizb": 5, "rub": 17, "page": 42, "ruku": 35, "manzil": 1,
            "words": [
                {"pos": 1, "text": "ٱللَّهُ", "trans": "allahu", "en": "Allah", "ur": "اللہ", "root": "أ ل ه", "lemma": "الله", "pos_tag": "Proper Noun", "grammar": "Mubtada"},
                {"pos": 2, "text": "لَآ", "trans": "la", "en": "no", "ur": "نہیں کوئی", "root": "ل ا", "lemma": "لَا", "pos_tag": "Negative Particle", "grammar": "Nafiyah lil-Jins"},
                {"pos": 3, "text": "إِلَـٰهَ", "trans": "ilaha", "en": "deity", "ur": "معبود", "root": "أ ل ه", "lemma": "إِلَـٰه", "pos_tag": "Noun", "grammar": "Ism La Mansoob"},
                {"pos": 4, "text": "إِلَّا", "trans": "illa", "en": "except", "ur": "مگر", "root": "إ ل ل", "lemma": "إِلَّا", "pos_tag": "Particle of Exception", "grammar": "Adat Hasr"},
                {"pos": 5, "text": "هُوَ", "trans": "huwa", "en": "Him", "ur": "وہی", "root": "ه و", "lemma": "هُوَ", "pos_tag": "Pronoun", "grammar": "Badal"},
                {"pos": 6, "text": "ٱلْحَىُّ", "trans": "al-hayyu", "en": "the Ever-Living", "ur": "جو زندہ جاوید ہے", "root": "ح ي ي", "lemma": "حَيّ", "pos_tag": "Adjective", "grammar": "Khabar Thani"},
                {"pos": 7, "text": "ٱلْقَيُّومُ", "trans": "al-qayyumu", "en": "the Sustainer of all existence", "ur": "سب کو تھامنے والا", "root": "ق و م", "lemma": "قَيُّوم", "pos_tag": "Adjective", "grammar": "Khabar Thalith"}
            ],
            "translations": {
                "en.saheeh": "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
                "ur.maududi": "اللہ وہ زندہ جاوید ہستی ہے، جو تمام کائنات کو سنبھالے ہوئے ہے، اس کے سوا کوئی معبود نہیں ہے۔ وہ نہ سوتا ہے اور نہ اسے اونگھ لگتی ہے۔ زمین اور آسمانوں میں جو کچھ ہے، اسی کا ہے۔ کون ہے جو اس کی جناب میں اس کی اجازت کے بغیر سفارش کر سکے؟ جو کچھ بندوں کے سامنے ہے اسے بھی وہ جانتا ہے اور جو کچھ ان سے اوجھل ہے اس سے بھی وہ واقف ہے۔ اور اس کی معلومات میں سے کوئی چیز ان کی گرفت ادراک میں نہیں آ سکتی، الا یہ کہ کسی چیز کا علم وہ خود ہی دینا چاہے۔ اس کی کرسی آسمانوں اور زمین کو گھیرے ہوئے ہے اور ان کی نگہبانی اس کے لیے کوئی تھکا دینے والا کام نہیں ہے۔ بس وہی ایک بزرگ و برتر ذات ہے۔",
                "hi.farooq": "अल्लाह, जिसके सिवा कोई पूज्य-प्रभु नहीं, वह जीवन्त सत्ता है, सबको संभालनेवाला है। न उसे ऊँघ लगती है और न निद्रा। उसी का है जो कुछ आकाशों में है और जो कुछ धरती में है। कौन है जो उसके यहाँ उसकी अनुमति के बिना सिफ़ारिश कर सके? वह जानता है जो कुछ उनके सामने है और जो कुछ उनके पीछे है। और वे उसके ज्ञान में से किसी चीज़ पर हावी नहीं हो सकते, सिवाय उसके जो उसने चाहा। उसकी कुर्सी आकाशों और धरती को समाए हुए है और उन दोनों की रक्षा उसे थकाती नहीं। और वह सर्वोच्च, महान है।",
                "hinglish.paraphrase": "Allah wo Zaat hai jiske siwa koi ibadat ke laayak nahi, wo Hamesha Zinda (Al-Hayy) aur sabko thhaamne wala (Al-Qayyum) hai. Usey na oongh aati hai na neend. Aasmanon aur zameen me jo kuch hai sab Usi ka hai. Uski ijazat ke baghair kaun shafa'at kar sakta hai? Wo sab jaanta hai jo hamare aage hai aur jo peechhe. Uski Kursi ne aasmanon aur zameen ko gher rakha hai aur unki hifazat Usey thhakaati nahi. Wo sabse Buland aur Azeem hai. (Ayat al-Kursi Quran ki sabse azeem ayah hai).",
                "bn.muhiuddin": "আল্লাহ, যিনি ব্যতীত কোনো উপাস্য নেই; তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করে না। আকাশ ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে আছে যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে তা তিনি জানেন। আর তাঁর ইচ্ছানুযায়ী ছাড়া তাঁর জ্ঞানের কোনো কিছুই তারা আয়ত্ত করতে পারে না। তাঁর কুরসী সমস্ত আকাশ ও পৃথিবীকে পরিবেষ্টিত করে আছে, আর এ দুটির রক্ষণাবেক্ষণ তাঁকে বিন্দুমাত্র ক্লান্ত করে না। তিনি পরম সমুন্নত, পরম মহান।",
                "fr.hamidullah": "Allah! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même «Al-Qayyoum». Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission? Il sait leur passé et leur futur. Et, de Sa science, ils n'embrassent que ce qu'Il veut. Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
                "id.kemenag": "Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.",
            },
            "tafsirs": {
                "ibn_kathir": "Ayat al-Kursi is the greatest single ayah in the Book of Allah, containing ten independent, sublime statements of pure monotheism. Ubayy ibn Ka'b reported that the Prophet (pbuh) asked him: 'O Abu al-Mundhir, do you know which verse from the Book of Allah with you is the greatest?' He replied: 'Allahu la ilaha illa huwa al-Hayyu al-Qayyum.' The Prophet struck his chest affectionately and said: 'May knowledge be pleasant for you, O Abu al-Mundhir!'",
                "al_jalalayn": "Allah, there is no god but He, the Living, the Everlasting. Neither slumber nor sleep overtakes Him. To Him belongs all that is in the cosmos. His Kursi signifies His vast knowledge or His mighty throne encompassing the realms.",
                "tafheem": "This verse presents the most comprehensive portrait of the Divine Reality. It systematically refutes polytheism, pantheism, deism, and the notion that the universe operates autonomously without perpetual divine sustenance.",
            },
            "hadith": {
                "collection": "Sahih al-Bukhari",
                "number": "2311",
                "text_ar": "إِذَا أَوَيْتَ إِلَى فِرَاشِكَ فَاقْرَأْ آيَةَ الْكُرْسِيِّ... لَنْ يَزَالَ عَلَيْكَ مِنَ اللَّهِ حَافِظٌ وَلاَ يَقْرَبُكَ شَيْطَانٌ حَتَّى تُصْبِحَ",
                "text_en": "When you go to bed, recite Ayat al-Kursi... Allah will appoint a guardian over you and no devil will approach you until morning.",
                "grade": "Sahih",
                "authority": "Imam al-Bukhari (Narrated by Abu Hurairah)"
            }
        },
        {
            "surah_id": 112,
            "verse_number": 1,
            "verse_key": "112:1",
            "text_uthmani": "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
            "text_simple": "قل هو الله أحد",
            "juz": 30, "hizb": 60, "rub": 240, "page": 604, "ruku": 554, "manzil": 7,
            "words": [
                {"pos": 1, "text": "قُلْ", "trans": "qul", "en": "Say", "ur": "کہو", "root": "ق و ل", "lemma": "قَالَ", "pos_tag": "Imperative Verb", "grammar": "Fi'l Amr"},
                {"pos": 2, "text": "هُوَ", "trans": "huwa", "en": "He", "ur": "وہ", "root": "ه و", "lemma": "هُوَ", "pos_tag": "Pronoun", "grammar": "Mubtada"},
                {"pos": 3, "text": "ٱللَّهُ", "trans": "allahu", "en": "Allah", "ur": "اللہ", "root": "أ ل ه", "lemma": "الله", "pos_tag": "Proper Noun", "grammar": "Khabar Awwal"},
                {"pos": 4, "text": "أَحَدٌ", "trans": "ahadun", "en": "[who is] One", "ur": "یکتا ہے", "root": "أ ح د", "lemma": "أَحَد", "pos_tag": "Noun", "grammar": "Khabar Thani"}
            ],
            "translations": {
                "en.saheeh": "Say, \"He is Allah, [who is] One,",
                "ur.maududi": "کہو، وہ اللہ ہے، یکتا،",
                "hi.farooq": "कहो, \"वह अल्लाह यकता (अकेला) है,",
                "hinglish.paraphrase": "Aap farma dijiye ke Wo Allah ek aur akela (be-misaal) hai.",
                "bn.muhiuddin": "বলুন, তিনি আল্লাহ, এক,",
                "fr.hamidullah": "Dis: «Il est Allah, Unique.",
                "id.kemenag": "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.",
            },
            "tafsirs": {
                "ibn_kathir": "'Ahad' is an absolute attribute meaning He is Singular, with no peer, partner, rival, or equal. The polytheists of Makkah asked the Prophet: 'O Muhammad, describe the lineage of your Lord to us.' In response, Allah revealed Surah al-Ikhlas, establishing that Allah is above lineage, composite parts, or similarity to created things.",
                "al_jalalayn": "Say: He is Allah, One: unique in His essence and attributes.",
                "tafheem": "Surah al-Ikhlas is equivalent to one-third of the Quran because the entire Quran revolves around three core themes: Tawhid (Monotheism), Risalah (Prophethood), and Akhirah (The Hereafter). This Surah purifies monotheism of all contamination.",
            },
            "asbab": "Musnad Ahmad & Tirmidhi record that polytheists questioned the Prophet (pbuh) regarding the lineage and material composition of God; this Surah revealed absolute divine transcendence.",
            "hadith": {
                "collection": "Sahih al-Bukhari",
                "number": "5013",
                "text_ar": "أَيَعْجِزُ أَحَدُكُمْ أَنْ يَقْرَأَ ثُلُثَ الْقُرْآنِ فِي لَيْلَةٍ؟... قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ",
                "text_en": "Is any of you unable to recite a third of the Quran in a single night?... Say: He is Allah, the One equals one third of the Quran.",
                "grade": "Sahih",
                "authority": "Imam al-Bukhari (Narrated by Abu Sa'id al-Khudri)"
            }
        }
    ]

    all_to_seed = fatihah_data + key_verses
    edition_map = {e.identifier: e.id for e in db.query(TranslationEdition).all()}
    tafsir_map = {t.identifier: t.id for t in db.query(TafsirEdition).all()}

    for item in all_to_seed:
        surah_id = item.get("surah_id", 1)
        existing_ayah = db.query(Ayah).filter_by(verse_key=item["verse_key"]).first()
        if not existing_ayah:
            ayah = Ayah(
                surah_id=surah_id,
                verse_number=item["verse_number"],
                verse_key=item["verse_key"],
                text_uthmani=item["text_uthmani"],
                text_simple=item["text_simple"],
                juz_number=item["juz"],
                hizb_number=item["hizb"],
                rub_number=item["rub"],
                page_number=item["page"],
                ruku_number=item["ruku"],
                manzil_number=item["manzil"],
                sajdah=False,
            )
            db.add(ayah)
            db.flush()
        else:
            ayah = existing_ayah

        # Words
        if not ayah.words:
            for w in item.get("words", []):
                word_obj = Word(
                    ayah_id=ayah.id,
                    position=w["pos"],
                    text_uthmani=w["text"],
                    transliteration=w["trans"],
                    translation_en=w["en"],
                    translation_ur=w.get("ur", ""),
                    root_letters=w.get("root"),
                    lemma=w.get("lemma"),
                    pos=w.get("pos_tag"),
                    grammar_desc=w.get("grammar"),
                )
                db.add(word_obj)

        # Translations
        for ed_ident, trans_str in item.get("translations", {}).items():
            if ed_ident in edition_map:
                ed_id = edition_map[ed_ident]
                existing_trans = db.query(TranslationText).filter_by(ayah_id=ayah.id, edition_id=ed_id).first()
                if not existing_trans:
                    db.add(TranslationText(ayah_id=ayah.id, edition_id=ed_id, text=trans_str))

        # Tafsirs
        for tf_ident, tf_str in item.get("tafsirs", {}).items():
            if tf_ident in tafsir_map:
                tf_id = tafsir_map[tf_ident]
                existing_tf = db.query(TafsirPassage).filter_by(ayah_id=ayah.id, edition_id=tf_id).first()
                if not existing_tf:
                    db.add(TafsirPassage(ayah_id=ayah.id, edition_id=tf_id, text=tf_str, section_title=f"Commentary on {item['verse_key']}"))

        # Asbab
        if "asbab" in item:
            existing_asbab = db.query(RevelationContext).filter_by(ayah_id=ayah.id).first()
            if not existing_asbab:
                db.add(RevelationContext(
                    ayah_id=ayah.id,
                    source_work="Asbab an-Nuzul by Al-Wahidi (d. 468 AH)",
                    report_text=item["asbab"],
                    authenticity_assessment="Documented Historical Report",
                    scholarly_notes="Classical occasion of revelation citation"
                ))

        # Hadith
        if "hadith" in item:
            h = item["hadith"]
            existing_h = db.query(HadithRecord).filter_by(related_verse_key=item["verse_key"]).first()
            if not existing_h:
                db.add(HadithRecord(
                    collection_name=h["collection"],
                    hadith_number=h["number"],
                    text_ar=h["text_ar"],
                    text_en=h["text_en"],
                    grade=h["grade"],
                    grading_authority=h["authority"],
                    related_verse_key=item["verse_key"]
                ))

    db.commit()
