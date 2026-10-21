from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.ai_rag_service import AIRagService
from backend.app.schemas.ai import AIQueryRequest, AIResponse

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.post("/chat", response_model=AIResponse)
def ask_ai(req: AIQueryRequest, db: Session = Depends(get_db)):
    """Source-grounded RAG query endpoint with multi-lingual responses, strict citation cards, and non-mufti disclaimers."""
    result = AIRagService.answer_query(
        db=db,
        query=req.query,
        language=req.language,
        verse_context=req.verse_context
    )
    return AIResponse(
        query=result["query"],
        language=result["language"],
        answer=result["answer"],
        citations=result["citations"],
        verification_status=result["verification_status"],
        disclaimer=result["disclaimer"]
    )
