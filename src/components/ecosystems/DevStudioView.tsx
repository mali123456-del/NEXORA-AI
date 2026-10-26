import React, { useState } from 'react';
import {
  Code2,
  Play,
  ShieldCheck,
  Sparkles,
  FileCode,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Loader2,
  Bug,
} from 'lucide-react';
import { sendChatMessage, runSastReview } from '../../services/api';

export const DevStudioView: React.FC = () => {
  const [language, setLanguage] = useState('typescript');
  const [activeMode, setActiveMode] = useState<'generate' | 'refactor' | 'sast' | 'test'>('generate');
  const [prompt, setPrompt] = useState('Create a production-grade rate-limiting middleware in Express with token bucket algorithm, Redis adapter, and IP header spoofing defense.');
  const [codeOutput, setCodeOutput] = useState(`import { Request, Response, NextFunction } from 'express';

// Token Bucket Rate Limiter with Anti-Spoofing Guard
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();
const CAPACITY = 60; // Max burst
const REFILL_RATE = 1; // Tokens added per second

export function tokenBucketRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Validate real client IP to prevent X-Forwarded-For injection attacks
  const rawIp = req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  let bucket = buckets.get(rawIp);
  if (!bucket) {
    bucket = { tokens: CAPACITY, lastRefill: now };
    buckets.set(rawIp, bucket);
  } else {
    // Refill tokens based on elapsed time
    const elapsedSec = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSec * REFILL_RATE);
    bucket.lastRefill = now;
  }

  if (bucket.tokens < 1) {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfterSeconds: Math.ceil((1 - bucket.tokens) / REFILL_RATE),
    });
    return;
  }

  bucket.tokens -= 1;
  res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
  next();
}
`);
  const [isLoading, setIsLoading] = useState(false);
  const [sastResults, setSastResults] = useState<{ totalIssues: number; issues: any[]; aiReview: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    setSastResults(null);

    try {
      if (activeMode === 'sast') {
        const res = await runSastReview({ code: codeOutput, language });
        setSastResults(res);
      } else {
        let taskInstruction = '';
        if (activeMode === 'generate') {
          taskInstruction = `You are a Senior Systems Software Engineer. Write clean, robust, secure ${language} code for the following request: "${prompt}". Return clean code with brief inline comments.`;
        } else if (activeMode === 'refactor') {
          taskInstruction = `You are a Principal Software Architect. Refactor this ${language} code for maximum performance, clean architecture, and defensive security:\n\`\`\`${language}\n${codeOutput}\n\`\`\`\nUser notes: ${prompt}`;
        } else if (activeMode === 'test') {
          taskInstruction = `You are a QA Lead and Test Engineer. Generate comprehensive unit tests (using Vitest/Jest or equivalent for ${language}) with edge cases and malicious inputs for this code:\n\`\`\`${language}\n${codeOutput}\n\`\`\``;
        }

        const res = await sendChatMessage({
          prompt: taskInstruction,
          model: 'gemini-4-argon',
          enableThinking: true,
          feature: 'Developer Studio',
        });

        // Extract code block if wrapped in markdown
        const match = res.text.match(/```(?:[a-zA-Z0-9_\-]+)?\s*([\s\S]*?)```/);
        setCodeOutput(match ? match[1].trim() : res.text);
      }
    } catch (err: any) {
      alert(`Developer Studio Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora_solution.${language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI DEVELOPER STUDIO</h2>
            <p className="text-xs text-slate-400">
              Code intelligence, automated refactoring, and SAST security scanner (Powered by gemini-4-argon)
            </p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          {(['generate', 'refactor', 'sast', 'test'] as const).map(m => (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                activeMode === m
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'sast' ? 'SAST Audit' : m === 'test' ? 'Unit Tests' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex-1 flex flex-col shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                {activeMode === 'sast' ? 'Target SAST Scope' : 'Architectural Prompt'}
              </span>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL / Postgres</option>
              </select>
            </div>

            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe feature requirements, architectural constraints, or optimization goals..."
              rows={5}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none font-mono"
            />

            <button
              onClick={handleAction}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-mono font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing with Argon reasoning...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>
                    {activeMode === 'sast'
                      ? 'Execute SAST Security Audit'
                      : activeMode === 'test'
                      ? 'Generate Test Harness'
                      : activeMode === 'refactor'
                      ? 'Refactor & Harden Code'
                      : 'Generate Clean Architecture'}
                  </span>
                </>
              )}
            </button>

            {/* Quick Templates */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400">Quick Templates:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Zero-Trust Auth Token Verification',
                  'High-Performance LRU Memory Cache',
                  'SQL Parameterized Prepared Statement',
                  'Distributed Lock with Redis',
                ].map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(tmpl)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono transition-colors"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Code Editor / Output Panel */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col shadow-xl h-full min-h-[460px]">
            {/* Editor Header */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-300">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>active_buffer.{language === 'typescript' ? 'ts' : language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Code Textarea / Viewer */}
            <div className="flex-1 p-3 bg-slate-950 flex flex-col">
              <textarea
                value={codeOutput}
                onChange={e => setCodeOutput(e.target.value)}
                rows={16}
                className="w-full flex-1 bg-transparent text-xs text-slate-200 font-mono leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/30"
                spellCheck={false}
              />
            </div>

            {/* SAST Audit Results Drawer */}
            {sastResults && (
              <div className="border-t border-slate-800 bg-slate-900/95 p-4 space-y-3 max-h-60 overflow-y-auto animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>SAST STATIC ANALYSIS RESULTS</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      sastResults.totalIssues === 0
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}
                  >
                    {sastResults.totalIssues === 0 ? 'CLEAN CODE' : `${sastResults.totalIssues} FINDINGS`}
                  </span>
                </div>

                {sastResults.issues.map((iss, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-rose-900/40 text-xs font-mono">
                    <div className="flex items-center justify-between text-rose-300 font-bold">
                      <span>Line {iss.line}: {iss.rule}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800">{iss.severity}</span>
                    </div>
                    <div className="mt-1 text-slate-400 text-[11px] bg-slate-900 p-1.5 rounded">
                      {iss.snippet}
                    </div>
                    <div className="mt-1 text-emerald-400 text-[11px]">
                      Recommendation: {iss.recommendation}
                    </div>
                  </div>
                ))}

                {sastResults.aiReview && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap font-sans">
                    <div className="font-mono text-cyan-400 font-bold mb-1">Argon Deep Review:</div>
                    {sastResults.aiReview}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
