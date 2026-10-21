from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.search_service import SearchService
from backend.app.schemas.search import SearchResponse

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
def universal_search(
    q: str = Query(..., description="Query in Arabic, English, Urdu, Hindi, or Arabic root"),
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Universal search across canonical Arabic text, translations, transliterations, and roots."""
    res = SearchService.universal_search(db, query=q, limit=limit)
    return SearchResponse(
        query=res["query"],
        total_matches=res["total_matches"],
        language="auto",
        results=res["results"]
    )
