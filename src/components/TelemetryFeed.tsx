"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, TerminalSquare } from 'lucide-react';
import { DynatraceMetric, ElasticLog } from '@/lib/models';

interface TelemetryFeedProps {
  logs: ElasticLog[];
  metrics: DynatraceMetric[];
}

export default function TelemetryFeed({ logs, metrics }: TelemetryFeedProps) {
  // Combine and sort logs/metrics by timestamp
  const feed = [
    ...metrics.map(m => ({ ...m, type: 'metric' as const })),
    ...logs.map(l => ({ ...l, type: 'log' as const }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5 shadow-2xl font-mono text-sm">
      <div className="flex items-center space-x-3 mb-5 border-b border-white/5 pb-4">
        <TerminalSquare size={18} className="text-indigo-400" />
        <h3 className="text-indigo-100 font-bold uppercase tracking-widest text-xs">MCP Telemetry Firehose</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 relative">
        {/* Fading top edge for smooth scrolling look */}
        <div className="sticky top-0 h-4 bg-gradient-to-b from-slate-950/40 to-transparent z-10 pointer-events-none -mt-4 mb-4"></div>

        <AnimatePresence initial={false}>
          {feed.slice(0, 15).map((item, i) => {
            const isMetric = item.type === 'metric';
            const m = item as any; // Type assertion bypass for map rendering
            
            const isAnomaly = isMetric ? m.event_type !== 'NORMAL' : m.error_code >= 500;
            const sourceColor = isMetric ? 'text-cyan-500' : 'text-fuchsia-500';
            const bgClass = isAnomaly 
              ? 'bg-red-950/20 border-red-900/50' 
              : 'bg-slate-900/30 border-white/5';

            return (
              <motion.div 
                key={`${item.type}-${m.timestamp}-${i}`}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex flex-col space-y-1.5 p-3 rounded-xl border ${bgClass} shadow-sm backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                  <span className={`${sourceColor} font-bold flex items-center`}>
                    {isMetric ? '[DYNATRACE MCP]' : '[ELASTIC MCP]'}
                  </span>
                  <span className="text-slate-500">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                </div>
                
                {isMetric ? (
                  <div className={`flex items-center space-x-2 text-xs ${isAnomaly ? 'text-red-300 font-medium' : 'text-slate-300'}`}>
                    <Activity size={12} className="flex-shrink-0" />
                    <span>{m.gate_id} | Drop: {m.packet_drop_rate.toFixed(1)}% | Crash: {m.crash_rate.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className={`flex items-start space-x-2 text-xs leading-relaxed ${isAnomaly ? 'text-orange-300 font-medium' : 'text-slate-400'}`}>
                    {isAnomaly && <AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-orange-500" />}
                    <span>[{m.error_code}] {m.message}</span>
                  </div>
                )}
                
                {isMetric && isAnomaly && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="text-red-500 font-bold ml-5 text-[10px] uppercase tracking-widest bg-red-950/50 px-2 py-0.5 rounded-full inline-block w-max mt-1 border border-red-900/50"
                  >
                    Critical: {m.event_type}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
