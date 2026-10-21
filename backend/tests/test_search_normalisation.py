from backend.app.services.search_service import SearchService
from backend.app.services.quran_service import normalize_arabic

def test_normalize_arabic_function():
    raw = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
    norm = normalize_arabic(raw)
    assert norm == "بسم الله الرحمن الرحيم"
    assert "ِ" not in norm
    assert "َ" not in norm
    assert "ٱ" not in norm

def test_arabic_search_matches_vocalized_text(db):
    # Query with no diacritics
    query = "الرحمن"
    res = SearchService.universal_search(db, query=query)
    assert res["total_matches"] > 0
    matched_keys = [item["verse_key"] for item in res["results"]]
    assert "1:1" in matched_keys or "1:3" in matched_keys

def test_translation_search(db):
    query = "praise"
    res = SearchService.universal_search(db, query=query)
    assert res["total_matches"] > 0
    matched_keys = [item["verse_key"] for item in res["results"]]
    assert "1:2" in matched_keys

def test_root_search(db):
    query = "ر ح م"
    res = SearchService.universal_search(db, query=query)
    assert res["total_matches"] > 0
