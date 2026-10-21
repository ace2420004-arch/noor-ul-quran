from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.quran_service import QuranService
from backend.app.schemas.quran import SurahSummarySchema, AyahSchema, WordSchema, TranslationItemSchema

router = APIRouter(prefix="/quran", tags=["Quran"])

@router.get("/surahs", response_model=List[SurahSummarySchema])
def list_surahs(db: Session = Depends(get_db)):
    """Returns all 114 Surahs with metadata."""
    surahs = QuranService.get_surahs(db)
    return [
        SurahSummarySchema(
            id=s.id,
            name_arabic=s.name_arabic,
            name_simple=s.name_simple,
            name_complex=s.name_complex,
            name_english=s.name_english,
            revelation_place=s.revelation_place,
            revelation_order=s.revelation_order,
            bismillah_pre=s.bismillah_pre,
            verses_count=s.verses_count,
            start_page=s.start_page,
            end_page=s.end_page,
        )
        for s in surahs
    ]

@router.get("/surahs/{surah_id}", response_model=SurahSummarySchema)
def get_surah(surah_id: int, db: Session = Depends(get_db)):
    """Returns single Surah metadata."""
    surah = QuranService.get_surah(db, surah_id)
    if not surah:
        raise HTTPException(status_code=404, detail=f"Surah {surah_id} not found")
    return SurahSummarySchema(
        id=surah.id,
        name_arabic=surah.name_arabic,
        name_simple=surah.name_simple,
        name_complex=surah.name_complex,
        name_english=surah.name_english,
        revelation_place=surah.revelation_place,
        revelation_order=surah.revelation_order,
        bismillah_pre=surah.bismillah_pre,
        verses_count=surah.verses_count,
        start_page=surah.start_page,
        end_page=surah.end_page,
    )

@router.get("/surahs/{surah_id}/ayahs", response_model=List[AyahSchema])
def get_surah_ayahs(
    surah_id: int,
    reciter: str = Query("alafasy", description="Reciter ID for audio URLs"),
    translation: Optional[str] = Query(None, description="Translation edition identifier to ensure is cached"),
    db: Session = Depends(get_db)
):
    """Returns all Ayahs for a given Surah with word-by-word breakdown and translations."""
    surah = QuranService.get_surah(db, surah_id)
    if not surah:
        raise HTTPException(status_code=404, detail=f"Surah {surah_id} not found")

    ayahs = QuranService.get_ayahs_by_surah(db, surah_id, translation)
    results = []
    for a in ayahs:
        words = [
            WordSchema(
                id=w.id,
                position=w.position,
                text_uthmani=w.text_uthmani,
                transliteration=w.transliteration,
                translation_en=w.translation_en,
                translation_ur=w.translation_ur,
                root_letters=w.root_letters,
                lemma=w.lemma,
                pos=w.pos,
                grammar_desc=w.grammar_desc
            )
            for w in a.words
        ]

        translations = [
            TranslationItemSchema(
                edition_id=tr.edition.id,
                edition_identifier=tr.edition.identifier,
                edition_name=tr.edition.name,
                language_code=tr.edition.language_code,
                author_name=tr.edition.author_name,
                text=tr.text
            )
            for tr in a.translations
        ]

        audio_url = QuranService.get_audio_url(reciter, a.surah_id, a.verse_number)

        results.append(
            AyahSchema(
                id=a.id,
                surah_id=a.surah_id,
                verse_number=a.verse_number,
                verse_key=a.verse_key,
                text_uthmani=a.text_uthmani,
                text_simple=a.text_simple,
                juz_number=a.juz_number,
                hizb_number=a.hizb_number,
                rub_number=a.rub_number,
                page_number=a.page_number,
                ruku_number=a.ruku_number,
                manzil_number=a.manzil_number,
                sajdah=a.sajdah,
                sajdah_number=a.sajdah_number,
                words=words,
                translations=translations,
                audio_url=audio_url
            )
        )

    return results

@router.get("/ayahs/{verse_key}", response_model=AyahSchema)
def get_ayah(
    verse_key: str,
    reciter: str = Query("alafasy"),
    db: Session = Depends(get_db)
):
    """Returns single Ayah by verse_key (e.g. '1:1', '2:255')."""
    ayah = QuranService.get_ayah_by_key(db, verse_key)
    if not ayah:
        raise HTTPException(status_code=404, detail=f"Ayah {verse_key} not found")

    words = [
        WordSchema(
            id=w.id,
            position=w.position,
            text_uthmani=w.text_uthmani,
            transliteration=w.transliteration,
            translation_en=w.translation_en,
            translation_ur=w.translation_ur,
            root_letters=w.root_letters,
            lemma=w.lemma,
            pos=w.pos,
            grammar_desc=w.grammar_desc
        )
        for w in ayah.words
    ]

    translations = [
        TranslationItemSchema(
            edition_id=tr.edition.id,
            edition_identifier=tr.edition.identifier,
            edition_name=tr.edition.name,
            language_code=tr.edition.language_code,
            author_name=tr.edition.author_name,
            text=tr.text
        )
        for tr in ayah.translations
    ]

    audio_url = QuranService.get_audio_url(reciter, ayah.surah_id, ayah.verse_number)

    return AyahSchema(
        id=ayah.id,
        surah_id=ayah.surah_id,
        verse_number=ayah.verse_number,
        verse_key=ayah.verse_key,
        text_uthmani=ayah.text_uthmani,
        text_simple=ayah.text_simple,
        juz_number=ayah.juz_number,
        hizb_number=ayah.hizb_number,
        rub_number=ayah.rub_number,
        page_number=ayah.page_number,
        ruku_number=ayah.ruku_number,
        manzil_number=ayah.manzil_number,
        sajdah=ayah.sajdah,
        sajdah_number=ayah.sajdah_number,
        words=words,
        translations=translations,
        audio_url=audio_url
    )
