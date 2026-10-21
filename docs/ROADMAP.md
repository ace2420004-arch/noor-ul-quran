# Noor-ul-Quran (نور القرآن)
## Phased Implementation Roadmap & Acceptance Criteria

---

## Phase 1: Foundation (Current Priority & Working Implementation)
- **Objective**: Establish the core architecture, authenticated data foundation, verified Quran navigation, responsive design system, and multi-translation reader.
- **Acceptance Criteria**:
  - [x] Complete 114 Surahs canonical metadata loaded and validated.
  - [x] High-precision Uthmani Arabic script with full diacritics.
  - [x] Multi-translation selector (English Saheeh, Urdu Maududi, Hindi Farooq, Hinglish conversational explanation).
  - [x] Responsive layout with desktop sidebar, mobile navigation, and bi-directional RTL/LTR support.
  - [x] Word-by-word interactive lookup (tap word -> root, lemma, grammatical role, transliteration).
  - [x] Search across Arabic, translations, and transliterations.
  - [x] Audio recitation player with multi-reciter CDN streaming (Alafasy, Abdul Basit, Al-Husary).
  - [x] Automated pytest test suite verifying Quran text integrity, search normalization, and API routes.

---

## Phase 2: Tafsir & Multilingual Depth
- **Objective**: Comprehensive multi-tafsir library and expanded linguistic matrices.
- **Acceptance Criteria**:
  - [ ] Side-by-side comparative viewer for Tafsir Ibn Kathir, Tafsir al-Jalalayn, and Tafheem-ul-Quran.
  - [ ] Source provenance badge displaying volume, page, edition, and publisher for each passage.
  - [ ] Independent language selectors for UI, translation, tafsir, and AI responses.
  - [ ] Content verification queue for scholarly and community review.

---

## Phase 3: Research Lab & Knowledge Graph
- **Objective**: Advanced linguistic concordance and semantic relationship explorer.
- **Acceptance Criteria**:
  - [ ] Arabic root concordance tool displaying all Quranic derivations for any triliteral or quadriliteral root.
  - [ ] Interactive SVG/Canvas Knowledge Graph with node filtering (Direct text, Shared root, Thematic, Hadith).
  - [ ] Export citations to BibTeX, Markdown, and JSON.

---

## Phase 4: Audio, Hifz & Learning Academy
- **Objective**: Memorisation workflows, spaced repetition, and structured education.
- **Acceptance Criteria**:
  - [ ] Hifz Mode with interactive hide/reveal text and repetition loop counter.
  - [ ] Spaced repetition revision scheduling with SuperMemo SM-2 algorithm.
  - [ ] Learning Academy with guided modules, vocabulary flashcards, and scored comprehension quizzes.

---

## Phase 5: AI Research Assistant (Source-Grounded RAG)
- **Objective**: Verifiable, citation-grounded conversational research.
- **Acceptance Criteria**:
  - [ ] RAG pipeline retrieving verified Quran text, translations, and classical tafsirs.
  - [ ] Strict citation attachments (`[cite:ayah:...]`, `[cite:tafsir:...]`) linking directly to source texts.
  - [ ] Multi-lingual support in English, Urdu, Hindi, and conversational Hinglish.
  - [ ] Explicit non-mufti refusal logic on religious legal verdicts (fatwa questions).

---

## Phase 6: Hadith, Asbab al-Nuzul & Scholarly Opinions
- **Objective**: Contextual historical literature and comparative fiqh references.
- **Acceptance Criteria**:
  - [ ] Searchable Hadith cross-references with collection numbers and scholar-attributed gradings.
  - [ ] Asbab al-Nuzul reports with authenticity assessments and warnings on disputed narrations.
  - [ ] Fiqh reference desk presenting documented school positions without artificial uniformity.

---

## Phase 7: Production Hardening, Mobile Apps & CI/CD
- **Objective**: Cross-platform deployment and enterprise operations.
- **Acceptance Criteria**:
  - [ ] Dockerized backend and frontend with multi-stage builds.
  - [ ] PWA offline support with Service Worker caching for core surahs and translations.
  - [ ] Automated CI/CD pipeline running integrity tests, linting, and accessibility audits.
