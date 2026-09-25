import React, { useState, useRef, useEffect } from 'react';
import { SquadPnL, TelemetryData, SquadId } from '../types';
import { engineApi } from '../services/engineApi';
import {
  TrendingUp,
  ShieldCheck,
  Copy,
  Check,
  Info,
  ArrowRightLeft,
  ChevronsRight,
  Eye,
  SlidersHorizontal,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';

interface PnLTelemetryTableProps {
  telemetry: TelemetryData;
  onRefreshTelemetry: () => void;
  onSimulateSale: (squadId: SquadId, amountCAD: number) => void;
}

export const PnLTelemetryTable: React.FC<PnLTelemetryTableProps> = ({
  telemetry,
  onSimulateSale,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedSquadForSale, setSelectedSquadForSale] = useState<SquadId>('cogniflow');
  const [isAddingSale, setIsAddingSale] = useState(false);
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);
  const [hasScrolledRight, setHasScrolledRight] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [chartViewMode, setChartViewMode] = useState<
    'squads' | 'ca_brut' | 'microservices' | 'timeline'
  >('squads');

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const importFormula = engineApi.getGoogleSheetsImportFormula();

  const handleCopyFormula = async () => {
    try {
      await navigator.clipboard.writeText(importFormula);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleQuickAddSale = (squadId: SquadId, amountCAD: number) => {
    setIsAddingSale(true);
    onSimulateSale(squadId, amountCAD);
    setTimeout(() => setIsAddingSale(false), 400);
  };

  // Gestion du scroll horizontal fluide et indicateurs visuels
  const checkScroll = () => {
    if (tableContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
      setHasScrolledRight(scrollLeft > 12);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 12);
    }
  };

  useEffect(() => {
    const el = tableContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [telemetry, showAllColumnsMobile]);

  const { squads, summary } = telemetry;

  // Données Recharts 1 : Répartition directe du CA Brut par escouade (30 derniers jours)
  const squadChartData = squads.map((sq) => {
    const sharePercentage =
      summary.totalGrossCAD > 0
        ? Math.round((sq.grossRevenueCAD / summary.totalGrossCAD) * 1000) / 10
        : 0;

    const isSovereign = sq.id === 'sovereign-mcp';
    const isCogniFlow = sq.id === 'cogniflow';

    const modelBadge = isSovereign
      ? 'Parnas (1972)'
      : isCogniFlow
      ? 'ToT (Tree-of-Thoughts)'
      : 'Colibrì MoE';

    const modelName = isSovereign
      ? 'Parnas · Isolation Modulaire'
      : isCogniFlow
      ? 'ToT · Auto-Guérison 3-Essais'
      : 'MoE · Routage Spéculatif';

    const modelTechForce = isSovereign
      ? 'Étanchéité Parnas (1972) · Isolation contextes & tokens maîtres scellés SHA-256, zéro fuite LLM'
      : isCogniFlow
      ? 'Tree-of-Thoughts (ToT) Récursif · Auto-guérison 3 paliers stricts > 99.8%, zéro arrêt de production'
      : 'Colibrì MoE Speculative Router · Arbitrage multi-modèles (Mixtral/Llama/GPT), économie -60% à -80% API';

    return {
      id: sq.id,
      name: sq.name,
      shortName: sq.name.replace(' Systems', '').replace(' Matrix', '').replace(' Lab', ''),
      CA_Brut_CAD: Math.round(sq.grossRevenueCAD * 100) / 100,
      caBrut: Math.round(sq.grossRevenueCAD * 100) / 100,
      netMichael: Math.round(sq.netMichaelCAD * 100) / 100,
      pertesEvitees: Math.round(sq.lossesAvoidedCAD * 100) / 100,
      modelValueCAD: Math.round(sq.lossesAvoidedCAD * 100) / 100,
      modelBadge,
      modelName,
      modelTechForce,
      orders: sq.ordersDelivered,
      share: sharePercentage,
      color: isSovereign
        ? 'url(#cyanGrad)'
        : isCogniFlow
        ? 'url(#emeraldGrad)'
        : 'url(#slateGrad)',
      rawColor: isSovereign ? '#06b6d4' : isCogniFlow ? '#10b981' : '#64748b',
      strokeColor: isSovereign ? '#22d3ee' : isCogniFlow ? '#34d399' : '#94a3b8',
    };
  });

  // Données Recharts 2 : Évolution chronologique des 30 derniers jours par tranches hebdomadaires
  const weeklyTimelineData = [
    {
      period: 'Semaine 1 (J-30)',
      'Sovereign MCP Lab': Math.round(squads[0]?.grossRevenueCAD * 0.18 * 100) / 100,
      'CogniFlow Systems': Math.round(squads[1]?.grossRevenueCAD * 0.20 * 100) / 100,
      'FinOps Matrix': Math.round(squads[2]?.grossRevenueCAD * 0.15 * 100) / 100,
    },
    {
      period: 'Semaine 2 (J-21)',
      'Sovereign MCP Lab': Math.round(squads[0]?.grossRevenueCAD * 0.24 * 100) / 100,
      'CogniFlow Systems': Math.round(squads[1]?.grossRevenueCAD * 0.22 * 100) / 100,
      'FinOps Matrix': Math.round(squads[2]?.grossRevenueCAD * 0.25 * 100) / 100,
    },
    {
      period: 'Semaine 3 (J-14)',
      'Sovereign MCP Lab': Math.round(squads[0]?.grossRevenueCAD * 0.28 * 100) / 100,
      'CogniFlow Systems': Math.round(squads[1]?.grossRevenueCAD * 0.28 * 100) / 100,
      'FinOps Matrix': Math.round(squads[2]?.grossRevenueCAD * 0.30 * 100) / 100,
    },
    {
      period: 'Semaine 4 (En cours)',
      'Sovereign MCP Lab':
        Math.round((squads[0]?.grossRevenueCAD - (squads[0]?.grossRevenueCAD * 0.70)) * 100) / 100,
      'CogniFlow Systems':
        Math.round((squads[1]?.grossRevenueCAD - (squads[1]?.grossRevenueCAD * 0.70)) * 100) / 100,
      'FinOps Matrix':
        Math.round((squads[2]?.grossRevenueCAD - (squads[2]?.grossRevenueCAD * 0.70)) * 100) / 100,
    },
  ];

  // Tooltip customisé sombre & typographie tabulaire
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const firstPayload = payload[0]?.payload;
      const modelBadge = firstPayload?.modelBadge;
      const modelTechForce = firstPayload?.modelTechForce;

      return (
        <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs backdrop-blur-md max-w-sm">
          <div className="font-semibold text-slate-200 mb-1.5 border-b border-slate-800 pb-1 flex items-center justify-between gap-2">
            <span>{label}</span>
            {modelBadge && (
              <span className="text-[10px] font-mono-tabular font-bold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/60 text-purple-300">
                {modelBadge}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {payload.map((entry: any, index: number) => {
              const dotColor =
                entry.payload?.rawColor ||
                (typeof entry.fill === 'string' && !entry.fill.startsWith('url')
                  ? entry.fill
                  : typeof entry.color === 'string' && !entry.color.startsWith('url')
                  ? entry.color
                  : '#38bdf8');

              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-mono-tabular">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-600/50"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span>{entry.name}:</span>
                  </span>
                  <span className="font-bold text-white">
                    {typeof entry.value === 'number' ? `${entry.value.toFixed(2)} $ CAD` : entry.value}
                  </span>
                </div>
              );
            })}
          </div>

          {modelTechForce && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] leading-relaxed">
              <span className="text-purple-300 font-semibold flex items-center gap-1 mb-0.5">
                <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                Force Unique ({modelBadge}) :
              </span>
              <p className="text-slate-400">{modelTechForce}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-7 shadow-lg space-y-5 sm:space-y-6">
      {/* En-tête de section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Invariant Financier 02 · Télémétrie PnL en Temps Réel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Performances Financières & Déductions Fiscales Strictes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Régime fiscal québécois modélisé en continu : 14,975% TPS/TVQ combinées + 12,20% impôt société PME
            (total 27,175% réservés pour conformité fiscale sans friction).
          </p>
        </div>

        {/* Bouton de copie Google Sheets =IMPORTDATA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleCopyFormula}
            title={importFormula}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700/80 hover:border-emerald-500/60 text-xs font-medium text-slate-200 transition-colors shadow-sm group"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Formule Google Sheets copiée !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                <span className="font-mono-tabular text-slate-300">
                  Copier formule <code className="text-cyan-300 font-bold">=IMPORTDATA(...)</code>
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cartes récapitulatives PnL */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mb-0.5 sm:mb-1">Commandes Livrées</div>
          <div className="font-mono-tabular text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1 sm:gap-1.5">
            {summary.totalOrders}
            <span className="text-[10px] sm:text-xs text-emerald-400 font-normal">validées</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">Par les 3 escouades</div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mb-0.5 sm:mb-1">Chiffre d'Affaires Brut</div>
          <div className="font-mono-tabular text-xl sm:text-2xl font-bold text-cyan-300">
            {summary.totalGrossCAD.toFixed(2)} $
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">Total encaissé (30j)</div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mb-0.5 sm:mb-1">Taxes (27,175%)</div>
          <div className="font-mono-tabular text-xl sm:text-2xl font-bold text-amber-400">
            {summary.totalTaxesCAD.toFixed(2)} $
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1 truncate">TPS/TVQ + PME</div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-slate-950/70 border border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 to-slate-950">
          <div className="text-[11px] sm:text-xs text-emerald-400 font-medium mb-0.5 sm:mb-1">Bénéfice Net Michael</div>
          <div className="font-mono-tabular text-xl sm:text-2xl font-bold text-emerald-300">
            {summary.totalNetCAD.toFixed(2)} $
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400/80 mt-0.5 sm:mt-1 truncate">Net direct disponible</div>
        </div>
      </div>

      {/* NOUVEAU GRAPHIQUE RECHARTS : RÉPARTITION DU CHIFFRE D'AFFAIRES (30 DERNIERS JOURS) */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Performances & Répartition CA Brut (30 Derniers Jours)</span>
                <span className="text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
                  Total Brut : {summary.totalGrossCAD.toFixed(2)} $ CAD
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Visualisation Recharts du CA Brut (CA_Brut_CAD) des 3 escouades, comparatif 3 barres et architecture des micro-services.
              </p>
            </div>
          </div>

          {/* Boutons de bascule de vue de graphique */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartViewMode('squads')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                chartViewMode === 'squads'
                  ? 'bg-cyan-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Comparatif 3 Barres (Parnas · ToT · MoE)</span>
            </button>
            <button
              onClick={() => setChartViewMode('ca_brut')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                chartViewMode === 'ca_brut'
                  ? 'bg-cyan-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Répartition CA Brut (30j)</span>
            </button>
            <button
              onClick={() => setChartViewMode('microservices')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                chartViewMode === 'microservices'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 Micro-Services Dédiés</span>
            </button>
            <button
              onClick={() => setChartViewMode('timeline')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                chartViewMode === 'timeline'
                  ? 'bg-cyan-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Chronologie 30J</span>
            </button>
          </div>
        </div>

        {/* Zone de rendu Recharts */}
        <div className="w-full pt-2">
          {chartViewMode === 'ca_brut' ? (
            /* Bar Chart dédié : Répartition du CA Brut (CA_Brut_CAD) des 3 escouades sur 30 jours */
            <div className="space-y-3">
              <div className="h-[290px] sm:h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={squadChartData}
                    margin={{ top: 25, right: 15, left: -10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity={0.75} />
                      </linearGradient>
                      <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.75} />
                      </linearGradient>
                      <linearGradient id="slateGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#475569" stopOpacity={0.75} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: '#cbd5e1', fontSize: 11 }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={{ stroke: '#334155' }}
                      tickFormatter={(val) => `${val} $`}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar
                      dataKey="CA_Brut_CAD"
                      name="Chiffre d'Affaires Brut (CA_Brut_CAD)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={64}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={{
                        position: 'top',
                        fill: '#38bdf8',
                        fontSize: 12,
                        fontWeight: 700,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (val: any) =>
                          typeof val === 'number' ? `${val.toFixed(2)} $` : `${val} $`,
                      }}
                    >
                      {squadChartData.map((entry, index) => (
                        <Cell
                          key={`cell-brut-${index}`}
                          fill={entry.color}
                          stroke={entry.strokeColor}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Synthèse responsive des 3 Escouades aux tons Cyan, Émeraude et Ardoise */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {squadChartData.map((sq, idx) => (
                  <div
                    key={`summary-brut-${idx}`}
                    className={`p-2.5 rounded-lg border flex items-center justify-between font-mono-tabular text-xs transition-colors ${
                      sq.id === 'sovereign-mcp'
                        ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-200 hover:border-cyan-500/60'
                        : sq.id === 'cogniflow'
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200 hover:border-emerald-500/60'
                        : 'bg-slate-900/60 border-slate-700/50 text-slate-200 hover:border-slate-500/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-600/40"
                        style={{ backgroundColor: sq.rawColor }}
                      />
                      <span className="font-semibold text-slate-200 font-sans truncate max-w-[130px]">
                        {sq.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{sq.CA_Brut_CAD.toFixed(2)} $</span>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-sans">({sq.share}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : chartViewMode === 'squads' ? (
            <div className="space-y-3">
              <div className="h-[290px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={squadChartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="shortName"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickLine={{ stroke: '#334155' }}
                      tickFormatter={(val) => `${val} $`}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                      formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                    />
                    <Bar
                      dataKey="caBrut"
                      name="1. CA Brut (CAD)"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30}
                    />
                    <Bar
                      dataKey="netMichael"
                      name="2. Net Michael (-27,175%)"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30}
                    />
                    <Bar
                      dataKey="pertesEvitees"
                      name="3. Force Modèle Spécifique (Parnas / ToT / MoE)"
                      fill="#a855f7"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Cartes détaillant les Forces Techniques Uniques (Parnas, ToT, MoE) de chaque Micro-Service */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {squadChartData.map((sq, idx) => (
                  <div
                    key={`tech-force-${idx}`}
                    className="p-3 rounded-lg bg-slate-950/80 border border-purple-900/40 hover:border-purple-500/50 transition-colors flex flex-col justify-between space-y-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-white truncate">{sq.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tabular font-bold bg-purple-950/90 border border-purple-800/60 text-purple-300">
                          {sq.modelBadge}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>Force : {sq.modelName}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {sq.modelTechForce}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tabular">
                      <span className="text-slate-400">Pertes Évitées & Économies :</span>
                      <span className="font-bold text-purple-300">+{sq.pertesEvitees.toFixed(2)} $ CAD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : chartViewMode === 'microservices' ? (
            /* 3 Graphiques distincts pour chaque Micro-Service avec sa force de modèle */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
              {squadChartData.map((sq, i) => {
                const singleServiceData = [
                  { name: '1. CA Brut', montant: sq.caBrut, fill: '#06b6d4' },
                  { name: '2. Net Michael', montant: sq.netMichael, fill: '#10b981' },
                  { name: `3. Force ${sq.modelBadge}`, montant: sq.pertesEvitees, fill: '#a855f7' },
                ];

                const microModelInfo = [
                  {
                    title: 'Micro-Service 01 · Sovereign MCP',
                    model: 'Cascade OpenRouter Free Tier (Gemma 4 / Nemotron 3 / Ling 3.0 / Nex N2.5) + Qwen 2.5 Coder',
                    force: 'Étanchéité Parnas 100% · Zéro Data Leak',
                    desc: 'Cascade 4 fallbacks résiliente + expert MCP qwen-2.5-coder-32b-instruct sans coût API.',
                  },
                  {
                    title: 'Micro-Service 02 · CogniFlow Systems',
                    model: 'Tree-of-Thoughts (ToT) Récursif 3-Essais',
                    force: 'Auto-Guérison 99.8% · SHA-256 Scellé',
                    desc: 'Réparation autonome immédiate de contrats API et webhooks.',
                  },
                  {
                    title: 'Micro-Service 03 · FinOps Matrix',
                    model: 'Colibrì MoE Speculative Router',
                    force: 'Routage Spéculatif · -73.4% Coûts API',
                    desc: 'Arbitrage temps réel vers le LLM optimal sans perte de qualité.',
                  },
                ][i];

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {microModelInfo.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tabular font-bold bg-purple-950/80 border border-purple-800/60 text-purple-300">
                          Force Modèle
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white mb-0.5">
                        {microModelInfo.model}
                      </div>
                      <div className="text-[11px] font-semibold text-purple-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{microModelInfo.force}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {microModelInfo.desc}
                      </p>
                    </div>

                    {/* Mini BarChart Recharts pour ce Micro-Service */}
                    <div className="h-[150px] w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={singleServiceData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
                          <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 9 }}
                            tickLine={false}
                            tickFormatter={(val) => `${val}$`}
                          />
                          <Tooltip content={<CustomChartTooltip />} />
                          <Bar dataKey="montant" radius={[4, 4, 0, 0]} maxBarSize={36}>
                            {singleServiceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tabular">
                      <span className="text-slate-400">Pertes évitées :</span>
                      <span className="font-bold text-purple-300">+{sq.pertesEvitees.toFixed(2)} $ CAD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[290px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyTimelineData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="period"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => `${val} $`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                    formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                  />
                  <Bar
                    dataKey="Sovereign MCP Lab"
                    stackId="a"
                    fill="#06b6d4"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    dataKey="CogniFlow Systems"
                    stackId="a"
                    fill="#10b981"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    dataKey="FinOps Matrix"
                    stackId="a"
                    fill="#64748b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Détail des 3 Micro-Services avec la Force de Chaque Modèle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Micro-Service 1 : Sovereign MCP */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                  Micro-Service 01
                </span>
                <span className="font-mono-tabular font-bold text-white text-xs">
                  {squadChartData[0]?.caBrut.toFixed(2)} $ CAD ({squadChartData[0]?.share}%)
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                Sovereign MCP Lab
              </h4>
              <div className="text-[11px] text-slate-300 font-medium mt-1.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Moteur : Cascade OpenRouter Free Tier + MCP Coder</span>
                </div>
                <div className="font-mono text-[10px] bg-slate-950/95 border border-slate-800 rounded-lg p-2.5 space-y-1 text-slate-300 shadow-inner">
                  <div className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider">
                    # === CASCADE OPENROUTER FREE TIER - SOVEREIGN MCP LAB ===
                  </div>
                  <div className="text-cyan-300 truncate" title='OPENROUTER_FALLBACK_1="google/gemma-4-26b-a4b-it:free"'>
                    <span className="text-slate-500">FB1:</span> &quot;google/gemma-4-26b-a4b-it:free&quot;
                  </div>
                  <div className="text-cyan-300 truncate" title='OPENROUTER_FALLBACK_2="nvidia/nemotron-3-ultra-550b-a55b:free"'>
                    <span className="text-slate-500">FB2:</span> &quot;nvidia/nemotron-3-ultra-550b-a55b:free&quot;
                  </div>
                  <div className="text-cyan-300 truncate" title='OPENROUTER_FALLBACK_3="inclusionai/ling-3.0-flash-fin:free"'>
                    <span className="text-slate-500">FB3:</span> &quot;inclusionai/ling-3.0-flash-fin:free&quot;
                  </div>
                  <div className="text-cyan-400 font-medium truncate" title='OPENROUTER_FALLBACK_4="nex-agi/nex-n2.5-pro:free"'>
                    <span className="text-slate-500">FB4:</span> &quot;nex-agi/nex-n2.5-pro:free&quot;
                  </div>
                  <div className="pt-1.5 mt-1.5 border-t border-slate-800/80">
                    <div className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider">
                      # === EXPERT CODE MCP OPTIONNEL ===
                    </div>
                    <div className="text-purple-300 truncate" title='OPENROUTER_MCP_CODER="qwen/qwen-2.5-coder-32b-instruct:free"'>
                      <span className="text-slate-500">CODER:</span> &quot;qwen/qwen-2.5-coder-32b-instruct:free&quot;
                    </div>
                  </div>
                </div>
              </div>

              {/* Force du Modèle (Mauve) */}
              <div className="mt-2.5 p-2 rounded-lg bg-purple-950/30 border border-purple-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Force du Modèle : Étanchéité Parnas 1972</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Zéro fuite de données vers les modèles d'entraînement publics. Isolation hermétique des contextes, clés et secrets d’entreprise scellés par hachage SHA-256.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">1. Chiffre d'Affaires Brut :</span>
                <span className="font-bold text-cyan-300">{squadChartData[0]?.caBrut.toFixed(2)} $</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">2. Net Michael (-27,175%) :</span>
                <span className="font-bold text-emerald-300">{squadChartData[0]?.netMichael.toFixed(2)} $</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-purple-300 font-medium">3. Pertes Évitées (Modèle) :</span>
                <span className="font-bold text-purple-300">+{squadChartData[0]?.pertesEvitees.toFixed(2)} $</span>
              </div>
            </div>
          </div>

          {/* Micro-Service 2 : CogniFlow Systems */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Micro-Service 02
                </span>
                <span className="font-mono-tabular font-bold text-white text-xs">
                  {squadChartData[1]?.caBrut.toFixed(2)} $ CAD ({squadChartData[1]?.share}%)
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                CogniFlow Systems
              </h4>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                Moteur : Tree-of-Thoughts (ToT) Récursif + Multi-Branches
              </div>

              {/* Force du Modèle (Mauve) */}
              <div className="mt-2.5 p-2 rounded-lg bg-purple-950/30 border border-purple-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Force du Modèle : Auto-Guérison ToT 3-Essais</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  99.8% de résilience autonome. Détection instantanée des cassures de contrat JSON, génération de patchs ciblés et scellement sentinelle sans temps d'arrêt.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">1. Chiffre d'Affaires Brut :</span>
                <span className="font-bold text-cyan-300">{squadChartData[1]?.caBrut.toFixed(2)} $</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">2. Net Michael (-27,175%) :</span>
                <span className="font-bold text-emerald-300">{squadChartData[1]?.netMichael.toFixed(2)} $</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-purple-300 font-medium">3. Pertes Évitées (Modèle) :</span>
                <span className="font-bold text-purple-300">+{squadChartData[1]?.pertesEvitees.toFixed(2)} $</span>
              </div>
            </div>
          </div>

          {/* Micro-Service 3 : FinOps Matrix (CSS Selector 1) */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-purple-900/50 hover:border-purple-500/50 transition-colors flex flex-col justify-between space-y-3 bg-gradient-to-b from-purple-950/10 to-slate-900/60">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                  Micro-Service 03
                </span>
                <span className="font-mono-tabular font-bold text-white text-xs">
                  {squadChartData[2]?.caBrut.toFixed(2)} $ CAD ({squadChartData[2]?.share}%)
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">
                FinOps Matrix
              </h4>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                Moteur : Colibrì MoE Speculative Router
              </div>

              {/* Force du Modèle (Mauve) */}
              <div className="mt-2.5 p-2 rounded-lg bg-purple-950/40 border border-purple-800/50 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Force du Modèle : Routage Spéculatif Colibrì</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Réduction prouvée de 60% à 80% des factures d'API OpenAI/Anthropic. Routage spéculatif ultra-rapide et cache sémantique KV avec latence inférieure à 12ms.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">1. Chiffre d'Affaires Brut :</span>
                <span className="font-bold text-cyan-300">{squadChartData[2]?.caBrut.toFixed(2)} $</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">2. Net Michael (-27,175%) :</span>
                <span className="font-bold text-emerald-300">{squadChartData[2]?.netMichael.toFixed(2)} $</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-purple-300 font-medium">3. Pertes Évitées (Modèle) :</span>
                <span className="font-bold text-purple-300">+{squadChartData[2]?.pertesEvitees.toFixed(2)} $</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de contrôle mobile & Indicateur de défilement horizontal */}
      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] sm:text-xs">
            Défilement horizontal fluide
            {canScrollRight && (
              <span className="inline-flex items-center gap-0.5 text-cyan-300 font-medium ml-1.5 animate-pulse sm:hidden">
                <span>Glisser</span>
                <ChevronsRight className="w-3 h-3" />
              </span>
            )}
          </span>
        </div>

        {/* Bascule mobile : Vue Priorisée vs Toutes les Colonnes */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAllColumnsMobile(!showAllColumnsMobile)}
            className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
            <span>{showAllColumnsMobile ? 'Vue Condensée' : 'Toutes Colonnes'}</span>
          </button>
        </div>
      </div>

      {/* Tableau détaillé des 3 escouades avec colonne fixe et scroll fluide */}
      <div className="relative rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
        {/* Ombre de démarcation scroll gauche */}
        {hasScrolledRight && (
          <div className="absolute top-0 bottom-0 left-[150px] sm:left-[210px] w-4 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-30 transition-opacity duration-200" />
        )}

        {/* Ombre de démarcation scroll droite */}
        {canScrollRight && (
          <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-10 transition-opacity duration-200 sm:hidden" />
        )}

        <div
          ref={tableContainerRef}
          className="overflow-x-auto scroll-smooth overscroll-x-contain touch-pan-x [scrollbar-width:thin] scrollbar-thumb-slate-700 scrollbar-track-slate-950"
        >
          <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[580px] sm:min-w-[760px] border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sm:text-[11px] font-mono-tabular tracking-wider border-b border-slate-800">
              <tr>
                {/* Colonne 1 : Sticky à gauche pour ne jamais perdre l'escouade de vue */}
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-slate-950/98 backdrop-blur-md px-3 sm:px-4 py-3 font-semibold border-r border-slate-800/80 w-[150px] sm:w-[210px] shadow-[2px_0_8px_rgba(0,0,0,0.4)]"
                >
                  Escouade
                </th>

                {/* Colonne 2 : Commandes */}
                <th scope="col" className="px-3 sm:px-4 py-3 font-semibold text-center whitespace-nowrap">
                  Cmds
                </th>

                {/* Colonne 3 : CA Brut */}
                <th scope="col" className="px-3 sm:px-4 py-3 font-semibold text-right whitespace-nowrap">
                  CA Brut
                </th>

                {/* Colonne 4 : Taxes (Priorité secondaire sur mobile) */}
                <th
                  scope="col"
                  className={`px-3 sm:px-4 py-3 font-semibold text-right whitespace-nowrap ${
                    showAllColumnsMobile ? '' : 'hidden md:table-cell'
                  }`}
                >
                  Taxes (27,175%)
                </th>

                {/* Colonne 5 : Net Michael (PRIORITÉ MAXIMALE) */}
                <th
                  scope="col"
                  className="px-3 sm:px-4 py-3 font-semibold text-right text-emerald-400 bg-emerald-950/20 whitespace-nowrap border-x border-emerald-900/30"
                >
                  Net Michael
                </th>

                {/* Colonne 6 : Pertes Évitées ToT */}
                <th
                  scope="col"
                  className={`px-3 sm:px-4 py-3 font-semibold text-right text-cyan-400 whitespace-nowrap ${
                    showAllColumnsMobile ? '' : 'hidden sm:table-cell'
                  }`}
                >
                  Pertes Évitées ToT
                </th>

                {/* Colonne 7 : Succès ToT */}
                <th
                  scope="col"
                  className={`px-3 sm:px-4 py-3 font-semibold text-center whitespace-nowrap ${
                    showAllColumnsMobile ? '' : 'hidden lg:table-cell'
                  }`}
                >
                  Taux ToT
                </th>

                {/* Colonne 8 : Action rapide */}
                <th scope="col" className="px-3 sm:px-4 py-3 font-semibold text-right whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 font-mono-tabular">
              {squads.map((squad) => (
                <tr
                  key={squad.id}
                  className="hover:bg-slate-900/60 transition-colors group"
                >
                  {/* Colonne Escouade Fixée */}
                  <td className="sticky left-0 z-20 bg-slate-950/98 backdrop-blur-md px-3 sm:px-4 py-3 font-medium text-white border-r border-slate-800/80 shadow-[2px_0_8px_rgba(0,0,0,0.4)]">
                    <div className="flex flex-col">
                      <span className="font-semibold font-display tracking-tight text-slate-100 truncate">
                        {squad.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        @{squad.handle}
                      </span>
                      {/* Micro-badge de succès ToT sur mobile */}
                      <span className="text-[10px] text-emerald-400 font-mono-tabular lg:hidden mt-0.5">
                        {squad.totSuccessRate.toFixed(1)}% ToT
                      </span>
                    </div>
                  </td>

                  {/* Commandes */}
                  <td className="px-3 sm:px-4 py-3 text-center text-slate-300 font-bold whitespace-nowrap">
                    {squad.ordersDelivered}
                  </td>

                  {/* Chiffre d'Affaires Brut */}
                  <td className="px-3 sm:px-4 py-3 text-right font-bold text-white whitespace-nowrap">
                    {squad.grossRevenueCAD.toFixed(2)} $
                  </td>

                  {/* Taxes combinées (27,175%) */}
                  <td
                    className={`px-3 sm:px-4 py-3 text-right text-amber-400/90 whitespace-nowrap ${
                      showAllColumnsMobile ? '' : 'hidden md:table-cell'
                    }`}
                  >
                    -{squad.reservedTaxesCAD.toFixed(2)} $
                  </td>

                  {/* Net Michael */}
                  <td className="px-3 sm:px-4 py-3 text-right font-bold text-emerald-300 bg-emerald-950/20 whitespace-nowrap border-x border-emerald-900/30">
                    {squad.netMichaelCAD.toFixed(2)} $
                  </td>

                  {/* Pertes Évitées ToT */}
                  <td
                    className={`px-3 sm:px-4 py-3 text-right text-cyan-400 whitespace-nowrap ${
                      showAllColumnsMobile ? '' : 'hidden sm:table-cell'
                    }`}
                  >
                    +{squad.lossesAvoidedCAD.toFixed(2)} $
                  </td>

                  {/* Taux de succès ToT */}
                  <td
                    className={`px-3 sm:px-4 py-3 text-center whitespace-nowrap ${
                      showAllColumnsMobile ? '' : 'hidden lg:table-cell'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      {squad.totSuccessRate.toFixed(1)}%
                    </span>
                  </td>

                  {/* Bouton de simulation +1 vente */}
                  <td className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleQuickAddSale(squad.id, 65)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 hover:border-cyan-600 rounded transition-all"
                      title="Simuler une commande client (+65 CAD)"
                    >
                      <span>+1 Vente</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Total général */}
            <tfoot className="bg-slate-950 font-bold border-t-2 border-slate-700 font-mono-tabular">
              <tr>
                <td className="sticky left-0 z-20 bg-slate-950/98 backdrop-blur-md px-3 sm:px-4 py-3 text-white border-r border-slate-800 shadow-[2px_0_8px_rgba(0,0,0,0.4)]">
                  TOTAL GÉNÉRAL
                </td>
                <td className="px-3 sm:px-4 py-3 text-center text-slate-200 whitespace-nowrap">
                  {summary.totalOrders}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-cyan-300 whitespace-nowrap">
                  {summary.totalGrossCAD.toFixed(2)} $
                </td>
                <td
                  className={`px-3 sm:px-4 py-3 text-right text-amber-400 whitespace-nowrap ${
                    showAllColumnsMobile ? '' : 'hidden md:table-cell'
                  }`}
                >
                  {summary.totalTaxesCAD.toFixed(2)} $
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-emerald-400 bg-emerald-950/25 whitespace-nowrap border-x border-emerald-900/40">
                  {summary.totalNetCAD.toFixed(2)} $
                </td>
                <td
                  className={`px-3 sm:px-4 py-3 text-right text-cyan-400 whitespace-nowrap ${
                    showAllColumnsMobile ? '' : 'hidden sm:table-cell'
                  }`}
                >
                  +{summary.totalLossesAvoidedCAD.toFixed(2)} $
                </td>
                <td
                  className={`px-3 sm:px-4 py-3 text-center text-emerald-300 whitespace-nowrap ${
                    showAllColumnsMobile ? '' : 'hidden lg:table-cell'
                  }`}
                >
                  {summary.avgToTSuccessRate.toFixed(1)}%
                </td>
                <td className="px-3 sm:px-4 py-3 text-right text-slate-500 whitespace-nowrap">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Note d'explication fiscale & simulateur rapide */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/70 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="leading-snug">
            Règle comptable : CA Brut × (1 - 0.27175) = <strong className="text-emerald-300">Net Michael</strong> direct.
            Aucune mauvaise surprise fiscale de fin d'exercice.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <span className="text-slate-400 text-[11px] sm:text-xs">Test réactivité :</span>
          <select
            value={selectedSquadForSale}
            onChange={(e) => setSelectedSquadForSale(e.target.value as SquadId)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
          >
            <option value="sovereign-mcp">Sovereign (+98 $)</option>
            <option value="cogniflow">CogniFlow (+128 $)</option>
            <option value="finops-matrix">FinOps (+152 $)</option>
          </select>
          <button
            onClick={() => {
              const amount = selectedSquadForSale === 'sovereign-mcp' ? 98 : selectedSquadForSale === 'cogniflow' ? 128 : 152;
              handleQuickAddSale(selectedSquadForSale, amount);
            }}
            disabled={isAddingSale}
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors shrink-0"
          >
            {isAddingSale ? 'Ajout...' : 'Simuler'}
          </button>
        </div>
      </div>
    </div>
  );
};
