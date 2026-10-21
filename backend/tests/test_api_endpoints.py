def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["project"] == "Noor-ul-Quran"

def test_surahs_endpoint(client):
    res = client.get("/api/v1/quran/surahs")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 114
    assert data[0]["name_simple"] == "Al-Fatihah"

def test_surah_ayahs_endpoint(client):
    res = client.get("/api/v1/quran/surahs/1/ayahs")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 7
    assert data[0]["verse_key"] == "1:1"
    assert "audio_url" in data[0]
    assert len(data[0]["words"]) >= 4

def test_surah_ayahs_accepts_selected_translation(client, monkeypatch):
    from backend.app.services.quran_service import QuranService

    requested_translations = []
    get_ayahs = QuranService.get_ayahs_by_surah

    def capture_translation(db, surah_id, translation_identifier=None):
        requested_translations.append(translation_identifier)
        return get_ayahs(db, surah_id)

    monkeypatch.setattr(QuranService, "get_ayahs_by_surah", capture_translation)
    res = client.get("/api/v1/quran/surahs/1/ayahs?translation=hi.azizul")

    assert res.status_code == 200
    assert requested_translations == ["hi.azizul"]

def test_tafsir_editions_endpoint(client):
    res = client.get("/api/v1/tafsir/editions")
    assert res.status_code == 200
    assert len(res.json()) >= 3

def test_search_endpoint(client):
    res = client.get("/api/v1/search?q=mercy")
    assert res.status_code == 200
    assert res.json()["total_matches"] > 0

def test_research_roots_endpoint(client):
    res = client.get("/api/v1/research/roots")
    assert res.status_code == 200
    assert len(res.json()) >= 7

def test_research_graph_uses_selected_surah(client, monkeypatch):
    from backend.app.services.quran_service import QuranService

    monkeypatch.setattr(QuranService, "get_ayahs_by_surah", lambda db, surah_id: [])
    res = client.get("/api/v1/research/graph?surah_id=2")

    assert res.status_code == 200
    data = res.json()
    assert data["surah_id"] == 2
    assert data["nodes"][0]["id"] == "surah_2"
    assert "Al-Baqarah" in data["nodes"][0]["label"]
    assert data["sampled_ayahs"] == []
    assert not any(node["type"] in {"Arabic Root", "Thematic Category"} for node in data["nodes"])
    assert not any(edge["type"] in {"root_derivation", "thematic"} for edge in data["edges"])
    assert any("no themes are inferred" in note for note in data["data_notes"])

def test_audio_reciters_endpoint(client):
    res = client.get("/api/v1/audio/reciters")
    assert res.status_code == 200
    assert len(res.json()) >= 5

def test_admin_integrity_endpoint(client):
    res = client.get("/api/v1/admin/integrity")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY_VERIFIED"
    assert data["surahs_registered"] == 114
