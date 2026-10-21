import type {
  SurahSummary,
  Ayah,
  TafsirEdition,
  TafsirPassage,
  SearchResponse,
  ArabicRoot,
  KnowledgeGraphResponse,
  AIResponse,
  Reciter,
  Bookmark,
  ReflectionNote,
  Course,
} from '../types';

const API_BASE = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }
  return res.json();
}

export const api = {
  // Quran
  async getSurahs(): Promise<SurahSummary[]> {
    const res = await fetch(`${API_BASE}/quran/surahs`);
    return handleResponse<SurahSummary[]>(res);
  },

  async getSurah(id: number): Promise<SurahSummary> {
    const res = await fetch(`${API_BASE}/quran/surahs/${id}`);
    return handleResponse<SurahSummary>(res);
  },

  async getSurahAyahs(surahId: number, reciter: string = 'alafasy', translation?: string): Promise<Ayah[]> {
    const params = new URLSearchParams({ reciter });
    if (translation) params.set('translation', translation);
    const res = await fetch(`${API_BASE}/quran/surahs/${surahId}/ayahs?${params}`);
    return handleResponse<Ayah[]>(res);
  },

  async getAyah(verseKey: string, reciter: string = 'alafasy'): Promise<Ayah> {
    const res = await fetch(`${API_BASE}/quran/ayahs/${verseKey}?reciter=${reciter}`);
    return handleResponse<Ayah>(res);
  },

  // Tafsir
  async getTafsirEditions(): Promise<TafsirEdition[]> {
    const res = await fetch(`${API_BASE}/tafsir/editions`);
    return handleResponse<TafsirEdition[]>(res);
  },

  async getAyahTafsir(verseKey: string, edition?: string): Promise<TafsirPassage[]> {
    const url = edition
      ? `${API_BASE}/tafsir/ayah/${verseKey}?edition=${edition}`
      : `${API_BASE}/tafsir/ayah/${verseKey}`;
    const res = await fetch(url);
    return handleResponse<TafsirPassage[]>(res);
  },

  async compareTafsir(verseKey: string): Promise<any> {
    const res = await fetch(`${API_BASE}/tafsir/compare/${verseKey}`);
    return handleResponse<any>(res);
  },

  // Search
  async search(query: string, limit: number = 30): Promise<SearchResponse> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return handleResponse<SearchResponse>(res);
  },

  // Research & Linguistics
  async getRoots(): Promise<ArabicRoot[]> {
    const res = await fetch(`${API_BASE}/research/roots`);
    return handleResponse<ArabicRoot[]>(res);
  },

  async getRootConcordance(rootLetters: string): Promise<any> {
    const res = await fetch(`${API_BASE}/research/roots/${encodeURIComponent(rootLetters)}`);
    return handleResponse<any>(res);
  },

  async getKnowledgeGraph(surahId: number): Promise<KnowledgeGraphResponse> {
    const res = await fetch(`${API_BASE}/research/graph?surah_id=${surahId}`);
    return handleResponse<KnowledgeGraphResponse>(res);
  },

  // AI Assistant
  async askAI(query: string, language: string = 'en', verseContext?: string): Promise<AIResponse> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, verse_context: verseContext }),
    });
    return handleResponse<AIResponse>(res);
  },

  // Audio
  async getReciters(): Promise<Reciter[]> {
    const res = await fetch(`${API_BASE}/audio/reciters`);
    return handleResponse<Reciter[]>(res);
  },

  // Learning
  async getCourses(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/learning/courses`);
    return handleResponse<Course[]>(res);
  },

  // Journal & Bookmarks
  async getBookmarks(): Promise<Bookmark[]> {
    const res = await fetch(`${API_BASE}/journal/bookmarks`);
    return handleResponse<Bookmark[]>(res);
  },

  async addBookmark(verseKey: string, collectionName: string = 'Favorites', note?: string): Promise<Bookmark> {
    const res = await fetch(`${API_BASE}/journal/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verse_key: verseKey, collection_name: collectionName, note }),
    });
    return handleResponse<Bookmark>(res);
  },

  async deleteBookmark(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/journal/bookmarks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<any>(res);
  },

  async getNotes(): Promise<ReflectionNote[]> {
    const res = await fetch(`${API_BASE}/journal/notes`);
    return handleResponse<ReflectionNote[]>(res);
  },

  async createNote(verseKey: string, title: string, content: string, tags: string = ''): Promise<ReflectionNote> {
    const res = await fetch(`${API_BASE}/journal/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verse_key: verseKey, title, content, tags }),
    });
    return handleResponse<ReflectionNote>(res);
  },

  async deleteNote(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/journal/notes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<any>(res);
  },

  // Context & Hadith
  async getAsbabNuzul(verseKey: string): Promise<any> {
    const res = await fetch(`${API_BASE}/context/asbab-nuzul/${verseKey}`);
    return handleResponse<any>(res);
  },

  async getAsbabNuzulRecords(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/context/asbab-nuzul-records`);
    return handleResponse<any[]>(res);
  },

  async getRelatedHadiths(verseKey: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/context/hadith/${verseKey}`);
    return handleResponse<any[]>(res);
  },

  async browseHadiths(params?: { collection?: string; query?: string; verse_key?: string }): Promise<any[]> {
    const searchParams = new URLSearchParams();
    if (params?.collection) searchParams.set('collection', params.collection);
    if (params?.query) searchParams.set('query', params.query);
    if (params?.verse_key) searchParams.set('verse_key', params.verse_key);
    const qs = searchParams.toString();
    const res = await fetch(`${API_BASE}/context/hadiths/browse${qs ? `?${qs}` : ''}`);
    return handleResponse<any[]>(res);
  },

  // Hifz
  async getHifzProgress(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hifz/progress`);
    return handleResponse<any[]>(res);
  },

  async updateHifzProgress(surahId: number, startAyah: number, endAyah: number, status: string, repetitions: number = 1): Promise<any> {
    const res = await fetch(`${API_BASE}/hifz/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surah_id: surahId, start_ayah: startAyah, end_ayah: endAyah, status, repetitions }),
    });
    return handleResponse<any>(res);
  },

  // Admin
  async getAdminIntegrity(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/integrity`);
    return handleResponse<any>(res);
  },
};
