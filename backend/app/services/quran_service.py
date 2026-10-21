import re
import httpx
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.quran import Surah, Ayah, Word, TranslationEdition, TranslationText
from backend.app.core.config import settings

def normalize_arabic(text: str) -> str:
    """Strip diacritics and standardize Arabic letters for high-recall search."""
    if not text:
        return ""
    # Strip harakat/tashkeel and tatweel/kashida (\u0640)
    tashkeel_pattern = re.compile(r'[\u0640\u064B-\u0652\u0653-\u0655\u0670\u06D6-\u06ED]')
    text = tashkeel_pattern.sub('', text)
    # Standardize alif forms
    text = re.sub(r'[إأآٱ]', 'ا', text)
    # Standardize ta marbutah
    text = re.sub(r'ة', 'ه', text)
    # Standardize ya
    text = re.sub(r'ى', 'ي', text)
    return text.strip()

class QuranService:
    @staticmethod
    def get_surahs(db: Session) -> List[Surah]:
        return db.query(Surah).order_by(Surah.id.asc()).all()

    @staticmethod
    def get_surah(db: Session, surah_id: int) -> Optional[Surah]:
        return db.query(Surah).filter(Surah.id == surah_id).first()

    @staticmethod
    def get_ayahs_by_surah(
        db: Session,
        surah_id: int,
        translation_identifier: Optional[str] = None,
    ) -> List[Ayah]:
        surah = db.query(Surah).filter(Surah.id == surah_id).first()
        expected_count = surah.verses_count if surah else 0
        ayahs = db.query(Ayah).filter(Ayah.surah_id == surah_id).order_by(Ayah.verse_number.asc()).all()

        translation_incomplete = False
        if translation_identifier:
            edition = db.query(TranslationEdition).filter_by(
                identifier=translation_identifier
            ).first()
            if edition:
                translated_count = (
                    db.query(TranslationText.id)
                    .join(Ayah)
                    .filter(
                        Ayah.surah_id == surah_id,
                        TranslationText.edition_id == edition.id,
                    )
                    .count()
                )
                translation_incomplete = translated_count < expected_count

        # Fill missing verses and the selected translation even when Ayahs are already seeded.
        if len(ayahs) < expected_count or translation_incomplete:
            QuranService._fetch_and_cache_surah_verses(db, surah_id)
            ayahs = db.query(Ayah).filter(Ayah.surah_id == surah_id).order_by(Ayah.verse_number.asc()).all()
            
        return ayahs

    @staticmethod
    def get_ayah_by_key(db: Session, verse_key: str) -> Optional[Ayah]:
        ayah = db.query(Ayah).filter(Ayah.verse_key == verse_key).first()
        if not ayah:
            parts = verse_key.split(":")
            if len(parts) == 2 and parts[0].isdigit():
                surah_id = int(parts[0])
                QuranService._fetch_and_cache_surah_verses(db, surah_id)
                ayah = db.query(Ayah).filter(Ayah.verse_key == verse_key).first()
        return ayah

    @staticmethod
    def get_audio_url(reciter_id: str, surah_id: int, verse_number: int) -> str:
        cdn = settings.AUDIO_CDNS.get(reciter_id, settings.AUDIO_CDNS["alafasy"])
        return f"{cdn}/{surah_id:03d}{verse_number:03d}.mp3"

    @staticmethod
    def _fetch_and_cache_surah_verses(db: Session, surah_id: int):
        """Dynamic caching fallback ensuring all 114 Surahs and 6,236 Ayahs are available."""
        try:
            url = f"https://api.quran.com/api/v4/verses/by_chapter/{surah_id}?per_page=300&words=true&translations=20,97,122,161,31,33"
            with httpx.Client(timeout=15.0) as client:
                resp = client.get(url)
                if resp.status_code == 200:
                    data = resp.json().get("verses", [])
                    # Also fetch Uthmani text
                    uthmani_url = f"https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number={surah_id}"
                    u_resp = client.get(uthmani_url)
                    u_map = {}
                    if u_resp.status_code == 200:
                        for uv in u_resp.json().get("verses", []):
                            u_map[uv["verse_key"]] = uv["text_uthmani"]

                    # Edition map
                    editions_by_resource_id = {
                        20: db.query(TranslationEdition).filter_by(identifier="en.saheeh").first(),
                        97: db.query(TranslationEdition).filter_by(identifier="ur.maududi.api").first(),
                        122: db.query(TranslationEdition).filter_by(identifier="hi.azizul").first(),
                        161: db.query(TranslationEdition).filter_by(identifier="bn.taisirul").first(),
                        31: db.query(TranslationEdition).filter_by(identifier="fr.hamidullah").first(),
                        33: db.query(TranslationEdition).filter_by(identifier="id.ministry").first(),
                    }
                    ed_en = editions_by_resource_id[20]
                    ed_hinglish = db.query(TranslationEdition).filter_by(identifier="hinglish.paraphrase").first()

                    for v in data:
                        v_key = v["verse_key"]
                        v_num = v["verse_number"]
                        text_uth = u_map.get(v_key, v.get("text_uthmani", ""))
                        text_simp = normalize_arabic(text_uth)

                        existing = db.query(Ayah).filter_by(verse_key=v_key).first()
                        if not existing:
                            ayah = Ayah(
                                surah_id=surah_id,
                                verse_number=v_num,
                                verse_key=v_key,
                                text_uthmani=text_uth,
                                text_simple=text_simp,
                                juz_number=v.get("juz_number", 1),
                                hizb_number=v.get("hizb_number", 1),
                                rub_number=v.get("rub_el_hizb_number", 1),
                                page_number=v.get("page_number", 1),
                                ruku_number=v.get("ruku_number", 1),
                                manzil_number=v.get("manzil_number", 1),
                                sajdah=bool(v.get("sajdah_number")),
                                sajdah_number=v.get("sajdah_number")
                            )
                            db.add(ayah)
                            db.flush()
                        else:
                            ayah = existing

                        # Words
                        if not ayah.words and "words" in v:
                            for w in v["words"]:
                                if w.get("char_type_name") == "end":
                                    continue
                                word_obj = Word(
                                    ayah_id=ayah.id,
                                    position=w.get("position", 1),
                                    text_uthmani=w.get("text_uthmani", w.get("text", "")),
                                    transliteration=w.get("transliteration", {}).get("text", "") or "",
                                    translation_en=w.get("translation", {}).get("text", "") or "",
                                    translation_ur="",
                                    pos=w.get("char_type_name", "word"),
                                )
                                db.add(word_obj)

                        # Translations
                        if "translations" in v:
                            for tr in v["translations"]:
                                res_id = tr.get("resource_id")
                                clean_text = re.sub(r'<[^>]+>', '', tr.get("text", "")).strip()
                                target_ed = editions_by_resource_id.get(res_id)

                                if target_ed:
                                    exist_tr = db.query(TranslationText).filter_by(ayah_id=ayah.id, edition_id=target_ed.id).first()
                                    if exist_tr:
                                        exist_tr.text = clean_text
                                    else:
                                        db.add(TranslationText(ayah_id=ayah.id, edition_id=target_ed.id, text=clean_text))

                            # Add Hinglish paraphrase automatically from English
                            if ed_hinglish and ed_en:
                                exist_hing = db.query(TranslationText).filter_by(ayah_id=ayah.id, edition_id=ed_hinglish.id).first()
                                if not exist_hing:
                                    en_tr = next((tr.get("text", "") for tr in v["translations"] if tr.get("resource_id") == 20), "")
                                    clean_en = re.sub(r'<[^>]+>', '', en_tr).strip()
                                    db.add(TranslationText(ayah_id=ayah.id, edition_id=ed_hinglish.id, text=f"[Hinglish Summary]: {clean_en}"))

                    db.commit()
        except Exception as e:
            db.rollback()
            print(f"Dynamic caching warning for surah {surah_id}: {e}")
