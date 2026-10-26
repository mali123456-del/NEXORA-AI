import React, { useState } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Sliders,
  Webhook,
  ListTodo,
  Shield,
  Loader2,
} from 'lucide-react';
import { createWorkspaceTask } from '../../services/api';

interface WorkflowPipeline {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastExecuted: string;
}

export const AutomationHubView: React.FC = () => {
  const [pipelines, setPipelines] = useState<WorkflowPipeline[]>([
    {
      id: 'pipe-1',
      name: 'Critical CVE Auto-Triage to Google Tasks',
      trigger: 'When security score falls below 70 in Ethical Hacking Lab',
      action: 'Automatically create high-priority task in Google Workspace Tasks queue',
      enabled: true,
      lastExecuted: '2026-10-25 10:14:02',
    },
    {
      id: 'pipe-2',
      name: 'GitHub Webhook SAST Pipeline',
      trigger: 'On incoming Pull Request webhook to /api/webhooks/github',
      action: 'Execute automated SAST code scanner & alert Slack channel',
      enabled: true,
      lastExecuted: '2026-10-25 09:30:18',
    },
    {
      id: 'pipe-3',
      name: 'Scheduled Nightly WAF Rule Sync',
      trigger: 'Cron schedule (0 2 * * * - Every night at 02:00 UTC)',
      action: 'Regenerate strict CSP nonce & export hardened Nginx config',
      enabled: false,
      lastExecuted: '2026-10-24 02:00:00',
    },
  ]);

  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    'Automation engine active. 3 managed workflows registered.',
  ]);

  const runSimulation = async (pipeline: WorkflowPipeline) => {
    setSimulatingId(pipeline.id);
    setSimulationLog(prev => [
      `[${new Date().toLocaleTimeString()}] Trigger received: ${pipeline.trigger}`,
      ...prev,
    ]);

    try {
      await new Promise(r => setTimeout(r, 1200));

      if (pipeline.id === 'pipe-1') {
        // Real action: create an actual task in Google Tasks!
        await createWorkspaceTask({
          title: `[AUTOMATION] Remediate critical CVE on scanned asset`,
          notes: `Triggered by ${pipeline.name} at ${new Date().toISOString()}`,
        });
        setSimulationLog(prev => [
          `[${new Date().toLocaleTimeString()}] Action completed: Created task in Google Tasks queue!`,
          ...prev,
        ]);
      } else {
        setSimulationLog(prev => [
          `[${new Date().toLocaleTimeString()}] Action executed: ${pipeline.action}`,
          ...prev,
        ]);
      }

      setPipelines(
        pipelines.map(p =>
          p.id === pipeline.id ? { ...p, lastExecuted: new Date().toLocaleString() } : p
        )
      );
    } catch (err: any) {
      setSimulationLog(prev => [
        `[${new Date().toLocaleTimeString()}] Error: ${err.message}`,
        ...prev,
      ]);
    } finally {
      setSimulatingId(null);
    }
  };

  const togglePipeline = (id: string) => {
    setPipelines(
      pipelines.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AUTOMATION HUB & WORKFLOW ROUTER</h2>
            <p className="text-xs text-slate-400">
              Visual event-driven trigger/action builder integrated with Google Tasks, Webhooks, and Security Scanners
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-yellow-950 text-yellow-300 border border-yellow-800">
            DISPATCHER: ONLINE (3 Workflows)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Pipeline List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">Registered Workflow Pipelines</span>
            <span className="text-[11px] font-mono text-slate-500">Event-Authoritative State</span>
          </div>

          <div className="space-y-3">
            {pipelines.map(pipeline => (
              <div
                key={pipeline.id}
                className={`p-4 rounded-2xl border transition-all ${
                  pipeline.enabled
                    ? 'bg-slate-900 border-slate-800 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white font-mono">{pipeline.name}</h3>
                  <button
                    onClick={() => togglePipeline(pipeline.id)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      pipeline.enabled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {pipeline.enabled ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-11 gap-2 text-xs font-mono items-center">
                  <div className="sm:col-span-5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-cyan-400 font-bold block text-[10px] uppercase">WHEN Trigger:</span>
                    <span className="text-[11px] mt-0.5 block">{pipeline.trigger}</span>
                  </div>

                  <div className="sm:col-span-1 flex justify-center text-slate-500">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="sm:col-span-5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-emerald-400 font-bold block text-[10px] uppercase">THEN Action:</span>
                    <span className="text-[11px] mt-0.5 block">{pipeline.action}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Last Run: {pipeline.lastExecuted}</span>
                  <button
                    onClick={() => runSimulation(pipeline)}
                    disabled={simulatingId === pipeline.id}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    {simulatingId === pipeline.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-yellow-400" />
                    )}
                    <span>Simulate Event Run</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Stream */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Real-Time Dispatch Execution Log</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Event Stream</span>
          </div>

          <div className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-y-auto min-h-[300px]">
            {simulationLog.map((log, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-yellow-400 shrink-0">➜</span>
                <span className="leading-relaxed">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
