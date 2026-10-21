from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user_data import HifzProgress
from backend.app.schemas.user_data import HifzProgressUpdate

router = APIRouter(prefix="/hifz", tags=["Hifz & Memorisation"])

@router.get("/progress")
def get_hifz_progress(db: Session = Depends(get_db)):
    """Retrieve all active memorisation tasks and revision schedules."""
    items = db.query(HifzProgress).filter_by(user_id=1).all()
    return [
        {
            "id": it.id,
            "surah_id": it.surah_id,
            "start_ayah": it.start_ayah,
            "end_ayah": it.end_ayah,
            "status": it.status,
            "repetitions_count": it.repetitions_count,
            "ease_factor": it.ease_factor,
            "interval_days": it.interval_days,
            "last_reviewed_at": it.last_reviewed_at.isoformat() if it.last_reviewed_at else None,
            "next_review_at": it.next_review_at.isoformat() if it.next_review_at else None,
        }
        for it in items
    ]

@router.post("/progress")
def update_hifz_progress(req: HifzProgressUpdate, db: Session = Depends(get_db)):
    """Update repetition count or revision status for a memorised Ayah range."""
    item = db.query(HifzProgress).filter_by(
        user_id=1,
        surah_id=req.surah_id,
        start_ayah=req.start_ayah,
        end_ayah=req.end_ayah
    ).first()

    now = datetime.utcnow()
    if not item:
        item = HifzProgress(
            user_id=1,
            surah_id=req.surah_id,
            start_ayah=req.start_ayah,
            end_ayah=req.end_ayah,
            status=req.status,
            repetitions_count=req.repetitions,
            interval_days=1,
            last_reviewed_at=now,
            next_review_at=now + timedelta(days=1)
        )
        db.add(item)
    else:
        item.repetitions_count += req.repetitions
        item.status = req.status
        item.last_reviewed_at = now
        # Simple spaced repetition progression
        if req.status == "memorised":
            item.interval_days = max(1, int(item.interval_days * item.ease_factor))
            item.next_review_at = now + timedelta(days=item.interval_days)

    db.commit()
    db.refresh(item)
    return {"message": "Progress recorded successfully", "id": item.id, "next_review": item.next_review_at}
