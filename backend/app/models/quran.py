from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Surah(Base):
    __tablename__ = "surahs"

    id = Column(Integer, primary_key=True, index=True) # 1 - 114
    name_arabic = Column(String(100), nullable=False)
    name_simple = Column(String(100), nullable=False) # e.g. "Al-Fatihah"
    name_complex = Column(String(100), nullable=False) # e.g. "Al-Fātiḥah"
    name_english = Column(String(150), nullable=False) # e.g. "The Opener"
    revelation_place = Column(String(20), nullable=False) # "makkah" or "madinah"
    revelation_order = Column(Integer, nullable=False)
    bismillah_pre = Column(Boolean, default=True)
    verses_count = Column(Integer, nullable=False)
    start_page = Column(Integer, nullable=False)
    end_page = Column(Integer, nullable=False)

    ayahs = relationship("Ayah", back_populates="surah", cascade="all, delete-orphan")


class Ayah(Base):
    __tablename__ = "ayahs"

    id = Column(Integer, primary_key=True, index=True) # 1 - 6236
    surah_id = Column(Integer, ForeignKey("surahs.id"), nullable=False, index=True)
    verse_number = Column(Integer, nullable=False) # e.g. 1
    verse_key = Column(String(20), nullable=False, unique=True, index=True) # "1:1"
    text_uthmani = Column(Text, nullable=False) # Canonical Hafs Uthmani with diacritics
    text_simple = Column(Text, nullable=False, index=True) # Normalized for fast search
    juz_number = Column(Integer, nullable=False, index=True) # 1 - 30
    hizb_number = Column(Integer, nullable=False) # 1 - 60
    rub_number = Column(Integer, nullable=False) # 1 - 240
    page_number = Column(Integer, nullable=False, index=True) # 1 - 604
    ruku_number = Column(Integer, nullable=False)
    manzil_number = Column(Integer, nullable=False)
    sajdah = Column(Boolean, default=False)
    sajdah_number = Column(Integer, nullable=True)

    surah = relationship("Surah", back_populates="ayahs")
    words = relationship("Word", back_populates="ayah", cascade="all, delete-orphan")
    translations = relationship("TranslationText", back_populates="ayah", cascade="all, delete-orphan")
    tafsir_passages = relationship("TafsirPassage", back_populates="ayah", cascade="all, delete-orphan")
    revelation_contexts = relationship("RevelationContext", back_populates="ayah", cascade="all, delete-orphan")
    topics = relationship("AyahTopic", back_populates="ayah", cascade="all, delete-orphan")


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ayah_id = Column(Integer, ForeignKey("ayahs.id"), nullable=False, index=True)
    position = Column(Integer, nullable=False)
    text_uthmani = Column(String(100), nullable=False)
    transliteration = Column(String(100), nullable=False)
    translation_en = Column(String(150), nullable=False)
    translation_ur = Column(String(150), nullable=True)
    root_letters = Column(String(20), nullable=True, index=True) # e.g. "ر ح م"
    lemma = Column(String(100), nullable=True, index=True)
    pos = Column(String(50), nullable=True) # Noun, Verb, etc.
    grammar_desc = Column(Text, nullable=True)

    ayah = relationship("Ayah", back_populates="words")


class TranslationEdition(Base):
    __tablename__ = "translation_editions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    identifier = Column(String(50), nullable=False, unique=True, index=True) # "en.saheeh", "ur.maududi"
    language_code = Column(String(10), nullable=False, index=True) # "en", "ur", "hi", "hinglish"
    language_name = Column(String(50), nullable=False)
    name = Column(String(150), nullable=False)
    author_name = Column(String(150), nullable=False)
    license = Column(String(100), nullable=False)
    is_canonical = Column(Boolean, default=True)

    texts = relationship("TranslationText", back_populates="edition")


class TranslationText(Base):
    __tablename__ = "translation_texts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ayah_id = Column(Integer, ForeignKey("ayahs.id"), nullable=False, index=True)
    edition_id = Column(Integer, ForeignKey("translation_editions.id"), nullable=False, index=True)
    text = Column(Text, nullable=False)

    ayah = relationship("Ayah", back_populates="translations")
    edition = relationship("TranslationEdition", back_populates="texts")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    title_en = Column(String(150), nullable=False)
    title_ar = Column(String(150), nullable=False)
    title_ur = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)

    ayah_topics = relationship("AyahTopic", back_populates="topic")


class AyahTopic(Base):
    __tablename__ = "ayah_topics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ayah_id = Column(Integer, ForeignKey("ayahs.id"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False, index=True)
    relevance_weight = Column(Float, default=1.0)

    ayah = relationship("Ayah", back_populates="topics")
    topic = relationship("Topic", back_populates="ayah_topics")


class ArabicRoot(Base):
    __tablename__ = "arabic_roots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    root_letters = Column(String(20), nullable=False, unique=True, index=True)
    transliteration = Column(String(50), nullable=False)
    occurrences_count = Column(Integer, default=0)
    primary_meanings = Column(Text, nullable=False)
    derivatives_json = Column(Text, default="[]") # JSON list of derived words
