import React, { useMemo } from 'react';
import { DipeptideData, PeptideType, AminoAcid } from '../types';
import { AMINO_ACIDS, MASS_H2O } from '../data/constants';

interface MassMatrixProps {
  type: PeptideType;
  selectedId: string | null;
  onSelect: (data: DipeptideData) => void;
  searchTerm: string;
}

const MassMatrix: React.FC<MassMatrixProps> = ({ type, selectedId, onSelect, searchTerm }) => {
  
  // Calculate grid data once
  const gridData = useMemo(() => {
    const matrix: DipeptideData[][] = [];
    
    for (let r = 0; r < AMINO_ACIDS.length; r++) {
      const row: DipeptideData[] = [];
      const aa1 = AMINO_ACIDS[r];
      
      for (let c = 0; c < AMINO_ACIDS.length; c++) {
        const aa2 = AMINO_ACIDS[c];
        
        // Calculation Logic
        // Linear: Mass(A) + Mass(B) - H2O
        // Cyclic: Mass(A) + Mass(B) - 2*H2O
        const sumMass = aa1.monoisotopicMass + aa2.monoisotopicMass;
        const linear = sumMass - MASS_H2O;
        const cyclic = sumMass - (2 * MASS_H2O);
        
        row.push({
          aa1,
          aa2,
          linearMass: linear,
          cyclicMass: cyclic,
          linearFormula: '', // Omitted for brevity
          id: `${aa1.threeLetter}-${aa2.threeLetter}`
        });
      }
      matrix.push(row);
    }
    return matrix;
  }, []);

  // Optimized Filter Logic
  const isMatch = (data: DipeptideData) => {
    if (!searchTerm) return false;
    const term = searchTerm.toLowerCase().trim();
    
    // 1. Text Search (Names, Codes) - Global search regardless of type
    const textMatch = 
      data.aa1.name.toLowerCase().includes(term) || 
      data.aa2.name.toLowerCase().includes(term) ||
      data.aa1.threeLetter.toLowerCase().includes(term) ||
      data.aa2.threeLetter.toLowerCase().includes(term) ||
      data.aa1.oneLetter.toLowerCase() === term ||
      data.aa2.oneLetter.toLowerCase() === term;

    if (textMatch) return true;

    // 2. Numeric/Mass Search
    // ONLY search the mass type currently being displayed (linear vs cyclic)
    const activeMass = type === 'linear' ? data.linearMass : data.cyclicMass;
    
    // Check if the term is a number
    const searchNum = parseFloat(term);
    const isNumericSearch = !isNaN(searchNum);

    if (isNumericSearch) {
      // A. Smart Range Match (+/- 0.05 Da)
      // Allows searching "188.1" to find "188.12"
      if (Math.abs(activeMass - searchNum) <= 0.05) {
        return true;
      }

      // B. Prefix Match Only
      // Converts mass to string (e.g. "203.1270") and checks if it STARTS with the term.
      // This allows: searching "203" -> finds "203.1270"
      // This prevents: searching "270" -> finding "203.1270" (Fix for the bug)
      const massStr = activeMass.toFixed(4);
      if (massStr.startsWith(term)) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="sticky left-0 z-20 bg-gray-50 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">
                <div className="flex flex-col items-center justify-center h-full">
                  <span>N-Term</span>
                  <span className="text-[10px] text-gray-400 rotate-90 my-1 transform">vs</span>
                  <span>C-Term</span>
                </div>
              </th>
              {AMINO_ACIDS.map((aa) => (
                <th key={aa.threeLetter} scope="col" className="p-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{aa.oneLetter}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{aa.threeLetter}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gridData.map((row, rowIndex) => (
              <tr key={AMINO_ACIDS[rowIndex].threeLetter}>
                <th scope="row" className="sticky left-0 z-10 bg-gray-50 p-2 text-center text-sm font-bold text-gray-700 whitespace-nowrap border-r border-gray-200">
                   <div className="flex flex-col items-center">
                    <span className="text-lg">{AMINO_ACIDS[rowIndex].oneLetter}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{AMINO_ACIDS[rowIndex].threeLetter}</span>
                  </div>
                </th>
                {row.map((cell) => {
                  const mass = type === 'linear' ? cell.linearMass : cell.cyclicMass;
                  const active = selectedId === cell.id;
                  const matched = searchTerm && isMatch(cell);
                  const dimmed = searchTerm && !matched;

                  return (
                    <td 
                      key={cell.id} 
                      onClick={() => onSelect(cell)}
                      className={`
                        p-2 text-center text-xs cursor-pointer transition-all duration-150 border-r border-b border-gray-100 last:border-r-0
                        ${active ? 'bg-science-600 text-white shadow-inner scale-105 font-bold z-0' : 'hover:bg-science-50 text-gray-600'}
                        ${dimmed ? 'opacity-30' : 'opacity-100'}
                        ${matched && !active ? 'bg-yellow-100 ring-2 ring-yellow-400 font-medium text-yellow-900' : ''}
                      `}
                    >
                      {mass.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MassMatrix;