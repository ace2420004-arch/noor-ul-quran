from typing import List, Optional
from pydantic import BaseModel

class TafsirEditionSchema(BaseModel):
    id: int
    identifier: str
    name: str
    name_ar: str
    author_name: str
    era: Optional[str] = None
    methodology: Optional[str] = None
    license: str
    language_code: str

class TafsirPassageSchema(BaseModel):
    id: int
    ayah_id: int
    verse_key: str
    edition: TafsirEditionSchema
    text: str
    volume: Optional[str] = None
    page: Optional[str] = None
    section_title: Optional[str] = None
