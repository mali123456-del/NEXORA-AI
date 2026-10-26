import React, { useState, useEffect } from 'react';
import { X, BookOpen, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { fetchDocContent } from '../services/api';

interface DocViewerModalProps {
  isOpen: boolean;
  docPath: string | null;
  onClose: () => void;
}

export const DocViewerModal: React.FC<DocViewerModalProps> = ({ isOpen, docPath, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('Documentation');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !docPath) return;

    setIsLoading(true);
    setError(null);

    fetchDocContent(docPath)
      .then(res => {
        setContent(res.content);
        const firstHeading = res.content.split('\n').find(l => l.startsWith('# '));
        setTitle(firstHeading ? firstHeading.replace(/^#\s*/, '') : res.filename);
      })
      .catch(err => {
        setError(err.message || 'Failed to load document');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, docPath]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-4xl h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 id="doc-modal-title" className="text-sm font-bold text-white font-mono truncate">
                {title}
              </h2>
              <div className="text-[11px] font-mono text-slate-400 truncate">{docPath}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopy}
              disabled={isLoading || !content}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close document viewer"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content View */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed text-slate-200 space-y-4 bg-slate-950/40">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span>Fetching documentation...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300">
              {error}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 select-text leading-relaxed">
              {content}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 border-t border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>NEXORA AI Technical Documentation Registry</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
