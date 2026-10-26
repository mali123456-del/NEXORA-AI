import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Download,
  Check,
  Search,
  Filter,
  Coins,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { MarketplaceItem } from '../../types';

export const MarketplaceView: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: 'mp-1',
      title: 'Kubernetes Zero-Trust Security Auditor',
      author: 'CyberGuard Labs',
      category: 'Security',
      rating: 4.9,
      downloads: 1420,
      priceUSD: 49,
      description: 'Continuous K8s manifest inspector scanning RBAC privileges, pod security standards, and network policies.',
      isInstalled: true,
      version: 'v2.1.0',
    },
    {
      id: 'mp-2',
      title: 'PostgreSQL Query Planner Optimizer Agent',
      author: 'ScaleDB Systems',
      category: 'DevOps',
      rating: 4.8,
      downloads: 980,
      priceUSD: 39,
      description: 'Analyzes slow EXPLAIN ANALYZE queries, recommends composite indexes, and rewrites recursive CTEs.',
      isInstalled: false,
      version: 'v1.4.2',
    },
    {
      id: 'mp-3',
      title: 'Omnichannel B2B Content Repurposer',
      author: 'Aura Growth',
      category: 'Content',
      rating: 4.7,
      downloads: 2150,
      priceUSD: 29,
      description: 'Transforms engineering whitepapers into LinkedIn technical threads, newsletters, and executive slide decks.',
      isInstalled: false,
      version: 'v3.0.1',
    },
    {
      id: 'mp-4',
      title: 'AlphaFold pLDDT Structural Scoring Pipeline',
      author: 'DeepBio Consortium',
      category: 'Analytics',
      rating: 5.0,
      downloads: 840,
      priceUSD: 69,
      description: 'Automated batch analysis pipeline for protein sequences against AlphaFold v6 and UniProt databases.',
      isInstalled: true,
      version: 'v1.0.4',
    },
    {
      id: 'mp-5',
      title: 'OWASP ZAP & Nuclei Safe Pipeline Orchestrator',
      author: 'SecOps Collective',
      category: 'Security',
      rating: 4.9,
      downloads: 1890,
      priceUSD: 59,
      description: 'Isolated test harness executing approved templates with strict SSRF defenses and remediation reports.',
      isInstalled: false,
      version: 'v2.3.0',
    },
    {
      id: 'mp-6',
      title: 'Financial Model & SaaS ARR Cohort Engine',
      author: 'VentureMetrics',
      category: 'Analytics',
      rating: 4.8,
      downloads: 720,
      priceUSD: 45,
      description: 'Generates dynamic 3-statement financial models, calculates net revenue retention, and projects acquisition ARR.',
      isInstalled: false,
      version: 'v2.0.0',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleInstall = (id: string) => {
    setItems(items.map(item => (item.id === id ? { ...item, isInstalled: !item.isInstalled } : item)));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI AGENT & DIGITAL MARKETPLACE</h2>
            <p className="text-xs text-slate-400">
              Browse, install, and publish autonomous agents and verified workflow blueprints (20% Platform Commission)
            </p>
          </div>
        </div>

        {/* Commission Indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 flex items-center space-x-1.5">
            <Coins className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>COMMISSION: 80% Publisher / 20% NEXORA</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search agents, templates, security scanners..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono">
          {['All', 'Security', 'DevOps', 'Content', 'Analytics'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-fuchsia-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                  {item.category}
                </span>
                <span className="text-slate-500">{item.version}</span>
              </div>

              <h3 className="text-sm font-bold text-white font-mono mt-3 group-hover:text-fuchsia-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">by {item.author}</p>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.rating}</span>
                  <span className="text-slate-500">({item.downloads.toLocaleString()})</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  ${item.priceUSD} <span className="text-[10px] text-slate-400 font-normal">one-time</span>
                </div>
              </div>

              <button
                onClick={() => toggleInstall(item.id)}
                className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                  item.isInstalled
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-600/40 hover:bg-slate-750'
                    : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20'
                }`}
              >
                {item.isInstalled ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Installed in Workspace</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Purchase & Deploy (${item.priceUSD})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
