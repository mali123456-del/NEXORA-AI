import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  FileCode2,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Sliders,
  Layers,
  Lock,
} from 'lucide-react';

export const DefensiveSecurityView: React.FC = () => {
  const [cspNonce, setCspNonce] = useState('rAnd0mN0nc3Str1ng==');
  const [strictTransport, setStrictTransport] = useState(true);
  const [frameAncestors, setFrameAncestors] = useState("'none'");
  const [copied, setCopied] = useState(false);

  const generatedCsp = `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-${cspNonce}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors ${frameAncestors}; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`;

  const generatedNginxHardening = `# NEXORA AI Hardened Nginx Configuration
server_tokens off;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
${strictTransport ? 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;' : ''}
${generatedCsp}
`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strideThreats = [
    { title: 'Spoofing', threat: 'Forged JWT claims or session hijacking', defense: 'HMAC-SHA256 tokens with short expiration, HttpOnly cookies, server-side token revocation ledger.' },
    { title: 'Tampering', threat: 'Parameter tampering in API scan targets', defense: 'Strict schema parsing with zod/TypeScript, SSRF allowlists, server-side parameter bounds checking.' },
    { title: 'Repudiation', threat: 'Actor denying scan execution', defense: 'Cryptographic immutable audit logging with actor ID, timestamp, and action hash.' },
    { title: 'Information Disclosure', threat: 'API keys leaked to browser bundles', defense: 'Zero client secrets. All GenAI and sensitive APIs proxy exclusively through server.ts.' },
    { title: 'Denial of Service', threat: 'Runaway token consumption or unbounded scans', defense: 'Token bucket rate-limiters, per-tenant budgets, timeout caps at 60s per probe.' },
    { title: 'Elevation of Privilege', threat: 'Regular user accessing administrative settings', defense: 'Role-Based Access Control (RBAC) enforced at gateway middleware level.' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI DEFENSIVE SECURITY SUITE</h2>
            <p className="text-xs text-slate-400">
              Active posture management, automated WAF/CSP rules, and STRIDE threat modeling
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800">
            OVERALL POSTURE: 96 / 100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive WAF & CSP Generator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Hardened CSP & Web Server Config Builder</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Random Script Nonce:</label>
                <input
                  type="text"
                  value={cspNonce}
                  onChange={e => setCspNonce(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Frame Ancestors (Clickjacking):</label>
                <select
                  value={frameAncestors}
                  onChange={e => setFrameAncestors(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs focus:outline-none"
                >
                  <option value="'none'">'none' (Highest Security - No Framing)</option>
                  <option value="'self'">'self' (Same Origin Framing Only)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="hstsToggle"
                  checked={strictTransport}
                  onChange={e => setStrictTransport(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
                />
                <label htmlFor="hstsToggle" className="font-mono text-slate-300 text-[11px]">
                  Enforce HSTS Preload (Strict-Transport-Security: 1 Year)
                </label>
              </div>
            </div>

            {/* Generated Config Block */}
            <div className="mt-3 relative p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                <span>nginx_hardened.conf</span>
                <button
                  onClick={() => handleCopy(generatedNginxHardening)}
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Conf'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {generatedNginxHardening}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: STRIDE Threat Matrix */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>STRIDE Threat Modeling Matrix</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Validated
              </span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {strideThreats.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 font-bold">{t.title}</span>
                    <span className="text-[10px] text-slate-500">Threat Class #{idx + 1}</span>
                  </div>
                  <p className="text-rose-400/90 text-[11px]">
                    <strong className="text-slate-400">Risk:</strong> {t.threat}
                  </p>
                  <p className="text-emerald-400/90 text-[11px]">
                    <strong className="text-slate-400">Mitigation:</strong> {t.defense}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
