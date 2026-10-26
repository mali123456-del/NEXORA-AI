import React, { useState } from 'react';
import {
  CloudCog,
  Dna,
  Cpu,
  Users,
  Shield,
  Layers,
  Search,
  ExternalLink,
  Loader2,
  CheckCircle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { ThreeCyberCore } from '../ThreeCyberCore';
import { fetchProteinData, fetchCompoundData } from '../../services/api';
import { ProteinInfo, CompoundInfo, SubscriptionPlan } from '../../types';

interface SmartWorkspaceViewProps {
  currentPlan: SubscriptionPlan;
  setCurrentPlan: (plan: SubscriptionPlan) => void;
}

export const SmartWorkspaceView: React.FC<SmartWorkspaceViewProps> = ({ currentPlan, setCurrentPlan }) => {
  const [activeSubTab, setActiveSubTab] = useState<'3d_core' | 'science' | 'rbac' | 'quotas'>('3d_core');

  // Science / Bioscience Engine state
  const [proteinInput, setProteinInput] = useState('P04637'); // Canonical TP53 human tumor suppressor
  const [compoundInput, setCompoundInput] = useState('Imatinib'); // Landmark targeted kinase inhibitor
  const [proteinData, setProteinData] = useState<ProteinInfo | null>(null);
  const [compoundData, setCompoundData] = useState<CompoundInfo | null>(null);
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);

  const handleQueryProtein = async (accession: string) => {
    setIsBioLoading(true);
    setBioError(null);
    try {
      const data = await fetchProteinData(accession);
      setProteinData(data);
    } catch (err: any) {
      setBioError(err.message || 'Protein query failed');
    } finally {
      setIsBioLoading(false);
    }
  };

  const handleQueryCompound = async (name: string) => {
    setIsBioLoading(true);
    setBioError(null);
    try {
      const data = await fetchCompoundData(name);
      setCompoundData(data);
    } catch (err: any) {
      setBioError(err.message || 'Compound query failed');
    } finally {
      setIsBioLoading(false);
    }
  };

  // RBAC Team Members in workspace
  const teamMembers = [
    { name: 'Dr. Sulaiman M.', email: 'm.sulaiman10thclass@gmail.com', role: 'Organization Owner', status: 'Active' },
    { name: 'SecOps Automated Agent', email: 'aegis-secops@nexora.internal', role: 'Security Analyst', status: 'Active' },
    { name: 'QA Synthesis Bot', email: 'synthetix-qa@nexora.internal', role: 'Developer', status: 'Active' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <CloudCog className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">SMART WORKSPACE & ENTERPRISE CLOUD</h2>
            <p className="text-xs text-slate-400">
              Interactive 3D Cyber-Neural Core (Three.js), Bioscience Research Lab, RBAC governance, and plan quotas
            </p>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('3d_core')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === '3d_core'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3D Neural Core</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('science');
              if (!proteinData) handleQueryProtein('P04637');
              if (!compoundData) handleQueryCompound('Imatinib');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'science'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Bioscience Lab</span>
          </button>
          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'rbac'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>RBAC & Teams</span>
          </button>
          <button
            onClick={() => setActiveSubTab('quotas')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'quotas'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Plan Quotas</span>
          </button>
        </div>
      </div>

      {activeSubTab === '3d_core' && (
        /* Three.js 3D Cyber-Neural Core Display */
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>PROCEDURAL 3D CYBER-NEURAL TOPOLOGY (Three.js r174)</span>
            <span className="text-cyan-400">Studio PBR Lighting & ACES Tone Mapping</span>
          </div>
          <ThreeCyberCore />
        </div>
      )}

      {activeSubTab === 'science' && (
        /* Bioscience Research Lab */
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase">
                <Dna className="w-4 h-4 text-cyan-400" />
                <span>DeepMind & Authoritative Science Connectors</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">UniProtKB & AlphaFold DB Curated</span>
            </div>

            {/* Quick try chips per Science Skill guideline */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-500">Quick Targets:</span>
              {[
                { label: 'TP53 (Tumor Suppressor)', id: 'P04637' },
                { label: 'BRCA1 (DNA Repair)', id: 'P38398' },
                { label: 'EGFR (Kinase Receptor)', id: 'P00533' },
                { label: 'Insulin', id: 'P01308' },
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => {
                    setProteinInput(chip.id);
                    handleQueryProtein(chip.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                    proteinInput === chip.id
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Query Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Protein Lookup */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-slate-400">
                  Protein UniProt Accession:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={proteinInput}
                    onChange={e => setProteinInput(e.target.value)}
                    placeholder="e.g. P04637"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQueryProtein(proteinInput)}
                    disabled={isBioLoading}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center space-x-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Query</span>
                  </button>
                </div>
              </div>

              {/* Chemical Compound Lookup */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-slate-400">
                  Chemical Compound (PubChem):
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={compoundInput}
                    onChange={e => setCompoundInput(e.target.value)}
                    placeholder="e.g. Imatinib, Aspirin"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQueryCompound(compoundInput)}
                    disabled={isBioLoading}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center space-x-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Query</span>
                  </button>
                </div>
              </div>
            </div>

            {bioError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300">
                {bioError}
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Protein Card */}
            {proteinData && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {proteinData.accession}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{proteinData.organism}</span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono">{proteinData.proteinName}</h3>
                <p className="text-xs text-slate-400 font-mono">Gene: {proteinData.geneName} | Length: {proteinData.sequenceLength} aa</p>

                {/* AlphaFold DB Links */}
                {proteinData.alphaFold && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="text-cyan-400 font-bold flex items-center justify-between">
                      <span>AlphaFold DB Structure Prediction:</span>
                      <span className="text-[10px] text-emerald-400">Available</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {proteinData.alphaFold.pdbUrl && (
                        <a
                          href={proteinData.alphaFold.pdbUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700"
                        >
                          <span>PDB Coordinates</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {proteinData.alphaFold.cifUrl && (
                        <a
                          href={proteinData.alphaFold.cifUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700"
                        >
                          <span>mmCIF Coordinate Model</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  Provenance: {proteinData.provenance}
                </div>
              </div>
            )}

            {/* Chemical Compound Card */}
            {compoundData && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    CID #{compoundData.cid}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">PubChem PUG REST</span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono">{compoundData.name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Formula: {compoundData.formula} | MW: {compoundData.molecularWeight} g/mol
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-400 text-[10px]">Canonical SMILES:</div>
                  <div className="text-emerald-300 break-all bg-slate-900 p-2 rounded text-[11px]">
                    {compoundData.smiles}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  IUPAC: {compoundData.iupacName}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'rbac' && (
        /* RBAC & Team Management */
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">TENANT RBAC & ACCESS CONTROL</h3>
              <p className="text-xs text-slate-400">Granular permissions with least privilege boundaries</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800">
              Role Isolation Active
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-bold text-white">{member.name}</div>
                  <div className="text-slate-400 text-[11px]">{member.email}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
                    {member.role}
                  </span>
                  <span className="text-emerald-400 text-[11px]">{member.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'quotas' && (
        /* Plan Quotas & Entitlements */
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">TIER ENTITLEMENTS & PLAN LIMITS</h3>
              <p className="text-xs text-slate-400">Current Active Plan: <strong className="text-cyan-400">{currentPlan}</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                id: 'FREE' as SubscriptionPlan,
                name: 'Free Starter',
                price: '$0 / mo',
                tokens: '50,000 tokens/mo',
                features: ['Basic Assistant', 'gemini-3.1-flash-lite', '1 Active Workflow', 'Community CTF'],
              },
              {
                id: 'PRO' as SubscriptionPlan,
                name: 'Professional',
                price: '$29 / mo',
                tokens: '500,000 tokens/mo',
                features: ['gemini-3.8-flash', 'Google Search Grounding', '1K/2K Image Gen', 'Dev Studio Refactoring'],
              },
              {
                id: 'ULTIMATE' as SubscriptionPlan,
                name: 'Ultimate Engineer',
                price: '$89 / mo',
                tokens: '2,500,000 tokens/mo',
                features: ['gemini-4-argon High Thinking', 'Ethical Hacking Lab', 'Omni Flash Video Gen', '4K Images'],
              },
              {
                id: 'BUSINESS' as SubscriptionPlan,
                name: 'Business Cloud',
                price: '$249 / mo',
                tokens: '10,000,000 tokens/mo',
                features: ['Team RBAC & Cloud Vault', '3D Cyber Core Visualizer', 'Bioscience Engine', 'Google Tasks Sync'],
              },
            ].map(tier => {
              const isActive = currentPlan === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                    isActive
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold font-mono text-white">{tier.name}</h4>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-cyan-400 font-mono mt-1">{tier.price}</div>
                    <div className="text-[11px] text-amber-400 font-mono mt-0.5">{tier.tokens}</div>

                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center space-x-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setCurrentPlan(tier.id)}
                    className={`w-full py-1.5 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-600 text-white cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isActive ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
