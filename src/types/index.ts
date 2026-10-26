export type EcosystemId =
  | 'assistant'
  | 'dev_studio'
  | 'ethical_hacking'
  | 'defensive_sec'
  | 'agent_workforce'
  | 'automation_hub'
  | 'marketplace'
  | 'business_studio'
  | 'creator_studio'
  | 'learning_academy'
  | 'data_intel'
  | 'smart_workspace';

export type SubscriptionPlan = 'FREE' | 'PRO' | 'ULTIMATE' | 'BUSINESS';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  isThinking?: boolean;
  groundingSources?: Array<{ title?: string; uri?: string }>;
  audioUrl?: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  description: string;
  remediation: string;
}

export interface SecurityScanResult {
  targetUrl: string;
  scanTimestamp: string;
  httpStatus: number;
  responseTimeMs: number;
  securityScore: number;
  findings: SecurityFinding[];
  headersSample: Record<string, string>;
  aiSummary?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  status: 'IDLE' | 'ACTIVE' | 'AWAITING_APPROVAL' | 'PAUSED';
  specialization: string[];
  tokensAllocated: number;
  requiresApproval: boolean;
}

export interface WorkflowStep {
  id: string;
  trigger: string;
  action: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  lastRun?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  author: string;
  category: 'Security' | 'DevOps' | 'Content' | 'Analytics' | 'Agents';
  rating: number;
  downloads: number;
  priceUSD: number;
  description: string;
  isInstalled: boolean;
  version: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed';
}

export interface ProteinInfo {
  accession: string;
  geneName: string;
  proteinName: string;
  organism: string;
  sequenceLength: number;
  sequence: string;
  alphaFold?: {
    cifUrl?: string;
    pdbUrl?: string;
    paeDocUrl?: string;
  };
  provenance: string;
}

export interface CompoundInfo {
  name: string;
  cid: number;
  formula: string;
  molecularWeight: number;
  smiles: string;
  iupacName: string;
  provenance: string;
}
