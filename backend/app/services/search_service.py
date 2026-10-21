from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.models.quran import Ayah, Surah, TranslationText, TranslationEdition, ArabicRoot, Word
from backend.app.services.quran_service import normalize_arabic, QuranService

class SearchService:
    @staticmethod
    def universal_search(db: Session, query: str, limit: int = 30) -> dict:
        q = query.strip()
        if not q:
            return {"query": query, "total_matches": 0, "results": []}

        norm_q = normalize_arabic(q)
        results = []
        seen_keys = set()

        # 0. Direct Verse Key search (e.g. "2:255", "1:1")
        if ":" in q:
            direct_ayah = QuranService.get_ayah_by_key(db, q)
            if direct_ayah and direct_ayah.verse_key not in seen_keys:
                seen_keys.add(direct_ayah.verse_key)
                en_trans = db.query(TranslationText).join(TranslationEdition).filter(
                    TranslationText.ayah_id == direct_ayah.id,
                    TranslationEdition.identifier == "en.saheeh"
                ).first()
                results.append({
                    "verse_key": direct_ayah.verse_key,
                    "surah_id": direct_ayah.surah_id,
                    "surah_name_simple": direct_ayah.surah.name_simple,
                    "surah_name_arabic": direct_ayah.surah.name_arabic,
                    "verse_number": direct_ayah.verse_number,
                    "text_uthmani": direct_ayah.text_uthmani,
                    "translation_text": en_trans.text if en_trans else "",
                    "translation_author": "Saheeh International",
                    "match_type": "verse_reference",
                    "highlight": q
                })

        # 0b. Surah Name Search (e.g. "Baqarah", "Mulk", "Yasin")
        surah_matches = db.query(Surah).filter(
            or_(
                Surah.name_simple.ilike(f"%{q}%"),
                Surah.name_english.ilike(f"%{q}%"),
                Surah.name_arabic.contains(q)
            )
        ).limit(5).all()
        for sm in surah_matches:
            first_v = db.query(Ayah).filter(Ayah.surah_id == sm.id, Ayah.verse_number == 1).first()
            if not first_v:
                QuranService.get_ayahs_by_surah(db, sm.id)
                first_v = db.query(Ayah).filter(Ayah.surah_id == sm.id, Ayah.verse_number == 1).first()
            if first_v and first_v.verse_key not in seen_keys:
                seen_keys.add(first_v.verse_key)
                en_trans = db.query(TranslationText).join(TranslationEdition).filter(
                    TranslationText.ayah_id == first_v.id,
                    TranslationEdition.identifier == "en.saheeh"
                ).first()
                results.append({
                    "verse_key": first_v.verse_key,
                    "surah_id": first_v.surah_id,
                    "surah_name_simple": sm.name_simple,
                    "surah_name_arabic": sm.name_arabic,
                    "verse_number": first_v.verse_number,
                    "text_uthmani": first_v.text_uthmani,
                    "translation_text": en_trans.text if en_trans else f"Opening verse of Surah {sm.name_simple}",
                    "translation_author": "Saheeh International",
                    "match_type": "surah_match",
                    "highlight": q
                })

        # 1. Arabic Normalized Search
        ayahs_ar = db.query(Ayah).filter(
            or_(
                Ayah.text_simple.contains(norm_q),
                Ayah.text_uthmani.contains(q)
            )
        ).limit(limit).all()

        for a in ayahs_ar:
            if a.verse_key not in seen_keys:
                seen_keys.add(a.verse_key)
                # Grab English translation
                en_trans = db.query(TranslationText).join(TranslationEdition).filter(
                    TranslationText.ayah_id == a.id,
                    TranslationEdition.identifier == "en.saheeh"
                ).first()

                results.append({
                    "verse_key": a.verse_key,
                    "surah_id": a.surah_id,
                    "surah_name_simple": a.surah.name_simple,
                    "surah_name_arabic": a.surah.name_arabic,
                    "verse_number": a.verse_number,
                    "text_uthmani": a.text_uthmani,
                    "translation_text": en_trans.text if en_trans else "",
                    "translation_author": "Saheeh International",
                    "match_type": "arabic_text",
                    "highlight": q
                })

        # 2. Translation Search (English, Urdu, Hindi, Hinglish)
        if len(results) < limit:
            trans_matches = db.query(TranslationText).join(Ayah).join(TranslationEdition).filter(
                TranslationText.text.ilike(f"%{q}%")
            ).limit(limit - len(results)).all()

            for tm in trans_matches:
                a = tm.ayah
                if a.verse_key not in seen_keys:
                    seen_keys.add(a.verse_key)
                    results.append({
                        "verse_key": a.verse_key,
                        "surah_id": a.surah_id,
                        "surah_name_simple": a.surah.name_simple,
                        "surah_name_arabic": a.surah.name_arabic,
                        "verse_number": a.verse_number,
                        "text_uthmani": a.text_uthmani,
                        "translation_text": tm.text,
                        "translation_author": tm.edition.name,
                        "match_type": "translation",
                        "highlight": q
                    })

        # 3. Root Search (e.g. "ر ح م" or "رحم")
        if len(results) < limit:
            root_matches = db.query(ArabicRoot).filter(
                or_(
                    ArabicRoot.root_letters.contains(norm_q),
                    ArabicRoot.transliteration.ilike(f"%{q}%"),
                    ArabicRoot.primary_meanings.ilike(f"%{q}%")
                )
            ).all()

            for rm in root_matches:
                # Find words with this root
                words_with_root = db.query(Word).filter(Word.root_letters == rm.root_letters).limit(5).all()
                for w in words_with_root:
                    a = w.ayah
                    if a.verse_key not in seen_keys:
                        seen_keys.add(a.verse_key)
                        en_trans = db.query(TranslationText).join(TranslationEdition).filter(
                            TranslationText.ayah_id == a.id,
                            TranslationEdition.identifier == "en.saheeh"
                        ).first()

                        results.append({
                            "verse_key": a.verse_key,
                            "surah_id": a.surah_id,
                            "surah_name_simple": a.surah.name_simple,
                            "surah_name_arabic": a.surah.name_arabic,
                            "verse_number": a.verse_number,
                            "text_uthmani": a.text_uthmani,
                            "translation_text": en_trans.text if en_trans else "",
                            "translation_author": f"Root Match: {rm.root_letters} ({rm.transliteration})",
                            "match_type": "arabic_root",
                            "highlight": f"Root {rm.root_letters}: {rm.primary_meanings}"
                        })

        return {
            "query": query,
            "total_matches": len(results),
            "results": results[:limit]
        }
