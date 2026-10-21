import React, { useState, useEffect } from 'react';
import { GraduationCap, RotateCcw, Award } from 'lucide-react';
import type { Course } from '../../types';
import { api } from '../../services/api';

export const LearningAcademyView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz'>('flashcards');
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  useEffect(() => {
    api.getCourses()
      .then((data) => {
        setCourses(data);
        if (data.length > 0) setSelectedCourse(data[0]);
      })
      .catch(console.error);
  }, []);

  if (!selectedCourse) return null;

  const currentFlashcard = selectedCourse.flashcards[flashcardIdx];

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    if (!selectedCourse.quiz) return 0;
    let score = 0;
    selectedCourse.quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct_index) score += 1;
    });
    return score;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Noor-ul-Quran Learning Academy</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Structured Quranic Arabic & Tafsir Studies
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Interactive vocabulary flashcards, grammar foundations, and verified comprehension assessments.
            </p>
          </div>

          {/* Course Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCourse(c);
                  setFlashcardIdx(0);
                  setIsFlipped(false);
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCourse.id === c.id
                    ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Course Info & Tab Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-white mr-2">{selectedCourse.title}</span>
            <span className="text-[11px] font-arabic text-[#064e3b] dark:text-[#fbbf24]">
              ({selectedCourse.title_ar})
            </span>
            <span className="ml-3 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-semibold text-[10px]">
              Level: {selectedCourse.level}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'flashcards'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Vocabulary Flashcards ({selectedCourse.flashcards.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Comprehension Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Main Study Arena */}
      {activeTab === 'flashcards' ? (
        /* Flashcards Arena */
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md text-center cursor-pointer transition-all hover:border-[#064e3b] flex flex-col items-center justify-center min-h-[300px] select-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
              Card {flashcardIdx + 1} of {selectedCourse.flashcards.length} • Click to Flip
            </span>

            {!isFlipped ? (
              <div className="space-y-2">
                <p className="font-arabic text-5xl sm:text-6xl text-[#064e3b] dark:text-[#fbbf24] font-bold">
                  {currentFlashcard.arabic}
                </p>
                <p className="text-sm font-semibold text-slate-400">
                  {currentFlashcard.transliteration}
                </p>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  "{currentFlashcard.meaning}"
                </p>
                {currentFlashcard.root && (
                  <p className="text-xs text-slate-500 font-medium">
                    Root: <span className="font-arabic font-bold text-sm text-[#064e3b] dark:text-[#fbbf24]">{currentFlashcard.root}</span>
                  </p>
                )}
              </div>
            )}

            <span className="text-[11px] text-slate-400 mt-6">
              {isFlipped ? 'Tap to see Arabic' : 'Tap to see English Meaning & Root'}
            </span>
          </div>

          {/* Flashcard Nav Controls */}
          <div className="flex items-center justify-between px-2">
            <button
              disabled={flashcardIdx === 0}
              onClick={() => {
                setFlashcardIdx((prev) => prev - 1);
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous Card
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {flashcardIdx + 1} / {selectedCourse.flashcards.length}
            </span>
            <button
              disabled={flashcardIdx === selectedCourse.flashcards.length - 1}
              onClick={() => {
                setFlashcardIdx((prev) => prev + 1);
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#047857]"
            >
              Next Card
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Arena */
        selectedCourse.quiz && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {selectedCourse.quiz.title}
                </h3>
                <p className="text-xs text-slate-500">Test your mastery of foundational vocabulary and grammar.</p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <Award className="w-4 h-4 text-[#d97706]" />
                  <span>Score: {calculateScore()} / {selectedCourse.quiz.questions.length}</span>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {selectedCourse.quiz.questions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <p className="font-bold text-sm text-slate-800 dark:text-white">
                    {idx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

                      if (isSelected) {
                        btnStyle = 'border-[#064e3b] bg-emerald-50 dark:bg-slate-700 text-[#064e3b] dark:text-[#fbbf24] font-bold';
                      }

                      if (quizSubmitted) {
                        if (optIdx === q.correct_index) {
                          btnStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isSelected && optIdx !== q.correct_index) {
                          btnStyle = 'border-red-400 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Action Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>

              {!quizSubmitted ? (
                <button
                  disabled={Object.keys(quizAnswers).length < selectedCourse.quiz.questions.length}
                  onClick={() => setQuizSubmitted(true)}
                  className="px-5 py-2 rounded-xl bg-[#064e3b] hover:bg-[#047857] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-colors"
                >
                  Submit Answers
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Assessment Complete
                </span>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
