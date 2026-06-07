const handleCopyMarkdown = async () => {
    if (!result) return;
    try {
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

      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard Error:", err);
      alert("Browser blocked clipboard access. Make sure you are on http://localhost!");
    }
  };

  const handleDownloadPDF = () => {
    try {
      const element = document.getElementById('export-content');
      if (!element) {
        alert("Error: Could not find the content to export.");
        return;
      }
      
      const opt = {
        margin:       0.5,
        filename:     `${result.project_name.replace(/\s+/g, '_')}_Architecture.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Engine Error:", err);
      alert("PDF generation failed. Press F12 to check the developer console for the exact error.");
    }
  };