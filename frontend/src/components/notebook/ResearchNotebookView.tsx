import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Tag, Download, Trash2 } from 'lucide-react';
import type { ReflectionNote } from '../../types';
import { api } from '../../services/api';

interface ResearchNotebookViewProps {
  onOpenAyahInReader: (verseKey: string) => void;
}

export const ResearchNotebookView: React.FC<ResearchNotebookViewProps> = ({ onOpenAyahInReader }) => {
  const [notes, setNotes] = useState<ReflectionNote[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [verseKeyInput, setVerseKeyInput] = useState<string>('1:1');
  const [titleInput, setTitleInput] = useState<string>('');
  const [contentInput, setContentInput] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('Tawhid, Gratitude');

  const loadNotes = () => {
    api.getNotes().then(setNotes).catch(console.error);
  };

  const handleDeleteNote = (id: number) => {
    api.deleteNote(id).then(loadNotes).catch(console.error);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNote = () => {
    if (!titleInput.trim() || !contentInput.trim()) return;

    api.createNote(verseKeyInput, titleInput, contentInput, tagsInput)
      .then(() => {
        loadNotes();
        setShowCreateModal(false);
        setTitleInput('');
        setContentInput('');
      })
      .catch(console.error);
  };

  const handleExportMarkdown = () => {
    let md = '# Noor-ul-Quran (نور القرآن) — Private Reflection Journal\n\n';
    notes.forEach((n) => {
      md += `## ${n.title} (Ayah ${n.verse_key})\n`;
      md += `*Tags: ${n.tags} | Date: ${new Date(n.created_at).toLocaleDateString()}*\n\n`;
      md += `${n.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noor_ul_quran_journal_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <BookMarked className="w-4 h-4" />
              <span>Personal Reflection Journal</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Private Research Notes & Reflections
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Record personal insights, practical actions, and questions for further study linked to specific Ayahs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Reflection</span>
            </button>

            {notes.length > 0 && (
              <button
                onClick={handleExportMarkdown}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Export Journal to Markdown"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes Feed */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#064e3b] dark:text-[#fbbf24]">
                  {note.title}
                </span>
                <button
                  onClick={() => onOpenAyahInReader(note.verse_key)}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-slate-800 text-[#064e3b] dark:text-[#fbbf24] font-bold text-[11px] hover:underline"
                >
                  Ayah {note.verse_key}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>

            {note.tags && (
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                {note.tags.split(',').map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {notes.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <BookMarked className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">Your journal is empty</p>
            <p>Click "New Reflection" or click the note icon on any Ayah in the Quran Reader.</p>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-950/15 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Reflection Note
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Verse Key Reference:
                </label>
                <input
                  type="text"
                  value={verseKeyInput}
                  onChange={(e) => setVerseKeyInput(e.target.value)}
                  placeholder="e.g. 1:1, 2:255"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reflection Title:
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Contemplating Divine Compassion"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Personal Reflections & Action Points:
                </label>
                <textarea
                  rows={4}
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Write your personal reflections, questions, or action items..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tags (comma-separated):
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Tawhid, Patience, Daily Life"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#047857]"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
