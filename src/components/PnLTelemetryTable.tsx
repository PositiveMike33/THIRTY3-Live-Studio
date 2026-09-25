import React, { useState } from 'react';
import { SquadPnL, TelemetryData, SquadId } from '../types';
import { engineApi } from '../services/engineApi';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Copy,
  Check,
  Layers,
  Sparkles,
  Info,
  ArrowUpRight,
} from 'lucide-react';

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

  const { squads, summary } = telemetry;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-lg space-y-6">
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
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Commandes Livrées</div>
          <div className="font-mono-tabular text-2xl font-bold text-white flex items-baseline gap-1.5">
            {summary.totalOrders}
            <span className="text-xs text-emerald-400 font-normal">missions validées</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Par les 3 escouades autonomes</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Chiffre d'Affaires Brut</div>
          <div className="font-mono-tabular text-2xl font-bold text-cyan-300">
            {summary.totalGrossCAD.toFixed(2)} $
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Toutes plateformes réunies</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Taxes & Impôts Réservés</div>
          <div className="font-mono-tabular text-2xl font-bold text-amber-400">
            {summary.totalTaxesCAD.toFixed(2)} $
          </div>
          <div className="text-[11px] text-slate-500 mt-1">27,175% TPS/TVQ + PME réservés</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950/70 border border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 to-slate-950">
          <div className="text-xs text-emerald-400 font-medium mb-1">Bénéfice Net Michael</div>
          <div className="font-mono-tabular text-2xl font-bold text-emerald-300">
            {summary.totalNetCAD.toFixed(2)} $
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Disponibilité nette immédiate</div>
        </div>
      </div>

      {/* Tableau détaillé des 3 escouades */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-slate-950/90 text-slate-400 uppercase text-[11px] font-mono-tabular tracking-wider border-b border-slate-800">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Escouade & Spécialité
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Commandes
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                CA Brut (CAD)
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                Taxes (27,175%)
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right text-emerald-400">
                Net Michael
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right text-cyan-400">
                Pertes Évitées ToT
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Succès ToT
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {squads.map((squad) => (
              <tr key={squad.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        squad.id === 'sovereign-mcp'
                          ? 'bg-cyan-400'
                          : squad.id === 'cogniflow'
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {squad.name}
                        <span className="text-[11px] text-slate-400 font-normal">{squad.handle}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                        {squad.roleTitle}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5 text-center font-mono-tabular font-medium text-slate-200">
                  {squad.ordersDelivered}
                </td>

                <td className="px-4 py-3.5 text-right font-mono-tabular font-medium text-cyan-300">
                  {squad.grossRevenueCAD.toFixed(2)} $
                </td>

                <td className="px-4 py-3.5 text-right font-mono-tabular text-amber-400/90">
                  {squad.reservedTaxesCAD.toFixed(2)} $
                </td>

                <td className="px-4 py-3.5 text-right font-mono-tabular font-bold text-emerald-400">
                  {squad.netMichaelCAD.toFixed(2)} $
                </td>

                <td className="px-4 py-3.5 text-right font-mono-tabular font-semibold text-cyan-400">
                  +{squad.lossesAvoidedCAD.toFixed(2)} $
                </td>

                <td className="px-4 py-3.5 text-center font-mono-tabular">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    <ShieldCheck className="w-3 h-3" />
                    {squad.totSuccessRate.toFixed(1)}%
                  </span>
                </td>

                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => handleQuickAddSale(squad.id, squad.id === 'sovereign-mcp' ? 98 : squad.id === 'cogniflow' ? 128 : 152)}
                    title="Simuler une commande livrée"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    <span>+1 Vente</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-950/90 border-t border-slate-800 font-mono-tabular text-xs sm:text-sm font-semibold">
            <tr>
              <td className="px-4 py-3 text-white">Total Consolidé THIRTY3</td>
              <td className="px-4 py-3 text-center text-white">{summary.totalOrders}</td>
              <td className="px-4 py-3 text-right text-cyan-300">{summary.totalGrossCAD.toFixed(2)} $</td>
              <td className="px-4 py-3 text-right text-amber-400">{summary.totalTaxesCAD.toFixed(2)} $</td>
              <td className="px-4 py-3 text-right text-emerald-400">{summary.totalNetCAD.toFixed(2)} $</td>
              <td className="px-4 py-3 text-right text-cyan-400">+{summary.totalLossesAvoidedCAD.toFixed(2)} $</td>
              <td className="px-4 py-3 text-center text-emerald-300">{summary.avgToTSuccessRate.toFixed(1)}%</td>
              <td className="px-4 py-3 text-right text-slate-500">—</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Note d'explication fiscale & simulateur rapide */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/70 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Règle comptable : Chiffre d'Affaires Brut × (1 - 0.27175) = <strong>Net Michael</strong> direct.
            Aucune mauvaise surprise fiscale de fin d'exercice.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400">Test réactivité live :</span>
          <select
            value={selectedSquadForSale}
            onChange={(e) => setSelectedSquadForSale(e.target.value as SquadId)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
          >
            <option value="sovereign-mcp">Sovereign MCP (+98 $)</option>
            <option value="cogniflow">CogniFlow (+128 $)</option>
            <option value="finops-matrix">FinOps Matrix (+152 $)</option>
          </select>
          <button
            onClick={() => {
              const amount = selectedSquadForSale === 'sovereign-mcp' ? 98 : selectedSquadForSale === 'cogniflow' ? 128 : 152;
              handleQuickAddSale(selectedSquadForSale, amount);
            }}
            disabled={isAddingSale}
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors"
          >
            {isAddingSale ? 'Enregistrement...' : 'Simuler'}
          </button>
        </div>
      </div>
    </div>
  );
};
