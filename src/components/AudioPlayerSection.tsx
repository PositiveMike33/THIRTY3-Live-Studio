import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  RotateCcw,
  Music,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';

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
    label: 'Intro',
    timeSec: 0,
    timeFormatted: '00:00',
    description: 'Nappe harmonique & mise sous tension des clusters',
  },
  {
    id: 'cue-drop1',
    label: 'DROP 1 Tambours',
    timeSec: 16,
    timeFormatted: '00:16',
    description: 'Percussion rythmée & cadence opérationnelle 128 BPM',
  },
  {
    id: 'cue-squads',
    label: 'Les 3 Escouades',
    timeSec: 49,
    timeFormatted: '00:49',
    description: 'Thème polyphonique représentant le trio MCP, n8n et MoE',
  },
  {
    id: 'cue-voice',
    label: 'Démo Vocale',
    timeSec: 134,
    timeFormatted: '02:14',
    description: 'Synthèse vocale d’analyse de télémétrie & circuit-breaker',
  },
  {
    id: 'cue-megadrop',
    label: 'MÉGA DROP Apothéose',
    timeSec: 149,
    timeFormatted: '02:29',
    description: 'Convergence pleine puissance & validation formelle',
  },
];

const TOTAL_DURATION_SEC = 293; // 4:53

export const AudioPlayerSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCueId, setActiveCueId] = useState<string>('cue-intro');

  // Web Audio synth generator refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialisation Web Audio synthétiseur d'ambiance
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

      // Fréquence techno cyber modulée
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 fundamental

      // Filtre passe-bas pour son chaleureux
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.08, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // AudioContext non disponible ou bloqué par le navigateur
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
    }
  };

  const seekTo = (sec: number) => {
    setCurrentTime(sec);
    // Met à jour le point de repère actif
    const matched = [...CUE_POINTS].reverse().find((c) => sec >= c.timeSec);
    if (matched) setActiveCueId(matched.id);
  };

  // Progression du temps
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

  // Volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 0.08,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-lg space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Invariant Audio 06 · Bande Sonore Officielle THIRTY3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Original Soundtrack & Démo Vocale (4:53)
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Composition originale accompagnant le déploiement opérationnel des 3 escouades.
            Utilisez les boutons de repère pour naviguer instantanément aux moments clés.
          </p>
        </div>

        {/* Badge d'état audio */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <Music className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono-tabular">BPM: 128 · 24-bit Hi-Res Master</span>
        </div>
      </div>

      {/* Lecteur Principal */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        {/* Visualiseur de fréquences synthétisées animées */}
        <div className="h-14 w-full flex items-end justify-between gap-1 px-2 py-1 bg-slate-900/60 rounded-lg border border-slate-800/80 overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            const height = isPlaying
              ? Math.max(15, Math.sin(i * 0.4 + currentTime * 2) * 50 + 45)
              : 8;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500 via-teal-400 to-emerald-400 rounded-t-sm transition-all duration-150"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Barre de scrubbing / progression */}
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
            <span>04:53</span>
          </div>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Boutons Play / Pause / Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => seekTo(0)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Retour au début"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Écouter la Bande Sonore (Synthèse Active)</span>
                </>
              )}
            </button>
          </div>

          {/* Contrôle de volume */}
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

      {/* Boutons de repère rapide (Cue Points) */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Points de Repère Clés (Accès 1-Clic)
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
                  <span className="font-semibold">{cue.label}</span>
                  <span className="font-mono-tabular text-cyan-400 text-[11px] font-bold">
                    {cue.timeFormatted}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{cue.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
