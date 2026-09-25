import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Radio,
  Share2,
  Copy,
  Check,
  Send,
  Linkedin,
  Twitter,
  FileText,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

interface CuePoint {
  id: string;
  label: string;
  timeSec: number;
  timeFormatted: string;
  description: string;
}

const CUE_POINTS: CuePoint[] = [
  {
    id: 'cue-intro',
    label: 'Communiqué de Presse',
    timeSec: 0,
    timeFormatted: '00:00',
    description: 'Annonce d’ouverture & positionnement exécutif de Michael Gauthier Guillet',
  },
  {
    id: 'cue-squads',
    label: 'Les 3 Escouades Autonomes',
    timeSec: 30,
    timeFormatted: '00:30',
    description: 'Présentation de Sovereign MCP Lab, CogniFlow Systems et FinOps Matrix',
  },
  {
    id: 'cue-parnas',
    label: 'Invariant David Parnas',
    timeSec: 75,
    timeFormatted: '01:15',
    description: 'Masquage strict d’information et étanchéité modulaire des contextes',
  },
  {
    id: 'cue-tot',
    label: 'Sécurité Récursive ToT',
    timeSec: 120,
    timeFormatted: '02:00',
    description: 'Auto-guérison 3-retry et préservation des flux financiers critiques',
  },
  {
    id: 'cue-call',
    label: 'Appel aux Partenaires & Interac',
    timeSec: 165,
    timeFormatted: '02:45',
    description: 'Financement du palier juridique et rails transactionnels friction zéro',
  },
];

const TOTAL_DURATION_SEC = 210; // 3:30 annonce professionnelle

export const AudioPlayerSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCueId, setActiveCueId] = useState<string>('cue-intro');
  const [activeSocialTab, setActiveSocialTab] = useState<'linkedin' | 'twitter' | 'press'>('linkedin');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Synthétiseur d'ambiance professionnelle Web Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Ton posé, sobre et professionnel (onde harmonique pure à basse fréquence 130 Hz C3)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130.81, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.05, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // AudioContext non disponible ou bloqué
    }
  };

  const stopSynth = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch {
      //
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSynth();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      startSynth();
      setIsPlaying(true);
      toast.info('Diffusion de l’annonce officielle en cours (synthèse broadcast audio active).', {
        autoClose: 2500,
        theme: 'dark',
      });
    }
  };

  const seekTo = (sec: number) => {
    setCurrentTime(sec);
    const matched = [...CUE_POINTS].reverse().find((c) => sec >= c.timeSec);
    if (matched) setActiveCueId(matched.id);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION_SEC) {
            stopSynth();
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          const matched = [...CUE_POINTS].reverse().find((c) => next >= c.timeSec);
          if (matched) setActiveCueId(matched.id);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 0.05,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Textes d'annonces réseaux sociaux prêts pour publication professionnelle
  const socialPosts = {
    linkedin: `🚀 [COMMUNIQUÉ OFFICIEL] Lancement de THIRTY3 : Trio d'Agents IA Autonomes pour l'Entreprise.

Conçu par Michael Gauthier Guillet, THIRTY3 déploie 3 escouades d'agents spécialisés :
1️⃣ Sovereign MCP Lab (@SovereignMCPLab) : Serveurs Model Context Protocol étanches selon David Parnas (1972).
2️⃣ CogniFlow Systems (@CogniFlowSystems) : Workflows d'automatisation n8n / Make fiabilisés par validation récursive Tree-of-Thought (ToT).
3️⃣ FinOps Matrix (@FinOpsMatrix) : Proxys de routage spéculatif réduisant les factures API de 60% à 80%.

📊 Dashboard exécutif en direct, télémétrie financière transparente (retenues fiscales québécoises de 27,175% appliquées) et rails transactionnels Interac Autodeposit & Stripe.

🔗 Découvrez la plateforme live : mikegauthierguillet@gmail.com | +1 438-543-2555
#IntelligenceArtificielle #MCP #Automatisation #FinOps #QuebecTech #Engineering`,

    twitter: `Lancement officiel de THIRTY3 par Michael Gauthier Guillet ⚡

3 escouades d'agents IA autonomes prêts pour la production :
🔹 @SovereignMCPLab : Serveurs MCP étanches (Parnas 1972)
🔹 @CogniFlowSystems : Workflows n8n avec auto-guérison ToT
🔹 @FinOpsMatrix : Arbitrage MoE -60% à -80% API

Dashboard en direct & PnL transparent : mikegauthierguillet@gmail.com
#IA #MCP #FinOps`,

    press: `COMMUNIQUÉ DE PRESSE EXÉCUTIF - THIRTY3
Émetteur : Michael Gauthier Guillet, Ingénieur en Chef & Fondateur
Contact : mikegauthierguillet@gmail.com | +1 438-543-2555

OBJET : Mise en production officielle de l'écosystème THIRTY3 et de son tableau de bord exécutif.

THIRTY3 concrétise le déploiement opérationnel d'agents IA modulaires pour l'entreprise :
- Conformité architecturale stricte aux principes de David Parnas.
- Auto-guérison ToT (3-retry max) scellée par hachage SHA-256 lors d'anomalies de schémas.
- Gestion financière rigoureuse avec provision fiscale automatique de 27,175% (TPS/TVQ + impôt PME) et suivi du palier juridique de 510,75 $ CAD.

Disponible dès maintenant via commandes directes et intégrations Looker Studio / Google Sheets.`,
  };

  const handleCopyPost = (key: 'linkedin' | 'twitter' | 'press') => {
    navigator.clipboard.writeText(socialPosts[key]);
    setCopiedType(key);
    toast.success(`Texte d'annonce ${key.toUpperCase()} copié dans le presse-papier !`, {
      theme: 'dark',
      autoClose: 2500,
    });
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-lg space-y-6">
      {/* En-tête sobre et professionnel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Invariant Média 06 · Annonce Réseaux Sociaux & Audio Broadcast</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Communiqué Audio & Kit de Publication Réseaux Sociaux
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Diffusion officielle de présentation du système THIRTY3 pour LinkedIn, X et partenaires institutionnels.
            Écoutez l'annonce audio chapitrée ou copiez les publications prêtes à diffuser.
          </p>
        </div>

        {/* Badge professionnel */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono-tabular">Format Broadcast 16-bit / 48 kHz</span>
        </div>
      </div>

      {/* Lecteur d'Annonce Audio Professionnel */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-4">
        {/* Visualiseur d'onde sobre */}
        <div className="h-10 w-full flex items-center justify-between gap-1 px-3 bg-slate-900/70 rounded-lg border border-slate-800 overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            const barHeight = isPlaying
              ? Math.max(15, Math.abs(Math.sin(i * 0.35 + currentTime * 1.8)) * 80 + 10)
              : 8;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-sm transition-all duration-150"
                style={{ height: `${barHeight}%` }}
              />
            );
          })}
        </div>

        {/* Barre de scrubbing */}
        <div>
          <input
            type="range"
            min="0"
            max={TOTAL_DURATION_SEC}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs font-mono-tabular text-slate-400 mt-1.5">
            <span className="text-cyan-400 font-semibold">{formatTime(currentTime)}</span>
            <span>03:30 (Durée totale annonce)</span>
          </div>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => seekTo(0)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Retour au début de l'annonce"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Suspendre la diffusion</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Diffuser l'Annonce Vocale Officielle</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Chapitrage officiel de l'annonce */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Chapitrage Exécutif de l'Annonce (Navigation directe)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CUE_POINTS.map((cue) => {
            const isActive = activeCueId === cue.id;
            return (
              <button
                key={cue.id}
                onClick={() => {
                  seekTo(cue.timeSec);
                  if (!isPlaying) togglePlay();
                }}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-cyan-950/60 border-cyan-500/70 text-white shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold truncate">{cue.label}</span>
                  <span className="font-mono-tabular text-cyan-400 text-[11px] font-bold shrink-0 ml-1">
                    {cue.timeFormatted}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{cue.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kit de publication Réseaux Sociaux 1-Clic (LinkedIn, X, Presse) */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Kit de Publication Réseaux Sociaux Clé en Main</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSocialTab('linkedin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeSocialTab === 'linkedin'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => setActiveSocialTab('twitter')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeSocialTab === 'twitter'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={() => setActiveSocialTab('press')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeSocialTab === 'press'
                  ? 'bg-slate-800 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Communiqué B2B</span>
            </button>
          </div>
        </div>

        {/* Contenu textuel prêt à copier */}
        <div className="relative bg-slate-900/90 rounded-lg p-4 border border-slate-800">
          <button
            onClick={() => handleCopyPost(activeSocialTab)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 hover:text-cyan-200 text-xs font-medium border border-slate-700 transition-colors shadow-sm"
          >
            {copiedType === activeSocialTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le texte prêt à publier</span>
              </>
            )}
          </button>

          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed pr-32">
            {socialPosts[activeSocialTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
