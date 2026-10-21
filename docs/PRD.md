# Noor-ul-Quran (نور القرآن)
## Complete Multilingual Quran, Tafsir, AI Research & Learning Ecosystem
### Product Requirements Document (PRD)

---

## 1. Executive Summary

**Noor-ul-Quran** is a production-grade, multilingual Islamic knowledge platform engineered for authentic Quran reading, scholarly tafsir study, Arabic linguistics analysis, hifz memorisation, and source-grounded AI-assisted research.

### Guiding Principles
1. **Authenticity First**: Original Quranic Arabic text is sacred and inviolable. It is stored, verified, and displayed using verified Uthmani datasets (Hafs 'an 'Asim). AI models are strictly forbidden from generating, reconstructing, or modifying Quranic Arabic.
2. **Provenance & Traceability**: Every translation, tafsir commentary, hadith reference, and historical report carries explicit attribution (author, work, volume, page, publisher, license, and verification date).
3. **Strict Categorical Separation**: The system enforces clear boundaries between:
   - Canonical Quranic Arabic text
   - Published translations
   - Classical scholarly tafsir
   - Documented hadith and historical contexts (Asbab al-Nuzul)
   - Personal user reflection notes
   - AI-generated syntheses and paraphrases
4. **Scholarly Responsibility & Non-Mufti Guardrails**: The platform and its AI assistant do not issue religious rulings (fatwas) or pretend to be muftis. Contested questions present documented scholarly opinions with sources and recommend qualified scholars.
5. **Universal Accessibility & Multilingual Inclusivity**: Supports 22+ languages with independent selectors for interface, translation, tafsir, and AI responses, including right-to-left (RTL) Arabic/Urdu scripts and conversational Roman Urdu/Hinglish explanations.

---

## 2. Product Features & Scope Matrix

| Module | Core Features | Immediate Phase 1 Implementation | External / Phase 2+ Requirements |
|---|---|---|---|
| **Quran Reader** | 114 Surahs, 30 Juz, Uthmani script, Ayah navigation, Tajweed, Word-by-word | Full 114 Surahs metadata, verified verse text, multi-translation, word breakdown | Full vector page scans for 1:1 printed Mushaf view |
| **Multi-Tafsir** | Classical tafsir works, side-by-side comparison, source edition metadata | Tafsir Ibn Kathir, Tafsir al-Jalalayn, Tafheem-ul-Quran (Maududi) | Copyrighted modern commentaries requiring commercial publisher licenses |
| **Universal Search** | Exact phrase, diacritic-tolerant, transliteration, root search, topic filter | Diacritic-normalised Arabic search, English/Urdu translation search, root lookup | Scaled pgvector semantic search cluster for enterprise multi-million passage corpus |
| **Linguistics Lab** | Root concordance, lemma frequencies, morphology, i'rab grammatical roles | Quranic Arabic Corpus root & lemma dataset, occurrence frequency breakdown | Automated dependency tree parser for complex non-Quranic classical texts |
| **Knowledge Graph** | Node-link graph connecting Surahs, Ayahs, Topics, Roots, Hadith | Interactive SVG graph visualization with 5 relationship filters | 3D WebGL graph rendering for 50,000+ nodes |
| **AI Assistant** | Source-grounded RAG, multi-lingual answers (Hinglish/Urdu/English), citation cards | Verification engine with citation cards, anti-hallucination checks, mufti disclaimers | Real-time live audio voice streaming (Gemini 3.8 Live API) |
| **Audio & Recitation**| Multi-reciter playback, verse repeat, sleep timer, playback speed | CDN playback for Mishary Alafasy, Abdul Basit, Al-Husary, verse looping | Word-level acoustic timestamp alignment for custom reciters |
| **Hifz Memorisation** | Hide/reveal text, spaced repetition revision intervals, repetition counter | Hide/reveal toggle, revision scheduler, progress storage | Automated acoustic voice pitch & tajweed speech recognition validator |
| **Learning Academy**  | Structured courses, vocabulary flashcards, comprehension quizzes | 3 complete courses with interactive flashcards and scored quizzes | Multi-tenant school LMS with live teacher grading and proctoring |
| **Research Notebook** | Personal reflections, tagged collections, Markdown export | Private reflection journal, tagging, export to JSON/Markdown | Cloud peer-to-peer end-to-end encrypted synchronisation |
| **Admin & Integrity** | Dataset checksums, audit logging, content correction queue | Checksum validator, audit log viewer, correction submission API | Enterprise role-based multi-approver workflow engine |

---

## 3. User Personas & Use Cases

1. **Daily Reciter (Beginner / Intermediate)**: Reads daily Surahs (Al-Mulk, Al-Kahf, Yasin) with clean typography, listens to Shaykh Mishary Alafasy, reads clear English/Urdu translations, and bookmarks last read position.
2. **Hifz Student**: Uses Memorisation Mode to hide Arabic text, repeats individual ayahs 5 to 10 times, tests memory, and tracks revision schedules using spaced repetition.
3. **Arabic & Quranic Linguistics Student**: Taps individual words to reveal roots, morphological forms (verb form, noun, active participle), and examines root occurrences across the entire Quran.
4. **Researcher / Academic**: Compares Tafsir Ibn Kathir with Tafsir al-Jalalayn, explores knowledge graph relationships, searches by root, and exports citations to research notebook.
5. **Inquisitive Youth (Conversational Learner)**: Asks questions in Hinglish ("Bhai, Surah Baqarah ki ayah 255 ka simple explanation kya hai?") and receives a verified, respectful, source-grounded explanation with clear citations.

---

## 4. Non-Functional Requirements

- **Performance**: Initial page load < 1.0s, search response time < 80ms, ayah audio start latency < 300ms.
- **Accessibility**: WCAG 2.1 AA compliant, visible focus states, screen reader ARIA labels, adjustable font size (18px to 48px), dark/light/sepia themes.
- **Security & Privacy**: Zero user tracking, private reflection journals kept private, role-based authorization for administrative tools, strict input sanitization.
