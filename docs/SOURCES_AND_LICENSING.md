# Noor-ul-Quran (نور القرآن)
## Content Provenance, Data Sources & Licensing Architecture

---

## 1. Authoritative Quran Arabic Text

The canonical Quranic text is sourced from verified, scholarly audited digital editions:
- **Primary Source**: **Tanzil Project (tanzil.net)** - Tanzil Hafs Uthmani Text.
  - **Text Standard**: Medina Mushaf edition published by the King Fahd Complex for the Printing of the Holy Quran (Majma' al-Malik Fahd li-Tiba'at al-Mushaf ash-Sharif).
  - **Encoding**: Unicode UTF-8 with standard Quranic diacritics (harakat), pause marks (waqf), and verse endings.
  - **Structure**: 114 Surahs, 6,236 Ayahs, 30 Juz, 60 Hizb, 7 Sajdahs (obligatory) / 14-15 total.
  - **Integrity Rule**: Canonical text is immutable. Any normalization (stripping tashkeel, standardizing alif wasl / hamza) occurs exclusively in transient search indexes and is never written back to the canonical storage layer.

---

## 2. Multi-Translation Provenance & Attribution

Every translation entry records the translator name, edition title, publication year, language ISO code, and legal license.

| Language | Edition Name | Author / Translator | License / Terms |
|---|---|---|---|
| **English** | Saheeh International | Emily Assami, Mary Kennedy, Amatullah Bantley | Permitted for free Islamic educational distribution |
| **English** | Meaning of the Glorious Quran | Marmaduke Pickthall | Public Domain (1930) |
| **English** | The Holy Quran: Translation & Commentary | Abdullah Yusuf Ali | Public Domain (1934) |
| **Urdu** | Tafheem-ul-Quran Translation | Sayyid Abul A'la Maududi | Islamic Publications / Educational fair use |
| **Urdu** | Quran Majeed Translation | Maulana Fateh Muhammad Jalandhry | Public Domain |
| **Urdu** | Translation of the Quran | Maulana Muhammad Junagarhi | Darussalam / Educational distribution |
| **Hindi** | Quran Majeed Hindi Translation | Muhammad Farooq Khan & Muhammad Ahmad | Islamic Book Service / Educational use |
| **Hinglish / Roman Urdu** | Explanatory Conversational Paraphrase | Noor-ul-Quran Research Team | Specially synthesized explanatory paraphrase; clearly marked as **non-canonical** |
| **Bengali** | Quraner Bonganubad | Maulana Muhiuddin Khan | Standard Islamic Foundation Bangladesh |
| **Indonesian** | Al-Qur'an dan Terjemahannya | Ministry of Religious Affairs (Kemenag RI) | Public educational distribution |
| **French** | Le Coran et sa traduction | Muhammad Hamidullah | Public Domain / Academic distribution |
| **Spanish** | El Sagrado Corán | Abdel Ghani Navio | Centro Cultural Islámico |
| **German** | Der Koran | Frank Bubenheim & Nadeem Elyas | King Fahd Complex verified edition |
| **Turkish** | Kur'an-ı Kerim Meali | Presidency of Religious Affairs (Diyanet) | Public educational distribution |

---

## 3. Classical Tafsir Library

Scholarly commentary is rigorously isolated from Quranic text:

1. **Tafsir Ibn Kathir (*Tafsir al-Qur'an al-'Azim*)**:
   - Author: Al-Hafiz Abu al-Fida 'Imad ad-Din Isma'il ibn 'Umar ibn Kathir (d. 774 AH / 1373 CE).
   - Character: Tafsir bi-l-Ma'thur (commentary grounded in Quran-by-Quran, Hadith, and Sahaba narrations).
   - Editions: Arabic classical text (Dar al-Fikr/Maktabat al-Ma'arif); Abridged English translation by Darussalam.
2. **Tafsir al-Jalalayn**:
   - Authors: Jalal al-Din al-Mahalli (d. 864 AH) & Jalal al-Din al-Suyuti (d. 911 AH).
   - Character: Concise lexical, grammatical, and theological commentary.
   - Editions: Classical public domain Arabic; English translation by Firas Hamza.
3. **Tafheem-ul-Quran**:
   - Author: Sayyid Abul A'la Maududi (d. 1979 CE).
   - Character: Contemporary socio-theological and thematic commentary in Urdu and English.
4. **Tafsir al-Tabari (*Jami' al-Bayan 'an Ta'wil Ay al-Qur'an*)**:
   - Author: Abu Ja'far Muhammad ibn Jarir al-Tabari (d. 310 AH).
   - Used for primary historical narrations, chains, and classical linguistic analysis.

---

## 4. Arabic Morphology & Linguistic Data

- **Source**: **The Quranic Arabic Corpus** (University of Leeds, developed by Kais Dukes).
  - Open linguistics dataset providing word-by-word morphological segmentation, part of speech (POS) tagging, root letters (Jadhar), lemmas, and syntactic treebank annotation.
  - License: GNU General Public License (GPL).

---

## 5. Hadith References & Asbab al-Nuzul

1. **Hadith Collections**:
   - Canonical Six Books (al-Kutub al-Sittah): Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah.
   - Rules: Every hadith entry must cite: Collection Name, Book Name/Number, Hadith Number, Narrator (Sahabi), Arabic text, and Grading (Sahih, Hasan, Da'if) with attribution to the grading scholar (e.g., Al-Albani, Al-Arna'ut, or classical consensus).
2. **Asbab al-Nuzul (Occasions of Revelation)**:
   - Primary reference: *Asbab an-Nuzul* by Ali ibn Ahmad al-Wahidi an-Naisaburi (d. 468 AH) and *Lubab an-Nuqul fi Asbab an-Nuzul* by Jalal al-Din al-Suyuti (d. 911 AH).
   - Rule: Disputed or weak historical reports are explicitly tagged with caution warnings and differing scholarly views.

---

## 6. Recitation Audio & Media Assets

- **Source**: **EveryAyah.com Audio Repository** & verified Islamic audio CDNs.
- **Licensed Reciters Included**:
  1. Shaykh Mishary Rashid Alafasy (Murattal, Hafs)
  2. Shaykh Mahmoud Khalil Al-Husary (Classic Murattal, Hafs)
  3. Shaykh Abdul Basit Abdul Samad (Murattal, Hafs)
  4. Shaykh Saad Al-Ghamdi (Murattal, Hafs)
  5. Shaykh Muhammad Siddiq Al-Minshawi (Murattal, Hafs)
- Audio files are streamed per ayah (e.g., `001001.mp3` for Surah 1 Ayah 1) using reliable high-speed CDN URLs.
