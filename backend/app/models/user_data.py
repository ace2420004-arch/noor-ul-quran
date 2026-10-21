from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True, index=True)
    role = Column(String(20), default="user") # "guest", "user", "student", "teacher", "scholar", "admin"
    created_at = Column(DateTime, default=datetime.utcnow)


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1, index=True)
    verse_key = Column(String(20), nullable=False, index=True) # "1:1"
    collection_name = Column(String(100), default="Favorites")
    note = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ReadingHistory(Base):
    __tablename__ = "reading_histories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1, index=True)
    surah_id = Column(Integer, nullable=False)
    verse_number = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ReflectionNote(Base):
    __tablename__ = "reflection_notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1, index=True)
    verse_key = Column(String(20), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(String(255), default="")
    is_private = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class HifzProgress(Base):
    __tablename__ = "hifz_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1, index=True)
    surah_id = Column(Integer, nullable=False, index=True)
    start_ayah = Column(Integer, nullable=False)
    end_ayah = Column(Integer, nullable=False)
    status = Column(String(50), default="learning") # "learning", "memorised", "review_due"
    repetitions_count = Column(Integer, default=0)
    ease_factor = Column(Float, default=2.5) # SuperMemo SM-2 factor
    interval_days = Column(Integer, default=1)
    last_reviewed_at = Column(DateTime, default=datetime.utcnow)
    next_review_at = Column(DateTime, default=datetime.utcnow)
