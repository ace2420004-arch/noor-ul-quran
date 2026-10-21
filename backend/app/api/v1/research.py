import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.quran import ArabicRoot, Word, Ayah, Topic, AyahTopic
from backend.app.schemas.quran import ArabicRootSchema

router = APIRouter(prefix="/research", tags=["Research & Linguistics"])

@router.get("/roots", response_model=List[ArabicRootSchema])
def list_roots(db: Session = Depends(get_db)):
    """List authenticated Arabic roots with occurrences and lexical meanings."""
    roots = db.query(ArabicRoot).all()
    results = []
    for r in roots:
        derivatives = []
        try:
            derivatives = json.loads(r.derivatives_json) if r.derivatives_json else []
        except Exception:
            pass

        results.append(ArabicRootSchema(
            id=r.id,
            root_letters=r.root_letters,
            transliteration=r.transliteration,
            occurrences_count=r.occurrences_count,
            primary_meanings=r.primary_meanings,
            derivatives=derivatives
        ))
    return results

@router.get("/roots/{root_letters}")
def get_root_concordance(root_letters: str, db: Session = Depends(get_db)):
    """Retrieve full concordance of words, lemmas, and ayahs sharing an Arabic root."""
    root_obj = db.query(ArabicRoot).filter(ArabicRoot.root_letters == root_letters).first()
    if not root_obj:
        raise HTTPException(status_code=404, detail=f"Root '{root_letters}' not found")

    words = db.query(Word).filter(Word.root_letters == root_letters).all()
    occurrences = []
    for w in words:
        occurrences.append({
            "verse_key": w.ayah.verse_key,
            "position": w.position,
            "text_uthmani": w.text_uthmani,
            "transliteration": w.transliteration,
            "translation_en": w.translation_en,
            "pos": w.pos,
            "grammar_desc": w.grammar_desc
        })

    return {
        "root_letters": root_obj.root_letters,
        "transliteration": root_obj.transliteration,
        "primary_meanings": root_obj.primary_meanings,
        "occurrences_count": len(occurrences),
        "occurrences": occurrences
    }

@router.get("/graph")
def get_knowledge_graph(
    surah_id: int = Query(1, ge=1, le=114, description="Surah ID to explore"),
    topic_slug: Optional[str] = Query(None, description="Topic slug to filter by"),
    db: Session = Depends(get_db)
):
    """Returns interactive knowledge graph nodes and relationships dynamically for any of the 114 Surahs."""
    from backend.app.models.quran import Surah
    from backend.app.services.quran_service import QuranService

    surah = db.query(Surah).filter(Surah.id == surah_id).first()
    if not surah:
        raise HTTPException(status_code=404, detail=f"Surah {surah_id} not found")

    # Ensure verses are cached/loaded
    ayahs = QuranService.get_ayahs_by_surah(db, surah_id)

    nodes = []
    edges = []

    # 1. Central Surah Node
    nodes.append({
        "id": f"surah_{surah.id}",
        "label": f"Surah {surah.id}: {surah.name_simple}",
        "arabic": surah.name_arabic,
        "type": "Surah",
        "group": "scripture",
        "desc": f"{surah.name_english} • Revealed in {surah.revelation_place.upper()} • {surah.verses_count} Verses",
        "is_center": True,
        "surah_id": surah.id
    })

    # Show a bounded, explicit sample instead of implying this is a full concordance.
    sample_ayahs = ayahs[:5]
    roots_by_ayah = {}

    for a in sample_ayahs:
        tr_text = next(
            (translation.text for translation in a.translations if translation.edition.identifier == "en.saheeh"),
            "",
        )
        nodes.append({
            "id": f"ayah_{a.verse_key}",
            "label": f"Ayah {a.verse_key}",
            "arabic": a.text_uthmani[:35] + ("..." if len(a.text_uthmani) > 35 else ""),
            "full_arabic": a.text_uthmani,
            "type": "Ayah",
            "group": "ayah",
            "desc": tr_text[:120] + ("..." if len(tr_text) > 120 else ""),
            "verse_key": a.verse_key,
            "source": "Quran text",
        })
        edges.append({
            "source": f"surah_{surah.id}",
            "target": f"ayah_{a.verse_key}",
            "label": "direct_textual_reference",
            "type": "direct_text"
        })

        roots_by_ayah[a.id] = set()
        for w in a.words:
            if w.root_letters and len(w.root_letters.strip()) > 0:
                roots_by_ayah[a.id].add(w.root_letters.strip())

    # 3. Root Nodes
    roots_to_ayahs = {}
    for ayah in sample_ayahs:
        for root_letters in roots_by_ayah[ayah.id]:
            roots_to_ayahs.setdefault(root_letters, []).append(ayah)

    for r_letters, related_ayahs in roots_to_ayahs.items():
        root_db = db.query(ArabicRoot).filter(ArabicRoot.root_letters == r_letters).first()
        r_id = f"root_{r_letters.replace(' ', '_')}"
        meanings = root_db.primary_meanings if root_db else "Core morphological root"
        translit = root_db.transliteration if root_db else r_letters
        nodes.append({
            "id": r_id,
            "label": f"Root: {r_letters}",
            "arabic": r_letters,
            "type": "Arabic Root",
            "group": "linguistics",
            "desc": f"Transliteration: {translit} • Lexical summary: {meanings}",
            "root_letters": r_letters,
            "source": "Word-level root annotation" + (" and local root lexicon" if root_db else ""),
        })
        for ayah in related_ayahs:
            edges.append({
                "source": f"ayah_{ayah.verse_key}",
                "target": r_id,
                "label": "root_annotation_in_ayah",
                "type": "root_derivation"
            })

    # Themes are included only for explicit local AyahTopic annotations.
    ayah_topic_rows = (
        db.query(AyahTopic, Topic, Ayah)
        .join(Topic, AyahTopic.topic_id == Topic.id)
        .join(Ayah, AyahTopic.ayah_id == Ayah.id)
        .filter(Ayah.id.in_(roots_by_ayah.keys()))
        .all()
        if roots_by_ayah
        else []
    )
    if topic_slug:
        ayah_topic_rows = [row for row in ayah_topic_rows if row[1].slug == topic_slug]

    topic_ayahs = {}
    for topic_link, topic, ayah in ayah_topic_rows:
        topic_ayahs.setdefault(topic.slug, (topic, []))[1].append((ayah, topic_link.relevance_weight))

    for topic, linked_ayahs in topic_ayahs.values():
        t = topic
        t_id = f"topic_{t.slug}"
        nodes.append({
            "id": t_id,
            "label": f"Theme: {t.title_en}",
            "arabic": t.title_ar or t.slug,
            "type": "Thematic Category",
            "group": "theme",
            "desc": t.description or "Recorded topic association.",
            "topic_slug": t.slug,
            "source": "Recorded Ayah-topic annotation",
        })
        for ayah, relevance_weight in linked_ayahs:
            edges.append({
                "source": f"ayah_{ayah.verse_key}",
                "target": t_id,
                "label": "recorded_topic_association",
                "type": "thematic",
                "relevance_weight": relevance_weight,
            })

    return {
        "surah_id": surah.id,
        "surah_name": surah.name_simple,
        "surah_name_ar": surah.name_arabic,
        "nodes": nodes,
        "edges": edges,
        "sampled_ayahs": [ayah.verse_key for ayah in sample_ayahs],
        "data_notes": [
            "Only the first five Ayahs are sampled; the graph is not a complete Surah concordance.",
            "Roots are shown only when word-level root annotations exist in sampled Ayahs.",
            "Themes are shown only when explicit Ayah-topic annotations are recorded; no themes are inferred.",
        ],
        "relationship_types": [
            "direct_textual_reference",
            "shared_vocabulary",
            "thematic_association"
        ]
    }
