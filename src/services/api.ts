import { SecurityScanResult, WorkspaceTask, ProteinInfo, CompoundInfo } from '../types';

export interface ChatResponse {
  text: string;
  model: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    searchChunks?: Array<{ web?: { uri?: string; title?: string } }>;
  } | null;
}

export async function sendChatMessage(params: {
  prompt: string;
  model?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemInstruction?: string;
  enableSearch?: boolean;
  enableThinking?: boolean;
  feature?: string;
}): Promise<ChatResponse> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function analyzeImage(params: {
  imageBase64: string;
  mimeType?: string;
  prompt?: string;
}): Promise<{ text: string }> {
  const res = await fetch('/api/ai/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function generateHighQualityImage(params: {
  prompt: string;
  aspectRatio?: string;
  imageSize?: '1K' | '2K' | '4K';
}): Promise<{ imageUrl: string | null; text: string; imageSize: string; aspectRatio: string }> {
  const res = await fetch('/api/ai/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Image generation failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function animateImageToVideo(params: {
  imageBase64: string;
  mimeType?: string;
  motionPrompt?: string;
  aspectRatio?: '16:9' | '9:16';
}): Promise<{ videoUrl: string | null; status: string; aspectRatio: string }> {
  const res = await fetch('/api/ai/animate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Video animation failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function synthesizeSpeech(params: {
  text: string;
  voice?: string;
}): Promise<{ audioUrl: string }> {
  const res = await fetch('/api/ai/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'TTS failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function runSecurityScan(params: {
  targetUrl: string;
  authorized: boolean;
  scopeNotes?: string;
  scanType?: string;
}): Promise<SecurityScanResult> {
  const res = await fetch('/api/security/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Scan request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function runSastReview(params: {
  code: string;
  language?: string;
}): Promise<{ totalIssues: number; issues: any[]; aiReview: string }> {
  const res = await fetch('/api/security/sast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'SAST failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchProteinData(accession: string): Promise<ProteinInfo> {
  const res = await fetch(`/api/science/protein/${encodeURIComponent(accession)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Protein query failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchCompoundData(name: string): Promise<CompoundInfo> {
  const res = await fetch(`/api/science/compound/${encodeURIComponent(name)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Compound query failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchWorkspaceTasks(): Promise<{ tasks: WorkspaceTask[]; source: string }> {
  const res = await fetch('/api/workspace/tasks');
  if (!res.ok) throw new Error('Failed to load tasks');
  return res.json();
}

export async function createWorkspaceTask(task: { title: string; notes?: string; due?: string }): Promise<WorkspaceTask> {
  const res = await fetch('/api/workspace/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateWorkspaceTask(id: string, updates: Partial<WorkspaceTask>): Promise<WorkspaceTask> {
  const res = await fetch(`/api/workspace/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteWorkspaceTask(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/workspace/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function getTelemetryUsage(): Promise<{ totalTokens: number; totalCostUSD: number; records: any[] }> {
  const res = await fetch('/api/telemetry/usage');
  if (!res.ok) throw new Error('Failed to load telemetry');
  return res.json();
}

export async function getAuditLogs(): Promise<any[]> {
  const res = await fetch('/api/security/audit-logs');
  if (!res.ok) throw new Error('Failed to load audit logs');
  return res.json();
}

export async function authorizeTarget(params: {
  targetUrl: string;
  organization?: string;
  contactEmail?: string;
  scopeNotes?: string;
}): Promise<{ success: boolean; ticketId: string; targetHost: string; expiresAt: string; message: string }> {
  const res = await fetch('/api/security/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Authorization failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getActiveAuthorizations(): Promise<{ activeAuthorizations: any[] }> {
  const res = await fetch('/api/security/authorizations');
  if (!res.ok) throw new Error('Failed to load authorizations');
  return res.json();
}

export async function fetchCtfChallenges(): Promise<{ challenges: any[]; totalPoints: number }> {
  const res = await fetch('/api/academy/challenges');
  if (!res.ok) throw new Error('Failed to load academy challenges');
  return res.json();
}

export async function verifyCtfFlag(
  challengeId: string,
  flag: string
): Promise<{ correct: boolean; points?: number; totalPoints?: number; alreadySolved?: boolean; message?: string }> {
  const res = await fetch('/api/academy/verify-flag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeId, flag }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Verification failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

