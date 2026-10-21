from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user_data import Bookmark, ReflectionNote
from backend.app.schemas.user_data import BookmarkCreate, BookmarkSchema, NoteCreate, NoteSchema

router = APIRouter(prefix="/journal", tags=["Research Notebook & Bookmarks"])

@router.get("/bookmarks", response_model=List[BookmarkSchema])
def list_bookmarks(db: Session = Depends(get_db)):
    """List private saved Ayah bookmarks."""
    bms = db.query(Bookmark).filter_by(user_id=1).order_by(Bookmark.created_at.desc()).all()
    return [
        BookmarkSchema(
            id=b.id,
            user_id=b.user_id,
            verse_key=b.verse_key,
            collection_name=b.collection_name,
            note=b.note,
            created_at=b.created_at
        )
        for b in bms
    ]

@router.post("/bookmarks", response_model=BookmarkSchema)
def add_bookmark(req: BookmarkCreate, db: Session = Depends(get_db)):
    """Add a new bookmark."""
    bm = Bookmark(
        user_id=1,
        verse_key=req.verse_key,
        collection_name=req.collection_name,
        note=req.note
    )
    db.add(bm)
    db.commit()
    db.refresh(bm)
    return BookmarkSchema(
        id=bm.id,
        user_id=bm.user_id,
        verse_key=bm.verse_key,
        collection_name=bm.collection_name,
        note=bm.note,
        created_at=bm.created_at
    )

@router.delete("/bookmarks/{bookmark_id}")
def delete_bookmark(bookmark_id: int, db: Session = Depends(get_db)):
    """Delete a saved bookmark."""
    bm = db.query(Bookmark).filter_by(id=bookmark_id, user_id=1).first()
    if not bm:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    db.delete(bm)
    db.commit()
    return {"message": "Bookmark removed"}

@router.get("/notes", response_model=List[NoteSchema])
def list_notes(db: Session = Depends(get_db)):
    """List private reflection notes."""
    notes = db.query(ReflectionNote).filter_by(user_id=1).order_by(ReflectionNote.created_at.desc()).all()
    return [
        NoteSchema(
            id=n.id,
            user_id=n.user_id,
            verse_key=n.verse_key,
            title=n.title,
            content=n.content,
            tags=n.tags or "",
            created_at=n.created_at,
            updated_at=n.updated_at
        )
        for n in notes
    ]

@router.post("/notes", response_model=NoteSchema)
def create_note(req: NoteCreate, db: Session = Depends(get_db)):
    """Save a private reflection note attached to an Ayah."""
    note = ReflectionNote(
        user_id=1,
        verse_key=req.verse_key,
        title=req.title,
        content=req.content,
        tags=req.tags or ""
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return NoteSchema(
        id=note.id,
        user_id=note.user_id,
        verse_key=note.verse_key,
        title=note.title,
        content=note.content,
        tags=note.tags or "",
        created_at=note.created_at,
        updated_at=note.updated_at
    )

@router.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a saved reflection note."""
    note = db.query(ReflectionNote).filter_by(id=note_id, user_id=1).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Reflection note removed"}
