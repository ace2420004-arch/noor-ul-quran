from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class TafsirEdition(Base):
    __tablename__ = "tafsir_editions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    identifier = Column(String(50), nullable=False, unique=True, index=True) # "ibn_kathir", "al_jalalayn", "tafheem"
    name = Column(String(150), nullable=False)
    name_ar = Column(String(150), nullable=False)
    author_name = Column(String(150), nullable=False)
    era = Column(String(50), nullable=True) # e.g. "8th Century AH"
    methodology = Column(String(100), nullable=True) # "Tafsir bi-l-Ma'thur"
    publication_info = Column(Text, nullable=True)
    license = Column(String(100), nullable=False)
    language_code = Column(String(10), default="en")

    passages = relationship("TafsirPassage", back_populates="edition")


class TafsirPassage(Base):
    __tablename__ = "tafsir_passages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ayah_id = Column(Integer, ForeignKey("ayahs.id"), nullable=False, index=True)
    edition_id = Column(Integer, ForeignKey("tafsir_editions.id"), nullable=False, index=True)
    text = Column(Text, nullable=False)
    volume = Column(String(20), nullable=True)
    page = Column(String(20), nullable=True)
    section_title = Column(String(255), nullable=True)

    ayah = relationship("Ayah", back_populates="tafsir_passages")
    edition = relationship("TafsirEdition", back_populates="passages")
