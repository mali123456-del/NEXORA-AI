import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Target,
  PieChart,
  DollarSign,
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { sendChatMessage } from '../../services/api';

export const BusinessStudioView: React.FC = () => {
  const [topic, setTopic] = useState('NEXORA AI Enterprise Security & Developer Ecosystem');
  const [targetMarket, setTargetMarket] = useState('B2B SaaS companies, DevSecOps teams, cybersecurity consultancies');
  const [planType, setPlanType] = useState<'pitch' | 'swot' | 'canvas' | 'pricing'>('pitch');
  const [generatedDoc, setGeneratedDoc] = useState(`## Executive Pitch Deck: NEXORA AI
### 1. Problem Statement
Modern technology companies suffer from tool fragmentation across fragmented AI chatbots, separate code editors, disconnected pentesting suites, and standalone automation tools, paying $300+/seat across 6 different SaaS vendors with zero unified security governance.

### 2. The Solution: NEXORA AI
The world's first unified AI ecosystem combining AI Super Assistant, Developer Studio, Ethical Hacking Lab, Agent Workforce, and Automation Hub under a single enterprise security gateway.

### 3. Business & Monetization Model
- Free-to-Paid Subscription Funnel: Free Tier -> Pro ($29/mo) -> Ultimate ($89/mo) -> Business ($249/mo).
- High Gross Margin: 78%+ margin based on server-side token budget routing.
- Marketplace Commissions: 20% commission on third-party autonomous agents and workflow blueprints.

### 4. Competitive Moat
- Zero-exposure server-side GenAI proxy architecture.
- Built-in authorized OWASP reconnaissance and SSRF protection.
- Low-resource client engine that runs flawlessly without local GPUs.
`);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      let prompt = '';
      if (planType === 'pitch') {
        prompt = `Draft an investor-ready 6-slide executive pitch deck for "${topic}" targeting "${targetMarket}". Include Problem, Solution, Market Opportunity, Business Model, Competitive Moat, and Go-to-Market.`;
      } else if (planType === 'swot') {
        prompt = `Create a rigorous Competitor SWOT Analysis for "${topic}" in the market "${targetMarket}". Identify Strengths, Weaknesses, Opportunities, and Threats with actionable strategic positioning.`;
      } else if (planType === 'canvas') {
        prompt = `Construct a complete 9-box Business Model Canvas for "${topic}" (Key Partners, Key Activities, Value Propositions, Customer Relationships, Channels, Cost Structure, Revenue Streams).`;
      } else {
        prompt = `Design a data-driven SaaS tier pricing model for "${topic}" with Free, Pro, Ultimate, and Business tiers. Calculate unit economics, feature gates, and usage limits.`;
      }

      const res = await sendChatMessage({
        prompt,
        model: 'gemini-4-argon',
        enableThinking: true,
        feature: 'Business Studio',
      });

      setGeneratedDoc(res.text);
    } catch (err: any) {
      alert(`Business Studio Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI BUSINESS & STRATEGY STUDIO</h2>
            <p className="text-xs text-slate-400">
              Investor pitch decks, competitor SWOT analysis, business model canvases, and SaaS monetization blueprints
            </p>
          </div>
        </div>

        {/* Plan Type Selector */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          {(['pitch', 'swot', 'canvas', 'pricing'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlanType(p)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                planType === p
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'pitch' ? 'Pitch Deck' : p === 'swot' ? 'SWOT' : p === 'canvas' ? 'BMC Canvas' : 'SaaS Pricing'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Inputs */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">Strategic Focus Parameters</span>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Company / Initiative Subject:</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Market & ICP:</label>
            <textarea
              value={targetMarket}
              onChange={e => setTargetMarket(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/30 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Executive Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Strategic Deliverable</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl flex flex-col min-h-[440px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-300">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>STRATEGY_DELIVERABLE.md</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans overflow-y-auto">
            {generatedDoc}
          </div>
        </div>
      </div>
    </div>
  );
};
