from backend.app.services.tafsir_service import TafsirService

def test_tafsir_editions_have_author_and_license(db):
    editions = TafsirService.get_editions(db)
    assert len(editions) >= 3
    for e in editions:
        assert e.author_name is not None and len(e.author_name) > 0
        assert e.license is not None and len(e.license) > 0
        assert e.name_ar is not None

def test_tafsir_passages_retrieval(db):
    passages = TafsirService.get_passages_for_ayah(db, verse_key="1:1")
    assert len(passages) >= 2
    ed_identifiers = [p["edition"]["identifier"] for p in passages]
    assert "ibn_kathir" in ed_identifiers
    assert "al_jalalayn" in ed_identifiers

def test_compare_tafsir_distinguishes_sources(db):
    comparison = TafsirService.compare_tafsir(db, verse_key="1:1")
    assert comparison["verse_key"] == "1:1"
    assert len(comparison["passages"]) >= 2
    for p in comparison["passages"]:
        assert "edition_name" in p
        assert "author" in p
        assert len(p["commentary"]) > 20
