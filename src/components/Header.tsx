import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  TrendingUp,
  ShieldAlert,
  Layers,
  HelpCircle,
  Radio,
  ExternalLink,
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'pnl', label: 'Télémétrie PnL', icon: TrendingUp },
    { id: 'healing', label: 'Boucle ToT (Self-Healing)', icon: ShieldAlert },
    { id: 'squads', label: 'Trio Marketing & Escouades', icon: Layers },
    { id: 'faq', label: 'FAQ & Garanties', icon: HelpCircle },
    { id: 'looker', label: 'Looker Studio', icon: BarChart3 },
    { id: 'audio', label: 'Annonce Réseaux', icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090e1a]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1 : Marque sobre THIRTY3 & Statut Mesh */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1 min-h-[44px]"
            aria-label="Accueil THIRTY3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:border-cyan-400 transition-colors">
              <span className="font-display font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                33
              </span>
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-1.5">
                THIRTY3
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </button>

          {/* Badge d'état de l'Engine Souverain (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 pl-3 ml-2 border-l border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-mono-tabular text-[11px] text-slate-300 truncate max-w-[320px]">
                {engineStatus?.nodeName || 'Deus Ex Sophia : ToT & Cloud MoE Mesh'} [{engineStatus?.vramStatus || 'RTX 4050 4.5 GB'}]
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Mesh Actif" />
            </div>
          </div>
        </div>

        {/* Zone 2 : Liens de navigation propres (Desktop) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs lg:text-sm font-medium text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`transition-colors hover:text-white py-1.5 ${
                activeSection === item.id ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3 : Actions directes & Menu Hamburger Mobile */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/PositiveMike33/THIRTY3-Live-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors min-h-[38px]"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => handleNavClick('looker')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors min-h-[38px]"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Looker</span>
          </button>

          <button
            onClick={() => handleNavClick('squads')}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-md shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all whitespace-nowrap min-h-[38px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Commander</span>
          </button>

          {/* Bouton Hamburger Mobile (Touch target 44px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* TIROIR MOBILE (Mobile Navigation Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090e1a]/98 backdrop-blur-xl px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Badge statut moteur mobile */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-white font-semibold text-xs">Deus Ex Sophia : MoE Mesh</div>
                <div className="text-[11px] text-slate-400 font-mono-tabular">RTX 4050 4.5 GB · Mesh Actif</div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              );
            })}
          </div>

          {/* Actions rapides mobile */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <a
              href="https://github.com/PositiveMike33/THIRTY3-Live-Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors min-h-[44px]"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Repo</span>
            </a>

            <button
              onClick={() => handleNavClick('looker')}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors min-h-[44px]"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Looker Studio</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
