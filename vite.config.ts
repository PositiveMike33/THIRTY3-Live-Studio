import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// Middleware Vite pour les routes API de télémétrie THIRTY3
function thirty3TelemetryApiPlugin(): Plugin {
  return {
    name: 'thirty3-telemetry-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        // GET /api/v1/mcp-microservices/telemetry/looker-csv
        if (req.url === '/api/v1/mcp-microservices/telemetry/looker-csv') {
          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          const csv = [
            'Escouade_ID,Nom_Escouade,Commandes_Livrees,CA_Brut_CAD,Taux_Taxes_Combine,Provisions_Fiscales_CAD,Net_Michael_CAD,Pertes_Evitees_ToT_CAD,Taux_Succes_ToT_Pourcent,Date_Extraction',
            'sovereign-mcp,"Sovereign MCP Lab",4,260.00,27.175%,70.66,189.34,585.00,99.8%,2026-09-25T10:00:00Z',
            'cogniflow,"CogniFlow Systems",3,255.00,27.175%,69.30,185.70,640.00,99.9%,2026-09-25T10:00:00Z',
            'finops-matrix,"FinOps Matrix",2,164.45,27.175%,44.69,119.76,920.00,99.7%,2026-09-25T10:00:00Z',
          ].join('\n');
          res.end(csv);
          return;
        }

        // GET /api/v1/mcp-microservices/telemetry/pnl
        if (req.url === '/api/v1/mcp-microservices/telemetry/pnl') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          const data = {
            squads: [
              {
                id: 'sovereign-mcp',
                name: 'Sovereign MCP Lab',
                handle: '@SovereignMCPLab',
                roleTitle: 'Architecte Serveurs MCP Parnas',
                leadArchitect: 'David Parnas Seal',
                description: 'Modules MCP étanches avec isolation stricte des contextes et schémas immuables.',
                ordersDelivered: 4,
                grossRevenueCAD: 260.0,
                taxRateTPS_TVQ: 0.14975,
                taxRatePME: 0.122,
                reservedTaxesCAD: 70.66,
                netMichaelCAD: 189.34,
                lossesAvoidedCAD: 585.0,
                totSuccessRate: 99.8,
                status: 'active',
                primaryTech: ['TypeScript', 'Model Context Protocol', 'Zod', 'Docker'],
              },
              {
                id: 'cogniflow',
                name: 'CogniFlow Systems',
                handle: '@CogniFlowSystems',
                roleTitle: 'Ingénierie Workflows n8n & ToT Loop',
                leadArchitect: 'Tree-of-Thought Engine',
                description: 'Automatisation d’entreprise n8n/Make avec boucle récursive 3-retry et scellement SHA-256.',
                ordersDelivered: 3,
                grossRevenueCAD: 255.0,
                taxRateTPS_TVQ: 0.14975,
                taxRatePME: 0.122,
                reservedTaxesCAD: 69.3,
                netMichaelCAD: 185.7,
                lossesAvoidedCAD: 640.0,
                totSuccessRate: 99.9,
                status: 'active',
                primaryTech: ['n8n', 'Make', 'PostgreSQL', 'Webhooks', 'ToT Kernel'],
              },
              {
                id: 'finops-matrix',
                name: 'FinOps Matrix',
                handle: '@FinOpsMatrix',
                roleTitle: 'Proxy Spéculatif Colibrì MoE',
                leadArchitect: 'Colibrì Mesh Arbiter',
                description: 'Optimisation de charge et arbitrage de jetons réduisant la facture LLM de 60% à 80%.',
                ordersDelivered: 2,
                grossRevenueCAD: 164.45,
                taxRateTPS_TVQ: 0.14975,
                taxRatePME: 0.122,
                reservedTaxesCAD: 44.69,
                netMichaelCAD: 119.76,
                lossesAvoidedCAD: 920.0,
                totSuccessRate: 99.7,
                status: 'active',
                primaryTech: ['Ollama RTX 4050', 'Colibrì MoE', 'LiteLLM', 'FastAPI'],
              },
            ],
            summary: {
              totalOrders: 9,
              totalGrossCAD: 679.45,
              totalTaxesCAD: 184.65,
              totalNetCAD: 494.79,
              totalLossesAvoidedCAD: 2145.0,
              avgToTSuccessRate: 99.8,
            },
            milestone: {
              targetCAD: 510.75,
              currentNetCAD: 494.79,
              remainingCAD: 15.96,
              percentage: 96.87,
              items: [
                {
                  id: 'item-declic',
                  label: 'Acte de naissance DEClic! (Ministère de l’Emploi et de la Solidarité sociale)',
                  amountCAD: 45.75,
                  fundedCAD: 45.75,
                  recipient: 'DEClic! / Gouvernement du Québec',
                  urgency: 'completed',
                  description: 'Document officiel d’état civil pour finaliser l’hérédité de Michael Gauthier Guillet.',
                },
                {
                  id: 'item-notary',
                  label: 'Déclaration d’hérédité notariée (Me Léopold Lincà, notaire)',
                  amountCAD: 465.0,
                  fundedCAD: 449.04,
                  recipient: 'Me Léopold Lincà, Notaire & Célébrant',
                  urgency: 'high',
                  description: 'Acte notarié officiel en minute attestant de la succession et du titre légal.',
                },
              ],
              lastUpdated: new Date().toISOString(),
            },
            engineStatus: {
              nodeName: 'Local Ollama RTX 4050',
              vramStatus: '4.5 GB / 6.0 GB VRAM',
              tier: 'Colibrì MoE Mesh Tier 0',
              activeMeshSockets: 3,
              latencyAvgMs: 14.8,
              isBackendConnected: true,
              lastHeartbeat: new Date().toISOString(),
            },
          };
          res.end(JSON.stringify(data));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), thirty3TelemetryApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
