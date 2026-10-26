import React, { useState, useEffect } from 'react';
import {
  Search,
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
  X,
} from 'lucide-react';
import { EcosystemId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: EcosystemId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'assistant' as EcosystemId, name: 'AI Super Assistant (Thinking & Voice)', icon: MessageSquare, category: 'Core' },
    { id: 'dev_studio' as EcosystemId, name: 'Developer Studio & SAST Code Review', icon: Code2, category: 'Dev' },
    { id: 'ethical_hacking' as EcosystemId, name: 'Ethical Hacking Lab (OWASP Scans)', icon: ShieldAlert, category: 'Security' },
    { id: 'defensive_sec' as EcosystemId, name: 'Defensive Security Posture & WAF', icon: ShieldCheck, category: 'Security' },
    { id: 'agent_workforce' as EcosystemId, name: 'AI Agent Workforce & Delegation', icon: Bot, category: 'Autonomy' },
    { id: 'automation_hub' as EcosystemId, name: 'Automation Hub & Google Tasks', icon: Zap, category: 'Autonomy' },
    { id: 'creator_studio' as EcosystemId, name: 'Creator Studio (4K Images & Video)', icon: Sparkles, category: 'Creative' },
    { id: 'business_studio' as EcosystemId, name: 'Business Studio (Pitch & Competitor SWOT)', icon: Briefcase, category: 'Business' },
    { id: 'marketplace' as EcosystemId, name: 'AI Agent & Workflow Marketplace', icon: ShoppingBag, category: 'Monetization' },
    { id: 'learning_academy' as EcosystemId, name: 'Learning Academy & Cybersecurity CTF', icon: GraduationCap, category: 'Education' },
    { id: 'data_intel' as EcosystemId, name: 'Data Intelligence (CSV Analysis)', icon: BarChart3, category: 'Analytics' },
    { id: 'smart_workspace' as EcosystemId, name: 'Smart Workspace (3D Core & Bioscience)', icon: CloudCog, category: 'Enterprise' },
  ];

  const filtered = commands.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-3 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400 ml-1" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a module, action, or command..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of matched destinations */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching ecosystem or command found
            </div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 group-hover:border-cyan-500/50">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-400">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 font-mono px-4">
          <span>Use <strong>ESC</strong> to close</span>
          <span>NEXORA AI Command Router</span>
        </div>
      </div>
    </div>
  );
};
