import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';


// Configure the visual theme of the diagrams
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral', // 'neutral' looks very clean and professional
  securityLevel: 'loose',
});

function Mermaid({ chart }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chart && chartRef.current) {
      // Tell mermaid to render the text into a visual SVG
      mermaid.render('mermaid-chart-svg', chart).then((result) => {
        chartRef.current.innerHTML = result.svg;
      }).catch((error) => {
        console.error("Mermaid rendering error:", error);
        chartRef.current.innerHTML = "<p class='text-red-500'>Error rendering diagram. Please try regenerating.</p>";
      });
    }
  }, [chart]);

  return <div ref={chartRef} className="flex justify-center w-full overflow-x-auto p-4 bg-white border border-gray-200 rounded-lg shadow-inner" />;
}

export default Mermaid;