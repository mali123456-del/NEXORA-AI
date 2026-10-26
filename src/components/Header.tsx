import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  Shield,
  Coins,
  Cpu,
  CheckCircle2,
  ListTodo,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  User,
  Code2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { SubscriptionPlan, UserRoleProfile } from '../types';
import { getTelemetryUsage } from '../services/api';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface HeaderProps {
  currentPlan: SubscriptionPlan;
  setCurrentPlan: (plan: SubscriptionPlan) => void;
  currentRole: UserRoleProfile;
  setCurrentRole: (role: UserRoleProfile) => void;
  onOpenCommandPalette: () => void;
  onOpenTasks: () => void;
  onOpenAuditLogs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  setCurrentPlan,
  currentRole,
  setCurrentRole,
  onOpenCommandPalette,
  onOpenTasks,
  onOpenAuditLogs,
}) => {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [telemetry, setTelemetry] = useState<{ totalTokens: number; totalCostUSD: number }>({
    totalTokens: 0,
    totalCostUSD: 0,
  });
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const planRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (planRef.current && !planRef.current.contains(e.target as Node)) {
        setShowPlanMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

  const roleProfiles: Record<UserRoleProfile, { label: string; icon: any; desc: string }> = {
    everyday: { label: 'Everyday User', icon: User, desc: 'Assistant, Creator & Workspace' },
    developer: { label: 'Developer', icon: Code2, desc: 'Dev Studio, SAST & APIs' },
    security: { label: 'Security Pro', icon: ShieldCheck, desc: 'Ethical Hacking & Defensive WAF' },
    business: { label: 'Business & Team', icon: Briefcase, desc: 'Strategy, Canvas & Marketplace' },
  };

  const CurrentRoleIcon = roleProfiles[currentRole].icon;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base tracking-tight text-white font-mono">
              NEXORA<span className="text-cyan-400">.AI</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              v4.2 PROD
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
        aria-label="Open Command Search (Ctrl+K)"
        className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs w-72 justify-between"
      >
        <div className="flex items-center space-x-2 truncate">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Search modules, actions & docs...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls: Telemetry, Tasks, Theme, Role, Plan, Audit */}
      <div className="flex items-center space-x-2">
        {/* Token Accounting & Spend Tracker */}
        <div className="hidden xl:flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{telemetry.totalTokens.toLocaleString()} tkns</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-emerald-400">${telemetry.totalCostUSD.toFixed(4)} est.</div>
        </div>

        {/* Tasks trigger */}
        <button
          onClick={onOpenTasks}
          title="Google Workspace & Tasks Queue"
          aria-label="Open Google Tasks and Workflow Queue"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
        >
          <ListTodo className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Tasks</span>
        </button>

        {/* Audit Log Modal trigger */}
        <button
          onClick={onOpenAuditLogs}
          title="Immutable Security Audit Logs"
          aria-label="Open Security Audit Logs"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
        >
          <Shield className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Audit</span>
        </button>

        {/* Theme Mode Selector (Dark / Light / System) */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title={`Active Theme: ${themeMode.toUpperCase()} (${resolvedTheme} resolved)`}
            aria-label="Switch platform appearance theme"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
          >
            {themeMode === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : themeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Monitor className="w-4 h-4 text-cyan-400" />
            )}
            <span className="hidden md:inline capitalize">{themeMode}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Theme Mode
              </div>
              {[
                { id: 'dark' as ThemeMode, label: 'Dark Mode', icon: Moon, desc: 'Deep Obsidian' },
                { id: 'light' as ThemeMode, label: 'Light Mode', icon: Sun, desc: 'Clean Executive' },
                { id: 'system' as ThemeMode, label: 'System Sync', icon: Monitor, desc: 'Auto OS Preference' },
              ].map(t => {
                const Icon = t.icon;
                const isSelected = themeMode === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeMode(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5" />
                      <div>
                        <div>{t.label}</div>
                        <div className="text-[9px] text-slate-500">{t.desc}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Role Experience Profile Switcher (Phase 3) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            title={`Active Persona: ${roleProfiles[currentRole].label}`}
            aria-label="Switch experience profile"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition-colors"
          >
            <CurrentRoleIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">{roleProfiles[currentRole].label}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Experience Persona
              </div>
              {(['everyday', 'developer', 'security', 'business'] as UserRoleProfile[]).map(r => {
                const Icon = roleProfiles[r].icon;
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="font-medium text-white">{roleProfiles[r].label}</div>
                        <div className="text-[10px] text-slate-500">{roleProfiles[r].desc}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Subscription Plan Switcher Dropdown */}
        <div className="relative" ref={planRef}>
          <button
            onClick={() => setShowPlanMenu(!showPlanMenu)}
            aria-label="Select Subscription Plan"
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
              planBadges[currentPlan].color
            }`}
          >
            <span>{planBadges[currentPlan].label}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showPlanMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
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
