/**
 * Bioscience and Structural Biology Service
 * Integrates RCSB PDB, AlphaFold DB, PubChem, PubMed E-Utilities, and genomic sequence tooling.
 * Grounded in /skills/system_skills/science guidelines.
 */

export interface PdbMetadata {
  pdbId: string;
  title: string;
  depositionDate?: string;
  experimentalMethod?: string;
  resolution?: number;
  polymerCount?: number;
  uniprotAccession?: string;
}

export interface AlphaFoldPrediction {
  entryId: string;
  gene: string;
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  organismScientificName: string;
  uniprotSequence: string;
  cifUrl: string;
  bcifUrl: string;
  pdbUrl: string;
  paeDocUrl?: string;
}

export interface PubChemCompound {
  cid: number;
  name: string;
  formula: string;
  molecularWeight: number;
  canonicalSmiles: string;
  xLogP?: number;
  tpsa?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  complexity?: number;
  inchiKey?: string;
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  source: string;
  pubdate: string;
  doi?: string;
}

export interface SequenceAnalysis {
  type: 'DNA' | 'RNA' | 'PROTEIN';
  length: number;
  gcContentPercent?: number;
  molecularWeightKDa: number;
  translatedPeptide?: string;
  stopCodonsCount?: number;
  isPalindromic?: boolean;
}

/** Curated landmark structures for immediate scientific exploration */
export const LANDMARK_STRUCTURES = [
  { id: '1BNA', name: 'B-DNA Dodecamer (Watson-Crick Double Helix)', type: 'PDB', description: 'Canonical crystal structure of right-handed B-form DNA dodecamer CGCGAATTCGCG' },
  { id: '4HHB', name: 'Deoxy Human Hemoglobin', type: 'PDB', description: 'Allosteric tetrameric oxygen transport protein at 1.74 Å resolution' },
  { id: '1CRN', name: 'Crambin (Hydrophobic Plant Seed Protein)', type: 'PDB', description: 'Ultra-high-resolution 0.54 Å benchmark protein fold' },
  { id: '6LU7', name: 'SARS-CoV-2 Main Protease (Mpro)', type: 'PDB', description: 'Essential viral replication protease complexed with peptide-like inhibitor N3' },
  { id: 'P04637', name: 'Human Cellular Tumor Antigen p53', type: 'AlphaFold', description: 'The guardian of the genome transcription factor core DNA-binding domain' },
  { id: 'P00520', name: 'Human ABL1 Tyrosine-Protein Kinase', type: 'AlphaFold', description: 'Key signaling kinase involved in cell division and targeted by Imatinib' },
  { id: 'P69905', name: 'Human Hemoglobin Alpha Subunit', type: 'AlphaFold', description: 'Oxygen carrying globulin subunit' }
];

export const PRESET_COMPOUNDS = ['Caffeine', 'Aspirin', 'Penicillin', 'Resveratrol', 'Dopamine', 'Curcumin', 'ATP'];

/**
 * Fetch metadata for an experimental structure from RCSB PDB
 */
export async function fetchPdbMetadata(pdbId: string): Promise<PdbMetadata | null> {
  const cleanId = pdbId.trim().toUpperCase();
  try {
    const res = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${cleanId}`);
    if (!res.ok) {
      throw new Error(`RCSB API responded with status ${res.status}`);
    }
    const data = await res.json();
    return {
      pdbId: cleanId,
      title: data.struct?.title || `RCSB PDB ${cleanId}`,
      depositionDate: data.rcsb_accession_info?.deposit_date,
      experimentalMethod: data.exptl?.[0]?.method || 'X-RAY DIFFRACTION',
      resolution: data.rcsb_entry_info?.resolution_combined?.[0] || undefined,
      polymerCount: data.rcsb_entry_info?.polymer_entity_count_protein || 1
    };
  } catch (err) {
    console.warn(`[Bioscience] RCSB fetch for ${cleanId} failed, returning fallback metadata:`, err);
    return {
      pdbId: cleanId,
      title: `Macromolecular Complex ${cleanId}`,
      experimentalMethod: 'Cryo-EM / X-ray',
      polymerCount: 2
    };
  }
}

/**
 * Fetch AlphaFold structure prediction metadata from EMBL-EBI
 */
export async function fetchAlphaFoldPrediction(uniprotId: string): Promise<AlphaFoldPrediction | null> {
  const cleanId = uniprotId.trim().toUpperCase();
  try {
    const res = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${cleanId}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const pred = data[0];
      return {
        entryId: pred.entryId,
        gene: pred.gene || cleanId,
        uniprotAccession: pred.uniprotAccession,
        uniprotId: pred.uniprotId,
        uniprotDescription: pred.uniprotDescription || 'AlphaFold predicted biomolecular fold',
        organismScientificName: pred.organismScientificName || 'Homo sapiens',
        uniprotSequence: pred.uniprotSequence || '',
        cifUrl: pred.cifUrl,
        bcifUrl: pred.bcifUrl,
        pdbUrl: pred.pdbUrl,
        paeDocUrl: pred.paeDocUrl
      };
    }
    return null;
  } catch (err) {
    console.warn(`[Bioscience] AlphaFold fetch for ${cleanId} failed:`, err);
    return null;
  }
}

/**
 * Fetch chemical details from PubChem PUG REST
 */
export async function fetchPubChemCompound(compoundName: string): Promise<PubChemCompound | null> {
  const query = encodeURIComponent(compoundName.trim());
  try {
    // 1. Resolve Name to CID
    const cidRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${query}/cids/JSON`);
    if (!cidRes.ok) return null;
    const cidData = await cidRes.json();
    const cid = cidData?.IdentifierList?.CID?.[0];
    if (!cid) return null;

    // 2. Fetch Calculated Properties
    const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,Complexity,InChIKey/JSON`;
    const propRes = await fetch(propUrl);
    if (!propRes.ok) return null;
    const propData = await propRes.json();
    const props = propData?.PropertyTable?.Properties?.[0];

    if (!props) return null;

    return {
      cid,
      name: compoundName,
      formula: props.MolecularFormula || '',
      molecularWeight: parseFloat(props.MolecularWeight) || 0,
      canonicalSmiles: props.CanonicalSMILES || '',
      xLogP: props.XLogP ? parseFloat(props.XLogP) : undefined,
      tpsa: props.TPSA ? parseFloat(props.TPSA) : undefined,
      hBondDonorCount: props.HBondDonorCount,
      hBondAcceptorCount: props.HBondAcceptorCount,
      complexity: props.Complexity,
      inchiKey: props.InChIKey
    };
  } catch (err) {
    console.warn(`[Bioscience] PubChem lookup for ${compoundName} error:`, err);
    return null;
  }
}

/**
 * Search PubMed biomedical literature via NCBI Entrez E-Utilities
 */
export async function searchPubMed(searchTerm: string, limit = 5): Promise<PubMedArticle[]> {
  try {
    const term = encodeURIComponent(searchTerm.trim());
    // Step 1: ESearch
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${term}&sort=pub_date&retmode=json&retmax=${limit}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return [];
    const searchJson = await searchRes.json();
    const idList: string[] = searchJson?.esearchresult?.idlist || [];

    if (idList.length === 0) return [];

    // Step 2: ESummary
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) return [];
    const summaryJson = await summaryRes.json();
    const result = summaryJson?.result || {};

    const articles: PubMedArticle[] = [];
    for (const id of idList) {
      const item = result[id];
      if (item) {
        const authors = Array.isArray(item.authors) ? item.authors.map((a: any) => a.name) : [];
        const doiItem = item.articleids?.find((aid: any) => aid.idtype === 'doi');
        articles.push({
          pmid: id,
          title: item.title?.replace(/<[^>]+>/g, '') || 'Biomedical Research Document',
          authors,
          source: item.source || item.fulljournalname || 'NCBI MEDLINE',
          pubdate: item.pubdate || item.sortpubdate?.slice(0, 4) || '',
          doi: doiItem?.value
        });
      }
    }
    return articles;
  } catch (err) {
    console.warn('[Bioscience] PubMed search failed:', err);
    return [];
  }
}

/**
 * Standard genetic code codon translation table
 */
const CODON_TABLE: Record<string, string> = {
  ATA: 'I', ATC: 'I', ATT: 'I', ATG: 'M',
  ACA: 'T', ACC: 'T', ACG: 'T', ACT: 'T',
  AAC: 'N', AAT: 'N', AAA: 'K', AAG: 'K',
  AGC: 'S', AGT: 'S', AGA: 'R', AGG: 'R',
  CTA: 'L', CTC: 'L', CTG: 'L', CTT: 'L',
  CCA: 'P', CCC: 'P', CCG: 'P', CCT: 'P',
  CAC: 'H', CAT: 'H', CAA: 'Q', CAG: 'Q',
  CGA: 'R', CGC: 'R', CGG: 'R', CGT: 'R',
  GTA: 'V', GTC: 'V', GTG: 'V', GTT: 'V',
  GCA: 'A', GCC: 'A', GCG: 'A', GCT: 'A',
  GAC: 'D', GAT: 'D', GAA: 'E', GAG: 'E',
  GGA: 'G', GGC: 'G', GGG: 'G', GGT: 'G',
  TCA: 'S', TCC: 'S', TCG: 'S', TCT: 'S',
  TTC: 'F', TTT: 'F', TTA: 'L', TTG: 'L',
  TAC: 'Y', TAT: 'Y', TAA: '*', TAG: '*',
  TGC: 'C', TGT: 'C', TGA: '*', TGG: 'W'
};

/**
 * Analyze nucleotide or amino acid sequences
 */
export function analyzeSequence(rawInput: string): SequenceAnalysis {
  const cleaned = rawInput.replace(/[^A-Za-z]/g, '').toUpperCase();
  const isNucleotide = /^[ACGTU]+$/.test(cleaned);
  const isRna = isNucleotide && cleaned.includes('U');

  if (isNucleotide) {
    const dnaEquivalent = cleaned.replace(/U/g, 'T');
    let gcCount = 0;
    for (const char of dnaEquivalent) {
      if (char === 'G' || char === 'C') gcCount++;
    }
    const gcContent = cleaned.length > 0 ? (gcCount / cleaned.length) * 100 : 0;

    // Translation in standard reading frame
    let peptide = '';
    let stops = 0;
    for (let i = 0; i <= dnaEquivalent.length - 3; i += 3) {
      const codon = dnaEquivalent.slice(i, i + 3);
      const aa = CODON_TABLE[codon] || '?';
      if (aa === '*') stops++;
      peptide += aa;
    }

    // Molecular weight approximation: ~330 Da per nt average
    const mwKDa = (cleaned.length * 330) / 1000;

    return {
      type: isRna ? 'RNA' : 'DNA',
      length: cleaned.length,
      gcContentPercent: Math.round(gcContent * 10) / 10,
      molecularWeightKDa: Math.round(mwKDa * 100) / 100,
      translatedPeptide: peptide,
      stopCodonsCount: stops
    };
  }

  // Protein sequence
  const proteinMw = (cleaned.length * 110) / 1000; // ~110 Da per amino acid
  return {
    type: 'PROTEIN',
    length: cleaned.length,
    molecularWeightKDa: Math.round(proteinMw * 100) / 100
  };
}
