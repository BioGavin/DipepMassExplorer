import { AminoAcid } from '../types';

export const MASS_H2O = 18.010565;

// Monoisotopic masses of the *free* amino acids (not residues)
// Source: IUPAC & standard mass spec databases
export const AMINO_ACIDS: AminoAcid[] = [
  { name: 'Glycine', threeLetter: 'Gly', oneLetter: 'G', formula: 'C2H5NO2', monoisotopicMass: 75.032028, polarity: 'Nonpolar' },
  { name: 'Alanine', threeLetter: 'Ala', oneLetter: 'A', formula: 'C3H7NO2', monoisotopicMass: 89.047678, polarity: 'Nonpolar' },
  { name: 'Serine', threeLetter: 'Ser', oneLetter: 'S', formula: 'C3H7NO3', monoisotopicMass: 105.042593, polarity: 'Polar' },
  { name: 'Proline', threeLetter: 'Pro', oneLetter: 'P', formula: 'C5H9NO2', monoisotopicMass: 115.063329, polarity: 'Nonpolar' },
  { name: 'Valine', threeLetter: 'Val', oneLetter: 'V', formula: 'C5H11NO2', monoisotopicMass: 117.078979, polarity: 'Nonpolar' },
  { name: 'Threonine', threeLetter: 'Thr', oneLetter: 'T', formula: 'C4H9NO3', monoisotopicMass: 119.058243, polarity: 'Polar' },
  { name: 'Cysteine', threeLetter: 'Cys', oneLetter: 'C', formula: 'C3H7NO2S', monoisotopicMass: 121.019749, polarity: 'Polar' },
  { name: 'Isoleucine', threeLetter: 'Ile', oneLetter: 'I', formula: 'C6H13NO2', monoisotopicMass: 131.094629, polarity: 'Nonpolar' },
  { name: 'Leucine', threeLetter: 'Leu', oneLetter: 'L', formula: 'C6H13NO2', monoisotopicMass: 131.094629, polarity: 'Nonpolar' },
  { name: 'Asparagine', threeLetter: 'Asn', oneLetter: 'N', formula: 'C4H8N2O3', monoisotopicMass: 132.053493, polarity: 'Polar' },
  { name: 'Aspartic Acid', threeLetter: 'Asp', oneLetter: 'D', formula: 'C4H7NO4', monoisotopicMass: 133.037508, polarity: 'Acidic' },
  { name: 'Glutamine', threeLetter: 'Gln', oneLetter: 'Q', formula: 'C5H10N2O3', monoisotopicMass: 146.069142, polarity: 'Polar' },
  { name: 'Lysine', threeLetter: 'Lys', oneLetter: 'K', formula: 'C6H14N2O2', monoisotopicMass: 146.105528, polarity: 'Basic' },
  { name: 'Glutamic Acid', threeLetter: 'Glu', oneLetter: 'E', formula: 'C5H9NO4', monoisotopicMass: 147.053158, polarity: 'Acidic' },
  { name: 'Methionine', threeLetter: 'Met', oneLetter: 'M', formula: 'C5H11NO2S', monoisotopicMass: 149.051049, polarity: 'Nonpolar' },
  { name: 'Histidine', threeLetter: 'His', oneLetter: 'H', formula: 'C6H9N3O2', monoisotopicMass: 155.069477, polarity: 'Basic' },
  { name: 'Phenylalanine', threeLetter: 'Phe', oneLetter: 'F', formula: 'C9H11NO2', monoisotopicMass: 165.078979, polarity: 'Nonpolar' },
  { name: 'Arginine', threeLetter: 'Arg', oneLetter: 'R', formula: 'C6H14N4O2', monoisotopicMass: 174.111676, polarity: 'Basic' },
  { name: 'Tyrosine', threeLetter: 'Tyr', oneLetter: 'Y', formula: 'C9H11NO3', monoisotopicMass: 181.073893, polarity: 'Polar' },
  { name: 'Tryptophan', threeLetter: 'Trp', oneLetter: 'W', formula: 'C11H12N2O2', monoisotopicMass: 204.089878, polarity: 'Nonpolar' },
];

export const AA_ORDER = AMINO_ACIDS.map(a => a.threeLetter);
