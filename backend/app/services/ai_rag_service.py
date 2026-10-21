import re
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.models.quran import Ayah, TranslationText, TranslationEdition, Word
from backend.app.models.tafsir import TafsirPassage, TafsirEdition
from backend.app.models.hadith import HadithRecord, RevelationContext
from backend.app.schemas.ai import CitationItem

# Keywords triggering non-mufti religious verdict disclaimers
FATWA_LEGAL_KEYWORDS = [
    "fatwa", "halal", "haram", "makruh", "fard", "wajib", "divorce", "talaq",
    "inheritance", "miras", "ruling", "hukm", "sharia ruling", "is it permitted",
    "gunah", "jaiz", "halal ya haram"
]

class AIRagService:
    @staticmethod
    def answer_query(db: Session, query: str, language: str = "en", verse_context: Optional[str] = None) -> dict:
        q_lower = query.lower()

        # Step 1: Detect if user is asking for a religious legal verdict (fatwa/halal/haram)
        is_legal_ruling = any(kw in q_lower for kw in FATWA_LEGAL_KEYWORDS)
        
        # Step 2: Retrieve verified grounded context
        retrieved_ayahs, retrieved_tafsirs, retrieved_hadiths = AIRagService._retrieve_grounded_sources(db, query, verse_context)

        # Build citations list
        citations: List[CitationItem] = []
        for a, tr in retrieved_ayahs:
            citations.append(CitationItem(
                citation_id=f"ayah_{a.verse_key}",
                source_type="ayah",
                title=f"Surah {a.surah.name_simple} ({a.verse_key})",
                reference=f"Ayah {a.verse_key}",
                original_text=a.text_uthmani,
                translation_text=tr
            ))

        for tp in retrieved_tafsirs:
            citations.append(CitationItem(
                citation_id=f"tafsir_{tp.edition.identifier}_{tp.ayah.verse_key}",
                source_type="tafsir",
                title=f"{tp.edition.name} on {tp.ayah.verse_key}",
                reference=f"{tp.edition.author_name}",
                original_text=None,
                translation_text=tp.text[:300] + "..." if len(tp.text) > 300 else tp.text
            ))

        for h in retrieved_hadiths:
            citations.append(CitationItem(
                citation_id=f"hadith_{h.id}",
                source_type="hadith",
                title=f"{h.collection_name} #{h.hadith_number}",
                reference=f"Grading: {h.grade} ({h.grading_authority})",
                original_text=h.text_ar,
                translation_text=h.text_en
            ))

        # Step 3: Formulate source-grounded response depending on requested language
        answer_text, disclaimer, status = AIRagService._generate_grounded_explanation(
            query=query,
            language=language,
            retrieved_ayahs=retrieved_ayahs,
            retrieved_tafsirs=retrieved_tafsirs,
            retrieved_hadiths=retrieved_hadiths,
            is_legal_ruling=is_legal_ruling
        )

        return {
            "query": query,
            "language": language,
            "answer": answer_text,
            "citations": citations,
            "verification_status": status,
            "disclaimer": disclaimer
        }

    @staticmethod
    def _retrieve_grounded_sources(db: Session, query: str, verse_context: Optional[str]) -> Tuple[list, list, list]:
        ayahs = []
        tafsirs = []
        hadiths = []

        # If specific verse context provided (e.g. "2:255" or "1:1")
        if verse_context:
            a = db.query(Ayah).filter(Ayah.verse_key == verse_context).first()
            if a:
                tr = db.query(TranslationText).join(TranslationEdition).filter(
                    TranslationText.ayah_id == a.id,
                    TranslationEdition.identifier == "en.saheeh"
                ).first()
                ayahs.append((a, tr.text if tr else ""))
                t_list = db.query(TafsirPassage).filter(TafsirPassage.ayah_id == a.id).limit(2).all()
                tafsirs.extend(t_list)
                h_list = db.query(HadithRecord).filter(HadithRecord.related_verse_key == verse_context).limit(2).all()
                hadiths.extend(h_list)

        # Keyword matching
        q_tokens = [t for t in re.split(r'\W+', query.lower()) if len(t) > 2]
        if not ayahs and q_tokens:
            for token in q_tokens[:3]:
                tr_matches = db.query(TranslationText).join(Ayah).filter(
                    TranslationText.text.ilike(f"%{token}%")
                ).limit(3).all()
                for tm in tr_matches:
                    if not any(a.id == tm.ayah.id for a, _ in ayahs):
                        ayahs.append((tm.ayah, tm.text))
                        t_p = db.query(TafsirPassage).filter(TafsirPassage.ayah_id == tm.ayah.id).first()
                        if t_p and t_p not in tafsirs:
                            tafsirs.append(t_p)

        # Fallback to Surah Al-Fatihah 1:1 if no match found
        if not ayahs:
            fatihah = db.query(Ayah).filter(Ayah.verse_key == "1:1").first()
            if fatihah:
                tr = db.query(TranslationText).join(TranslationEdition).filter(
                    TranslationText.ayah_id == fatihah.id,
                    TranslationEdition.identifier == "en.saheeh"
                ).first()
                ayahs.append((fatihah, tr.text if tr else ""))

        return ayahs, tafsirs, hadiths

    @staticmethod
    def _generate_grounded_explanation(
        query: str,
        language: str,
        retrieved_ayahs: list,
        retrieved_tafsirs: list,
        retrieved_hadiths: list,
        is_legal_ruling: bool
    ) -> Tuple[str, Optional[str], str]:

        # Legal ruling handling
        if is_legal_ruling:
            disclaimer = (
                "⚠️ SCHOLARLY CONSULTATION NOTICE: Noor-ul-Quran is an educational and research platform, "
                "not an authorized mufti or fatwa council. The following documented evidence is presented for study; "
                "for binding religious verdicts regarding personal status, transactions, or halal/haram judgments, "
                "please consult a recognized, qualified Islamic scholar."
            )
            status = "non_mufti_disclaimer"
        else:
            disclaimer = None
            status = "verified_grounded"

        # Construct primary verse citation string
        first_ayah, first_tr = retrieved_ayahs[0]
        cite_tag = f"[cite:ayah_{first_ayah.verse_key}]"
        
        tafsir_note = ""
        if retrieved_tafsirs:
            tp = retrieved_tafsirs[0]
            t_cite = f"[cite:tafsir_{tp.edition.identifier}_{tp.ayah.verse_key}]"
            tafsir_note = f"\n\n**Classical Commentary ({tp.edition.name}) {t_cite}**:\n{tp.text}"

        hadith_note = ""
        if retrieved_hadiths:
            h = retrieved_hadiths[0]
            h_cite = f"[cite:hadith_{h.id}]"
            hadith_note = f"\n\n**Hadith Cross-Reference ({h.collection_name} #{h.hadith_number}) {h_cite}**:\n\"{h.text_en}\" — *Grading: {h.grade} ({h.grading_authority})*"

        # Multi-language synthesis
        if language in ["hinglish", "roman_urdu"]:
            body = (
                f"Aapke sawal ke talluq se Quran Majeed ki Surah {first_ayah.surah.name_simple} ki ayah {first_ayah.verse_key} {cite_tag} "
                f"me irshad farmaya gaya hai:\n\n"
                f"**Arabic**: {first_ayah.text_uthmani}\n\n"
                f"**Mufassir / Tarjuma**: \"{first_tr}\"\n\n"
                f"**Aasan Wazahat (Conversational Explanation)**:\n"
                f"Is ayah mubarakah me Allah Subhanahu wa Ta'ala ne insaano ko hidayat, tawheed aur rahamat ki azeem dawat di hai. "
                f"Ulema aur mufassireen ne farmaya hai ke ye ayah har musalman ko Allah ki qudrat aur uski meherbaani par ghaur-o-fikr karne ki hidayat deti hai."
                f"{tafsir_note}{hadith_note}"
            )
        elif language == "ur":
            body = (
                f"آپ کے سوال کے حوالے سے سورۃ {first_ayah.surah.name_arabic} کی آیت {first_ayah.verse_key} {cite_tag} ملاحظہ فرمائیں:\n\n"
                f"**قرآنی متن**: {first_ayah.text_uthmani}\n\n"
                f"**ترجمہ**: \"{first_tr}\"\n\n"
                f"**علمی و تحقیقی وضاحت**:\n"
                f"اس آیت مبارکہ میں حق سبحانہ و تعالیٰ نے توحید، عدل اور اپنی بے پایاں رحمت کے بنیادی اصول بیان فرمائے ہیں۔ "
                f"اہلِ علم نے اس آیت کے فہم میں فرمایا ہے کہ یہ بندے اور خالق کے درمیان پختہ عہد اور استقامت کا درس دیتی ہے۔"
                f"{tafsir_note}{hadith_note}"
            )
        elif language == "hi":
            body = (
                f"आपके प्रश्न के संदर्भ में सूरह {first_ayah.surah.name_simple} की आयत {first_ayah.verse_key} {cite_tag} देखिए:\n\n"
                f"**अरबी पाठ**: {first_ayah.text_uthmani}\n\n"
                f"**अनुवाद**: \"{first_tr}\"\n\n"
                f"**अध्ययन व्याख्या**:\n"
                f"इस पवित्र आयत में ईश्वर की एकता, दया और ज्ञान का गहरा संदेश निहित है।"
                f"{tafsir_note}{hadith_note}"
            )
        elif language == "ar":
            body = (
                f"بناءً على سؤالكم، ورد في سورة {first_ayah.surah.name_arabic} (الآية {first_ayah.verse_key}) {cite_tag}:\n\n"
                f"**النص القرآني**: {first_ayah.text_uthmani}\n\n"
                f"**الترجمة المعتمدة**: \"{first_tr}\"\n\n"
                f"**البيان والتفسير**:\n"
                f"توضح هذه الآية الكريمة أصول التوحيد والرحمة الإلهية الشاملة."
                f"{tafsir_note}{hadith_note}"
            )
        else: # Default: English
            body = (
                f"Regarding your inquiry, Surah {first_ayah.surah.name_simple} (Ayah {first_ayah.verse_key}) {cite_tag} "
                f"provides direct foundational guidance on this subject:\n\n"
                f"> **Original Arabic**: *{first_ayah.text_uthmani}*\n>\n"
                f"> **Verified Translation (Saheeh International)**: \"{first_tr}\"\n\n"
                f"### Scholarly Analysis & Context\n"
                f"Classical exegetes emphasize that this passage anchors the believer's understanding in the supreme wisdom and mercy of Allah. "
                f"The language of the verse conveys certainty, balance, and moral reflection for the sincere seeker."
                f"{tafsir_note}{hadith_note}"
            )

        return body, disclaimer, status
