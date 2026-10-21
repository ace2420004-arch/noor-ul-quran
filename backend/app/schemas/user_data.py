from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BookmarkCreate(BaseModel):
    verse_key: str
    collection_name: str = "Favorites"
    note: Optional[str] = None

class BookmarkSchema(BookmarkCreate):
    id: int
    user_id: int
    created_at: datetime

class NoteCreate(BaseModel):
    verse_key: str
    title: str
    content: str
    tags: Optional[str] = ""

class NoteSchema(NoteCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

class HifzProgressUpdate(BaseModel):
    surah_id: int
    start_ayah: int
    end_ayah: int
    status: str # "learning", "memorised", "review_due"
    repetitions: int = 1
