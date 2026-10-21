from backend.app.core.database import Base
from backend.app.models.quran import (
    Surah, Ayah, Word, TranslationEdition, TranslationText, Topic, AyahTopic, ArabicRoot
)
from backend.app.models.tafsir import TafsirEdition, TafsirPassage
from backend.app.models.hadith import RevelationContext, HadithRecord
from backend.app.models.user_data import User, Bookmark, ReadingHistory, ReflectionNote, HifzProgress
from backend.app.models.ai import AIConversation, AIMessage
from backend.app.models.admin import AuditLog, DatasetVersion, ContentCorrectionReport

__all__ = [
    "Base",
    "Surah",
    "Ayah",
    "Word",
    "TranslationEdition",
    "TranslationText",
    "Topic",
    "AyahTopic",
    "ArabicRoot",
    "TafsirEdition",
    "TafsirPassage",
    "RevelationContext",
    "HadithRecord",
    "User",
    "Bookmark",
    "ReadingHistory",
    "ReflectionNote",
    "HifzProgress",
    "AIConversation",
    "AIMessage",
    "AuditLog",
    "DatasetVersion",
    "ContentCorrectionReport",
]
