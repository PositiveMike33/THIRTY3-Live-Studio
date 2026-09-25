/**
 * Types TypeScript stricts pour THIRTY3 - Trio-Agents Engine & Live Dashboard
 * Architecturé pour Michael Gauthier Guillet
 */

export interface MilestoneBreakdownItem {
  id: string;
  label: string;
  amountCAD: number;
  fundedCAD: number;
  recipient: string;
  urgency: 'high' | 'critical' | 'completed';
  description: string;
}

export interface FinancialMilestone {
  targetCAD: number;
  currentNetCAD: number;
  remainingCAD: number;
  percentage: number;
  items: MilestoneBreakdownItem[];
  lastUpdated: string;
}

export type SquadId = 'sovereign-mcp' | 'cogniflow' | 'finops-matrix';

export interface SquadPnL {
  id: SquadId;
  name: string;
  handle: string;
  roleTitle: string;
  leadArchitect: string;
  description: string;
  ordersDelivered: number;
  grossRevenueCAD: number;
  taxRateTPS_TVQ: number; // 0.14975 (14.975%)
  taxRatePME: number;     // 0.12200 (12.2%)
  reservedTaxesCAD: number; // (14.975% + 12.2% = 27.175%)
  netMichaelCAD: number;
  lossesAvoidedCAD: number;
  totSuccessRate: number; // e.g. 99.8
  status: 'active' | 'busy' | 'standby';
  primaryTech: string[];
}

export interface HealingPass {
  step: 1 | 2 | 3;
  role: 'Architect' | 'Commando' | 'Sentinel';
  title: string;
  action: string;
  durationMs: number;
  certainty: number; // 0 to 100%
  details: string;
}

export interface HealingIncident {
  id: string;
  timestamp: string;
  squadId: SquadId;
  squadName: string;
  serviceName: string;
  anomalyType: string;
  passes: HealingPass[];
  finalStatus: 'PASS' | 'HEALED' | 'ISOLATED';
  lossAvoidedCAD: number;
  sha256Seal: string;
  executionTotalMs: number;
}

export interface ServiceGig {
  id: string;
  squadId: SquadId;
  squadName: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  architecturePrinciple: string; // ex: David Parnas Information Hiding
  priceEUR: number;
  priceCAD: number;
  priceUSD: number;
  deliveryDays: number;
  features: string[];
  stripeUrl?: string;
  fiverrUrl: string;
  comeupUrl: string;
  interacAvailable: boolean;
}

export interface EngineStatus {
  nodeName: string;
  vramStatus: string;
  tier: string;
  activeMeshSockets: number;
  latencyAvgMs: number;
  isBackendConnected: boolean;
  lastHeartbeat: string;
}

export interface TelemetryData {
  squads: SquadPnL[];
  summary: {
    totalOrders: number;
    totalGrossCAD: number;
    totalTaxesCAD: number;
    totalNetCAD: number;
    totalLossesAvoidedCAD: number;
    avgToTSuccessRate: number;
  };
  milestone: FinancialMilestone;
  recentIncidents: HealingIncident[];
  engineStatus: EngineStatus;
}
