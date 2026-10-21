from typing import List, Optional
from pydantic import BaseModel

class SearchResultItem(BaseModel):
    verse_key: str
    surah_id: int
    surah_name_simple: str
    surah_name_arabic: str
    verse_number: int
    text_uthmani: str
    translation_text: Optional[str] = None
    translation_author: Optional[str] = None
    match_type: str # "exact_arabic", "normalized_arabic", "translation", "root"
    highlight: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    total_matches: int
    language: str
    results: List[SearchResultItem]
