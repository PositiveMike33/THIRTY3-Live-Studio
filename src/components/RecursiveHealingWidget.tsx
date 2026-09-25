import React, { useState } from 'react';
import { useThirty3Store } from '../store/useThirty3Store';
import { SquadId, HealingIncident } from '../types';
import {
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle,
  Cpu,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Fingerprint,
} from 'lucide-react';

export const RecursiveHealingWidget: React.FC = () => {
  const {
    telemetry,
    isHealingSimulating,
    activeIncidentStep,
    currentHealingIncident,
    triggerHealingSimulation,
    dismissCurrentHealing,
  } = useThirty3Store();

  const [selectedSquad, setSelectedSquad] = useState<SquadId>('cogniflow');
  const [selectedLossCAD, setSelectedLossCAD] = useState<number>(195.0);

  const incidents = telemetry?.recentIncidents || [];
  const latestIncident = currentHealingIncident || incidents[0];

  const handleTrigger = () => {
    if (isHealingSimulating) return;
    triggerHealingSimulation(selectedSquad, selectedLossCAD);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-lg space-y-6">
      {/* En-tête du module */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Invariant Technique 03 · Boucle Récursive Correctrice (ToT Self-Healing)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Auto-Guérison Idempotente à 3 Passes & Plafond Strict 3-Retry
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Toute rupture de contrat (API, Webhook, schema drift) est interceptée et résolue en moins de 60 ms.
            Architecture de David Parnas préservée, perte financière prévenue et scellement cryptographique SHA-256.
          </p>
        </div>

        {/* Contrôles de simulation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Escouade cible :</span>
            <select
              value={selectedSquad}
              onChange={(e) => setSelectedSquad(e.target.value as SquadId)}
              disabled={isHealingSimulating}
              className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-cyan-500"
            >
              <option value="cogniflow">CogniFlow Systems (@CogniFlowSystems)</option>
              <option value="finops-matrix">FinOps Matrix (@FinOpsMatrix)</option>
              <option value="sovereign-mcp">Sovereign MCP Lab (@SovereignMCPLab)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Enjeu financier :</span>
            <select
              value={selectedLossCAD}
              onChange={(e) => setSelectedLossCAD(Number(e.target.value))}
              disabled={isHealingSimulating}
              className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 text-xs font-mono-tabular focus:ring-1 focus:ring-cyan-500"
            >
              <option value={195.0}>195,00 $ CAD (Commande B2B)</option>
              <option value={310.0}>310,00 $ CAD (Batch ETL)</option>
              <option value={450.0}>450,00 $ CAD (API Spurt Timeout)</option>
            </select>
          </div>

          <button
            onClick={handleTrigger}
            disabled={isHealingSimulating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md ${
              isHealingSimulating
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]'
            }`}
          >
            {isHealingSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulation en cours...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Déclencher Simulation d'Anomalie (ToT 3-Retry)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visualisation en direct des 3 passes ToT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Passe 1 : Architect */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
            activeIncidentStep === 1
              ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
              : activeIncidentStep > 1 || (!isHealingSimulating && latestIncident)
              ? 'bg-slate-950/70 border-slate-800'
              : 'bg-slate-950/40 border-slate-900 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Passe 1 / 3
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono-tabular">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>~15 ms</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-white">1. Architect Diagnostic</h3>
          </div>

          <p className="text-xs text-slate-400 mb-3 min-h-[36px]">
            {activeIncidentStep === 1
              ? 'Analyse lexicale AST en cours... Détection de l’incompatibilité de contrat.'
              : latestIncident?.passes[0]?.details || 'Isolation de l’invariant brisé et cartographie des dépendances.'}
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Niveau de certitude :</span>
            <span className="font-mono-tabular font-bold text-cyan-300">
              {activeIncidentStep === 1 ? 'Calcul...' : `${latestIncident?.passes[0]?.certainty.toFixed(1) || '91.2'}%`}
            </span>
          </div>

          {activeIncidentStep === 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 animate-pulse" />
          )}
        </div>

        {/* Passe 2 : Commando */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
            activeIncidentStep === 2
              ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : activeIncidentStep > 2 || (!isHealingSimulating && latestIncident)
              ? 'bg-slate-950/70 border-slate-800'
              : 'bg-slate-950/40 border-slate-900 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
              Passe 2 / 3
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono-tabular">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>~27 ms</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-white">2. Commando Patch</h3>
          </div>

          <p className="text-xs text-slate-400 mb-3 min-h-[36px]">
            {activeIncidentStep === 2
              ? 'Application du correctif idempotent et ré-aiguillage circuit-breaker...'
              : latestIncident?.passes[1]?.details || 'Injection du transformateur assaini & normalisation de la file.'}
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Niveau de certitude :</span>
            <span className="font-mono-tabular font-bold text-amber-300">
              {activeIncidentStep === 2 ? 'Injection...' : `${latestIncident?.passes[1]?.certainty.toFixed(2) || '99.96'}%`}
            </span>
          </div>

          {activeIncidentStep === 2 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 animate-pulse" />
          )}
        </div>

        {/* Passe 3 : Sentinel */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
            activeIncidentStep === 3
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
              : (!isHealingSimulating && latestIncident)
              ? 'bg-slate-950/70 border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 to-slate-950'
              : 'bg-slate-950/40 border-slate-900 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Passe 3 / 3
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono-tabular">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>100% PASS</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-sm text-white">3. Sentinel SHA-256 Seal</h3>
          </div>

          <p className="text-xs text-slate-400 mb-3 min-h-[36px]">
            {activeIncidentStep === 3
              ? 'Vérification formelle et scellement de la signature cryptographique...'
              : latestIncident?.passes[2]?.details || 'Validation de non-régression et scellement cryptographique du journal.'}
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Perte sauvée :</span>
            <span className="font-mono-tabular font-bold text-emerald-300">
              +{latestIncident?.lossAvoidedCAD.toFixed(2) || '195.00'} $ CAD
            </span>
          </div>

          {activeIncidentStep === 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Résultat du dernier incident scellé */}
      {latestIncident && (
        <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-white font-medium">
                <span>Dernier scellement : <strong className="text-emerald-400 font-mono-tabular">{latestIncident.id}</strong></span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300">{latestIncident.serviceName}</span>
              </div>
              <div className="font-mono-tabular text-slate-500 text-[11px] truncate max-w-lg mt-0.5">
                SHA-256: {latestIncident.sha256Seal}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono-tabular font-bold">
              Économie : +{latestIncident.lossAvoidedCAD.toFixed(2)} $ CAD
            </span>
            <span className="text-[11px] text-slate-400 font-mono-tabular">
              Résolu en {latestIncident.executionTotalMs} ms
            </span>
          </div>
        </div>
      )}

      {/* Journal des incidents résolus */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Historique des Incidents Auto-Guéris (Circuit Breaker Inviolé)</span>
        </div>

        <div className="space-y-2">
          {incidents.slice(0, 3).map((inc) => (
            <div
              key={inc.id}
              className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="font-mono-tabular text-cyan-400 font-semibold">{inc.id}</span>
                <span className="text-slate-400">[{inc.squadName}]</span>
                <span className="text-slate-300 font-medium truncate max-w-[280px] sm:max-w-md">
                  {inc.anomalyType}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono-tabular self-end sm:self-auto text-[11px]">
                <span className="text-emerald-400 font-bold">+{inc.lossAvoidedCAD.toFixed(2)} $</span>
                <span className="text-slate-500">{new Date(inc.timestamp).toLocaleTimeString()}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {inc.finalStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
