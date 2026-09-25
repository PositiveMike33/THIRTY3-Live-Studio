import { create } from 'zustand';
import { TelemetryData, HealingIncident, SquadId } from '../types';
import { engineApi } from '../services/engineApi';
import { toast } from 'react-toastify';

interface Thirty3State {
  telemetry: TelemetryData | null;
  isLoading: boolean;
  isDemoMode: boolean;
  activeSection: string;
  isHealingSimulating: boolean;
  currentHealingIncident: HealingIncident | null;
  activeIncidentStep: number; // 0: idle, 1: Architect, 2: Commando, 3: Sentinel
  error: string | null;

  // Actions
  fetchTelemetry: () => Promise<void>;
  triggerHealingSimulation: (squadId?: SquadId, customLossAmount?: number) => Promise<HealingIncident | null>;
  recordSale: (squadId: SquadId, grossCAD: number) => Promise<void>;
  resetDefaults: () => void;
  setActiveSection: (section: string) => void;
  dismissCurrentHealing: () => void;
}

export const useThirty3Store = create<Thirty3State>((set, get) => ({
  telemetry: null,
  isLoading: false,
  isDemoMode: true,
  activeSection: 'hero',
  isHealingSimulating: false,
  currentHealingIncident: null,
  activeIncidentStep: 0,
  error: null,

  fetchTelemetry: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await engineApi.getTelemetry();
      const isConnected = data.engineStatus.isBackendConnected;
      set({
        telemetry: data,
        isDemoMode: !isConnected,
        isLoading: false,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue de télémétrie';
      set({ error: errorMessage, isLoading: false, isDemoMode: true });
      toast.warn('Mode démo interactif activé : Engine local non détecté, fonctionnement 100% autonome.', {
        position: 'bottom-right',
        autoClose: 4000,
        theme: 'dark',
      });
    }
  },

  triggerHealingSimulation: async (squadId?: SquadId, customLossAmount?: number) => {
    set({ isHealingSimulating: true, activeIncidentStep: 1 });

    // Toast d'annonce de l'anomalie
    toast.info('⚡ Incident détecté ! Déclenchement de la boucle ToT 3-Retry...', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });

    try {
      // Étape 1 : Architect Diagnostic (délai réaliste de visualisation)
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ activeIncidentStep: 2 });

      // Étape 2 : Commando Patch
      await new Promise((resolve) => setTimeout(resolve, 900));
      set({ activeIncidentStep: 3 });

      // Étape 3 : Sentinel Validation & appel API
      const incident = await engineApi.simulateHealing(squadId, customLossAmount);

      await new Promise((resolve) => setTimeout(resolve, 700));

      // Mise à jour de la télémétrie
      const updatedTelemetry = await engineApi.getTelemetry();

      set({
        telemetry: updatedTelemetry,
        currentHealingIncident: incident,
        isHealingSimulating: false,
        activeIncidentStep: 0,
      });

      toast.success(
        `🛡️ Auto-guérison ToT réussie ! Perte de +${incident.lossAvoidedCAD.toFixed(2)} $ CAD évitée (SHA-256 scellé).`,
        {
          position: 'top-right',
          autoClose: 5000,
          theme: 'dark',
        }
      );

      return incident;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de la boucle de guérison';
      set({
        isHealingSimulating: false,
        activeIncidentStep: 0,
        error: errorMessage,
      });
      toast.error(`Erreur simulation ToT: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
      return null;
    }
  },

  recordSale: async (squadId: SquadId, grossCAD: number) => {
    try {
      const updatedData = await engineApi.recordSale(squadId, grossCAD);
      set({ telemetry: updatedData });
      toast.success(
        `🎉 Vente enregistrée (+${grossCAD.toFixed(2)} $ CAD) ! Taxes et net Michael actualisés en direct.`,
        {
          position: 'top-right',
          autoClose: 3500,
          theme: 'dark',
        }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur d’enregistrement de la commande';
      toast.error(errorMsg, { theme: 'dark' });
    }
  },

  resetDefaults: () => {
    const data = engineApi.resetDefaults();
    set({ telemetry: data, currentHealingIncident: null, activeIncidentStep: 0 });
    toast.info('Données de démo réinitialisées à l’état de référence.', {
      position: 'bottom-right',
      autoClose: 2500,
      theme: 'dark',
    });
  },

  setActiveSection: (section: string) => {
    set({ activeSection: section });
  },

  dismissCurrentHealing: () => {
    set({ currentHealingIncident: null });
  },
}));
