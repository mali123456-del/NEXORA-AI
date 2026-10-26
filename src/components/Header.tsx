import React, { useEffect, useState } from 'react';
import {
  Search,
  Shield,
  Coins,
  Cpu,
  CheckCircle2,
  ListTodo,
  FileText,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { getTelemetryUsage } from '../services/api';

interface HeaderProps {
  currentPlan: SubscriptionPlan;
  setCurrentPlan: (plan: SubscriptionPlan) => void;
  onOpenCommandPalette: () => void;
  onOpenTasks: () => void;
  onOpenAuditLogs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  setCurrentPlan,
  onOpenCommandPalette,
  onOpenTasks,
  onOpenAuditLogs,
}) => {
  const [telemetry, setTelemetry] = useState<{ totalTokens: number; totalCostUSD: number }>({
    totalTokens: 0,
    totalCostUSD: 0,
  });
  const [showPlanMenu, setShowPlanMenu] = useState(false);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await getTelemetryUsage();
        setTelemetry({ totalTokens: data.totalTokens, totalCostUSD: data.totalCostUSD });
      } catch {
        // Fallback
      }
    };
    fetchUsage();
    const interval = setInterval(fetchUsage, 8000);
    return () => clearInterval(interval);
  }, []);

  const planBadges: Record<SubscriptionPlan, { label: string; color: string; desc: string }> = {
    FREE: { label: 'FREE TIER', color: 'bg-slate-800 text-slate-300 border-slate-700', desc: '50 daily requests' },
    PRO: { label: 'PRO ($29/m)', color: 'bg-cyan-950 text-cyan-300 border-cyan-800', desc: 'Search + 1K/2K Vision' },
    ULTIMATE: { label: 'ULTIMATE ($89/m)', color: 'bg-purple-950 text-purple-300 border-purple-800', desc: 'Thinking High + Omni Video' },
    BUSINESS: { label: 'BUSINESS ($249/m)', color: 'bg-emerald-950 text-emerald-300 border-emerald-800', desc: 'RBAC + 3D Core + Tasks' },
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base tracking-tight text-white font-mono">NEXORA<span className="text-cyan-400">.AI</span></span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              ECOSYSTEM v4.2
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden md:block">
            Create. Build. Secure. Automate. Trade. Grow.
          </p>
        </div>
      </div>

      {/* Global Command Palette search bar */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs w-64 justify-between"
      >
        <div className="flex items-center space-x-2">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Quick command search...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls: Telemetry, Tasks, Plan Selector, Audit */}
      <div className="flex items-center space-x-2.5">
        {/* Token Accounting & Compute Spend Tracker */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{telemetry.totalTokens.toLocaleString()} tkns</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-emerald-400">
            ${telemetry.totalCostUSD.toFixed(4)} est.
          </div>
        </div>

        {/* Workspace Google Tasks trigger */}
        <button
          onClick={onOpenTasks}
          title="Google Workspace & Tasks Queue"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
        >
          <ListTodo className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Tasks</span>
        </button>

        {/* Audit Log Modal trigger */}
        <button
          onClick={onOpenAuditLogs}
          title="Immutable Security Audit Logs"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
        >
          <Shield className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Audit</span>
        </button>

        {/* Subscription Plan Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPlanMenu(!showPlanMenu)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
              planBadges[currentPlan].color
            }`}
          >
            <span>{planBadges[currentPlan].label}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showPlanMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Select Active Plan
              </div>
              {(['FREE', 'PRO', 'ULTIMATE', 'BUSINESS'] as SubscriptionPlan[]).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setCurrentPlan(p);
                    setShowPlanMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentPlan === p ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-mono">{planBadges[p].label}</div>
                    <div className="text-[10px] text-slate-500">{planBadges[p].desc}</div>
                  </div>
                  {currentPlan === p && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
