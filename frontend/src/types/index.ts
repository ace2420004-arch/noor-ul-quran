export interface Word {
  id: number;
  position: number;
  text_uthmani: str;
  transliteration: str;
  translation_en: str;
  translation_ur?: str;
  root_letters?: str;
  lemma?: str;
  pos?: str;
  grammar_desc?: str;
}

export interface TranslationItem {
  edition_id: number;
  edition_identifier: str;
  edition_name: str;
  language_code: str;
  author_name: str;
  text: str;
}

export interface Ayah {
  id: number;
  surah_id: number;
  verse_number: number;
  verse_key: str;
  text_uthmani: str;
  text_simple: str;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah: boolean;
  sajdah_number?: number | null;
  words?: Word[];
  translations?: TranslationItem[];
  audio_url?: str;
}

export interface SurahSummary {
  id: number;
  name_arabic: str;
  name_simple: str;
  name_complex: str;
  name_english: str;
  revelation_place: str;
  revelation_order: number;
  bismillah_pre: boolean;
  verses_count: number;
  start_page: number;
  end_page: number;
}

export interface TafsirEdition {
  id: number;
  identifier: str;
  name: str;
  name_ar: str;
  author_name: str;
  era?: str;
  methodology?: str;
  license: str;
  language_code: str;
}

export interface TafsirPassage {
  id: number;
  ayah_id: number;
  verse_key: str;
  edition: TafsirEdition;
  text: str;
  volume?: str;
  page?: str;
  section_title?: str;
}

export interface SearchResultItem {
  verse_key: str;
  surah_id: number;
  surah_name_simple: str;
  surah_name_arabic: str;
  verse_number: number;
  text_uthmani: str;
  translation_text?: str;
  translation_author?: str;
  match_type: str;
  highlight?: str;
}

export interface SearchResponse {
  query: str;
  total_matches: number;
  language: str;
  results: SearchResultItem[];
}

export interface CitationItem {
  citation_id: str;
  source_type: str;
  title: str;
  reference: str;
  original_text?: str;
  translation_text?: str;
}

export interface AIResponse {
  query: str;
  language: str;
  answer: str;
  citations: CitationItem[];
  verification_status: str;
  disclaimer?: str;
}

export interface ArabicRoot {
  id: number;
  root_letters: str;
  transliteration: str;
  occurrences_count: number;
  primary_meanings: str;
  derivatives: { word: str; type: str; meaning: str }[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  arabic?: string;
  type: string;
  group: string;
  desc?: string;
  is_center?: boolean;
  surah_id?: number;
  verse_key?: string;
  root_letters?: string;
  topic_slug?: string;
  source?: string;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  label: string;
  type: 'direct_text' | 'root_derivation' | 'thematic';
  relevance_weight?: number;
}

export interface KnowledgeGraphResponse {
  surah_id: number;
  surah_name: string;
  surah_name_ar: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  sampled_ayahs: string[];
  data_notes: string[];
  relationship_types: string[];
}

export interface Reciter {
  id: str;
  name: str;
  name_ar: str;
  style: str;
  quality: str;
}

export interface Bookmark {
  id: number;
  user_id: number;
  verse_key: str;
  collection_name: str;
  note?: str;
  created_at: str;
}

export interface ReflectionNote {
  id: number;
  user_id: number;
  verse_key: str;
  title: str;
  content: str;
  tags: str;
  created_at: str;
  updated_at: str;
}

export interface Course {
  id: str;
  title: str;
  title_ar: str;
  level: str;
  lessons_count: number;
  description: str;
  progress_percent: number;
  flashcards: { arabic: str; transliteration: str; meaning: str; root?: str }[];
  quiz?: {
    title: str;
    questions: {
      id: number;
      question: str;
      options: str[];
      correct_index: number;
      explanation: str;
    }[];
  };
}

export type str = string;
