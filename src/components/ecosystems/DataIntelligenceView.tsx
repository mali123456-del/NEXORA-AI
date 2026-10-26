import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Upload,
  Play,
  Sparkles,
  Loader2,
  Table,
  CheckCircle,
} from 'lucide-react';
import { sendChatMessage } from '../../services/api';

export const DataIntelligenceView: React.FC = () => {
  const [csvRaw, setCsvRaw] = useState(
    `timestamp,region,api_calls,p99_latency_ms,error_rate_pct
2026-10-21,us-east-1,142000,42,0.02
2026-10-22,us-west-2,198000,58,0.04
2026-10-23,eu-central-1,89000,38,0.01
2026-10-24,ap-southeast-1,115000,82,0.08
2026-10-25,sa-east-1,64000,94,0.12`
  );

  const [parsedData, setParsedData] = useState<{ headers: string[]; rows: string[][] }>({
    headers: ['timestamp', 'region', 'api_calls', 'p99_latency_ms', 'error_rate_pct'],
    rows: [
      ['2026-10-21', 'us-east-1', '142000', '42', '0.02'],
      ['2026-10-22', 'us-west-2', '198000', '58', '0.04'],
      ['2026-10-23', 'eu-central-1', '89000', '38', '0.01'],
      ['2026-10-24', 'ap-southeast-1', '115000', '82', '0.08'],
      ['2026-10-25', 'sa-east-1', '64000', '94', '0.12'],
    ],
  });

  const [nlQuery, setNlQuery] = useState('Identify latency bottlenecks and recommend edge routing adjustments.');
  const [queryAnswer, setQueryAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleParseCsv = (text: string) => {
    setCsvRaw(text);
    const lines = text.trim().split('\n');
    if (lines.length > 0) {
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim()));
      setParsedData({ headers, rows });
    }
  };

  const handleRunNlQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const prompt = `You are a Principal Data Scientist and Cloud Telemetry Architect. Given the following tabular dataset:
\`\`\`csv
${csvRaw}
\`\`\`
Analyze and answer this query: "${nlQuery}". Provide quantitative findings, outlier detection, and concrete architectural recommendations.`;

      const res = await sendChatMessage({
        prompt,
        model: 'gemini-4-argon',
        enableThinking: true,
        feature: 'Data Intelligence',
      });
      setQueryAnswer(res.text);
    } catch (err: any) {
      setQueryAnswer(`Query error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute real metrics from columns
  const numericColIndex = parsedData.headers.findIndex(h => h.includes('latency') || h.includes('calls'));
  const values = parsedData.rows.map(r => parseFloat(r[numericColIndex]) || 0);
  const maxVal = Math.max(...values, 1);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono">AI DATA INTELLIGENCE & ANALYTICS</h2>
            <p className="text-xs text-slate-400">
              CSV/JSON dataset ingestion, natural language data queries, and automated anomaly detection
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800">
            {parsedData.rows.length} ROWS INGESTED
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Raw Data Input & Interactive Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center space-x-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Dataset Ingestion (CSV / Structured Records)</span>
              </span>
              <button
                onClick={() =>
                  handleParseCsv(
                    `timestamp,service,cpu_load_pct,mem_gb,req_sec\n2026-10-25T08:00,auth-service,24,1.8,420\n2026-10-25T09:00,auth-service,48,2.4,890\n2026-10-25T10:00,auth-service,92,3.8,2100\n2026-10-25T11:00,auth-service,65,2.9,1340`
                  )
                }
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
              >
                Load Cloud Telemetry Sample
              </button>
            </div>

            <textarea
              value={csvRaw}
              onChange={e => handleParseCsv(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />

            {/* Rendered Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <tr>
                    {parsedData.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {parsedData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-1.5">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Real SVG Chart Connected to Actual Ingested Data */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400">
                Visual Trend Distribution ({parsedData.headers[numericColIndex] || 'Metric'}):
              </div>
              <div className="space-y-1.5">
                {parsedData.rows.map((row, idx) => {
                  const val = parseFloat(row[numericColIndex]) || 0;
                  const pct = Math.min(100, Math.round((val / maxVal) * 100));
                  return (
                    <div key={idx} className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="w-24 truncate text-slate-400">{row[0] || `Row ${idx + 1}`}</span>
                      <div className="flex-1 bg-slate-900 h-4 rounded-md overflow-hidden p-0.5">
                        <div
                          className="bg-emerald-500 h-full rounded transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-emerald-300 font-bold">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Natural Language Data Querying */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white uppercase">Natural Language Query Engine</span>
          </div>

          <form onSubmit={handleRunNlQuery} className="space-y-2.5">
            <textarea
              value={nlQuery}
              onChange={e => setNlQuery(e.target.value)}
              rows={3}
              placeholder="Ask anything about the ingested data: 'What is the correlation between latency and error rate?' or 'Find outlier spikes'..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !nlQuery.trim()}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Quantitative Synthesis...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Natural Language Query</span>
                </>
              )}
            </button>
          </form>

          {/* Answer Display */}
          <div className="flex-1 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed overflow-y-auto min-h-[220px]">
            {queryAnswer ? (
              <div className="whitespace-pre-wrap font-sans">{queryAnswer}</div>
            ) : (
              <div className="text-slate-500 font-mono text-[11px] text-center pt-14">
                Execute a query above to see automated statistical correlations and actionable conclusions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
