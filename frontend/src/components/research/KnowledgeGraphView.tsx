import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Info, Search, Share2 } from 'lucide-react';
import type { KnowledgeGraphNode, SurahSummary } from '../../types';
import type { InterfaceLanguage } from '../../preferences';
import { t } from '../../i18n';
import { api } from '../../services/api';

interface KnowledgeGraphViewProps {
  surahs: SurahSummary[];
  selectedSurahId: number;
  onSelectSurahId: (id: number) => void;
  onOpenAyahInReader: (verseKey: string) => void;
  interfaceLanguage: InterfaceLanguage;
  onRetrySurahList: () => void;
  surahListError: string | null;
  surahListLoading: boolean;
}

const nodeColors: Record<string, string> = {
  scripture: '#064e3b',
  ayah: '#d97706',
  linguistics: '#047857',
  theme: '#0369a1',
};

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  surahs,
  selectedSurahId,
  onSelectSurahId,
  onOpenAyahInReader,
  interfaceLanguage,
  onRetrySurahList,
  surahListError,
  surahListLoading,
}) => {
  const [graphLoad, setGraphLoad] = useState<{
    surahId: number;
    data?: Awaited<ReturnType<typeof api.getKnowledgeGraph>>;
    error?: string;
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct_text' | 'root_derivation' | 'thematic'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);
  const loading = graphLoad?.surahId !== selectedSurahId;
  const graphData = graphLoad?.surahId === selectedSurahId ? graphLoad.data ?? null : null;
  const error = graphLoad?.surahId === selectedSurahId ? graphLoad.error ?? null : null;

  useEffect(() => {
    let active = true;

    api.getKnowledgeGraph(selectedSurahId)
      .then((data) => {
        if (!active) return;
        setGraphLoad({ surahId: selectedSurahId, data });
        setSelectedNodeId(data.nodes.find((node) => node.is_center)?.id ?? data.nodes[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setGraphLoad({
          surahId: selectedSurahId,
          error: err instanceof Error ? err.message : 'Unable to load the knowledge graph.',
        });
      });

    return () => {
      active = false;
    };
  }, [selectedSurahId, requestVersion]);

  const searchMatchedNodes = useMemo(() => {
    if (!graphData) return [];
    const query = searchFilter.trim().toLocaleLowerCase();
    return graphData.nodes.filter((node) => (
      !query
      || [node.label, node.type, node.arabic, node.desc, node.root_letters]
        .some((value) => value?.toLocaleLowerCase().includes(query))
    ));
  }, [graphData, searchFilter]);

  const searchMatchIds = useMemo(
    () => new Set(searchMatchedNodes.map((node) => node.id)),
    [searchMatchedNodes],
  );

  const matchingEdges = useMemo(
    () => graphData?.edges.filter((edge) => activeFilter === 'all' || edge.type === activeFilter) ?? [],
    [graphData, activeFilter],
  );

  const searchRelatedIds = useMemo(() => {
    if (!graphData) return new Set<string>();
    if (!searchFilter.trim()) {
      return new Set(graphData.nodes.map((node) => node.id));
    }
    const ids = new Set(searchMatchIds);
    if (searchMatchIds.size > 0) {
      graphData.nodes.filter((node) => node.is_center).forEach((node) => ids.add(node.id));
      matchingEdges.forEach((edge) => {
        if (searchMatchIds.has(edge.source) || searchMatchIds.has(edge.target)) {
          ids.add(edge.source);
          ids.add(edge.target);
        }
      });
    }
    return ids;
  }, [graphData, searchFilter, searchMatchIds, matchingEdges]);

  const visibleEdges = useMemo(
    () => matchingEdges.filter((edge) => searchRelatedIds.has(edge.source) && searchRelatedIds.has(edge.target)),
    [matchingEdges, searchRelatedIds],
  );

  const matchingNodes = useMemo(
    () => graphData?.nodes.filter((node) => searchRelatedIds.has(node.id)) ?? [],
    [graphData, searchRelatedIds],
  );
  const visibleNodes = useMemo(() => matchingNodes.filter((node) => (
    searchRelatedIds.has(node.id)
    && (activeFilter === 'all' || node.is_center || visibleEdges.some((edge) => edge.source === node.id || edge.target === node.id))
  )), [matchingNodes, activeFilter, searchRelatedIds, visibleEdges]);

  const selectedNode = visibleNodes.find((node) => node.id === selectedNodeId) ?? visibleNodes[0] ?? null;
  const selectedNodeVerseKey = selectedNode?.verse_key;
  const positions = useMemo(() => {
    const center = visibleNodes.find((node) => node.is_center) ?? visibleNodes[0];
    const surrounding = visibleNodes.filter((node) => node.id !== center?.id);
    const coords = new Map<string, { x: number; y: number }>();

    if (center) coords.set(center.id, { x: 300, y: 200 });
    surrounding.forEach((node, index) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * index) / surrounding.length;
      coords.set(node.id, {
        x: 300 + Math.cos(angle) * 190,
        y: 200 + Math.sin(angle) * 140,
      });
    });
    return coords;
  }, [visibleNodes]);

  const selectedNodeAyah = selectedNode && graphData
    ? graphData.edges
      .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
      .map((edge) => edge.source === selectedNode.id ? edge.target : edge.source)
      .map((id) => graphData.nodes.find((node) => node.id === id))
      .find((node) => node?.verse_key)?.verse_key
    : undefined;
  const targetVerseKey = selectedNode?.verse_key
    ?? selectedNodeAyah
    ?? graphData?.sampled_ayahs[0];
  const filterOptions = [
    { id: 'all', label: t(interfaceLanguage, 'allRelations') },
    { id: 'direct_text', label: t(interfaceLanguage, 'directText') },
    { id: 'root_derivation', label: t(interfaceLanguage, 'sharedRoot') },
    { id: 'thematic', label: t(interfaceLanguage, 'themes') },
  ] as const;
  const fetchErrorMessage = error?.includes('fetch')
    ? `${t(interfaceLanguage, 'retryHelp')} (${error})`
    : error;

  const handleNodeKeyDown = (event: React.KeyboardEvent<SVGGElement>, node: KnowledgeGraphNode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedNodeId(node.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#fbbf24] font-bold text-xs uppercase tracking-wider mb-1">
          <Share2 className="w-4 h-4" />
          <span>Interactive Knowledge Graph</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t(interfaceLanguage, 'graphTitle')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          {t(interfaceLanguage, 'graphDescription')}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t(interfaceLanguage, 'surah')}
            <select
              value={selectedSurahId}
              onChange={(event) => onSelectSurahId(Number(event.target.value))}
              disabled={surahs.length === 0 || surahListLoading}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium disabled:opacity-60"
              style={{ colorScheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' }}
            >
              {surahs.map((surah) => (
                <option key={surah.id} value={surah.id}>
                  {surah.id}. {surah.name_simple} — {surah.name_arabic}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t(interfaceLanguage, 'searchGraph')}
            <span className="relative block mt-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchFilter}
                onChange={(event) => setSearchFilter(event.target.value)}
                placeholder={t(interfaceLanguage, 'searchGraph')}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs placeholder:text-slate-400"
              />
            </span>
          </label>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t(interfaceLanguage, 'filters')}</span>
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={`px-3 py-1.5 min-h-10 rounded-xl font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                activeFilter === filter.id
                  ? 'bg-[#064e3b] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {graphData && (
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-300" aria-live="polite">
            {visibleNodes.length} entities · {visibleEdges.length} relationships
          </p>
        )}
        {surahListError && (
          <p className="mt-3 text-xs text-amber-800 dark:text-amber-300" role="status">
            {t(interfaceLanguage, 'surahUnavailable')} {surahListError}
            <button
              onClick={onRetrySurahList}
              className="ml-2 underline underline-offset-2 focus-visible:outline-2"
            >
              {t(interfaceLanguage, 'retry')}
            </button>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
          {loading && (
            <div className="text-center space-y-2" role="status" aria-live="polite">
              <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-300">{t(interfaceLanguage, 'loadingGraph')}</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center space-y-3 max-w-md" role="alert">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                {t(interfaceLanguage, 'failedGraph')}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">{fetchErrorMessage}</p>
              <button
                onClick={() => setRequestVersion((version) => version + 1)}
                className="px-4 py-2 min-h-10 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                {t(interfaceLanguage, 'retry')}
              </button>
            </div>
          )}

          {!loading && !error && graphData && visibleNodes.length > 0 && (
            <div className="w-full overflow-x-auto overscroll-x-contain" aria-label="Scrollable graph canvas">
              <svg
                className="w-full min-w-[560px] h-[400px] sm:h-[440px]"
                viewBox="0 0 600 400"
                role="img"
                aria-label={`Semantic network for Surah ${graphData.surah_name}`}
              >
                {visibleEdges.map((edge) => {
                  const source = positions.get(edge.source);
                  const target = positions.get(edge.target);
                  if (!source || !target) return null;
                  const color = edge.type === 'direct_text' ? '#047857'
                    : edge.type === 'root_derivation' ? '#d97706' : '#0284c7';
                  return (
                    <line
                      key={`${edge.source}-${edge.target}-${edge.type}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={color}
                      strokeWidth="2"
                      strokeOpacity="0.7"
                    />
                  );
                })}

                {visibleNodes.map((node) => {
                  const position = positions.get(node.id);
                  if (!position) return null;
                  const isSelected = node.id === selectedNode?.id;
                  const color = nodeColors[node.group] ?? '#475569';
                  const label = node.label.length > 14 ? `${node.label.slice(0, 12)}…` : node.label;
                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer focus-visible:outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.type}: ${node.label}`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedNodeId(node.id)}
                      onKeyDown={(event) => handleNodeKeyDown(event, node)}
                    >
                      <title>{node.label}{node.desc ? ` — ${node.desc}` : ''}</title>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={node.is_center ? 45 : 34}
                        fill={color}
                        stroke={isSelected ? '#fbbf24' : 'transparent'}
                        strokeWidth="4"
                      />
                      {node.arabic && (
                        <text
                          x={position.x}
                          y={position.y - 4}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="bold"
                          direction="rtl"
                          pointerEvents="none"
                        >
                          {node.arabic.length > 13 ? `${node.arabic.slice(0, 11)}…` : node.arabic}
                        </text>
                      )}
                      <text
                        x={position.x}
                        y={position.y + (node.arabic ? 13 : 4)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {!loading && !error && graphData && visibleNodes.length === 0 && (
            <p className="text-sm text-slate-700 dark:text-slate-200 text-center py-10">
              {t(interfaceLanguage, 'noEntities')}
            </p>
          )}

          <div className="w-full flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-700 dark:text-slate-200 pt-3 border-t border-slate-100 dark:border-slate-800">
            {Object.entries(nodeColors).map(([group, color]) => (
              <span key={group} className="flex items-center gap-1.5 capitalize">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {group === 'scripture' ? t(interfaceLanguage, 'surah')
                  : group === 'ayah' ? 'Ayah'
                    : group === 'linguistics' ? 'Arabic Root' : t(interfaceLanguage, 'themes')}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>{t(interfaceLanguage, 'graphInspector')}</span>
            </div>

            {selectedNode ? (
              <div className="space-y-3" aria-live="polite">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300">
                  {selectedNode.type}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white break-words">
                  {selectedNode.label}
                </h3>
                {selectedNode.arabic && (
                  <p className="font-arabic text-2xl text-[#064e3b] dark:text-[#fbbf24]" dir="rtl">
                    {selectedNode.arabic}
                  </p>
                )}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedNode.desc || t(interfaceLanguage, 'selectNode')}
                </p>
                {selectedNode.source && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 border-l-2 border-emerald-600 pl-3">
                    Source: {selectedNode.source}
                  </p>
                )}
                {selectedNodeVerseKey && (
                  <button
                    onClick={() => onOpenAyahInReader(selectedNodeVerseKey)}
                    className="w-full py-2 px-3 min-h-10 rounded-xl border border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    {t(interfaceLanguage, 'openAyah')} {selectedNodeVerseKey}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {loading ? t(interfaceLanguage, 'loadingGraph') : t(interfaceLanguage, 'selectNode')}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 space-y-3">
            {graphData && (
              <details className="text-xs text-slate-700 dark:text-slate-300">
                <summary className="cursor-pointer font-semibold min-h-8 flex items-center">
                  {t(interfaceLanguage, 'graphProvenance')}
                </summary>
                <p className="mt-1">{t(interfaceLanguage, 'sampledOnly')}</p>
                <p className="mt-1">{t(interfaceLanguage, 'rootsOnly')}</p>
                <p className="mt-1">{t(interfaceLanguage, 'themesOnly')}</p>
                <p className="mt-2 font-medium">
                  {t(interfaceLanguage, 'ayahSample')}: {graphData.sampled_ayahs?.join(', ') || 'None'}
                </p>
              </details>
            )}
            <button
              onClick={() => targetVerseKey && onOpenAyahInReader(targetVerseKey)}
              disabled={!targetVerseKey}
              className="w-full py-2.5 px-4 min-h-11 rounded-xl bg-[#064e3b] hover:bg-[#047857] disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <span>{targetVerseKey ? `${t(interfaceLanguage, 'openAyah')} ${targetVerseKey}` : t(interfaceLanguage, 'noAyah')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
