from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class RevelationContext(Base):
    __tablename__ = "revelation_contexts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ayah_id = Column(Integer, ForeignKey("ayahs.id"), nullable=False, index=True)
    source_work = Column(String(150), nullable=False) # e.g. "Asbab an-Nuzul by Al-Wahidi"
    report_text = Column(Text, nullable=False)
    narrator_chain = Column(Text, nullable=True)
    authenticity_assessment = Column(String(50), nullable=False) # "Sahih", "Hasan", "Da'if / Disputed"
    scholarly_notes = Column(Text, nullable=True)

    ayah = relationship("Ayah", back_populates="revelation_contexts")


class HadithRecord(Base):
    __tablename__ = "hadith_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    collection_name = Column(String(100), nullable=False, index=True) # "Sahih al-Bukhari"
    book_number = Column(Integer, nullable=True)
    hadith_number = Column(String(50), nullable=False) # "1", "447"
    text_ar = Column(Text, nullable=False)
    text_en = Column(Text, nullable=False)
    text_ur = Column(Text, nullable=True)
    narrator = Column(String(150), nullable=True)
    grade = Column(String(50), nullable=False) # "Sahih"
    grading_authority = Column(String(150), nullable=False) # "Imam al-Bukhari"
    related_verse_key = Column(String(20), nullable=True, index=True) # "1:1"
