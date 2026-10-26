import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  Lock,
  FileCheck,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { SecurityScanResult } from '../../types';
import { runSecurityScan, authorizeTarget } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useEcosystemStatus } from '../../context/EcosystemStatusContext';

export const EthicalHackingView: React.FC = () => {
  const { notify } = useNotification();
  const { setEcosystemStatus } = useEcosystemStatus();
  const [targetUrl, setTargetUrl] = useState('https://example.com');
  const [scopeNotes, setScopeNotes] = useState('Production asset authorized for non-destructive security header and OWASP verification.');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTicket, setActiveTicket] = useState<string | null>('AUTH-DEV-EXAMPLE');
  const [scanType, setScanType] = useState<'quick' | 'full' | 'stride'>('quick');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuthorizeScope = async () => {
    if (!targetUrl) return;
    setIsAuthorizing(true);
    setErrorMessage(null);
    try {
      const res = await authorizeTarget({
        targetUrl,
        organization: 'NEXORA Security Operations',
        contactEmail: 'security@nexora.internal',
        scopeNotes,
      });
      setActiveTicket(res.ticketId);
      setIsAuthorized(true);
      notify({
        type: 'success',
        title: 'Authorization Ticket Issued',
        message: `Server validated scope record: ${res.ticketId} for ${res.targetHost}. Valid for 4 hours.`,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authorization failed');
      notify({
        type: 'error',
        title: 'Scope Authorization Rejected',
        message: err.message || 'Target cannot be authorized',
      });
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthorized) {
      const err = 'Authorization Error: You must certify ownership and obtain a verified server authorization ticket before launching assessments.';
      setErrorMessage(err);
      notify({
        type: 'error',
        title: 'Authorization Required',
        message: 'Scan blocked: Server-verified scope ticket required.',
      });
      return;
    }

    setIsLoading(true);
    setEcosystemStatus('ethical_hacking', 'syncing');
    try {
      // If not already authorized via server ticket, obtain one
      let ticketToUse = activeTicket;
      if (!ticketToUse) {
        const authRes = await authorizeTarget({
          targetUrl,
          organization: 'Verified Client Audit',
          scopeNotes,
        });
        ticketToUse = authRes.ticketId;
        setActiveTicket(ticketToUse);
      }

      const result = await runSecurityScan({
        targetUrl,
        authorized: isAuthorized,
        scopeNotes,
        scanType,
      });
      setScanResult(result);
      setEcosystemStatus('ethical_hacking', 'online');
      notify({
        type: result.securityScore >= 75 ? 'success' : 'warning',
        title: 'Security Assessment Complete',
        message: `Target ${result.targetUrl} assessed. Posture Score: ${result.securityScore}/100 with ${result.findings.length} findings.`,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Scan failed to execute');
      setEcosystemStatus('ethical_hacking', 'online');
      notify({
        type: 'error',
        title: 'Security Scan Blocked',
        message: err.message || 'SSRF or connection failure',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPentestReport = () => {
    if (!scanResult) return;
    const reportText = `# NEXORA AI — PENETRATION TESTING & SECURITY AUDIT REPORT
Target: ${scanResult.targetUrl}
Timestamp: ${scanResult.scanTimestamp}
Security Posture Score: ${scanResult.securityScore}/100
HTTP Status: ${scanResult.httpStatus} | Latency: ${scanResult.responseTimeMs}ms

## Executive Summary & AI Synthesis
${scanResult.aiSummary || 'Automated inspection completed with no critical service disruptions.'}

## Identified Findings (${scanResult.findings.length})
${scanResult.findings.map(f => `### [${f.severity}] ${f.title} (${f.id})
Category: ${f.category}
Description: ${f.description}
Remediation: ${f.remediation}
`).join('\n')}

## Security Headers Sample
${JSON.stringify(scanResult.headersSample, null, 2)}

--
Generated automatically by NEXORA AI Ethical Hacking Lab (Zero-Trust Guard v4.2)
`;
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora_pentest_report_${scanResult.targetUrl.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI ETHICAL HACKING & PENETRATION LAB</h2>
            <p className="text-xs text-slate-400">
              OWASP Top 10 automated reconnaissance, SSRF-guarded header validation, and AI remediation synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SSRF GUARD: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Mandatory Authorization Gate & Scope Form */}
      <form onSubmit={handleStartScan} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Scan Target & Digital Authorization Gate</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">RFC1918 & Cloud Metadata Protected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Hostname or FQDN:</label>
            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Assessment Profile:</label>
            <select
              value={scanType}
              onChange={e => setScanType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none"
            >
              <option value="quick">Quick OWASP Surface Probe</option>
              <option value="full">Comprehensive Header & TLS Audit</option>
              <option value="stride">STRIDE Threat Model Mapping</option>
            </select>
          </div>

          <div className="md:col-span-12">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Scope Documentation & Engagement Notes:</label>
            <input
              type="text"
              value={scopeNotes}
              onChange={e => setScopeNotes(e.target.value)}
              placeholder="e.g. Authorized pentest contract #SEC-2026-X on staging domain"
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50"
            />
          </div>
        </div>

        {/* Mandatory Explicit Authorization Checkbox & Server Ticket */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="authCheck"
              checked={isAuthorized}
              onChange={e => setIsAuthorized(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="authCheck" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
              <strong className="text-rose-300 font-mono">Explicit Authorization Confirmation:</strong> I hereby certify and legally warrant that I am the verified owner of the specified target domain or possess explicit written authorization to perform non-destructive security vulnerability assessment.
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-rose-900/30">
            <div className="flex items-center space-x-2 text-[11px] font-mono">
              <span className="text-slate-400">SERVER TICKET:</span>
              {activeTicket ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {activeTicket} [VERIFIED]
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  NONE ISSUED
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAuthorizeScope}
              disabled={isAuthorizing || !targetUrl}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {isAuthorizing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Validating Scope...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Verify & Obtain Server Ticket</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isAuthorized}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning Target & Enforcing SSRF Defense...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Launch Authorized Security Assessment</span>
            </>
          )}
        </button>
      </form>

      {/* Results View */}
      {scanResult && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Posture Score Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-xl border shadow-lg ${
                  scanResult.securityScore >= 80
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600 shadow-emerald-500/20'
                    : scanResult.securityScore >= 50
                    ? 'bg-amber-950/80 text-amber-300 border-amber-600 shadow-amber-500/20'
                    : 'bg-rose-950/80 text-rose-300 border-rose-600 shadow-rose-500/20'
                }`}
              >
                <span>{scanResult.securityScore}</span>
                <span className="text-[9px] font-normal text-slate-400">/ 100</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  {scanResult.securityScore >= 80 ? 'HARDENED POSTURE' : scanResult.securityScore >= 50 ? 'MODERATE RISK DEFICIENCIES' : 'CRITICAL SECURITY DEFICIT'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Target: <span className="text-cyan-400">{scanResult.targetUrl}</span> | Latency: {scanResult.responseTimeMs}ms | Status: {scanResult.httpStatus}
                </p>
              </div>
            </div>

            <button
              onClick={downloadPentestReport}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download Pentest Dossier (.md)</span>
            </button>
          </div>

          {/* AI Remediation Narrative */}
          {scanResult.aiSummary && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>AI EXECUTIVE REMEDIATION ROADMAP (Gemini 3.8 Flash)</span>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                {scanResult.aiSummary}
              </p>
            </div>
          )}

          {/* Findings Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Identified Vulnerabilities & Misconfigurations ({scanResult.findings.length})
            </h4>

            {scanResult.findings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs font-mono text-emerald-400">
                Zero security header or configuration issues detected. Outstanding posture!
              </div>
            ) : (
              scanResult.findings.map(finding => (
                <div
                  key={finding.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          finding.severity === 'HIGH' || finding.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : finding.severity === 'MEDIUM'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">{finding.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{finding.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{finding.description}</p>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Actionable Fix:</strong> {finding.remediation}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
