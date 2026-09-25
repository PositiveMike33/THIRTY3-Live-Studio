import React from 'react';
import { Cpu, Terminal, ExternalLink, BookOpen, BarChart3, ShieldCheck } from 'lucide-react';
import { EngineStatus } from '../types';

interface HeaderProps {
  engineStatus?: EngineStatus;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  engineStatus,
  onNavigateSection,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#090e1a]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1 : Marque sobre THIRTY3 */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateSection('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:border-cyan-400 transition-colors">
              <span className="font-display font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                33
              </span>
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
                THIRTY3
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </button>

          {/* Badge d'état de l'Engine Souverain */}
          <div className="hidden lg:flex items-center gap-2 pl-3 ml-2 border-l border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-mono-tabular text-[11px] text-slate-300 truncate max-w-[320px]">
                {engineStatus?.nodeName || 'Local Ollama RTX 4050'} [{engineStatus?.vramStatus || '4.5 GB VRAM'}] + {engineStatus?.tier || 'Colibrì MoE Mesh Tier 0'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Mesh Actif" />
            </div>
          </div>
        </div>

        {/* Zone 2 : Liens de navigation propres */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigateSection('milestone')}
            className={`transition-colors hover:text-white ${
              activeSection === 'milestone' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Palier 510,75 $
          </button>
          <button
            onClick={() => onNavigateSection('pnl')}
            className={`transition-colors hover:text-white ${
              activeSection === 'pnl' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Télémétrie PnL
          </button>
          <button
            onClick={() => onNavigateSection('healing')}
            className={`transition-colors hover:text-white ${
              activeSection === 'healing' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Boucle ToT (Self-Healing)
          </button>
          <button
            onClick={() => onNavigateSection('squads')}
            className={`transition-colors hover:text-white ${
              activeSection === 'squads' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Les 3 Escouades
          </button>
          <button
            onClick={() => onNavigateSection('looker')}
            className={`transition-colors hover:text-white ${
              activeSection === 'looker' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Looker Studio
          </button>
          <button
            onClick={() => onNavigateSection('audio')}
            className={`transition-colors hover:text-white ${
              activeSection === 'audio' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Soundtrack
          </button>
        </nav>

        {/* Zone 3 : Actions directes (GitHub, Looker, Docs) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://github.com/mikegauthierguillet"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => onNavigateSection('looker')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Looker Studio</span>
          </button>

          <button
            onClick={() => onNavigateSection('squads')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-md shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Commander un Gig</span>
          </button>
        </div>
      </div>
    </header>
  );
};
