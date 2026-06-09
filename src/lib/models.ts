export type NodeType = 'gate' | 'concourse' | 'waypoint';

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  capacity: number;
  currentOccupancy: number;
  coordinates: { x: number; y: number }; // For heatmap visualization
}

export type EdgeStatus = 'open' | 'congested' | 'closed';

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  distance: number;
  traversalCost: number; // Base cost (can be updated dynamically based on congestion)
  status: EdgeStatus;
}

export type VenueType = 'stadium' | 'concert' | 'gathering' | 'carnival';

export type ProblemType = 'bottleneck' | 'surge' | 'resource_exhaustion' | 'transit_failure';

export interface VenueGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DynatraceMetric {
  timestamp: string; // ISO 8601
  location_id: string; // Renamed from gate_id to be more generic
  packet_drop_rate: number; // Percentage 0-100
  crash_rate: number; // Percentage 0-100
  event_type: string;
}

export interface ElasticLog {
  timestamp: string; // ISO 8601
  location_id: string; // Renamed from gate_id to be more generic
  error_code: number; // e.g., 200, 500, 503
  message: string;
}



// Utility function to get the cost of an edge dynamically
export function calculateDynamicEdgeCost(edge: GraphEdge, targetNode: GraphNode): number {
  if (edge.status === 'closed') return Infinity;
  
  // Calculate cost based on target node capacity
  const congestionRatio = targetNode.currentOccupancy / targetNode.capacity;
  
  // Exponential cost increase as it approaches capacity
  let dynamicCost = edge.traversalCost;
  if (congestionRatio > 0.8) {
    dynamicCost *= 2;
  }
  if (congestionRatio > 0.95) {
    dynamicCost *= 5;
  }
  if (edge.status === 'congested') {
    dynamicCost *= 3;
  }
  
  return dynamicCost;
}
