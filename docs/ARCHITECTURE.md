# Noor-ul-Quran (نور القرآن)
## Application Architecture & Engineering Blueprint

---

## 1. System Topology

```
+-----------------------------------------------------------------------------------+
|                                CLIENT TIER                                        |
|  [ Modern Web SPA / Responsive Tablet & Mobile ] (React 19 + TypeScript + Vite)   |
|  - Emerald & Gold Islamic Design System (Tailwind CSS v4 + Vanilla CSS Tokens)   |
|  - Bi-directional RTL / LTR Typography Engine (Amiri, Scheherazade, Outfit)      |
|  - Audio Player Engine (Verse Loop, Speed, Multi-reciter CDN streaming)          |
|  - State Layer: LocalStorage Cache + Reactive Contexts (Auth, Reading, Audio)     |
+-----------------------------------------+-----------------------------------------+
                                          | JSON over HTTPS (REST API)
                                          v
+-----------------------------------------------------------------------------------+
|                              BACKEND API GATEWAY                                  |
|  [ FastAPI Application ] (Python 3.13 + Uvicorn)                                  |
|  - Middleware: CORS, Request Rate Limiter, Response Compression, Security Headers |
|  - Core Auth & Permission Engine: Role-Based Access Control (Admin, Scholar, User)|
|  - OpenAPI 3.1 Interactive Documentation (/docs, /redoc)                          |
+-----------------------------------------+-----------------------------------------+
                                          |
   +--------------------+-----------------+--------------------+--------------------+
   |                    |                                      |                    |
   v                    v                                      v                    v
+--------------+ +---------------------+ +----------------------------+ +---------------+
| Quran Router | | Tafsir & Context    | | Universal Search & RAG     | | Audio & Study |
| - Surahs     | | - Ibn Kathir        | | - Diacritic Normalisation  | | - Multi-recite|
| - Ayahs      | | - Al-Jalalayn       | | - Root & Lemma Concordance | | - Hifz Loop   |
| - Word/Word  | | - Maududi           | | - Knowledge Graph Engine   | | - Flashcards  |
| - Tajweed    | | - Asbab an-Nuzul    | | - Verified AI Assistant    | | - Quizzes     |
+-------+------+ +----------+----------+ +--------------+-------------+ +-------+-------+
        |                   |                           |                       |
        +-------------------+-------------+-------------+-----------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                DATA & STORAGE TIER                                |
|  [ Relational Persistence ]                                                       |
|  - SQLite (Local zero-config self-contained testing & offline deployment)         |
|  - PostgreSQL 16 + pgvector (Production cloud deployment)                         |
|  - Full audit trail logging for all content modifications                         |
|  - Verified Canonical Datasets (Tanzil, Quranic Arabic Corpus, Authentic Hadith) |
|  [ Audio Asset CDN ]                                                              |
|  - EveryAyah.com & Quran CDN (128kbps / 192kbps MP3 streams with verse mapping)   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
NOOR_UL_QURAN/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- v1/
|   |   |   |   |-- quran.py           # Surah, Ayah, Word breakdown, Tajweed
|   |   |   |   |-- tafsir.py          # Classical commentaries and comparison
|   |   |   |   |-- search.py          # Universal search across Arabic & translations
|   |   |   |   |-- research.py        # Root concordance, morphology, knowledge graph
|   |   |   |   |-- ai_assistant.py    # Source-grounded RAG with strict citations
|   |   |   |   |-- audio.py           # Reciters, streams, timestamps
|   |   |   |   |-- hifz.py            # Memorisation, repetition, spaced revision
|   |   |   |   |-- learning.py        # Academy courses, flashcards, quizzes
|   |   |   |   |-- journal.py         # Personal reflections and bookmarks
|   |   |   |   |-- context.py         # Asbab an-Nuzul & Hadith cross-references
|   |   |   |   `-- admin.py           # Content verification, integrity checks, logs
|   |   |-- core/
|   |   |   |-- config.py              # Environment configuration & constants
|   |   |   |-- database.py            # SQLAlchemy database engine & session maker
|   |   |   `-- security.py            # Password hashing, tokens, RBAC
|   |   |-- models/                    # Normalized SQLAlchemy ORM models
|   |   |   |-- quran.py
|   |   |   |-- tafsir.py
|   |   |   |-- hadith.py
|   |   |   |-- user_data.py
|   |   |   |-- ai.py
|   |   |   `-- admin.py
|   |   |-- schemas/                   # Pydantic schemas for request/response validation
|   |   |-- services/                  # Business logic & domain services
|   |   |   |-- quran_service.py
|   |   |   |-- tafsir_service.py
|   |   |   |-- search_service.py
|   |   |   |-- morphology_service.py
|   |   |   |-- ai_rag_service.py
|   |   |   `-- audio_service.py
|   |   |-- data/                      # Verified canonical datasets & seed files
|   |   `-- main.py                    # FastAPI application initialization
|   |-- tests/                         # Pytest test suite
|   |   |-- test_quran_integrity.py
|   |   |-- test_search_normalisation.py
|   |   |-- test_tafsir_provenance.py
|   |   |-- test_ai_rag_citations.py
|   |   `-- test_api_endpoints.py
|   `-- requirements.txt
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- layout/
|   |   |   |   |-- Sidebar.tsx        # 14-section navigation sidebar
|   |   |   |   |-- Header.tsx         # Search, language switcher, theme toggle
|   |   |   |   `-- AudioPlayerBar.tsx # Persistent bottom audio player with loop
|   |   |   |-- quran/
|   |   |   |   |-- QuranReader.tsx    # Ayah-by-ayah & continuous Mushaf reader
|   |   |   |   |-- AyahCard.tsx       # Uthmani text, translations, word-by-word
|   |   |   |   |-- WordPopover.tsx    # Interactive root, lemma, morphology popup
|   |   |   |   `-- SurahSelector.tsx  # Surah & Juz fast-finder
|   |   |   |-- tafsir/
|   |   |   |   `-- TafsirLibrary.tsx  # Multi-tafsir comparison & provenance
|   |   |   |-- search/
|   |   |   |   `-- SearchExplore.tsx  # Universal search interface
|   |   |   |-- research/
|   |   |   |   |-- ResearchLab.tsx    # Root concordance & morphology studio
|   |   |   |   `-- KnowledgeGraph.tsx # Interactive SVG knowledge graph
|   |   |   |-- ai/
|   |   |   |   `-- AiAssistant.tsx    # RAG assistant with citation inspection
|   |   |   |-- audio/
|   |   |   |   `-- MemorisationAudio.tsx # Hifz mode, hide/reveal, spaced repetition
|   |   |   |-- learning/
|   |   |   |   `-- LearningAcademy.tsx   # Courses, flashcards, interactive quizzes
|   |   |   |-- notebook/
|   |   |   |   `-- ResearchNotebook.tsx  # Personal reflection journal
|   |   |   `-- modals/
|   |   |       `-- AyahDetailModal.tsx   # Comprehensive Ayah Evidence Card
|   |   |-- types/                     # TypeScript domain interfaces
|   |   |-- services/                  # API client & local persistence
|   |   |-- App.tsx                    # Main application router and state
|   |   |-- main.tsx
|   |   `-- index.css
|   `-- package.json
|
`-- docs/
    |-- PRD.md
    |-- ARCHITECTURE.md
    |-- SOURCES_AND_LICENSING.md
    |-- DATABASE_SCHEMA.md
    `-- ROADMAP.md
```

---

## 3. Strict Boundary & Security Architecture

1. **Sacred Canonical Text Firewall**:
   - Quran text is stored in read-only tables or immutable datasets with SHA-256 verification hashes.
   - No frontend client, standard API, or AI pipeline has write access to the Quranic text tables.
   - Any proposed typo correction or character update requires a signed cryptographic administrative review ticket with audited change logging.

2. **Source-Grounded AI Retrieval-Augmented Generation (RAG) Architecture**:
   - The user query triggers multi-vector and lexical retrieval across:
     a) Canonical Arabic verses
     b) Authenticated English/Urdu translations
     c) Classical Tafsir passages (Ibn Kathir, Jalalayn, Maududi)
     d) Documented Hadith and Asbab al-Nuzul records
   - The retrieved passages are formatted as verified context with strict prompt injection guardrails.
   - The AI generation pipeline enforces:
     - **Attribution Rule**: Every factual claim must reference a retrieved citation key (`[cite:ayah:2:255]` or `[cite:tafsir:ibn_kathir:2:255]`).
     - **Non-Mufti Guardrail**: If the question asks for a legal verdict (fatwa/halal/haram), the system outputs documented scholarly differences with attribution, issues a disclaimer, and explicitly recommends consulting a certified local scholar.
     - **Linguistic Clarity**: Clearly marks whether an answer is in English, Urdu, or conversational Hinglish, reminding the user that conversational explanations are explanatory paraphrases, not certified translations.
