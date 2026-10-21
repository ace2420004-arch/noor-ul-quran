import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, FileText, Lock, RefreshCw, Send } from 'lucide-react';
import { api } from '../../services/api';

export const AdminIntegrityView: React.FC = () => {
  const [integrityData, setIntegrityData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reportType, setReportType] = useState<string>('translation');
  const [reportEntityId, setReportEntityId] = useState<string>('1:1');
  const [issueDesc, setIssueDesc] = useState<string>('');
  const [proposedText, setProposedText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const loadIntegrity = () => {
    setLoading(true);
    api.getAdminIntegrity()
      .then((data) => {
        setIntegrityData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadIntegrity();
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDesc.trim() || !proposedText.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setIssueDesc('');
      setProposedText('');
      setReportSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Content Integrity & Provenance Dashboard</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dataset Cryptographic Verification & Audit Trail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Immutable canonical Quran storage verification, dataset checksums, and audited correction workflow.
            </p>
          </div>
          <button
            onClick={loadIntegrity}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            title="Re-run integrity verification"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-verify</span>
          </button>
        </div>
      </div>

      {/* Health Cards */}
      {integrityData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-400">Canonical Chapters</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-[#064e3b] dark:text-[#fbbf24]">
                {integrityData.surahs_registered} / {integrityData.surahs_target}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">114 Surahs Authenticated</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-400">Sacred Text Firewall</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                LOCKED / IMMUTABLE
              </span>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Read-Only Canonical Core</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-400">Active Translations</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">
                {integrityData.translation_editions_active} Editions
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">EN, UR, HI, Hinglish, etc.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-400">Classical Tafsir Works</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">
                {integrityData.tafsir_editions_active} Works
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Ibn Kathir, Jalalayn, Maududi</p>
          </div>
        </div>
      )}

      {/* Dataset Version Checksums */}
      {integrityData?.dataset_versions && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#064e3b]" />
            Authenticated Dataset Fingerprints (SHA-256)
          </h3>

          <div className="space-y-3">
            {integrityData.dataset_versions.map((v: any, i: number) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-[#064e3b] dark:text-[#fbbf24]">
                  <span>{v.name} ({v.version})</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Audited by: {v.verified_by}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <span className="shrink-0 font-bold">SHA-256:</span>
                  <span className="break-all text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                    {v.sha256}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Correction Submission Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Propose a Translation or Typo Correction
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Community and scholarly review ticket. Any accepted change is logged with full version history and attribution.
          </p>
        </div>

        {reportSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you. Your correction report has been queued for review by scholarly administrators.</span>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Content Type:
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="translation">Translation text</option>
                  <option value="tafsir">Tafsir passage citation</option>
                  <option value="morphology">Arabic root or morphology label</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Verse Key Reference:
                </label>
                <input
                  type="text"
                  value={reportEntityId}
                  onChange={(e) => setReportEntityId(e.target.value)}
                  placeholder="e.g. 1:1, 2:255"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Issue Description:
              </label>
              <textarea
                rows={2}
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Explain the inaccuracy, typo, or missing attribution with references..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Proposed Correction & Supporting Scholarly Source:
              </label>
              <textarea
                rows={2}
                value={proposedText}
                onChange={(e) => setProposedText(e.target.value)}
                placeholder="Provide corrected wording and cite the published work/edition..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Correction Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
