export interface AminoAcid {
  name: string;
  threeLetter: string;
  oneLetter: string;
  formula: string;
  monoisotopicMass: number; // The mass of the isolated amino acid molecule
  polarity: 'Nonpolar' | 'Polar' | 'Basic' | 'Acidic';
}

export interface DipeptideData {
  aa1: AminoAcid;
  aa2: AminoAcid;
  linearMass: number;
  cyclicMass: number;
  linearFormula: string; // Simplified representation
  id: string; // Unique key e.g., "Ala-Gly"
}

export type PeptideType = 'linear' | 'cyclic';

export interface GeminiAnalysisState {
  loading: boolean;
  content: string;
  error: string | null;
}
