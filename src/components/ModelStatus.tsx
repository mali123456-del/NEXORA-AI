import React, { useEffect, useState } from 'react';
import { Cpu, Zap } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface ModelStatusProps {
  currentPlan: SubscriptionPlan;
}

export const ModelStatus: React.FC<ModelStatusProps> = ({ currentPlan }) => {
  const [modelInfo, setModelInfo] = useState<{
    modelName: string;
    provider: 'Local Ollama' | 'Gemini Cloud API';
    latencyMs: number;
    status: 'Ready' | 'High Latency' | 'Offline';
  }>({
    modelName: currentPlan === 'FREE' ? 'llama3.2:1b (Local)' : 'gemini-4-argon (Cloud)',
    provider: currentPlan === 'FREE' ? 'Local Ollama' : 'Gemini Cloud API',
    latencyMs: 35,
    status: 'Ready',
  });

  useEffect(() => {
    let isMounted = true;
    const checkModelRouteAndLatency = async () => {
      const startTime = performance.now();
      try {
        const res = await fetch(`/api/ai/route-model?plan=${currentPlan}&taskType=general`);
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        if (res.ok && isMounted) {
          const data = await res.json();
          let status: 'Ready' | 'High Latency' | 'Offline' = 'Ready';
          if (latency > 400) status = 'High Latency';

          setModelInfo({
            modelName: data.selectedModel || (currentPlan === 'FREE' ? 'llama3.2:1b (Local)' : 'gemini-4-argon (Cloud)'),
            provider: data.provider || (currentPlan === 'FREE' ? 'Local Ollama' : 'Gemini Cloud API'),
            latencyMs: latency,
            status,
          });
        } else if (isMounted) {
          setModelInfo(prev => ({ ...prev, status: 'Offline', latencyMs: 9999 }));
        }
      } catch {
        if (isMounted) {
          setModelInfo(prev => ({ ...prev, status: 'Offline', latencyMs: 9999 }));
        }
      }
    };

    checkModelRouteAndLatency();
    const interval = setInterval(checkModelRouteAndLatency, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentPlan]);

  const dotColor =
    modelInfo.status === 'Ready'
      ? 'bg-emerald-500 shadow-emerald-500/50'
      : modelInfo.status === 'High Latency'
      ? 'bg-amber-500 shadow-amber-500/50'
      : 'bg-rose-500 shadow-rose-500/50';

  const textColor =
    modelInfo.status === 'Ready'
      ? 'text-emerald-400'
      : modelInfo.status === 'High Latency'
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div
      title={`Active Engine: ${modelInfo.provider} | Model: ${modelInfo.modelName} | Latency: ${modelInfo.latencyMs}ms`}
      className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono"
    >
      <span className={`w-2 h-2 rounded-full animate-pulse shadow-sm ${dotColor}`} />
      <div className="flex items-center space-x-1 text-slate-300 truncate max-w-[180px]">
        <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
        <span className="truncate">{modelInfo.modelName}</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className={`flex items-center space-x-0.5 ${textColor}`}>
        <Zap className="w-3 h-3 shrink-0" />
        <span>{modelInfo.latencyMs}ms</span>
      </div>
    </div>
  );
};
