import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral', 
  securityLevel: 'loose',
});

function Mermaid({ chart }) {
  const chartRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [cleanText, setCleanText] = useState("");

  useEffect(() => {
    if (chart && chartRef.current) {
      setHasError(false); // Reset error state on new generation

      // Clean markdown fences and force it to start exactly at 'graph'
      let cleaned = chart.replace(/```mermaid/gi, '').replace(/```/gi, '').trim();
      const graphIndex = cleaned.indexOf('graph');
      if(graphIndex !== -1) {
          cleaned = cleaned.substring(graphIndex);
      }
      setCleanText(cleaned);

      const uniqueId = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`;

      mermaid.render(uniqueId, cleaned).then((result) => {
        chartRef.current.innerHTML = result.svg;
      }).catch((error) => {
        console.error("Mermaid syntax error handled gracefully:", error);
        setHasError(true); // Trigger the fallback UI
      });
    }
  }, [chart]);

  // The Fallback UI if Mermaid crashes
  if (hasError) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg shadow-inner">
        <p className="text-red-700 font-bold mb-2">
          ⚠️ Diagram engine encountered complex syntax. Displaying raw architecture flow:
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
          {cleanText || chart}
        </pre>
      </div>
    );
  }

  // The Standard Visual UI
  return <div ref={chartRef} className="flex justify-center w-full overflow-x-auto p-4 bg-white border border-gray-200 rounded-lg shadow-inner" />;
}

export default Mermaid;