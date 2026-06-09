"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

interface AgentActionLogProps {
  analysis: string | null;
  proposedAction: string | null;
  hitlRequired: boolean;
  digitalSignagePayload?: any;
  isSimulating: boolean;
  terminalLines?: string[];
  gitlabIssueUrl?: string | null;
  elasticUrl?: string | null;
  historicalMatchId?: string | null;
  autoHealingTriggered?: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export default function AgentActionLog({ analysis, proposedAction, hitlRequired, digitalSignagePayload, isSimulating, terminalLines = [], gitlabIssueUrl, elasticUrl, historicalMatchId, autoHealingTriggered, onApprove, onReject }: AgentActionLogProps) {
  const [visibleLines, setVisibleLines] = React.useState<string[]>([]);
  const [animationFinished, setAnimationFinished] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  React.useEffect(() => {
    if (isSimulating) {
      setVisibleLines([]);
      setAnimationFinished(false);
      let i = 0;
      const interval = setInterval(() => {
        setVisibleLines(prev => {
          if (i >= terminalLines.length) return prev;
          return [...prev, terminalLines[i]];
        });
        i++;
        if (i >= terminalLines.length) {
          clearInterval(interval);
          setTimeout(() => setAnimationFinished(true), 800); // Small pause at the end
        }
      }, 700); // SLOWED DOWN from 150 to 700ms so judges can actually read the thoughts!
      return () => clearInterval(interval);
    } else if (!isSimulating) {
      setVisibleLines([]);
      setAnimationFinished(false);
    }
  }, [isSimulating, terminalLines]);

  return (
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl rounded-2xl border border-blue-900/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] font-sans relative overflow-hidden">
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5 relative z-10">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
          <Bot size={20} className="text-white" />
        </div>
        <h3 className="text-blue-100 font-bold uppercase tracking-widest text-xs">Google Cloud Agent Runtime</h3>
      </div>

      <div className="space-y-5 overflow-y-auto custom-scrollbar pr-2 relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {!isSimulating && !analysis ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center h-32 text-gray-500"
            >
              <ShieldAlert size={24} className="mb-3 opacity-30" />
              <p className="text-xs font-mono uppercase tracking-widest">Awaiting Telemetry Anomalies...</p>
            </motion.div>
          ) : isSimulating && !(analysis && animationFinished) ? (
            <motion.div 
              key="terminal"
              ref={scrollRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/90 rounded-lg p-5 font-mono text-xs sm:text-sm leading-loose border border-green-900/50 shadow-[0_0_20px_rgba(0,255,0,0.15)] h-full overflow-y-auto"
            >
              {visibleLines.map((line, idx) => {
                if (!line) return null;
                const isToolCall = line.includes('[TOOL_CALL]');
                const isResult = line.includes('[RESULT]');
                const isThought = line.includes('[GEMINI_THOUGHT]');
                
                let textColor = 'text-green-400 opacity-90';
                if (isToolCall) textColor = 'text-blue-300 font-semibold bg-blue-900/30 px-1.5 py-0.5 rounded';
                if (isResult) textColor = 'text-amber-300';
                if (isThought) textColor = 'text-fuchsia-100 font-bold bg-fuchsia-900/60 px-2 py-1 rounded border-l-4 border-fuchsia-500 shadow-sm';

                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={`${textColor} mb-1`}
                  >
                    {line}
                  </motion.div>
                );
              })}
              
              {/* Added a blinking cursor to show it's waiting for Gemini */}
              {isSimulating && !analysis && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   transition={{ repeat: Infinity, duration: 0.8 }}
                   className="text-blue-400 mt-4 font-bold text-xs font-mono"
                 >
                   {'>'} [GEMINI 3.1 FLASH LITE] Aggregating context. Generating live spatial execution plan... █
                 </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ staggerChildren: 0.2 }}
              className="space-y-5"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="text-[10px] uppercase tracking-[0.15em] text-blue-400 mb-2 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                  Cognitive Analysis
                </h4>
                <div className="text-sm text-gray-300 leading-relaxed border-l-2 border-blue-500/50 pl-4 bg-gradient-to-r from-blue-950/30 to-transparent p-3 rounded-r-lg shadow-inner">
                  {analysis}
                </div>
              </motion.div>

              {proposedAction && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-[10px] uppercase tracking-[0.15em] text-emerald-400 mb-2 font-bold flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                    Execution Plan
                  </h4>
                  <div className="text-sm text-emerald-100 font-medium bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/50 shadow-inner">
                    {proposedAction}
                  </div>
                </motion.div>
              )}

              {gitlabIssueUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 p-3 bg-slate-900 border border-blue-500/30 rounded-xl flex items-center justify-between"
                >
                  <span className="text-blue-400 text-xs font-mono tracking-wide flex items-center">
                    <CheckCircle size={14} className="mr-2" /> Live GitLab Ticket Generated
                  </span>
                  <a href={gitlabIssueUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800 text-blue-100 text-[10px] uppercase font-bold rounded-lg border border-blue-500/50 transition-colors cursor-pointer">
                    View on GitLab ↗
                  </a>
                </motion.div>
              )}

              {elasticUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  className="mt-2 p-3 bg-slate-900 border border-teal-500/30 rounded-xl flex items-center justify-between"
                >
                  <span className="text-teal-400 text-xs font-mono tracking-wide flex items-center">
                    <CheckCircle size={14} className="mr-2" /> Live Elastic Instance Created
                  </span>
                </motion.div>
              )}

              {historicalMatchId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 p-3 bg-slate-900 border border-purple-500/30 rounded-xl flex items-center justify-between"
                >
                  <span className="text-purple-400 text-xs font-mono tracking-wide flex items-center">
                    <CheckCircle size={14} className="mr-2" /> Historical MongoDB Match Applied
                  </span>
                  <span className="px-3 py-1.5 bg-purple-900/30 text-purple-200 text-[10px] font-bold rounded-lg border border-purple-500/50 uppercase">
                    Incident #{historicalMatchId.substring(0, 8)}
                  </span>
                </motion.div>
              )}

              {autoHealingTriggered && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-2 p-3 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.2)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>
                  <span className="text-red-400 text-xs font-mono tracking-wide flex items-center relative z-10 font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping absolute"></span>
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2 relative"></span>
                    [AUTO-HEALING] Background Storage Cleaner Spawned
                  </span>
                  <span className="px-3 py-1.5 bg-red-900/40 text-red-100 text-[9px] font-bold rounded-lg border border-red-500/50 uppercase tracking-widest relative z-10">
                    Quota Protection Active
                  </span>
                </motion.div>
              )}

              {digitalSignagePayload && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4"
                >
                  <h4 className="text-[10px] uppercase tracking-[0.15em] text-fuchsia-400 mb-2 font-bold flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mr-2"></span>
                    Digital Signage MCP Payload
                  </h4>
                  <pre className="text-xs text-fuchsia-200 bg-fuchsia-950/20 p-3 rounded-xl border border-fuchsia-900/30 overflow-x-auto">
                    {JSON.stringify(digitalSignagePayload, null, 2)}
                  </pre>
                </motion.div>
              )}

              {hitlRequired && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 pt-5 border-t border-white/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold flex items-center bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-900/50">
                      <Clock size={12} className="mr-2 animate-pulse" /> Human Authorization Required
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={onApprove}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
                    >
                      <CheckCircle size={14} className="mr-2" /> Authorize Reroute
                    </button>
                    <button 
                      onClick={onReject}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase border border-slate-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Reject Plan
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
