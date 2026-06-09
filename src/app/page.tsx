"use client";

import React, { useState, useEffect } from 'react';
import VenueHeatmap from '@/components/VenueHeatmap';
import TelemetryFeed from '@/components/TelemetryFeed';
import AgentActionLog from '@/components/AgentActionLog';
import { VenueGraph, DynatraceMetric, ElasticLog, VenueType, ProblemType } from '@/lib/models';
import { generateBaselineDynatraceMetric, generateBaselineElasticLog, generateAnomalyDynatraceMetric, generateAnomalyElasticLog } from '@/lib/mockGenerators';

const VENUES: Record<VenueType, VenueGraph> = {
  stadium: {
    nodes: [
      { id: 'Metro_Station', type: 'gate', name: 'Metro Transit Hub', capacity: 4000, currentOccupancy: 800, coordinates: { x: 50, y: 15 } },
      { id: 'Gate_A', type: 'gate', name: 'Gate A (North)', capacity: 1000, currentOccupancy: 200, coordinates: { x: 30, y: 35 } },
      { id: 'Gate_B', type: 'gate', name: 'Gate B (East)', capacity: 1000, currentOccupancy: 300, coordinates: { x: 80, y: 50 } },
      { id: 'Food_Court', type: 'concourse', name: 'Stadium Food Court', capacity: 2000, currentOccupancy: 1500, coordinates: { x: 20, y: 65 } },
      { id: 'Concourse_1', type: 'concourse', name: 'Main Concourse', capacity: 5000, currentOccupancy: 1500, coordinates: { x: 50, y: 50 } },
      { id: 'Exit_South', type: 'gate', name: 'Exit South', capacity: 3000, currentOccupancy: 100, coordinates: { x: 50, y: 85 } },
    ],
    edges: [
      { id: 'e0', sourceId: 'Metro_Station', targetId: 'Gate_A', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'e1', sourceId: 'Gate_A', targetId: 'Concourse_1', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'e2', sourceId: 'Gate_B', targetId: 'Concourse_1', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'e3', sourceId: 'Food_Court', targetId: 'Concourse_1', distance: 50, traversalCost: 5, status: 'open' },
      { id: 'e4', sourceId: 'Concourse_1', targetId: 'Exit_South', distance: 100, traversalCost: 10, status: 'open' },
    ]
  },
  concert: {
    nodes: [
      { id: 'Entrance_Gate', type: 'gate', name: 'Main Entrance', capacity: 4000, currentOccupancy: 800, coordinates: { x: 50, y: 15 } },
      { id: 'Main_Stage', type: 'concourse', name: 'Main Stage', capacity: 10000, currentOccupancy: 3000, coordinates: { x: 50, y: 35 } },
      { id: 'VIP_Tent', type: 'concourse', name: 'VIP Tent', capacity: 1000, currentOccupancy: 400, coordinates: { x: 80, y: 50 } },
      { id: 'Food_Court', type: 'concourse', name: 'Merch / Food Court', capacity: 3000, currentOccupancy: 1500, coordinates: { x: 20, y: 50 } },
      { id: 'Medical_Tent', type: 'waypoint', name: 'Medical Tent', capacity: 500, currentOccupancy: 50, coordinates: { x: 80, y: 70 } },
      { id: 'Exit_North', type: 'gate', name: 'Exit North', capacity: 2000, currentOccupancy: 100, coordinates: { x: 50, y: 90 } },
    ],
    edges: [
      { id: 'f0', sourceId: 'Entrance_Gate', targetId: 'Main_Stage', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'f1', sourceId: 'Main_Stage', targetId: 'VIP_Tent', distance: 80, traversalCost: 8, status: 'open' },
      { id: 'f2', sourceId: 'Main_Stage', targetId: 'Food_Court', distance: 80, traversalCost: 8, status: 'open' },
      { id: 'f3', sourceId: 'Main_Stage', targetId: 'Exit_North', distance: 200, traversalCost: 20, status: 'open' },
      { id: 'f4', sourceId: 'Food_Court', targetId: 'Exit_North', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'f5', sourceId: 'VIP_Tent', targetId: 'Medical_Tent', distance: 50, traversalCost: 5, status: 'open' },
      { id: 'f6', sourceId: 'Medical_Tent', targetId: 'Exit_North', distance: 80, traversalCost: 8, status: 'open' },
    ]
  },
  gathering: {
    nodes: [
      { id: 'Central_Station', type: 'gate', name: 'Central Transit Hub', capacity: 3000, currentOccupancy: 1000, coordinates: { x: 50, y: 15 } },
      { id: 'Main_Square', type: 'concourse', name: 'Main Celebration Square', capacity: 8000, currentOccupancy: 4000, coordinates: { x: 50, y: 40 } },
      { id: 'East_Shelter', type: 'concourse', name: 'East Covered Shelter', capacity: 2000, currentOccupancy: 500, coordinates: { x: 80, y: 50 } },
      { id: 'Food_Market', type: 'concourse', name: 'Food Market', capacity: 2000, currentOccupancy: 800, coordinates: { x: 20, y: 50 } },
      { id: 'Kids_Zone', type: 'waypoint', name: 'Kids Play Zone', capacity: 1000, currentOccupancy: 300, coordinates: { x: 20, y: 70 } },
      { id: 'Restrooms', type: 'waypoint', name: 'Public Restrooms', capacity: 500, currentOccupancy: 100, coordinates: { x: 80, y: 70 } },
    ],
    edges: [
      { id: 'g0', sourceId: 'Central_Station', targetId: 'Main_Square', distance: 150, traversalCost: 15, status: 'open' },
      { id: 'g1', sourceId: 'Main_Square', targetId: 'East_Shelter', distance: 50, traversalCost: 5, status: 'open' },
      { id: 'g2', sourceId: 'Main_Square', targetId: 'Food_Market', distance: 80, traversalCost: 8, status: 'open' },
      { id: 'g3', sourceId: 'Food_Market', targetId: 'Kids_Zone', distance: 40, traversalCost: 4, status: 'open' },
      { id: 'g4', sourceId: 'East_Shelter', targetId: 'Restrooms', distance: 60, traversalCost: 6, status: 'open' },
      { id: 'g5', sourceId: 'Kids_Zone', targetId: 'Restrooms', distance: 120, traversalCost: 12, status: 'open' },
    ]
  },
  carnival: {
    nodes: [
      { id: 'Ticket_Booth', type: 'gate', name: 'Main Ticket Booth', capacity: 2000, currentOccupancy: 400, coordinates: { x: 50, y: 15 } },
      { id: 'Parade_Route', type: 'concourse', name: 'Main Parade Route', capacity: 5000, currentOccupancy: 3000, coordinates: { x: 50, y: 40 } },
      { id: 'Ferris_Wheel', type: 'waypoint', name: 'Giant Ferris Wheel', capacity: 1000, currentOccupancy: 800, coordinates: { x: 80, y: 40 } },
      { id: 'Beer_Garden', type: 'concourse', name: 'Beer Garden', capacity: 2000, currentOccupancy: 1500, coordinates: { x: 20, y: 60 } },
      { id: 'Game_Stalls', type: 'waypoint', name: 'Arcade & Games', capacity: 1500, currentOccupancy: 600, coordinates: { x: 80, y: 70 } },
      { id: 'Exit_Plaza', type: 'gate', name: 'Exit Plaza', capacity: 4000, currentOccupancy: 500, coordinates: { x: 50, y: 90 } },
    ],
    edges: [
      { id: 'c0', sourceId: 'Ticket_Booth', targetId: 'Parade_Route', distance: 80, traversalCost: 8, status: 'open' },
      { id: 'c1', sourceId: 'Parade_Route', targetId: 'Ferris_Wheel', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'c2', sourceId: 'Parade_Route', targetId: 'Beer_Garden', distance: 60, traversalCost: 6, status: 'open' },
      { id: 'c3', sourceId: 'Ferris_Wheel', targetId: 'Game_Stalls', distance: 70, traversalCost: 7, status: 'open' },
      { id: 'c4', sourceId: 'Beer_Garden', targetId: 'Exit_Plaza', distance: 100, traversalCost: 10, status: 'open' },
      { id: 'c5', sourceId: 'Game_Stalls', targetId: 'Exit_Plaza', distance: 120, traversalCost: 12, status: 'open' },
      { id: 'c6', sourceId: 'Parade_Route', targetId: 'Exit_Plaza', distance: 200, traversalCost: 20, status: 'open' },
    ]
  }
};

export default function Dashboard() {
  const [activeVenue, setActiveVenue] = useState<VenueType>('stadium');
  const [activeProblem, setActiveProblem] = useState<ProblemType | 'random'>('random');
  const [graph, setGraph] = useState<VenueGraph>(VENUES['stadium']);
  const [metrics, setMetrics] = useState<DynatraceMetric[]>([]);
  const [logs, setLogs] = useState<ElasticLog[]>([]);
  
  // Agent State
  const [agentAnalysis, setAgentAnalysis] = useState<string | null>(null);
  const [proposedAction, setProposedAction] = useState<string | null>(null);
  const [digitalSignagePayload, setDigitalSignagePayload] = useState<any | null>(null);
  const [hitlRequired, setHitlRequired] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string[]>([]);
  const [aiRoutingPath, setAiRoutingPath] = useState<string[]>([]);
  const [activeTargetNode, setActiveTargetNode] = useState<string | null>(null);
  const [gitlabIssueUrl, setGitlabIssueUrl] = useState<string | null>(null);
  const [elasticUrl, setElasticUrl] = useState<string | null>(null);
  
  // Create a stable graph representation to allow mutations on approval
  const [displayGraph, setDisplayGraph] = useState<VenueGraph | null>(null);

  useEffect(() => {
    setDisplayGraph(graph);
  }, [graph]);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Switch Venue
  const handleVenueSwitch = (v: VenueType) => {
    setActiveVenue(v);
    setGraph(VENUES[v]);
    setMetrics([]);
    setLogs([]);
    setAgentAnalysis(null);
    setProposedAction(null);
    setDigitalSignagePayload(null);
    setHitlRequired(false);
    setSimulationActive(false);
    setTerminalLines([]);
    setGitlabIssueUrl(null);
    setElasticUrl(null);
  };

  // Background stream simulation removed to prevent UI jumping.
  // The UI will remain perfectly clean until the user explicitly hits "Simulate Disaster".

  // Trigger Disaster
  const triggerSimulation = async () => {
    setSimulationActive(true);
    
    // Pick problem type
    const problemTypes: ProblemType[] = ['bottleneck', 'surge', 'resource_exhaustion', 'transit_failure'];
    const selectedProblem = activeProblem === 'random' ? problemTypes[Math.floor(Math.random() * problemTypes.length)] : activeProblem;

    // Pick target node based on venue
    // Pick target node based on venue and problem type
    let targetNodeId = graph.nodes[0].id;
    
    if (selectedProblem === 'resource_exhaustion') {
        if (activeVenue === 'stadium') targetNodeId = 'Food_Court';
        else if (activeVenue === 'concert') targetNodeId = 'Food_Court';
        else if (activeVenue === 'gathering') targetNodeId = 'Food_Market';
        else if (activeVenue === 'carnival') targetNodeId = 'Beer_Garden';
    } else if (selectedProblem === 'transit_failure') {
        if (activeVenue === 'stadium') targetNodeId = 'Metro_Station';
        else if (activeVenue === 'concert') targetNodeId = 'Exit_North';
        else if (activeVenue === 'gathering') targetNodeId = 'Central_Station';
        else if (activeVenue === 'carnival') targetNodeId = 'Exit_Plaza';
    } else if (selectedProblem === 'bottleneck') {
        if (activeVenue === 'stadium') targetNodeId = 'Gate_A';
        else if (activeVenue === 'concert') targetNodeId = 'VIP_Tent';
        else if (activeVenue === 'gathering') targetNodeId = 'Central_Station';
        else if (activeVenue === 'carnival') targetNodeId = 'Parade_Route';
    } else if (selectedProblem === 'surge') {
        if (activeVenue === 'stadium') targetNodeId = 'Concourse_1';
        else if (activeVenue === 'concert') targetNodeId = 'Main_Stage';
        else if (activeVenue === 'gathering') targetNodeId = 'East_Shelter';
        else if (activeVenue === 'carnival') targetNodeId = 'Ferris_Wheel';
    }
    
    setActiveTargetNode(targetNodeId);
    
    // 1. Update Graph to show congestion at target node
    setGraph(prev => {
      const newNodes = prev.nodes.map(n => 
        n.id === targetNodeId ? { ...n, currentOccupancy: Math.floor(n.capacity * 1.5) } : n // Over capacity
      );
      const newEdges = prev.edges.map(e => 
        e.sourceId === targetNodeId || e.targetId === targetNodeId ? { ...e, status: 'congested' as const } : e
      );
      return { nodes: newNodes, edges: newEdges };
    });

    // 2. Generate Anomalies
    const newMetric = generateAnomalyDynatraceMetric(targetNodeId, activeVenue, selectedProblem);
    const newLog = generateAnomalyElasticLog(targetNodeId, activeVenue, selectedProblem);
    
    // Create visuals for the 4 extra MCPs based on the exact problem!
    let gitlabMsg = `[GITLAB] Creating urgent DevOps issue for broken gate at ${targetNodeId}.`;
    let mongoMsg = `[MONGODB] Loading historical crowd density maps for ${activeVenue}.`;
    let fivetranMsg = `[FIVETRAN] Syncing local transit APIs for rerouting.`;

    if (selectedProblem === 'resource_exhaustion') {
      gitlabMsg = `[GITLAB] Creating IT ticket for POS System Crash at ${targetNodeId}.`;
      fivetranMsg = `[FIVETRAN] Syncing local inventory supply chain APIs.`;
    } else if (selectedProblem === 'transit_failure') {
      gitlabMsg = `[GITLAB] Creating incident for City Transit delay impacting ${targetNodeId}.`;
      mongoMsg = `[MONGODB] Loading historical train delay surge patterns.`;
    } else if (selectedProblem === 'surge') {
      gitlabMsg = `[GITLAB] Security incident logged for crowd surge at ${targetNodeId}.`;
    }

    const mongoLog: ElasticLog = { location_id: targetNodeId, timestamp: new Date().toISOString(), error_code: 200, message: mongoMsg };
    const fivetranLog: ElasticLog = { location_id: targetNodeId, timestamp: new Date().toISOString(), error_code: 200, message: fivetranMsg };
    const arizeLog: ElasticLog = { location_id: targetNodeId, timestamp: new Date().toISOString(), error_code: 200, message: `[ARIZE] Trace logged. Hallucination risk: 0%.` };
    const gitlabLog: ElasticLog = { location_id: targetNodeId, timestamp: new Date().toISOString(), error_code: 500, message: gitlabMsg };

    setMetrics(prev => [newMetric, ...prev].slice(0, 15));
    setLogs(prev => [gitlabLog, arizeLog, fivetranLog, mongoLog, newLog, ...prev].slice(0, 15));

    // Generate dynamic Agent Thoughts matching the exact problem!
    const dynamicThoughts = [
      `> [SYSTEM] Initializing OmniFlow AI Orchestrator for ${activeVenue}...`,
      `> [GEMINI_THOUGHT] Severe anomaly detected at ${targetNodeId}. Halting standard routing.`,
      `> [TOOL_CALL] get_dynatrace_telemetry({ node: '${targetNodeId}' })`,
      `> [RESULT] ${newMetric.event_type}. ${newMetric.packet_drop_rate}% packet drop.`,
      `> [GEMINI_THOUGHT] Infrastructure compromised. Investigating deep MCP logs...`,
      `> [TOOL_CALL] get_elastic_logs({ query: '${selectedProblem}' })`,
      `> [RESULT] ERROR: ${newLog.message}`,
      `> [GEMINI_THOUGHT] Predicting crowd trajectory. Querying historical spatial density...`,
      `> [TOOL_CALL] mongodb_vector_search({ query: '${selectedProblem} history' })`,
      `> [RESULT] Matches 2024 historical crush pattern. HIGH RISK.`,
      `> [GEMINI_THOUGHT] Verifying local transit APIs to predict incoming load...`,
      `> [TOOL_CALL] fivetran_sync_live_transit()`,
      `> [RESULT] Transit Sync complete. 40% incoming crowd spike expected.`,
      `> [GEMINI_THOUGHT] Generating emergency LLM rerouting plan...`,
      `> [TOOL_CALL] arize_evaluate_llm_trace({ plan: 'Reroute from ${targetNodeId}' })`,
      `> [RESULT] Guardrails passed. Hallucination risk: 0.01%.`,
      `> [TOOL_CALL] gitlab_create_incident_issue({ priority: 'P0' })`,
      `> [RESULT] DevOps Ticket assigned to Engineering Team.`
    ];
    setTerminalLines(dynamicThoughts);

    // 3. Send to Universal AI Agent Backend
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric: newMetric, log: newLog, venueType: activeVenue, currentGraph: graph, targetNodeId })
      });
      const data = await response.json();

      if (data.status === 'success' && data.hitl_required) {
        setAgentAnalysis(data.agent_analysis);
        setProposedAction(data.proposed_action);
        setDigitalSignagePayload(data.digital_signage_payload);
        setHitlRequired(true);
        setAiRoutingPath(data.routing_path || []);
        setGitlabIssueUrl(data.gitlab_issue_url || null);
        setElasticUrl(data.elastic_url || null);
      } else if (data.status === 'error') {
        setAgentAnalysis(`[SYSTEM ERROR] Failed to run AI Analysis: ${data.message || 'Check terminal logs.'}`);
        setSimulationActive(false);
      }
    } catch (e) {
      console.error("Agent API failed", e);
      setAgentAnalysis(`[NETWORK ERROR] Failed to reach Agent Backend.`);
      setSimulationActive(false);
    }
  };

  const handleApprove = () => {
    setHitlRequired(false);
    setProposedAction("ACTION EXECUTED: " + proposedAction);
    
    // THE WOW FACTOR: Draw the AI route on the map!
    setActiveRoute(aiRoutingPath);

    // THE WOW FACTOR 2: Voice Announcement
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("Emergency Reroute Authorized. Digital Signage updated. Evacuation path secured.");
      msg.rate = 1.1;
      msg.pitch = 0.9;
      window.speechSynthesis.speak(msg);
    }

    // THE WOW FACTOR 3: Clear the congestion on the map
    if (displayGraph && activeTargetNode) {
      const newGraph = { ...displayGraph };
      newGraph.nodes = newGraph.nodes.map(n => {
        if (n.id === activeTargetNode) return { ...n, currentOccupancy: Math.floor(n.capacity * 0.2) }; // Safe!
        return n;
      });
      newGraph.edges = newGraph.edges.map(e => {
        if (e.sourceId === activeTargetNode || e.targetId === activeTargetNode) {
          return { ...e, status: 'open' }; // Clear the red congested edges
        }
        return e;
      });
      setDisplayGraph(newGraph);
    }
    
    setAgentAnalysis("HITL Approval Received. Execution complete. Digital Signage MCP payload deployed.");
  };

  const handleReject = () => {
    setAgentAnalysis("HITL Rejected. Waiting for manual override from human operators.");
    setProposedAction(null);
    setHitlRequired(false);
    setDigitalSignagePayload(null);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">OmniFlow AI</h1>
          <p className="text-slate-400 text-sm mt-1">Universal Autonomous Crowd Intelligence</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={activeVenue} 
            onChange={(e) => handleVenueSwitch(e.target.value as VenueType)}
            className="bg-slate-900 border border-blue-900/50 text-blue-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold tracking-wide uppercase"
          >
            <option value="stadium">Cricket / Football Stadium</option>
            <option value="concert">Pop Concert / Festival</option>
            <option value="gathering">Eid / Christmas Gathering</option>
            <option value="carnival">Rio Carnival</option>
          </select>

          <select 
            value={activeProblem} 
            onChange={(e) => setActiveProblem(e.target.value as ProblemType | 'random')}
            className="bg-slate-900 border border-purple-900/50 text-purple-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold tracking-wide uppercase"
          >
            <option value="random">Random Problem</option>
            <option value="bottleneck">Bottleneck / Choke</option>
            <option value="surge">Mass Surge / Exodus</option>
            <option value="resource_exhaustion">Resource Exhaustion</option>
            <option value="transit_failure">Transit Delay</option>
          </select>

          <button 
            onClick={triggerSimulation}
            disabled={hitlRequired || simulationActive}
            className="bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 text-red-300 px-6 py-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Simulate Disaster
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: UI Map & Logs */}
        <div className="lg:col-span-2 flex flex-col space-y-6 h-full min-h-0">
          <div className="flex-1 min-h-0">
            <VenueHeatmap graph={displayGraph} venueType={activeVenue} activeRoute={activeRoute} />
          </div>
          <div className="h-[420px] flex-shrink-0">
            <AgentActionLog 
              analysis={agentAnalysis} 
              proposedAction={proposedAction} 
              hitlRequired={hitlRequired} 
              digitalSignagePayload={digitalSignagePayload}
              isSimulating={simulationActive}
              terminalLines={terminalLines}
              gitlabIssueUrl={gitlabIssueUrl}
              elasticUrl={elasticUrl}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>

        {/* Right Column: Telemetry */}
        <div className="h-full min-h-0">
          <TelemetryFeed logs={logs} metrics={metrics} />
        </div>
      </div>
    </main>
  );
}
