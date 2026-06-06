import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Mermaid from './Mermaid';

function App() {
  const [codePayload, setCodePayload] = useState('');
  const [gitLog, setGitLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code_payload: codePayload,
          git_log: gitLog,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze project');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">ProofOfWork <span className="text-blue-600">Engine</span></h1>
        <p className="text-slate-500 mt-2 font-medium">Turn messy code into production-grade architecture docs.</p>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Inputs (Fixed Width) */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Input Messy Assets</h2>
          
          <label className="block text-sm font-semibold text-slate-600 mb-1">Raw Source Code Files</label>
          <textarea 
            className="w-full h-64 p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="--- app.py ---&#10;[paste code here]&#10;&#10;--- App.jsx ---&#10;[paste code here]"
            value={codePayload}
            onChange={(e) => setCodePayload(e.target.value)}
          />

          <label className="block text-sm font-semibold text-slate-600 mb-1">Raw Git Log (Optional)</label>
          <textarea 
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg mb-6 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Paste output of `git log`..."
            value={gitLog}
            onChange={(e) => setGitLog(e.target.value)}
          />

          <button 
            onClick={handleAnalyze}
            disabled={loading || !codePayload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing Architecture...' : 'Generate Proof of Work'}
          </button>

          {error && <p className="text-red-500 mt-4 text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</p>}
        </div>

        {/* RIGHT COLUMN: Outputs (Card Layout) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Empty / Loading States */}
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-slate-400 font-medium">
              Awaiting code payload...
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-slate-200 rounded-2xl bg-white shadow-sm">
              <div className="flex flex-col items-center gap-3 animate-pulse text-blue-600 font-semibold">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Parsing architecture and extracting trade-offs...
              </div>
            </div>
          )}

          {/* Results Render */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Card */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-3xl font-extrabold text-slate-900">{result.project_name}</h2>
                <p className="text-lg text-blue-600 mt-2 font-medium">{result.one_liner}</p>
              </div>

              {/* Diagram Card */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">System Architecture Flow</h3>
                <Mermaid chart={result.mermaid_diagram_code} />
              </div>

              {/* Text Description Card */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Technical Overview</h3>
                <div className="prose prose-slate max-w-none text-sm md:text-base text-slate-700 leading-relaxed">
                  <ReactMarkdown>{result.system_architecture_markdown}</ReactMarkdown>
                </div>
              </div>

              {/* Compact Trade-offs Grid */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Strategic Trade-Offs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.key_tradeoffs.map((tradeoff, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                      <p className="font-bold text-slate-800 mb-3">{tradeoff.decision}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2 items-start">
                          <span className="text-green-500 font-bold mt-0.5">✓</span>
                          <span className="text-slate-600"><strong className="text-slate-700">Pro:</strong> {tradeoff.pros.join(' ')}</span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <span className="text-red-500 font-bold mt-0.5">✗</span>
                          <span className="text-slate-600"><strong className="text-slate-700">Con:</strong> {tradeoff.cons.join(' ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;