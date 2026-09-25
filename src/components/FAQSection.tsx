import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Clock,
  Headphones,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Cpu,
  CreditCard,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'garanties' | 'delais' | 'support' | 'facturation';
  question: string;
  answer: string;
  highlights: string[];
  badge?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'garantie-tot-selfhealing',
    category: 'garanties',
    question: 'Quelle est la garantie de fonctionnement sur les serveurs MCP et workflows ToT ?',
    answer:
      'Chaque microservice et workflow d’automatisation intègre notre boucle récursive de résilience Tree-of-Thought (ToT) plafonnée à 3 essais maximum (Diagnostic Architect -> Commando Patch -> Validation Sentinelle > 99,9%). En cas de rupture d’API tierce ou de contrat JSON non-conforme, le système s’auto-guérit sans intervention manuelle. Si un dysfonctionnement imputable à notre architecture survient dans les 30 jours, il est corrigé sous 4 heures sans frais, ou remboursé intégralement.',
    highlights: [
      'Plafond strict de 3 retries ToT avec scellement SHA-256',
      'Certitude mathématique > 99.9% avant remise en ligne',
      'Garantie satisfait ou remboursé sous 30 jours',
    ],
    badge: 'Invariant Zéro Panne',
  },
  {
    id: 'garantie-parnas-etancheite',
    category: 'garanties',
    question: 'Comment garantissez-vous la sécurité et l’isolation de nos données d’entreprise ?',
    answer:
      'Nous appliquons le principe d’étanchéité modulaire de David Parnas (1972) : chaque connecteur MCP possède un espace mémoire, des clés API et des contextes strictement cloisonnés. Vos données d’entreprise ne sont jamais transmises à des modèles d’entraînement externes. Sur demande, le routage s’effectue à 100% sur notre cluster d’inférence local (Ollama RTX 4050) sans aucune sortie sur le web public.',
    highlights: [
      'Architecture modulaire étanche selon David Parnas',
      'Zéro fuite d’entraînement IA (Zero Data Retention)',
      'Possibilité de déploiement 100% On-Premise / Local RTX',
    ],
    badge: 'Confidentialité Stricte',
  },
  {
    id: 'delais-microservices',
    category: 'delais',
    question: 'Quels sont les délais de livraison typiques pour un microservice commandé ?',
    answer:
      'Nos modules sont pré-architecturés et testés en amont dans nos pipelines de validation. Un microservice unitaire (serveur MCP dédié, script de routage Colibrì MoE ou connecteur Stripe/n8n) est packagé, déployé et livré clé-en-main en 24 à 48 heures ouvrées avec sa documentation technique et ses variables d’environnement prêtes à l’emploi.',
    highlights: [
      'Microservice autonome : 24 à 48h ouvrées',
      'Workflow complexe multi-nœuds (n8n / Make) : 3 à 5 jours ouvrés',
      'Audit FinOps complet & cluster d’arbitrage : 48h',
    ],
    badge: '24-48h Ouvrées',
  },
  {
    id: 'delais-deploiement-urgence',
    category: 'delais',
    question: 'Proposez-vous un déploiement d’urgence en cas d’incident ou d’explosion de coûts API ?',
    answer:
      'Oui. Pour les urgences critiques (facture OpenAI/Anthropic en forte surchauffe ou flux de production bloqué), nous activons un canal Commando Prioritaire avec intervention immédiate sous 2 heures pour brancher notre proxy d’arbitrage spéculatif Colibrì MoE et stabiliser les coûts immédiatement.',
    highlights: [
      'Intervention d’urgence sous 2 heures',
      'Réduction immédiate de 60% à 80% de la facture token',
      'Bascule transparente sans interruption de service client',
    ],
    badge: 'Urgence Commando',
  },
  {
    id: 'support-methode',
    category: 'support',
    question: 'Comment s’organise le support technique et qui répond à nos questions ?',
    answer:
      'Aucun chatbot générique ni sous-traitant offshore. Le support est assuré en direct par Michael Gauthier Guillet, Ingénieur en Chef et Architecte du système. Vous bénéficiez d’un canal de communication direct (Slack/Discord privé, courriel prioritaire et session Google Meet de cadrage technique).',
    highlights: [
      'Interlocuteur unique : Michael Gauthier Guillet en direct',
      'Canal prioritaire dédié avec suivi de télémétrie',
      'Session de passation vidéo et documentation Markdown complète',
    ],
    badge: 'Direct Ingénieur en Chef',
  },
  {
    id: 'support-mises-a-jour',
    category: 'support',
    question: 'Que comprend la période de maintenance et de garantie après déploiement ?',
    answer:
      'Chaque livraison inclut 30 jours de support proactif et de supervision continue. Nous veillons aux changements de versions des API externes (mise à jour des schémas JSON, dépréciations d’endpoints) et appliquons les correctifs nécessaires pour maintenir votre disponibilité à 100%.',
    highlights: [
      '30 jours de maintenance proactive inclus',
      'Veille d’obsolescence API et rétrocompatibilité',
      'Abonnement d’infogérance trimestrielle disponible sur devis',
    ],
  },
  {
    id: 'facturation-paiement',
    category: 'facturation',
    question: 'Quels sont les modes de paiement acceptés et comment s’applique la fiscalité ?',
    answer:
      'Nous supportons le virement Interac direct Autodeposit canadien (mikegauthierguillet@gmail.com, confirmation instantanée) ainsi que le paiement sécurisé par carte bancaire via Stripe Link (EUR, CAD, USD). Une facture officielle d’entreprise conforme au régime fiscal québécois (TPS/TVQ 14,975% déduite) vous est automatiquement délivrée.',
    highlights: [
      'Virement Interac Autodeposit sans frais (CAD)',
      'Paiement mondial 1-clic par Stripe Link (EUR, USD, CAD)',
      'Facturation commerciale avec TPS/TVQ en règle',
    ],
    badge: 'Interac & Stripe Link',
  },
];

type CategoryFilter = 'all' | 'garanties' | 'delais' | 'support' | 'facturation';

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [openIds, setOpenIds] = useState<string[]>(['garantie-tot-selfhealing', 'delais-microservices']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredItems =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-8 shadow-lg relative overflow-hidden">
      {/* Halo d'ambiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête FAQ */}
      <div className="relative z-10 max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Transparence & Sérénité Client</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
          Foire aux Questions & Engagements de Service
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Toutes les réponses relatives à nos garanties d’étanchéité, nos protocoles d'auto-guérison ToT, nos délais de livraison
          et notre méthodologie d'accompagnement direct par l’Ingénieur en Chef.
        </p>
      </div>

      {/* Piliers de confiance rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 relative z-10">
        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Garantie 30 Jours</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Satisfaction intégrale ou remboursement sans contestation.
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Déploiement 24-48h</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Microservices modulaires livrés prêts pour la production.
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Support Michael Direct</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Échange direct avec l’architecte concepteur des agents.
            </div>
          </div>
        </div>
      </div>

      {/* Onglets de filtrage par catégorie */}
      <div className="flex flex-wrap items-center gap-2 mb-6 relative z-10 border-b border-slate-800/80 pb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          Toutes les questions ({FAQ_ITEMS.length})
        </button>

        <button
          onClick={() => setActiveCategory('garanties')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeCategory === 'garanties'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Garanties & Invariants ToT</span>
        </button>

        <button
          onClick={() => setActiveCategory('delais')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeCategory === 'delais'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Délais de Livraison</span>
        </button>

        <button
          onClick={() => setActiveCategory('support')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeCategory === 'support'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Headphones className="w-3.5 h-3.5 text-indigo-400" />
          <span>Support & Accompagnement</span>
        </button>

        <button
          onClick={() => setActiveCategory('facturation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeCategory === 'facturation'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Paiement & Fiscalité</span>
        </button>
      </div>

      {/* Liste des Accordéons */}
      <div className="space-y-3 relative z-10">
        {filteredItems.map((item) => {
          const isOpen = openIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-slate-950/90 border-slate-700 shadow-md'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-4 sm:px-6 py-4 text-left flex items-start sm:items-center justify-between gap-3 group focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`mt-0.5 sm:mt-0 w-2 h-2 rounded-full shrink-0 ${
                      isOpen ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-medium text-sm sm:text-base text-slate-200 group-hover:text-white transition-colors">
                    {item.question}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {item.badge && (
                    <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono-tabular">
                      {item.badge}
                    </span>
                  )}
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                      isOpen
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 space-y-3.5">
                  <p className="leading-relaxed text-slate-300">{item.answer}</p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/90 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Engagements Clés</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.highlights.map((h, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs font-mono-tabular text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bannière de contact personnalisé */}
      <div className="mt-8 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vous avez un cas d’usage spécifique ou une contrainte On-Premise ?</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Échangez directement avec Michael Gauthier Guillet pour évaluer votre architecture et modéliser vos économies API.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="mailto:mikegauthierguillet@gmail.com?subject=Demande%20d%27Architecture%20THIRTY3%20-%20Microservices%20IA"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg transition-all shadow-sm"
          >
            <span>Poser une question directe</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </a>
        </div>
      </div>
    </div>
  );
};
