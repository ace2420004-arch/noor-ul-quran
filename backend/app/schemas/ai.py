from typing import List, Optional
from pydantic import BaseModel

class CitationItem(BaseModel):
    citation_id: str
    source_type: str # "ayah", "tafsir", "hadith", "asbab_nuzul"
    title: str # e.g. "Surah Al-Baqarah (2:255)" or "Tafsir Ibn Kathir (2:255)"
    reference: str
    original_text: Optional[str] = None
    translation_text: Optional[str] = None

class AIQueryRequest(BaseModel):
    query: str
    language: str = "en" # "en", "ur", "hinglish", "hi", "ar"
    verse_context: Optional[str] = None # e.g. "2:255"

class AIResponse(BaseModel):
    query: str
    language: str
    answer: str
    citations: List[CitationItem]
    verification_status: str # "verified_grounded", "scholarly_difference_noted", "non_mufti_disclaimer"
    disclaimer: Optional[str] = None
