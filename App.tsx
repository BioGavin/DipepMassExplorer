import React, { useState } from 'react';
import { Atom, Search, Activity, HelpCircle } from 'lucide-react';
import MassMatrix from './components/MassMatrix';
import InfoPanel from './components/InfoPanel';
import { DipeptideData, PeptideType } from './types';

function App() {
  const [peptideType, setPeptideType] = useState<PeptideType>('linear');
  const [selectedPeptide, setSelectedPeptide] = useState<DipeptideData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-science-600 p-2 rounded-lg">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Dipeptide Mass Explorer</h1>
              <p className="text-xs text-slate-500">Precision Mass Spectrometry Reference</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-science-600 transition-colors">Documentation</a>
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-science-600 transition-colors">About</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          
          {/* Toggles */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setPeptideType('linear')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                peptideType === 'linear' 
                  ? 'bg-white text-science-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Linear Dipeptides
            </button>
            <button
              onClick={() => setPeptideType('cyclic')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                peptideType === 'cyclic' 
                  ? 'bg-white text-science-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cyclic (DKP)
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-science-500 focus:border-science-500 sm:text-sm transition-colors"
              placeholder="Search (e.g. 'Ala', 'A', '188.12')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Info Banner for Mobile/General */}
        <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
           <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
           <div>
             <p className="font-semibold">Calculation Basis:</p>
             <p className="opacity-90 mt-1">
               {peptideType === 'linear' 
                 ? "Linear Mass = Mass(AA1) + Mass(AA2) - Mass(H2O). Standard peptide bond formation." 
                 : "Cyclic Mass = Mass(AA1) + Mass(AA2) - 2 × Mass(H2O). Diketopiperazine ring formation."}
             </p>
             <p className="text-xs text-blue-600 mt-2 opacity-75">
               Using Monoisotopic Masses: H (1.0078), C (12.0000), N (14.0031), O (15.9949), S (31.9721).
             </p>
           </div>
        </div>

        {/* The Matrix */}
        <div className="relative">
          <MassMatrix 
            type={peptideType}
            selectedId={selectedPeptide?.id || null}
            onSelect={setSelectedPeptide}
            searchTerm={searchTerm}
          />
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Masses shown in Daltons (Da). Matrix displays theoretical monoisotopic masses.</p>
        </div>

      </main>

      {/* Slide-over Panel */}
      <InfoPanel 
        data={selectedPeptide} 
        type={peptideType} 
        onClose={() => setSelectedPeptide(null)} 
      />
    </div>
  );
}

export default App;