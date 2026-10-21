from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.hadith import RevelationContext, HadithRecord
from backend.app.models.quran import Ayah

router = APIRouter(prefix="/context", tags=["Context & Hadith"])

@router.get("/asbab-nuzul/{verse_key}")
def get_asbab_nuzul(verse_key: str, db: Session = Depends(get_db)):
    """Retrieve historical occasion of revelation reports with authenticity assessment."""
    ayah = db.query(Ayah).filter_by(verse_key=verse_key).first()
    if not ayah:
        raise HTTPException(status_code=404, detail=f"Ayah {verse_key} not found")

    contexts = db.query(RevelationContext).filter_by(ayah_id=ayah.id).all()
    if not contexts:
        return {
            "verse_key": verse_key,
            "has_specific_sabab": False,
            "reports": [],
            "scholarly_note": "No specific single historical incident is recorded; classical scholars view this verse as general foundational guidance."
        }

    return {
        "verse_key": verse_key,
        "has_specific_sabab": True,
        "reports": [
            {
                "source": c.source_work,
                "report_text": c.report_text,
                "authenticity_assessment": c.authenticity_assessment,
                "scholarly_notes": c.scholarly_notes
            }
            for c in contexts
        ]
    }

@router.get("/hadith/{verse_key}")
def get_related_hadiths(verse_key: str, db: Session = Depends(get_db)):
    """Retrieve verified Hadith cross-references linked to an Ayah."""
    hadiths = db.query(HadithRecord).filter_by(related_verse_key=verse_key).all()
    return [
        {
            "id": h.id,
            "collection_name": h.collection_name,
            "hadith_number": h.hadith_number,
            "text_ar": h.text_ar,
            "text_en": h.text_en,
            "grade": h.grade,
            "grading_authority": h.grading_authority,
            "narrator": h.narrator or "Sahabi (r.a.)"
        }
        for h in hadiths
    ]

@router.get("/hadiths/browse")
def browse_hadiths(
    collection: str = None,
    query: str = None,
    verse_key: str = None,
    db: Session = Depends(get_db)
):
    """Browse and filter authentic Hadiths linked to Quranic verses."""
    q = db.query(HadithRecord)
    if collection and collection != "all":
        q = q.filter(HadithRecord.collection_name.ilike(f"%{collection}%"))
    if verse_key:
        q = q.filter(HadithRecord.related_verse_key == verse_key)
    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            (HadithRecord.text_en.ilike(search_pattern)) |
            (HadithRecord.text_ar.like(search_pattern)) |
            (HadithRecord.narrator.ilike(search_pattern)) |
            (HadithRecord.related_verse_key.like(search_pattern))
        )
    hadiths = q.all()
    return [
        {
            "id": h.id,
            "collection_name": h.collection_name,
            "hadith_number": h.hadith_number,
            "related_verse_key": h.related_verse_key,
            "text_ar": h.text_ar,
            "text_en": h.text_en,
            "grade": h.grade,
            "grading_authority": h.grading_authority,
            "narrator": h.narrator or "Sahabi (r.a.)"
        }
        for h in hadiths
    ]

@router.get("/asbab-nuzul-records")
def list_asbab_nuzul(db: Session = Depends(get_db)):
    """List classical Asbab an-Nuzul (Occasions of Revelation) records."""
    records = db.query(RevelationContext).all()
    result = []
    for r in records:
        ayah = db.query(Ayah).filter_by(id=r.ayah_id).first()
        vk = ayah.verse_key if ayah else "1:1"
        result.append({
            "id": r.id,
            "verse_key": vk,
            "source_work": r.source_work,
            "report_text": r.report_text,
            "authenticity_assessment": r.authenticity_assessment,
            "scholarly_notes": r.scholarly_notes
        })
    return result
