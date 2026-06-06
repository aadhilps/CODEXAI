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
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-blue-600">ProofOfWork Engine</h1>
        <p className="text-gray-500 mt-2">Turn messy code into production-grade architecture docs.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Inputs */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Input Messy Assets</h2>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Raw Source Code Files</label>
          <textarea 
            className="w-full h-64 p-3 border border-gray-300 rounded mb-4 font-mono text-sm"
            placeholder="Paste your app.py, package.json, etc. here..."
            value={codePayload}
            onChange={(e) => setCodePayload(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Raw Git Log (Optional)</label>
          <textarea 
            className="w-full h-32 p-3 border border-gray-300 rounded mb-6 font-mono text-sm"
            placeholder="Paste output of `git log`..."
            value={gitLog}
            onChange={(e) => setGitLog(e.target.value)}
          />

          <button 
            onClick={handleAnalyze}
            disabled={loading || !codePayload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Analyzing Architecture...' : 'Generate Proof of Work'}
          </button>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>

        {/* RIGHT COLUMN: Outputs */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
          {!result && !loading && (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Awaiting payload...
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center text-blue-500 font-semibold animate-pulse">
              Parsing architecture and extracting trade-offs...
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{result.project_name}</h2>
                <p className="text-lg text-blue-600 mt-1">{result.one_liner}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">System Architecture</h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{result.system_architecture_markdown}</ReactMarkdown>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">System Architecture Visualization</h3>
                  <Mermaid chart={result.mermaid_diagram_code} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Key Trade-Offs</h3>
                <div className="grid gap-4">
                  {result.key_tradeoffs.map((tradeoff, idx) => (
                    <div key={idx} className="p-4 border border-blue-100 bg-blue-50/50 rounded">
                      <p className="font-semibold text-gray-800">Decision: {tradeoff.decision}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-bold text-green-600">Pros:</span> {tradeoff.pros.join(', ')} <br/>
                        <span className="font-bold text-red-500">Cons:</span> {tradeoff.cons.join(', ')}
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