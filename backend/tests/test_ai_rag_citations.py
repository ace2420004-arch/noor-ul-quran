from backend.app.services.ai_rag_service import AIRagService

def test_ai_answers_with_verifiable_citations(db):
    res = AIRagService.answer_query(db, query="What is the meaning of mercy in Surah Al-Fatihah?", language="en", verse_context="1:1")
    assert "answer" in res
    assert len(res["citations"]) > 0
    # Citations must contain source type, title, and reference
    first_cite = res["citations"][0]
    assert first_cite.source_type in ["ayah", "tafsir", "hadith"]
    assert "Surah" in first_cite.title or "Tafsir" in first_cite.title

def test_ai_hinglish_response_support(db):
    res = AIRagService.answer_query(db, query="Bhai, is ayah ka aasan matlab batao", language="hinglish", verse_context="1:1")
    assert "Aasan Wazahat" in res["answer"]
    assert len(res["citations"]) > 0

def test_ai_non_mufti_legal_disclaimer(db):
    # Fatwa/legal query should trigger notice
    res = AIRagService.answer_query(db, query="Is this halal or haram? Give me a fatwa on divorce.", language="en")
    assert res["verification_status"] == "non_mufti_disclaimer"
    assert res["disclaimer"] is not None
    assert "SCHOLARLY CONSULTATION NOTICE" in res["disclaimer"]
