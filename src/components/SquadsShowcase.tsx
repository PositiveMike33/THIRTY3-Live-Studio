import React, { useState } from 'react';
import { OFFICIAL_SERVICE_GIGS } from '../services/engineApi';
import { ServiceGig, SquadId } from '../types';
import { useThirty3Store } from '../store/useThirty3Store';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Mail,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Layers,
  Cpu,
  TrendingDown,
  X,
} from 'lucide-react';

export const SquadsShowcase: React.FC = () => {
  const [selectedGig, setSelectedGig] = useState<ServiceGig | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'CAD' | 'EUR' | 'USD'>('CAD');

  const { recordSale, telemetry } = useThirty3Store();

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSimulateDirectOrder = (gig: ServiceGig) => {
    recordSale(gig.squadId, gig.priceCAD);
    setSelectedGig(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Invariant Opérationnel 05 · Le Trio d'Agents IA Autonomes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Les 3 Escouades Spécialisées & Microservices Prêts pour la Production
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Unités logicielles autonomes certifiées sans code tronqué. Chaque microservice est développé
            selon les principes fondateurs du génie logiciel rigoureux.
          </p>
        </div>

        {/* Sélecteur de devise */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs self-start md:self-auto">
          <span className="text-slate-500 px-2 font-medium">Devise :</span>
          {(['CAD', 'EUR', 'USD'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                selectedCurrency === curr
                  ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Tâche de Fond : Amortissement d'Infrastructure R&D (Actif en Background) */}
      {telemetry?.milestone && (
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300 font-medium">
              Pipeline Background : <strong>Amortissement R&D Cluster Souverain</strong>
            </span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-400 font-mono-tabular">
              {telemetry.milestone.currentNetCAD.toFixed(2)} $ / {telemetry.milestone.targetCAD.toFixed(2)} $ CAD ({telemetry.milestone.percentage.toFixed(1)}%)
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="w-32 sm:w-40 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${telemetry.milestone.percentage}%` }}
              />
            </div>
            <span className="font-mono-tabular text-emerald-400 font-bold text-[11px]">
              {telemetry.milestone.remainingCAD > 0 ? `Reste : ${telemetry.milestone.remainingCAD.toFixed(2)} $` : '100% Bouclé'}
            </span>
          </div>
        </div>
      )}

      {/* Grille des 3 Cartes Néomorphiques des Escouades avec animations fluides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {OFFICIAL_SERVICE_GIGS.map((gig) => {
          const isMCP = gig.squadId === 'sovereign-mcp';
          const isCogni = gig.squadId === 'cogniflow';

          const accentColor = isMCP
            ? 'cyan'
            : isCogni
            ? 'emerald'
            : 'amber';

          const priceDisplay =
            selectedCurrency === 'CAD'
              ? `${gig.priceCAD} $ CAD`
              : selectedCurrency === 'EUR'
              ? `${gig.priceEUR} €`
              : `${gig.priceUSD} $ USD`;

          return (
            <div
              key={gig.id}
              className="group relative rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Ligne d'accent lumineuse supérieure */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
                  isMCP
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : isCogni
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
              />

              <div>
                {/* En-tête de carte avec insigne vectoriel */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Insigne vectoriel haute fidélité */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105 ${
                        isMCP
                          ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                          : isCogni
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      }`}
                    >
                      {isMCP ? (
                        <Cpu className="w-6 h-6" />
                      ) : isCogni ? (
                        <Zap className="w-6 h-6" />
                      ) : (
                        <TrendingDown className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-white">{gig.squadName}</h3>
                      </div>
                      <span className="text-xs font-mono-tabular text-slate-400">{gig.badge}</span>
                    </div>
                  </div>

                  <span className="font-mono-tabular text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Livré en {gig.deliveryDays}j
                  </span>
                </div>

                {/* Titre du service & sous-titre */}
                <h4 className="font-semibold text-sm text-slate-100 mb-1 group-hover:text-cyan-300 transition-colors">
                  {gig.title}
                </h4>
                <p className="text-xs text-slate-400 mb-4">{gig.subtitle}</p>

                {/* Principe d'architecture fondamental */}
                <div className="mb-4 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300">
                  <span className="text-slate-500 block mb-0.5">Fondation d'ingénierie :</span>
                  <span className="font-medium text-slate-200">{gig.architecturePrinciple}</span>
                </div>

                {/* Liste des livrables */}
                <ul className="space-y-2 mb-6">
                  {gig.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          isMCP ? 'text-cyan-400' : isCogni ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pied de carte : Prix & Déclenchement Modal */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-slate-400">Tarif unique :</span>
                  <div className="text-right">
                    <span className="font-mono-tabular text-xl font-extrabold text-white">
                      {priceDisplay}
                    </span>
                    <div className="text-[10px] text-slate-500">Livraison complète incluse</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedGig(gig)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs shadow-md transition-all whitespace-nowrap"
                  >
                    <span>Commander</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedGig(gig)}
                    className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 transition-colors"
                  >
                    <span>Rails Interac / Stripe</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE COMMANDE FRICTION ZÉRO */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-6 space-y-5">
            {/* Bouton de fermeture */}
            <button
              onClick={() => setSelectedGig(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête Modal */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                Rails Transactionnels Friction Zéro · Michael Gauthier Guillet
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Finaliser la commande : {selectedGig.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tarif : <strong className="text-white font-mono-tabular font-bold">{selectedGig.priceCAD} $ CAD</strong> ({selectedGig.priceEUR} € / {selectedGig.priceUSD} $ USD)
              </p>
            </div>

            {/* Option 1 : Virement Interac direct Autodeposit */}
            <div className="p-4 rounded-lg bg-slate-950 border border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 to-slate-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" /> Option 1 : Virement Interac direct (Autodeposit)
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-medium">
                  Recommandé CAD (0% frais)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Courriel :</span>
                    <strong className="font-mono-tabular text-white">mikegauthierguillet@gmail.com</strong>
                  </div>
                  <button
                    onClick={() => handleCopy('mikegauthierguillet@gmail.com', 'email')}
                    className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                    title="Copier courriel"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Téléphone SMS :</span>
                    <strong className="font-mono-tabular text-white">+1 438-543-2555</strong>
                  </div>
                  <button
                    onClick={() => handleCopy('+1 438-543-2555', 'phone')}
                    className="p-1 text-slate-400 hover:text-emerald-300 transition-colors"
                    title="Copier numéro"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Dépôt automatique activé. Mentionnez simplement l'escouade <em>{selectedGig.badge}</em> en commentaire.
                </p>
              </div>
            </div>

            {/* Option 2 : Stripe Link & Plateformes Freelance */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Option 2 : Carte bancaire & Plateformes</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`mailto:mikegauthierguillet@gmail.com?subject=Commande%20Stripe%20Link%20${encodeURIComponent(selectedGig.title)}&body=Bonjour%20Michael,%20je%20souhaite%20recevoir%20le%20lien%20Stripe%20Link%20pour%20${encodeURIComponent(selectedGig.title)}.`}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stripe Link 1-clic</span>
                </a>

                <a
                  href={selectedGig.comeupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
                >
                  <span>ComeUp Profil</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Bouton de simulation de test immédiat */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Pour démonstration instantanée :</span>
              <button
                onClick={() => handleSimulateDirectOrder(selectedGig)}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors"
              >
                Simuler Paiement ({selectedGig.priceCAD} $ CAD)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
