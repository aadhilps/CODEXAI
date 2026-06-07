import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Mermaid from './Mermaid';

function App() {
  const [codePayload, setCodePayload] = useState('');
  const [gitLog, setGitLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_payload: codePayload, git_log: gitLog }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze project');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    const markdownContent = `
# ${result.project_name}
> ${result.one_liner}

## System Architecture Flow
\`\`\`mermaid
${result.mermaid_diagram_code}
\`\`\`

## Technical Overview
${result.system_architecture_markdown}

## Strategic Trade-Offs
${result.key_tradeoffs.map(t => `**${t.decision}**\n- ✓ Pro: ${t.pros.join(' ')}\n- ✗ Con: ${t.cons.join(' ')}`).join('\n\n')}
    `.trim();

    // Bulletproof native clipboard fallback
    const textArea = document.createElement("textarea");
    textArea.value = markdownContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Browser security blocked copying. Try using Chrome or Edge!");
    }
    document.body.removeChild(textArea);
  };

  const handleDownloadPDF = () => {
    // Triggers the native browser print dialog for perfect vector PDFs
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 md:p-8 font-sans selection:bg-blue-100 print:bg-white print:p-0">
      
      {/* HEADER: Hidden during PDF print */}
      <header className="max-w-7xl mx-auto mb-10 text-center md:text-left print:hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          codexAI <span className="text-blue-600">Engine</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">Turn messy code into production-grade architecture docs.</p>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 print:block print:w-full">
        
        {/* LEFT COLUMN: Inputs - Hidden during PDF print */}
        <div className="w-full lg:w-1/3 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-fit sticky top-8 print:hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
            <h2 className="text-xl font-bold text-slate-800">Input Assets</h2>
          </div>
          
          <label className="block text-sm font-semibold text-slate-700 mb-2">Raw Source Code Files</label>
          <textarea 
            className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 font-mono text-xs focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
            placeholder="--- app.py ---&#10;[paste code here]&#10;&#10;--- App.jsx ---&#10;[paste code here]"
            value={codePayload}
            onChange={(e) => setCodePayload(e.target.value)}
          />

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Brief Description of Project <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea 
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-8 font-sans text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
            placeholder="Briefly describe what this project does, its main features, or what you built..."
            value={gitLog}
            onChange={(e) => setGitLog(e.target.value)}
          />

          <button 
            onClick={handleAnalyze}
            disabled={loading || !codePayload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing...
              </span>
            ) : 'Generate Proof of Work'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Outputs */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 print:w-full">
          
          {/* EXPORT BUTTONS: Hidden during PDF print */}
          {result && (
            <div className="flex justify-end gap-3 mb-2 animate-fade-in print:hidden">
              <button onClick={handleCopyMarkdown} className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm">
                {copied ? '✅ Copied!' : '📋 Copy Markdown'}
              </button>
              <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-slate-900/20 text-sm">
                📄 Download PDF
              </button>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 text-slate-400 font-medium print:hidden">
              <div className="w-16 h-16 mb-4 bg-slate-100 rounded-2xl flex items-center justify-center rotate-3 text-2xl">⚡</div>
              <p>Awaiting code payload...</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[500px] flex items-center justify-center rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 print:hidden">
              <div className="flex flex-col items-center gap-4 text-blue-600 font-semibold">
                <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                Mapping architecture...
              </div>
            </div>
          )}

          {/* RESULTS WRAPPER: This is what prints! */}
          {result && (
            <div id="export-content" className="space-y-6 animate-fade-in pb-10 print:pb-0">
              
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden print:shadow-none print:border-none print:p-0">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 print:hidden"></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{result.project_name}</h2>
                <p className="text-lg text-slate-500 mt-3 font-medium leading-relaxed">{result.one_liner}</p>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 print:shadow-none print:border-none print:p-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 print:hidden"></span> System Architecture Flow</h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 print:bg-white print:border-none">
                  <Mermaid chart={result.mermaid_diagram_code} />
                </div>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 print:shadow-none print:border-none print:p-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 print:hidden"></span> Technical Overview</h3>
                <div className="prose prose-slate prose-headings:font-bold prose-a:text-blue-600 max-w-none text-slate-700 leading-relaxed print:text-black">
                  <ReactMarkdown>{result.system_architecture_markdown}</ReactMarkdown>
                </div>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 page-break-inside-avoid print:shadow-none print:border-none print:p-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 print:hidden"></span> Strategic Trade-Offs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:grid-cols-1 print:gap-4">
                  {result.key_tradeoffs.map((tradeoff, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:shadow-md hover:border-blue-100 group print:bg-white print:border-b print:rounded-none print:p-4">
                      <p className="font-bold text-slate-900 mb-4 text-lg">{tradeoff.decision}</p>
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-3 items-start bg-white p-3 rounded-xl shadow-sm print:shadow-none print:p-0 print:bg-transparent">
                          <span className="text-green-500 font-bold mt-0.5 bg-green-50 w-6 h-6 flex items-center justify-center rounded-full shrink-0 print:bg-transparent">✓</span>
                          <span className="text-slate-600 leading-relaxed"><strong className="text-slate-800">Pro:</strong> {tradeoff.pros.join(' ')}</span>
                        </div>
                        <div className="flex gap-3 items-start bg-white p-3 rounded-xl shadow-sm print:shadow-none print:p-0 print:bg-transparent">
                          <span className="text-red-500 font-bold mt-0.5 bg-red-50 w-6 h-6 flex items-center justify-center rounded-full shrink-0 print:bg-transparent">✗</span>
                          <span className="text-slate-600 leading-relaxed"><strong className="text-slate-800">Con:</strong> {tradeoff.cons.join(' ')}</span>
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