import React from 'react';
import {
  MessageSquare,
  Code2,
  ShieldAlert,
  ShieldCheck,
  Bot,
  Zap,
  ShoppingBag,
  Briefcase,
  Sparkles,
  GraduationCap,
  BarChart3,
  CloudCog,
} from 'lucide-react';
import { EcosystemId } from '../types';
import { useEcosystemStatus, EcosystemConnectivityState } from '../context/EcosystemStatusContext';

export type { EcosystemConnectivityState };

interface NavigationProps {
  activeTab: EcosystemId;
  setActiveTab: (tab: EcosystemId) => void;
  statusOverrides?: Partial<Record<EcosystemId, EcosystemConnectivityState>>;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, statusOverrides = {} }) => {
  const { statuses } = useEcosystemStatus();

  const getStatus = (id: EcosystemId): EcosystemConnectivityState => {
    return statusOverrides[id] || statuses[id] || 'online';
  };

  const categories = [
    {
      label: 'INTELLIGENCE & DEV',
      items: [
        {
          id: 'assistant' as EcosystemId,
          name: 'AI Super Assistant',
          badge: 'Thinking / Voice',
          icon: MessageSquare,
          accent: 'text-cyan-400 group-hover:text-cyan-300',
        },
        {
          id: 'dev_studio' as EcosystemId,
          name: 'AI Developer Studio',
          badge: 'gemini-4-argon',
          icon: Code2,
          accent: 'text-indigo-400 group-hover:text-indigo-300',
        },
        {
          id: 'creator_studio' as EcosystemId,
          name: 'AI Creator Studio',
          badge: '1K-4K / Omni Video',
          icon: Sparkles,
          accent: 'text-purple-400 group-hover:text-purple-300',
        },
        {
          id: 'business_studio' as EcosystemId,
          name: 'AI Business Studio',
          badge: 'Strategy',
          icon: Briefcase,
          accent: 'text-amber-400 group-hover:text-amber-300',
        },
      ],
    },
    {
      label: 'SECURITY & AUTONOMY',
      items: [
        {
          id: 'ethical_hacking' as EcosystemId,
          name: 'AI Ethical Hacking Lab',
          badge: 'Authorized OWASP',
          icon: ShieldAlert,
          accent: 'text-rose-400 group-hover:text-rose-300',
        },
        {
          id: 'defensive_sec' as EcosystemId,
          name: 'Defensive Security',
          badge: 'Posture & WAF',
          icon: ShieldCheck,
          accent: 'text-emerald-400 group-hover:text-emerald-300',
        },
        {
          id: 'agent_workforce' as EcosystemId,
          name: 'AI Agent Workforce',
          badge: 'Multi-Agent',
          icon: Bot,
          accent: 'text-teal-400 group-hover:text-teal-300',
        },
        {
          id: 'automation_hub' as EcosystemId,
          name: 'Automation Hub',
          badge: 'Google Tasks',
          icon: Zap,
          accent: 'text-yellow-400 group-hover:text-yellow-300',
        },
      ],
    },
    {
      label: 'MARKETPLACE & SCALE',
      items: [
        {
          id: 'marketplace' as EcosystemId,
          name: 'AI Marketplace',
          badge: '20% Comm.',
          icon: ShoppingBag,
          accent: 'text-fuchsia-400 group-hover:text-fuchsia-300',
        },
        {
          id: 'learning_academy' as EcosystemId,
          name: 'Learning Academy',
          badge: 'CTF Labs',
          icon: GraduationCap,
          accent: 'text-blue-400 group-hover:text-blue-300',
        },
        {
          id: 'data_intel' as EcosystemId,
          name: 'Data Intelligence',
          badge: 'CSV Analytics',
          icon: BarChart3,
          accent: 'text-emerald-400 group-hover:text-emerald-300',
        },
        {
          id: 'smart_workspace' as EcosystemId,
          name: 'Smart Workspace & Cloud',
          badge: '3D & Science',
          icon: CloudCog,
          accent: 'text-cyan-400 group-hover:text-cyan-300',
        },
      ],
    },
  ];

  const renderStatusDot = (status: EcosystemConnectivityState) => {
    switch (status) {
      case 'online':
        return (
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20 shrink-0"
            title="Ecosystem Online & Ready"
          />
        );
      case 'syncing':
        return (
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-cyan-500/30 animate-pulse shrink-0"
            title="Active Background Task / Syncing"
          />
        );
      case 'offline':
        return (
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"
            title="Ecosystem Inactive / Offline"
          />
        );
    }
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Ecosystem Status Legend */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-900">
        <span>ECOSYSTEM STATUS</span>
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px]">live</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px]">sync</span>
          </span>
        </div>
      </div>

      <div className="p-3 space-y-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
              {cat.label}
            </h3>
            <div className="space-y-0.5">
              {cat.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const status = getStatus(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/80'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      {/* Status indicator dot */}
                      {renderStatusDot(status)}
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.accent : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 ${
                        isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-3 border-t border-slate-900 bg-slate-950">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 font-semibold">NEXORA OS v4.2</div>
            <div className="text-[10px] text-slate-400">12 Ecosystems Synchronized</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
        </div>
      </div>
    </aside>
  );
};
