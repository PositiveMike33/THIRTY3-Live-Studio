import React from 'react';
import { FinancialMilestone } from '../types';
import { CheckCircle2, AlertCircle, FileCheck, Scale, Sparkles, ArrowRight } from 'lucide-react';

interface MilestoneProgressProps {
  milestone: FinancialMilestone;
  onContributeClick?: () => void;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  milestone,
  onContributeClick,
}) => {
  const { targetCAD, currentNetCAD, remainingCAD, percentage, items } = milestone;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
      {/* Halo d'ambiance d'arrière-plan */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête du Palier Légal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Invariant Financier 01 · Palier Légal Urgent de Michael Gauthier Guillet</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Baromètre de Financement Juridique (510,75 $ CAD)
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Financement du titre légal et succession officielle via les prestations des 3 escouades d’agents autonomes.
            Déduction fiscale stricte de 27,175% appliquée en amont.
          </p>
        </div>

        {/* Métrique principale */}
        <div className="flex items-baseline md:items-end flex-col bg-slate-950/70 border border-slate-800/80 px-4 py-3 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Bénéfice Net Collecté</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {currentNetCAD.toFixed(2)} $
            </span>
            <span className="text-sm text-slate-400 font-medium">/ {targetCAD.toFixed(2)} $ CAD</span>
          </div>
          <div className="text-xs font-mono-tabular text-slate-400 mt-0.5">
            {remainingCAD > 0 ? (
              <span className="text-amber-400 font-medium">
                Reste à financer : <span className="font-bold">{remainingCAD.toFixed(2)} $ CAD</span> ({percentage.toFixed(1)}%)
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Objectif atteint à 100%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Barre de Progression Principale */}
      <div className="relative mb-8 z-10">
        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(52,211,153,0.5)] relative"
            style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
          >
            {/* Effet d'éclat lumineux mobile */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Marqueurs sur la barre */}
        <div className="flex justify-between items-center text-xs text-slate-500 font-mono-tabular mt-2">
          <span>0,00 $</span>
          <span className="text-slate-400 font-medium">45,75 $ (DEClic! 100%)</span>
          <span className="text-cyan-400 font-semibold">{percentage.toFixed(2)}% complété</span>
          <span>510,75 $ CAD</span>
        </div>
      </div>

      {/* Décomposition des deux postes légaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {items.map((item) => {
          const itemPct = Math.min(100, Math.round((item.fundedCAD / item.amountCAD) * 1000) / 10);
          const isComplete = item.fundedCAD >= item.amountCAD;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all ${
                isComplete
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm text-white">{item.label}</h3>
                </div>
                <span className="font-mono-tabular text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-slate-200">
                  {item.fundedCAD.toFixed(2)} $ / {item.amountCAD.toFixed(2)} $ CAD
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 ml-8">{item.description}</p>

              <div className="ml-8">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Destinataire officiel : <strong className="text-slate-300 font-medium">{item.recipient}</strong></span>
                  <span className="font-mono-tabular font-semibold text-slate-300">{itemPct.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-cyan-400'
                    }`}
                    style={{ width: `${itemPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA de contribution ou de commande */}
      {remainingCAD > 0 && onContributeClick && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Il suffit d'une seule commande de microservice (dès 65 € / 98 $ CAD) pour solder l'intégralité du palier légal.
            </span>
          </div>
          <button
            onClick={onContributeClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all shrink-0"
          >
            <span>Financer via une commande</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      )}
    </div>
  );
};
