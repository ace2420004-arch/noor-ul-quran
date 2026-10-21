from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.tafsir_service import TafsirService
from backend.app.schemas.tafsir import TafsirEditionSchema, TafsirPassageSchema

router = APIRouter(prefix="/tafsir", tags=["Tafsir"])

@router.get("/editions", response_model=List[TafsirEditionSchema])
def list_tafsir_editions(db: Session = Depends(get_db)):
    """List all classical Tafsir works available in the repository."""
    editions = TafsirService.get_editions(db)
    return [
        TafsirEditionSchema(
            id=e.id,
            identifier=e.identifier,
            name=e.name,
            name_ar=e.name_ar,
            author_name=e.author_name,
            era=e.era,
            methodology=e.methodology,
            license=e.license,
            language_code=e.language_code
        )
        for e in editions
    ]

@router.get("/ayah/{verse_key}", response_model=List[TafsirPassageSchema])
def get_ayah_tafsir(
    verse_key: str,
    edition: Optional[str] = Query(None, description="Optional edition identifier (e.g. 'ibn_kathir')"),
    db: Session = Depends(get_db)
):
    """Retrieve scholarly commentary passages for a given Ayah."""
    passages = TafsirService.get_passages_for_ayah(db, verse_key, edition)
    return passages

@router.get("/compare/{verse_key}")
def compare_tafsir(verse_key: str, db: Session = Depends(get_db)):
    """Side-by-side comparative analysis of classical commentaries for an Ayah."""
    return TafsirService.compare_tafsir(db, verse_key)
