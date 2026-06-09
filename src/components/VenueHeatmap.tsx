"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VenueGraph } from '@/lib/models';
import Image from 'next/image';

interface VenueHeatmapProps {
  graph: VenueGraph | null;
  venueType: string;
  activeRoute?: string[];
}

export default function VenueHeatmap({ graph, venueType, activeRoute = [] }: VenueHeatmapProps) {
  if (!graph) return <div className="p-8 text-center text-gray-500">Loading Map...</div>;

  const bgImage = `/${venueType}-bg.png`;

  return (
    <div className="relative w-full h-[450px] bg-black rounded-2xl overflow-hidden border border-blue-900/40 shadow-[0_0_50px_rgba(30,58,138,0.3)]">
      {/* Background Blueprint Image */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <img 
          src={bgImage}  
          alt="Venue Blueprint" 
          className="w-full h-full object-cover object-center filter contrast-125 saturate-150"
        />
      </div>

      <div className="absolute top-5 left-5 px-3 py-1 bg-black/60 backdrop-blur-md border border-blue-900/50 rounded text-[10px] uppercase tracking-[0.2em] text-blue-300 font-semibold z-20 shadow-lg">
        Live Venue Topology
      </div>

      <svg className="relative z-10 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Draw Edges */}
        <AnimatePresence>
          {graph.edges.map(edge => {
            const source = graph.nodes.find(n => n.id === edge.sourceId);
            const target = graph.nodes.find(n => n.id === edge.targetId);
            if (!source || !target) return null;

            let strokeColor = '#1e3a8a'; // deep blue
            let strokeWidth = 1;
            let opacity = 0.5;

            if (edge.status === 'congested') {
              strokeColor = '#ef4444'; // critical red
              strokeWidth = 2;
              opacity = 0.8;
            } else if (edge.status === 'closed') {
              strokeColor = '#000000'; // black/hidden
              opacity = 0.1;
            }

            return (
              <motion.line
                key={`edge-${edge.id}`}
                x1={source.coordinates.x}
                y1={source.coordinates.y}
                x2={target.coordinates.x}
                y2={target.coordinates.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ filter: edge.status === 'congested' ? 'drop-shadow(0 0 5px rgba(239,68,68,0.8))' : 'drop-shadow(0 0 2px rgba(30,58,138,0.5))' }}
              />
            );
          })}
        </AnimatePresence>

        {/* Draw AI Generated Active Route */}
        {activeRoute.length > 1 && (
          <AnimatePresence>
            {activeRoute.map((nodeId, idx) => {
              if (idx === activeRoute.length - 1) return null;
              const source = graph.nodes.find(n => n.id === nodeId);
              const target = graph.nodes.find(n => n.id === activeRoute[idx + 1]);
              if (!source || !target) return null;

              return (
                <motion.line
                  key={`route-${source.id}-${target.id}`}
                  x1={source.coordinates.x}
                  y1={source.coordinates.y}
                  x2={target.coordinates.x}
                  y2={target.coordinates.y}
                  stroke="#10b981" // Emerald green
                  strokeWidth={3}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: idx * 0.5, ease: "linear" }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.9))' }}
                  strokeDasharray="4 4"
                />
              );
            })}
          </AnimatePresence>
        )}

        {/* Draw Nodes */}
        <AnimatePresence>
          {graph.nodes.map(node => {
            const congestionRatio = node.currentOccupancy / node.capacity;
            
            let fillColor = '#3b82f6'; // vibrant blue
            let shadowColor = 'rgba(59,130,246,0.8)';
            let scale = 1;

            if (congestionRatio > 0.8) {
              fillColor = '#f59e0b'; // warning orange
              shadowColor = 'rgba(245,158,11,0.9)';
              scale = 1.2;
            }
            if (congestionRatio > 0.95) {
              fillColor = '#ef4444'; // critical red
              shadowColor = 'rgba(239,68,68,1)';
              scale = 1.4;
            }

            return (
              <g key={`node-${node.id}`}>
                <motion.circle
                  cx={node.coordinates.x}
                  cy={node.coordinates.y}
                  r={3.5}
                  fill={fillColor}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: scale, 
                    opacity: 1,
                    filter: `drop-shadow(0 0 ${scale * 8}px ${shadowColor})`
                  }}
                  transition={{ 
                    duration: 0.8, 
                    type: "spring", 
                    stiffness: 100,
                    filter: { duration: 0.2 } 
                  }}
                />
                
                {/* Pulse Effect for Congested Nodes */}
                {congestionRatio > 0.8 && (
                  <motion.circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r={3.5}
                    fill="transparent"
                    stroke={fillColor}
                    strokeWidth={1.5}
                    initial={{ scale: scale, opacity: 0.9 }}
                    animate={{ scale: scale * 4.0, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}

                {/* Node Labels */}
                <motion.text
                  x={node.coordinates.x}
                  y={node.coordinates.y + 7}
                  fontSize="2.5"
                  fill="#e5e7eb"
                  textAnchor="middle"
                  className="select-none font-sans font-bold tracking-wider"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {node.name}
                </motion.text>
                <motion.text
                  x={node.coordinates.x}
                  y={node.coordinates.y + 11}
                  fontSize="2.2"
                  fill={congestionRatio > 0.8 ? fillColor : '#9ca3af'}
                  textAnchor="middle"
                  className="select-none font-mono font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {node.currentOccupancy}/{node.capacity}
                </motion.text>
              </g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}
