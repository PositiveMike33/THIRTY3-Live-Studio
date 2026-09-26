/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * THIRTY3 - Live Studio Dashboard & Trio-Agents Engine
 * Architecturé pour Michael Gauthier Guillet
 */

import React, { useEffect } from 'react';
import { useThirty3Store } from './store/useThirty3Store';
import { Header } from './components/Header';
import { MilestoneProgress } from './components/MilestoneProgress';
import { PnLTelemetryTable } from './components/PnLTelemetryTable';
import { RecursiveHealingWidget } from './components/RecursiveHealingWidget';
import { SquadsShowcase } from './components/SquadsShowcase';
import { FAQSection } from './components/FAQSection';
import { LookerStudioEmbed } from './components/LookerStudioEmbed';
import { AudioPlayerSection } from './components/AudioPlayerSection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ShieldAlert,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Layers,
  TrendingUp,
  BarChart3,
  Home,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const {
    telemetry,
    fetchTelemetry,
    isDemoMode,
    activeSection,
    setActiveSection,
    recordSale,
    resetDefaults,
  } = useThirty3Store();

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090e1a] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notifications Provider */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Header Sticky */}
      <Header
        engineStatus={telemetry?.engineStatus}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* Bandeau d'état Démo vs API Réelle */}
      {isDemoMode && (
        <div className="bg-slate-900/95 border-b border-cyan-900/40 px-3 sm:px-4 py-2 text-center text-xs text-slate-300 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span>
            <strong>Mode Démo Interactif THIRTY3 :</strong> L'Engine fonctionne en circuit autonome
            haute fidélité. Toutes les simulations sont 100% réactives en direct.
          </span>
          <button
            onClick={() => fetchTelemetry()}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium ml-1"
          >
            Re-scanner port 3000
          </button>
        </div>
      )}

      {/* Conteneur Principal avec padding bas pour le Bottom Nav Mobile */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12 pb-24 md:pb-12">
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-2 sm:pt-4 pb-4 sm:pb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
            <div className="max-w-3xl space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-[11px] sm:text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Vitrine Publique Officielle · Trio d'Agents IA Autonomes</span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                THIRTY3{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  Live Studio Dashboard
                </span>
                <br />
                & Trio-Agents Engine
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed">
                Plateforme d'ingénierie dirigée par <strong>Michael Gauthier Guillet</strong>.
                Déploiement d'agents IA autonomes spécialisés : serveurs MCP modulaires David Parnas,
                workflows d'automatisation n8n avec boucle Tree-of-Thought (ToT), et passerelles d'arbitrage
                Colibrì MoE réduisant les coûts de 60% à 80%.
              </p>

              {/* Raccourcis d'actions Hero (Pleine largeur sur mobile, alignés sur écran large) */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('squads')}
                  className="px-4 sm:px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Explorer les 3 Escouades</span>
                </button>

                <button
                  onClick={() => scrollToSection('healing')}
                  className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 text-xs font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Tester l'Auto-Guérison ToT</span>
                </button>

                <button
                  onClick={() => scrollToSection('squads')}
                  className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Trio Marketing & Conversion (Actif)</span>
                </button>
              </div>
            </div>

            {/* Carte récapitulative rapide de statut (Responsive) */}
            <div className="w-full lg:w-80 p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
                <span className="font-semibold text-slate-200">Architecture Active</span>
                <span className="font-mono-tabular text-emerald-400 font-bold">100% DISPO</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Escouades IA :</span>
                  <span className="font-bold text-white">3 unités étanches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Plafond Retry ToT :</span>
                  <span className="font-mono-tabular text-cyan-400 font-bold">3 passes max</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Taxes combinées :</span>
                  <span className="font-mono-tabular text-amber-400 font-bold">27,175% strict</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cluster local :</span>
                  <span className="font-mono-tabular text-slate-300">RTX 4050 4.5 GB</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">Virement Interac Autodeposit :</div>
                <div className="font-mono-tabular text-xs font-bold text-cyan-300 mt-0.5 truncate">
                  mikegauthierguillet@gmail.com
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUMMARY CARDS RAPIDES SUR MOBILE & TABLETTE (Inspiré par le Mobile Dashboard Layout) */}
        {telemetry && (
          <section className="grid grid-cols-2 lg:hidden gap-2.5">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-slate-400 font-medium">CA Brut (30j)</div>
              <div className="font-mono-tabular text-lg font-bold text-cyan-300 mt-1 truncate">
                {telemetry.summary.totalGrossCAD.toFixed(2)} $
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono-tabular">{telemetry.summary.totalOrders} commandes</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 to-slate-950 flex flex-col justify-between">
              <div className="text-[11px] text-emerald-400 font-medium">Net Michael</div>
              <div className="font-mono-tabular text-lg font-bold text-emerald-300 mt-1 truncate">
                {telemetry.summary.totalNetCAD.toFixed(2)} $
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5 font-mono-tabular">Après -27,175%</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-purple-900/40 flex flex-col justify-between">
              <div className="text-[11px] text-purple-300 font-medium">Pertes Évitées ToT</div>
              <div className="font-mono-tabular text-lg font-bold text-purple-300 mt-1 truncate">
                +{telemetry.summary.totalLossesAvoidedCAD.toFixed(2)} $
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono-tabular">Auto-guérison 99.8%</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-amber-400 font-medium">Objectif 510,75 $</div>
              <div className="font-mono-tabular text-lg font-bold text-white mt-1 truncate">
                {telemetry.milestone.percentage.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono-tabular">
                {telemetry.milestone.remainingCAD > 0 ? `Reste ${telemetry.milestone.remainingCAD.toFixed(2)} $` : '100% Bouclé'}
              </div>
            </div>
          </section>
        )}

        {/* 2. TABLEAU DE BORD FINANCIER PNL EN DIRECT & BAROMÈTRE D'OBJECTIF */}
        {telemetry && (
          <section id="pnl" className="space-y-6">
            <MilestoneProgress
              milestone={telemetry.milestone}
              onContributeClick={() => scrollToSection('squads')}
            />
            <PnLTelemetryTable
              telemetry={telemetry}
              onRefreshTelemetry={fetchTelemetry}
              onSimulateSale={(squadId, amount) => recordSale(squadId, amount)}
            />
          </section>
        )}

        {/* 3. BOUCLE RÉCURSIVE CORRECTRICE (TOT SELF-HEALING) */}
        <section id="healing">
          <RecursiveHealingWidget />
        </section>

        {/* 4. LES 3 ESCOUADES & COMMANDES FRICTION ZÉRO */}
        <section id="squads">
          <SquadsShowcase />
        </section>

        {/* 5. FOIRE AUX QUESTIONS (FAQ) · GARANTIES, DÉLAIS & SUPPORT */}
        <section id="faq">
          <FAQSection />
        </section>

        {/* 6. GOOGLE LOOKER STUDIO & EXPORT CSV GOOGLE SHEETS */}
        <section id="looker">
          <LookerStudioEmbed telemetry={telemetry} />
        </section>

        {/* 7. ANNONCE OFFICIELLE RÉSEAUX SOCIAUX & AUDIO BROADCAST */}
        <section id="audio">
          <AudioPlayerSection />
        </section>
      </main>

      {/* FOOTER EXÉCUTIF */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-12 sm:mt-16 py-8 sm:py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-display font-bold text-base text-white">
                <span>THIRTY3</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-normal text-slate-400">
                  Système conçu et opéré par Michael Gauthier Guillet
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Sovereign MCP Lab · CogniFlow Systems · FinOps Matrix
              </p>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="https://github.com/PositiveMike33/THIRTY3-Live-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-colors min-h-[38px]"
              >
                <span>GitHub Repo</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                onClick={resetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition-colors min-h-[38px]"
                title="Rétablir les chiffres initiaux de référence"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser Données</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-slate-500 text-[11px] sm:text-xs">
            <div>
              © 2026 THIRTY3. Invariants stricts : Parnas (1972) · ToT 3-Retry · TPS/TVQ 14,975% + PME 12,20%.
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono-tabular">
              <span>mikegauthierguillet@gmail.com</span>
              <span>+1 438-543-2555</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR (Conforme à l'infographie Mobile Dashboard Layout) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#090e1a]/95 backdrop-blur-xl border-t border-slate-800 md:hidden pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 px-2"
        aria-label="Navigation rapide mobile"
      >
        <div className="grid grid-cols-5 items-center justify-around gap-1">
          <button
            onClick={() => scrollToSection('hero')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-h-[44px] ${
              activeSection === 'hero' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-0.5 truncate">Accueil</span>
          </button>

          <button
            onClick={() => scrollToSection('pnl')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-h-[44px] ${
              activeSection === 'pnl' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-0.5 truncate">PnL</span>
          </button>

          <button
            onClick={() => scrollToSection('healing')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-h-[44px] ${
              activeSection === 'healing' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-0.5 truncate">ToT</span>
          </button>

          <button
            onClick={() => scrollToSection('squads')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-h-[44px] ${
              activeSection === 'squads' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-0.5 truncate">Escouades</span>
          </button>

          <button
            onClick={() => scrollToSection('looker')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-h-[44px] ${
              activeSection === 'looker' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span className="text-[10px] mt-0.5 truncate">Looker</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

