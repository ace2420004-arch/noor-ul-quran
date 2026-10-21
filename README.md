# 📖 Noor-ul-Quran (نُورُ الْقُرْآنِ)
> **Understand the Quran. Reflect deeply. Live by its guidance.**  
> *A Production-Quality Multilingual Quran, Tafsir, Arabic Linguistics, Memorisation & Source-Grounded AI Research Ecosystem.*

---

## 🌟 1. Project Vision & Core Principles

**Noor-ul-Quran** is a unified, scholarly grounded digital Quran knowledge ecosystem built for students, researchers, teachers, Arabic learners, and everyday readers. 

Unlike generic Quran web apps or open-ended chatbot wrappers, Noor-ul-Quran is engineered upon strict Islamic informatics standards:
- **Sacred Scripture Immutability**: The Arabic text preserves the authentic Hafs 'an 'Asim recitation in Tanzil-verified Uthmani script with complete vocalization (diacritics/harakat). AI models are architecturally prohibited from synthesizing, generating, or modifying Quranic Arabic.
- **Categorical Data Separation**: The platform strictly separates and labels five distinct layers of information:
  1. *Canonical Quran Scripture* (Original Arabic text)
  2. *Published Translations* (Attributed to verified translators and editions)
  3. *Classical Scholarly Tafsir* (Recognized exegesis: Ibn Kathir, Al-Jalalayn, Maududi)
  4. *Personal Reflections & Journal Notes* (Private to the user)
  5. *AI Explanations & Paraphrases* (Explicitly labeled as generated explanations, never confused with authentic scripture or translations)
- **Non-Mufti Legal Guardrail**: The source-grounded AI Assistant refuses to issue definitive religious verdicts (*fatwas*) or declare actions strictly halal/haram. When queries touch upon jurisprudence (*fiqh*), the engine returns documented textual evidence alongside a prominent **Scholarly Consultation Notice**.
- **Traceable Citations**: Every explanation maps directly to verified verse keys (`[cite:ayah_1:1]`), classical tafsir passages (`[cite:tafsir_ibn_kathir_1:1]`), and Hadith narrations with explicit grading authorities (*Sahih*, *Hasan*).

---

## 🗺️ 2. Integrated 14-Section Architecture

The application contains 14 responsive navigation modules:

1. **Home Dashboard**: Daily Ayah of reflection (Ayat al-Kursi 2:255), quick navigation to all 114 Surahs, module directory, and reading shortcuts.
2. **Quran Reader**: Complete 114 Surahs & 30 Juz navigator, Ayah-by-Ayah display and continuous Mushaf mode, word-by-word tap popover (morphology, root letters, lemma, and grammar), multi-translation selection, audio recitation sync, and bookmarks.
3. **Tafsir Library**: Multi-edition classical exegesis with side-by-side comparative views (Ibn Kathir, Al-Jalalayn, Tafheem-ul-Quran), author biography, methodology classification, and Surah picker.
4. **Search & Explore**: Unified search engine featuring diacritic-tolerant Arabic search (stripping tashkeel and tatweel), translation text search, and root concordance with highlighted match badges.
5. **Quran Research Lab**: Interactive Knowledge Graph visualization linking Surahs, Ayahs, Arabic roots, themes, and documented Hadith cross-references with relationship filtering.
6. **AI Research Assistant**: Source-grounded RAG engine answering inquiries in conversational Hinglish, Roman Urdu, Urdu, Hindi, Arabic, and English with interactive citation cards and reader deep links.
7. **Arabic Linguistics Studio**: Triliteral roots directory, total corpus occurrences count, morphological derivations, and interactive ayah concordance.
8. **Hadith & Islamic Sources**: Authentic reference collection with book and number identifiers, original Arabic text, translations, and documented grading authorities (e.g., Al-Albani, An-Nawawi, Ibn Hibban).
9. **Learning Academy**: Structured learning tracks, interactive vocabulary flashcards with 3D flip animation, and scored comprehension quizzes with instant feedback.
10. **Memorisation & Audio (Hifz Studio)**: Active recall practice with hide/reveal Arabic text, customizable repetition loops (1x, 3x, 5x, 10x), and revision completion tracking.
11. **Research Notebook**: Private reflection journal with tags, linked verse keys, and Markdown export for offline study.
12. **Bookmarks & Collections**: Saved verses with custom tags and quick jump links back to the reader.
13. **Reading History**: Non-intrusive local reading logs tracking completed chapters and recitations.
14. **Admin Integrity Dashboard**: Cryptographic dataset verification (SHA-256 checksums), read-only database integrity checks, dataset health metrics, and an audited correction reporting workflow.

---

## 🛠️ 3. Technology Stack

### Backend
- **Framework**: Python 3.13+ with **FastAPI**
- **ORM & Database**: **SQLAlchemy** with **SQLite** (development/testing) and **PostgreSQL + pgvector** (production)
- **Data Validation**: **Pydantic v2**
- **Testing**: **Pytest** with 24 automated unit, integration, and integrity tests
- **Audio Recitations**: Every Ayah maps to high-quality audio streams from recognized reciters (Mishary Rashid Alafasy, Abdul Basit Murattal, Mahmoud Khalil Al-Husary, Saad Al-Ghamdi, Mohamed Siddiq Al-Minshawi).

### Frontend
- **Framework**: **React 19** + **TypeScript**
- **Build Tool**: **Vite 8**
- **Styling**: **Tailwind CSS v4** with accessible custom themes (Light, Emerald Dark, and Warm Sepia)
- **Typography**: Authentic Arabic typography (`Amiri`, `Scheherazade New`) with dynamic font scaling slider (22px to 44px)
- **Icons**: **Lucide React**

---

## 🚀 4. Quick Start & Setup Instructions

### Prerequisites
- **Python**: 3.11+
- **Node.js**: v20+ / v24+
- **Git**

### A. Backend Setup
1. Open PowerShell or a terminal in the project root:
   ```powershell
   cd c:\Users\munva\Downloads\NOOR_UL_QURAN
   ```
2. Activate the virtual environment:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   *(Or on Linux/macOS: `source .venv/bin/activate`)*

3. Verify dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Run the automated test suite:
   ```powershell
   pytest backend/tests/ -v
   ```
   *Expects: `24 passed in ~0.8s`.*

5. Launch the FastAPI server:
   ```powershell
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - API Root: [http://127.0.0.1:8000/api/v1](http://127.0.0.1:8000/api/v1)

---

### B. Frontend Setup
1. Open a new terminal in the `frontend` folder:
   ```powershell
   cd c:\Users\munva\Downloads\NOOR_UL_QURAN\frontend
   ```

2. Install dependencies:
   ```powershell
   npm.cmd install
   ```

3. Validate TypeScript build:
   ```powershell
   npm.cmd run build
   ```

4. Start Vite development server:
   ```powershell
   npm.cmd run dev
   ```
   - Application URL: [http://127.0.0.1:5173](http://127.0.0.1:5173)

---

## 🧪 5. Automated Test Suite Overview

Run all tests via:
```powershell
.\.venv\Scripts\pytest.exe backend/tests/ -v
```

The test suite covers:
- `test_quran_integrity.py`:
  - `test_all_114_surahs_seeded`: Asserts 114 Surahs registered with exact Tanzil IDs.
  - `test_fatihah_verse_count_and_keys`: Verifies 7 ayahs in Surah Al-Fatihah (`1:1` to `1:7`).
  - `test_fatihah_arabic_uthmani_integrity`: Verifies exact Uthmani diacritics for verse 1:1.
  - `test_translation_mapping`: Verifies Saheeh International mapping for all seeded ayahs.
  - `test_word_by_word_morphology`: Verifies word-level root, lemma, and grammar breakdown.
- `test_search_normalisation.py`:
  - `test_strip_tashkeel_diacritics`: Tests removal of fathah, kasrah, dammah, sukoon, shaddah.
  - `test_normalize_alef_and_yaa`: Tests normalization of `إ`, `أ`, `آ`, `ى`.
  - `test_search_arabic_unvocalized`: Tests unvocalized query matching vocalized text.
  - `test_search_translation`: Tests English keyword search for "mercy".
  - `test_search_root`: Tests triliteral root search for `ر ح م`.
- `test_tafsir_provenance.py`:
  - `test_tafsir_editions_have_licenses`: Ensures all tafsir works cite edition, author, and methodology.
  - `test_comparative_tafsir_passages`: Verifies multi-tafsir comparison for Ayah 1:1.
- `test_ai_rag_citations.py`:
  - `test_grounded_answer_includes_citations`: Verifies structured citation cards in RAG responses.
  - `test_non_mufti_legal_disclaimer`: Ensures queries about rulings trigger the mandatory disclaimer.
  - `test_hinglish_conversational_response`: Validates conversational explanations in Hinglish.
- `test_api_endpoints.py`:
  - End-to-end HTTP integration tests for Surahs, Ayahs, Tafsir, Search, AI, Learning, and Admin Integrity endpoints.

---

## 🔒 6. Security, Privacy & Integrity Standards

- **Read-Only Canonical Core**: Quranic scripture tables have strict application-level write-protection and checksum verification.
- **Audited Correction Queue**: Any user correction report is stored as an unapplied ticket requiring administrator and scholar approval before acceptance.
- **Zero Exposed Secrets**: All configuration loads through environment variables managed in `backend/app/core/config.py`.
- **Private by Default**: Reflection notes and reading history reside in local storage and private database schemas; no user reflection is ever passed to public AI model training.

---

## 📚 7. Sources & Provenance Documentation

Full scholarly provenance, dataset licensing, and reference details are available in [`docs/SOURCES_AND_LICENSING.md`](docs/SOURCES_AND_LICENSING.md):
- **Quran Text**: Tanzil Project (Hafs Uthmani v1.0.2)
- **Translations**: Saheeh International, Maulana Fateh Muhammad Jalandhari (Urdu), Dr. Muhammad Taqi-ud-Din al-Hilali & Dr. Muhammad Muhsin Khan
- **Tafsir**: Tafsir Ibn Kathir (*Tafsir al-Qur'an al-'Azim*), Tafsir al-Jalalayn, Tafheem-ul-Quran (Sayyid Abul A'la Maududi)
- **Audio CDN**: Everyayah / Islamic Network Audio CDN (licensed for public educational use)
- **Hadith**: Authentic collections cross-referenced with Darussalam and classical grading standards

---

## 📜 License

Content of the Quranic scripture belongs to the public domain and divine revelation. Software source code is licensed under the **MIT License**.
