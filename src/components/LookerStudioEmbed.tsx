import React, { useState } from 'react';
import { TelemetryData } from '../types';
import { engineApi } from '../services/engineApi';
import {
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Clock,
  PieChart,
  LineChart,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

interface LookerStudioEmbedProps {
  telemetry: TelemetryData | null;
}

type Period = '24h' | '7d' | '30d' | 'all';

export const LookerStudioEmbed: React.FC<LookerStudioEmbedProps> = ({ telemetry }) => {
  const [period, setPeriod] = useState<Period>('7d');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'iframe'>('visualizer');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleDownloadCSV = async () => {
    const csvData = await engineApi.getLookerCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `thirty3_telemetry_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const squads = telemetry?.squads || [];
  const summary = telemetry?.summary || {
    totalOrders: 9,
    totalGrossCAD: 679.45,
    totalTaxesCAD: 184.65,
    totalNetCAD: 494.79,
    totalLossesAvoidedCAD: 2145.0,
    avgToTSuccessRate: 99.8,
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-lg space-y-6">
      {/* En-tête Looker Studio */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Invariant Technique 04 · Connectivité Google Looker Studio & Data Stream</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Dashboard Analytique & Pipeline Google Sheets
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Flux de données continu au format CSV ouvert pour vos tableaux de bord Looker Studio, BigQuery ou Google Sheets.
          </p>
        </div>

        {/* Contrôles de période et métriques de synchronisation */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Indicateur de latence */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Latence sync :</span>
            <span className="font-mono-tabular font-bold text-emerald-400">&lt; 1,8 sec</span>
          </div>

          {/* Sélecteur de période */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            {(['24h', '7d', '30d', 'all'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  period === p
                    ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === '24h' ? '24h' : p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : 'Global'}
              </button>
            ))}
          </div>

          {/* Bouton de téléchargement CSV direct */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 hover:border-slate-600 text-xs font-medium text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Télécharger CSV</span>
          </button>
        </div>
      </div>

      {/* Onglets Vue Interactive vs Iframe */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'visualizer'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Vue Analytique Executive Native</span>
          </button>
          <button
            onClick={() => setActiveTab('iframe')}
            className={`flex items-center gap-2 pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'iframe'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Iframe Google Looker Studio Embed</span>
          </button>
        </div>

        {/* Bouton Copier formule Google Sheets */}
        <button
          onClick={handleCopyFormula}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Formule copiée !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono-tabular">Copier =IMPORTDATA("...")</span>
            </>
          )}
        </button>
      </div>

      {/* Vue 1 : Visualiseur Analytique Natif Looker */}
      {activeTab === 'visualizer' && (
        <div className="space-y-6">
          {/* Graphique de répartition PnL par escouade */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {squads.map((squad) => {
              const shareOfGross = summary.totalGrossCAD > 0 ? (squad.grossRevenueCAD / summary.totalGrossCAD) * 100 : 33.3;
              return (
                <div
                  key={squad.id}
                  className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-medium text-slate-300">{squad.name}</span>
                      <span className="font-mono-tabular font-bold text-cyan-400">{shareOfGross.toFixed(1)}% du CA</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                        style={{ width: `${shareOfGross}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                        <div className="text-slate-500 text-[10px]">Brut CAD</div>
                        <div className="text-slate-200 font-semibold">{squad.grossRevenueCAD.toFixed(2)} $</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                        <div className="text-slate-500 text-[10px]">Net Michael</div>
                        <div className="text-emerald-400 font-semibold">{squad.netMichaelCAD.toFixed(2)} $</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Pertes prévenues :</span>
                    <span className="font-mono-tabular font-bold text-cyan-300">+{squad.lossesAvoidedCAD.toFixed(2)} $</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table récapitulative des métriques exportables */}
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Structure des colonnes injectées dans Google Sheets & Looker Studio
              </span>
              <span className="font-mono-tabular text-slate-500">
                Endpoint actif : <code>/api/v1/mcp-microservices/telemetry/looker-csv</code>
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-lg p-3 font-mono-tabular text-xs text-slate-300 overflow-x-auto whitespace-pre">
              {engineApi.generateCSV()}
            </div>
          </div>
        </div>
      )}

      {/* Vue 2 : Iframe Looker Studio */}
      {activeTab === 'iframe' && (
        <div className="w-full h-[550px] rounded-lg border border-slate-800 overflow-hidden relative bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Connecteur Google Looker Studio Dédié
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                L'URL de synchronisation directe est prête. Vous pouvez lier n'importe quel rapport Looker Studio
                à la source de données CSV fournie par l'Engine local THIRTY3.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-left">
              <div className="text-[11px] text-slate-400 mb-1 font-semibold">Formule Google Sheets recommandée :</div>
              <div className="font-mono-tabular text-xs text-cyan-300 break-all select-all">
                {importFormula}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopyFormula}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors"
              >
                {copied ? 'Copié !' : 'Copier la formule'}
              </button>
              <a
                href="https://lookerstudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>Ouvrir Looker Studio</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
