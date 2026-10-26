import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, RefreshCw, Copy, Check, ExternalLink, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  resetKey?: string | number;
  incidentUrl?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDetailsExpanded: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsExpanded: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Log exception for audit diagnostics
    console.error('[NEXORA ErrorBoundary] UI exception caught:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // If resetKey changes (e.g. active tab switches), automatically attempt recovery
    if (this.props.resetKey !== undefined && prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.handleReset();
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsExpanded: false,
      copied: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleCopyDetails = async (): Promise<void> => {
    const { error, errorInfo } = this.state;
    const diagnosticPayload = [
      `=== NEXORA AI INCIDENT REPORT ===`,
      `Timestamp: ${new Date().toISOString()}`,
      `Error: ${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`,
      `User Agent: ${navigator.userAgent}`,
      `\n--- Stack Trace ---`,
      error?.stack || 'No stack trace available',
      `\n--- Component Stack ---`,
      errorInfo?.componentStack || 'No component stack available',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(diagnosticPayload);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    } catch (err) {
      console.warn('Failed to copy error report to clipboard:', err);
    }
  };

  getReportUrl = (): string => {
    if (this.props.incidentUrl) {
      return this.props.incidentUrl;
    }
    const { error } = this.state;
    const title = encodeURIComponent(`[UI Crash] ${error?.name || 'Component'}: ${error?.message?.slice(0, 80) || 'Unexpected Error'}`);
    const body = encodeURIComponent(
      `### NEXORA UI Incident Report\n\n**Error:** ${error?.message}\n**Timestamp:** ${new Date().toISOString()}\n\n*Diagnostics:*\n\`\`\`\n${error?.stack?.slice(0, 600) || 'N/A'}\n\`\`\``
    );
    return `https://github.com/mali123456-del/NEXORA-AI/issues/new?title=${title}&body=${body}`;
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, isDetailsExpanded, copied } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const reportUrl = this.getReportUrl();

      return (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md text-slate-100 overflow-y-auto w-full h-full">
          <div className="max-w-2xl w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-950/30">
            {/* Header / Severity Alert */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    UI Fault Isolated
                  </span>
                  <span className="text-xs text-slate-400">NEXORA Shield Boundary</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5 truncate">
                  Ecosystem View Crash Intercepted
                </h2>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  A runtime exception occurred in the active ecosystem view. NEXORA's centralized
                  error boundary caught this failure to preserve your workspace state and background tasks.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="mt-5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-xs text-red-300 break-all select-all">
              <span className="text-slate-500 font-semibold select-none">Error: </span>
              {error?.message || 'An unknown exception was encountered.'}
            </div>

            {/* Actions Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                type="button"
                onClick={this.handleCopyDetails}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 text-sm font-medium transition-all"
                title="Copy full error stack for debugging"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Diagnostics' : 'Copy Details'}
              </button>

              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm font-medium transition-all ml-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Report Incident
              </a>
            </div>

            {/* Collapsible Stack Trace */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => this.setState({ isDetailsExpanded: !isDetailsExpanded })}
                className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Technical Diagnostic Details
                </span>
                {isDetailsExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {isDetailsExpanded && (
                <div className="mt-3 space-y-3">
                  {error?.stack && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Stack Trace</div>
                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto max-h-48 whitespace-pre-wrap select-all">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {errorInfo?.componentStack && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Component Stack</div>
                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono overflow-x-auto max-h-36 whitespace-pre-wrap select-all">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
