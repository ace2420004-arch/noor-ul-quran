import pytest
from backend.app.models.quran import Surah, Ayah, TranslationEdition
from backend.app.services import quran_service

def test_surah_count(db):
    """Verify that exactly 114 Surahs exist in the canonical database."""
    count = db.query(Surah).count()
    assert count == 114, f"Expected 114 Surahs, found {count}"

def test_surah_1_al_fatihah(db):
    """Verify Surah 1 metadata and verse count."""
    fatihah = db.query(Surah).filter(Surah.id == 1).first()
    assert fatihah is not None
    assert fatihah.name_simple == "Al-Fatihah"
    assert fatihah.name_arabic == "الفاتحة"
    assert fatihah.verses_count == 7
    assert fatihah.revelation_place == "makkah"

def test_surah_114_an_nas(db):
    """Verify Surah 114 metadata."""
    nas = db.query(Surah).filter(Surah.id == 114).first()
    assert nas is not None
    assert nas.name_simple == "An-Nas"
    assert nas.verses_count == 6

def test_ayah_1_1_diacritics_preservation(db):
    """Verify that canonical Uthmani Arabic script retains complete harakat/tashkeel."""
    ayah_1 = db.query(Ayah).filter(Ayah.verse_key == "1:1").first()
    assert ayah_1 is not None
    assert ayah_1.text_uthmani == "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
    # Ensure simplified version strips diacritics for search indexing without affecting uthmani
    assert ayah_1.text_simple == "بسم الله الرحمن الرحيم"
    assert ayah_1.text_uthmani != ayah_1.text_simple

def test_word_by_word_ordering(db):
    """Verify word position ordering for Ayah 1:1."""
    ayah_1 = db.query(Ayah).filter(Ayah.verse_key == "1:1").first()
    assert len(ayah_1.words) >= 4
    positions = [w.position for w in ayah_1.words]
    assert positions == sorted(positions), "Words must be ordered by position"
    assert ayah_1.words[0].text_uthmani == "بِسْمِ"
    assert ayah_1.words[0].root_letters == "س م و"

def test_translation_editions_integrity(db):
    """Verify active translation editions are populated."""
    editions = db.query(TranslationEdition).all()
    identifiers = [e.identifier for e in editions]
    assert "en.saheeh" in identifiers
    assert "ur.maududi" in identifiers
    assert "hi.farooq" in identifiers
    assert "hinglish.paraphrase" in identifiers

def test_dynamic_translation_cache_uses_matching_editions(db, monkeypatch):
    from backend.app.models.quran import TranslationText
    from backend.app.services.quran_service import QuranService

    translations = {
        20: "English translation",
        97: "Urdu translation",
        122: "Hindi translation",
        161: "Bengali translation",
        31: "French translation",
        33: "Indonesian translation",
    }
    verse = db.query(Ayah).filter_by(verse_key="1:1").first()

    class MockResponse:
        status_code = 200

        def __init__(self, url):
            self.url = url

        def json(self):
            if "/quran/verses/uthmani?" in self.url:
                return {"verses": [{"verse_key": "1:1", "text_uthmani": verse.text_uthmani}]}
            return {
                "verses": [{
                    "verse_key": "1:1",
                    "verse_number": 1,
                    "translations": [
                        {"resource_id": resource_id, "text": text}
                        for resource_id, text in translations.items()
                    ],
                }]
            }

    class MockClient:
        def __init__(self, timeout):
            self.timeout = timeout

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_value, traceback):
            return False

        def get(self, url):
            return MockResponse(url)

    monkeypatch.setattr(quran_service.httpx, "Client", MockClient)
    QuranService._fetch_and_cache_surah_verses(db, 1)

    for resource_id, text in translations.items():
        identifier = {
            20: "en.saheeh",
            97: "ur.maududi.api",
            122: "hi.azizul",
            161: "bn.taisirul",
            31: "fr.hamidullah",
            33: "id.ministry",
        }[resource_id]
        stored_text = (
            db.query(TranslationText)
            .join(TranslationEdition)
            .filter(
                TranslationText.ayah_id == verse.id,
                TranslationEdition.identifier == identifier,
            )
            .first()
        )
        assert stored_text is not None
        assert stored_text.text == text
