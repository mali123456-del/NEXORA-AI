import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Plus,
  Coins,
  Shield,
  Layers,
  ArrowRight,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { AgentProfile } from '../../types';

export const AgentWorkforceView: React.FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([
    {
      id: 'ag-1',
      name: 'Aegis-SecOps',
      role: 'Automated DevSecOps & Vulnerability Triage',
      description: 'Scans new pull requests for OWASP vulnerabilities and enforces security linting gates.',
      avatar: '🛡️',
      status: 'ACTIVE',
      specialization: ['SAST', 'Dependency CVEs', 'Secret Scanning'],
      tokensAllocated: 50000,
      requiresApproval: true,
    },
    {
      id: 'ag-2',
      name: 'Synthetix-QA',
      role: 'Automated Test Harness Generator',
      description: 'Generates Vitest & Playwright end-to-end testing fixtures for frontend routes.',
      avatar: '🧪',
      status: 'ACTIVE',
      specialization: ['Integration Tests', 'Fuzzing', 'Mocking'],
      tokensAllocated: 35000,
      requiresApproval: false,
    },
    {
      id: 'ag-3',
      name: 'Argon-Refactor',
      role: 'High-Reasoning Code Optimizer',
      description: 'Discovers algorithmic bottlenecks and refactors loops into O(n) streaming pipelines.',
      avatar: '⚡',
      status: 'AWAITING_APPROVAL',
      specialization: ['Memory Optimization', 'Async Streams', 'Profiling'],
      tokensAllocated: 80000,
      requiresApproval: true,
    },
    {
      id: 'ag-4',
      name: 'Bioscience-Scout',
      role: 'Bioinformatics & Structure Analyzer',
      description: 'Scrapes UniProt sequences, computes AlphaFold pLDDT scores, and generates molecular summaries.',
      avatar: '🧬',
      status: 'IDLE',
      specialization: ['UniProtKB', 'AlphaFold DB', 'PubChem'],
      tokensAllocated: 25000,
      requiresApproval: false,
    },
  ]);

  const [activeTaskLog, setActiveTaskLog] = useState<string[]>([
    '[10:24:01] [Aegis-SecOps] Completed SAST scan on repository. 0 hardcoded secrets discovered.',
    '[10:24:45] [Synthetix-QA] Generated 14 integration test cases for AssistantView and TasksDrawer.',
    '[10:25:12] [Argon-Refactor] Proposed refactoring of token bucket rate limiter. Awaiting human approval.',
  ]);

  const [selectedAgentForApproval, setSelectedAgentForApproval] = useState<AgentProfile | null>(null);

  const toggleAgentStatus = (id: string) => {
    setAgents(
      agents.map(ag => {
        if (ag.id !== id) return ag;
        const nextStatus = ag.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return { ...ag, status: nextStatus };
      })
    );
  };

  const handleApprove = (id: string) => {
    setAgents(
      agents.map(ag => (ag.id === id ? { ...ag, status: 'ACTIVE' } : ag))
    );
    setActiveTaskLog(prev => [
      `[${new Date().toLocaleTimeString()}] Human supervisor approved workflow execution for ${id}. Execution in flight.`,
      ...prev,
    ]);
    setSelectedAgentForApproval(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI AGENT WORKFORCE & COLLABORATION</h2>
            <p className="text-xs text-slate-400">
              Autonomous multi-agent task planning, tool delegation, human approval review, and token budgeting
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>HUMAN-IN-THE-LOOP GATE: ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => {
          const isAwaiting = agent.status === 'AWAITING_APPROVAL';
          const isActive = agent.status === 'ACTIVE';

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isAwaiting
                  ? 'bg-amber-950/20 border-amber-600/50 shadow-lg shadow-amber-500/10'
                  : isActive
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    {agent.avatar}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isAwaiting
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono mt-3">{agent.name}</h3>
                <p className="text-[11px] text-cyan-400 font-mono">{agent.role}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{agent.description}</p>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {agent.specialization.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Token Budget:</span>
                  <span className="text-amber-400 font-semibold">{agent.tokensAllocated.toLocaleString()}</span>
                </div>

                {isAwaiting ? (
                  <button
                    onClick={() => setSelectedAgentForApproval(agent)}
                    className="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold flex items-center justify-center space-x-1 shadow-md shadow-amber-600/20 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Review Pending Action</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleAgentStatus(agent.id)}
                    className={`w-full py-1.5 px-3 rounded-xl font-mono text-xs transition-colors flex items-center justify-center space-x-1 ${
                      isActive
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isActive ? 'Pause Agent' : 'Resume Agent'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Agent Collaboration Live Activity Terminal */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>AGENT COLLABORATION PIPELINE & EXECUTION STREAM</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Authoritative Event Queue</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
          {activeTaskLog.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-cyan-400 shrink-0">➜</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Human Approval Modal */}
      {selectedAgentForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">HUMAN REVIEW & APPROVAL REQUIRED</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Agent: <span className="text-cyan-400">{selectedAgentForApproval.name}</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Proposed Action:</div>
              <p className="leading-relaxed">
                Refactor rate limiting middleware from static in-memory Map into an async distributed Redis cluster with automatic cache invalidation and connection health checks.
              </p>
              <div className="text-[11px] text-amber-400">
                Estimated Token Cost: ~1,200 tokens ($0.0024 USD)
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                onClick={() => setSelectedAgentForApproval(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Reject Action
              </button>
              <button
                onClick={() => handleApprove(selectedAgentForApproval.id)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-600/30"
              >
                Authorize & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
