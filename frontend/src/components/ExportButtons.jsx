import React, { useState } from 'react';
import { FileJson, FileText, Loader2 } from 'lucide-react';
import { generateProfessionalPDF } from '../utils/pdfGenerator';

const ExportButtons = ({ data, reportRef }) => {
  const [exportingJSON, setExportingJSON] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const exportJSON = async () => {
    if (!data) return;
    setExportingJSON(true);
    
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cloudmorph-report-${data.app_name || 'app'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('JSON Export Failed:', err);
    } finally {
      setTimeout(() => setExportingJSON(false), 1000);
    }
  };

  const exportPDF = async () => {
    if (!data) return;
    setExportingPDF(true);

    try {
      // Small delay for UX feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Call direct jsPDF professional generator
      generateProfessionalPDF(data);
    } catch (err) {
      console.error('Professional PDF Export Failed:', err);
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={exportJSON}
        disabled={exportingJSON || !data}
        className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-accent-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-purple-500/5"
      >
        {exportingJSON ? (
          <Loader2 className="w-4 h-4 animate-spin text-accent-purple" />
        ) : (
          <FileJson className="w-4 h-4 text-accent-purple group-hover:scale-110 transition-transform" />
        )}
        <span className="text-slate-700 dark:text-white/80">{exportingJSON ? 'Exporting...' : 'Export JSON'}</span>
      </button>

      <button 
        onClick={exportPDF}
        disabled={exportingPDF || !data}
        className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:border-accent-cyan/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-cyan-500/5"
      >
        {exportingPDF ? (
          <Loader2 className="w-4 h-4 animate-spin text-accent-cyan" />
        ) : (
          <FileText className="w-4 h-4 text-accent-cyan group-hover:scale-110 transition-transform" />
        )}
        <span className="text-slate-700 dark:text-white/80">{exportingPDF ? 'Generating PDF...' : 'Export PDF'}</span>
      </button>
    </div>
  );
};

export default ExportButtons;
