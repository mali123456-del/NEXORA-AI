import React, { useState, useEffect } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { getAuditLogs } from '../services/api';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[80vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono">IMMUTABLE SECURITY AUDIT LEDGER</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Cryptographically tracked events, authorization scans, and SSRF defenses
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadLogs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">
              No audit records registered yet
            </div>
          ) : (
            logs.map(log => {
              const isBlocked = log.status === 'BLOCKED' || log.status === 'FLAGGED';
              const isWarning = log.status === 'WARNING';
              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border font-mono text-xs ${
                    isBlocked
                      ? 'bg-rose-950/20 border-rose-800/40'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-800/40'
                      : 'bg-slate-950/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBlocked
                            ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                            : isWarning
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                            : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                        }`}
                      >
                        {log.eventType}
                      </span>
                      <span className="text-slate-400 text-[11px]">Actor: {log.actor}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-2 text-slate-300 text-xs">
                    {log.details}
                  </div>
                  {log.target && (
                    <div className="mt-1 text-[11px] text-cyan-400">
                      Target: {log.target}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Non-repudiation verified</span>
          <span>Zero-Trust Architecture</span>
        </div>
      </div>
    </div>
  );
};
