import { VenueGraph, GraphNode, GraphEdge, calculateDynamicEdgeCost } from './models';

// Dijkstra's algorithm to find the safest/fastest path given current congestion
export function findSafestEvacuationPath(
  graph: VenueGraph,
  startNodeId: string,
  endNodeIds: string[]
): { path: string[]; totalCost: number } | null {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialize
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || distances[currentId] === Infinity) {
      break; // Unreachable nodes remain
    }

    // If we've reached one of our target exit nodes, we can stop early (optional optimization)
    // But for full shortest paths to all possible exits, we process everything.

    unvisited.delete(currentId);

    // Look at neighbors
    const edgesFromCurrent = graph.edges.filter((e) => e.sourceId === currentId || e.targetId === currentId);
    
    for (const edge of edgesFromCurrent) {
      // Since it's an undirected graph (pathways go both ways usually), get the neighbor
      const neighborId = edge.sourceId === currentId ? edge.targetId : edge.sourceId;
      if (!unvisited.has(neighborId)) continue;

      const targetNode = graph.nodes.find(n => n.id === neighborId)!;
      const dynamicCost = calculateDynamicEdgeCost(edge, targetNode);
      
      const newDist = distances[currentId] + dynamicCost;
      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        previous[neighborId] = currentId;
      }
    }
  }

  // Find the best exit node
  let bestExitId: string | null = null;
  let bestExitCost = Infinity;

  for (const exitId of endNodeIds) {
    if (distances[exitId] < bestExitCost) {
      bestExitCost = distances[exitId];
      bestExitId = exitId;
    }
  }

  if (bestExitId === null || bestExitCost === Infinity) {
    return null; // No path found
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = bestExitId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { path, totalCost: bestExitCost };
}
