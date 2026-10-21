from typing import List, Optional
from pydantic import BaseModel

class WordSchema(BaseModel):
    id: int
    position: int
    text_uthmani: str
    transliteration: str
    translation_en: str
    translation_ur: Optional[str] = None
    root_letters: Optional[str] = None
    lemma: Optional[str] = None
    pos: Optional[str] = None
    grammar_desc: Optional[str] = None

class TranslationItemSchema(BaseModel):
    edition_id: int
    edition_identifier: str
    edition_name: str
    language_code: str
    author_name: str
    text: str

class AyahSchema(BaseModel):
    id: int
    surah_id: int
    verse_number: int
    verse_key: str
    text_uthmani: str
    text_simple: str
    juz_number: int
    hizb_number: int
    rub_number: int
    page_number: int
    ruku_number: int
    manzil_number: int
    sajdah: bool
    sajdah_number: Optional[int] = None
    words: Optional[List[WordSchema]] = []
    translations: Optional[List[TranslationItemSchema]] = []
    audio_url: Optional[str] = None

class SurahSummarySchema(BaseModel):
    id: int
    name_arabic: str
    name_simple: str
    name_complex: str
    name_english: str
    revelation_place: str
    revelation_order: int
    bismillah_pre: bool
    verses_count: int
    start_page: int
    end_page: int

class SurahDetailSchema(SurahSummarySchema):
    ayahs: Optional[List[AyahSchema]] = []

class ArabicRootSchema(BaseModel):
    id: int
    root_letters: str
    transliteration: str
    occurrences_count: int
    primary_meanings: str
    derivatives: List[dict] = []
