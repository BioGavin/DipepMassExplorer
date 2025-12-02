import React, { useState, useEffect } from 'react';
import { X, Beaker, Bot, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DipeptideData, PeptideType, GeminiAnalysisState } from '../types';
import { streamDipeptideAnalysis } from '../services/geminiService';

interface InfoPanelProps {
  data: DipeptideData | null;
  type: PeptideType;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, type, onClose }) => {
  const [analysis, setAnalysis] = useState<GeminiAnalysisState>({
    loading: false,
    content: '',
    error: null,
  });

  // Reset analysis when data changes
  useEffect(() => {
    setAnalysis({ loading: false, content: '', error: null });
  }, [data, type]);

  if (!data) return null;

  const currentMass = type === 'linear' ? data.linearMass : data.cyclicMass;
  const peptideName = type === 'linear' 
    ? `${data.aa1.threeLetter}-${data.aa2.threeLetter}` 
    : `cyclo(${data.aa1.threeLetter}-${data.aa2.threeLetter})`;

  const handleAnalyze = async () => {
    setAnalysis({ loading: true, content: '', error: null });
    await streamDipeptideAnalysis(data, type, (text) => {
      setAnalysis(prev => ({
        ...prev,
        content: prev.content + text
      }));
    });
    setAnalysis(prev => ({ ...prev, loading: false }));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-science-50">
        <h2 className="text-xl font-bold text-science-900 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-science-600" />
          Detail View
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Basic Properties Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-science-100 text-science-700 uppercase tracking-wide">
              {type === 'linear' ? 'Linear Peptide' : 'Cyclic Dipeptide (DKP)'}
            </span>
            <h1 className="text-3xl font-bold mt-2 text-gray-900">{peptideName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {data.aa1.name} — {data.aa2.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase">Monoisotopic Mass</p>
              <p className="text-xl font-mono font-bold text-science-700">
                {currentMass.toFixed(5)} <span className="text-xs text-gray-400">Da</span>
              </p>
            </div>
             <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase">Chemical Formula</p>
              <p className="text-md font-mono font-medium text-gray-700 pt-1">
                 {/* Simplified formula logic would be needed for exact atomic count, using approximation or just description here */}
                 Complex
              </p>
            </div>
          </div>
        </div>

        {/* Composition */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Composition</h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">N</div>
                    <div>
                        <p className="font-medium text-gray-900">{data.aa1.name}</p>
                        <p className="text-xs text-gray-500">{data.aa1.formula} | {data.aa1.monoisotopicMass.toFixed(3)}</p>
                    </div>
                </div>
                <span className="text-xs font-mono text-gray-400">N-Term</span>
             </div>
             <div className="flex items-center justify-center text-gray-300">
                <div className="h-4 w-0.5 bg-gray-300"></div>
             </div>
             <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">C</div>
                    <div>
                        <p className="font-medium text-gray-900">{data.aa2.name}</p>
                        <p className="text-xs text-gray-500">{data.aa2.formula} | {data.aa2.monoisotopicMass.toFixed(3)}</p>
                    </div>
                </div>
                <span className="text-xs font-mono text-gray-400">C-Term</span>
             </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              AI Analysis
            </h3>
          </div>

          {!analysis.content && !analysis.loading && (
            <button 
              onClick={handleAnalyze}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2 text-sm"
            >
              <Bot className="w-5 h-5" />
              Analyze {peptideName} with Gemini
            </button>
          )}

          {(analysis.loading || analysis.content) && (
             <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 text-sm leading-relaxed text-gray-800">
                {analysis.content ? (
                  <ReactMarkdown 
                    className="prose prose-sm prose-purple max-w-none"
                    components={{
                       h1: ({node, ...props}) => <p className="font-bold text-base mb-2" {...props} />,
                       h2: ({node, ...props}) => <p className="font-bold text-base mb-2" {...props} />,
                       h3: ({node, ...props}) => <p className="font-bold text-sm mb-1" {...props} />,
                       p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                       ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                    }}
                  >
                    {analysis.content}
                  </ReactMarkdown>
                ) : (
                  <div className="flex items-center justify-center py-4 text-purple-600 gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    Generating insight...
                  </div>
                )}
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InfoPanel;
