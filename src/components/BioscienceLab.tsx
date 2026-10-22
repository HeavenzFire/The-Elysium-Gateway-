import React, { useState } from 'react';
import { 
  Dna, 
  Atom, 
  BookOpen, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Activity, 
  FlaskConical,
  Microscope,
  Cpu
} from 'lucide-react';
import { 
  LANDMARK_STRUCTURES, 
  PRESET_COMPOUNDS, 
  fetchPdbMetadata, 
  fetchAlphaFoldPrediction, 
  fetchPubChemCompound, 
  searchPubMed, 
  analyzeSequence,
  type PdbMetadata,
  type AlphaFoldPrediction,
  type PubChemCompound,
  type PubMedArticle,
  type SequenceAnalysis
} from '../services/bioscienceService';
import { ThreeBioScene, type SceneMode } from './ThreeBioScene';

interface BioscienceLabProps {
  onDelegateMission?: (directive: string, title: string, entityId?: string) => void;
}

export const BioscienceLab: React.FC<BioscienceLabProps> = ({ onDelegateMission }) => {
  const [activeSubTab, setActiveSubTab] = useState<'3d_structures' | 'chemistry' | 'literature' | 'sequence'>('3d_structures');
  const [selectedStructureId, setSelectedStructureId] = useState<string>('1BNA');
  const [sceneMode, setSceneMode] = useState<SceneMode>('dna_helix');
  const [pdbMeta, setPdbMeta] = useState<PdbMetadata | null>(null);
  const [afMeta, setAfMeta] = useState<AlphaFoldPrediction | null>(null);
  const [loadingStructure, setLoadingStructure] = useState<boolean>(false);

  // Chemistry state
  const [compoundQuery, setCompoundQuery] = useState<string>('Caffeine');
  const [compoundData, setCompoundData] = useState<PubChemCompound | null>(null);
  const [loadingCompound, setLoadingCompound] = useState<boolean>(false);

  // Literature state
  const [literatureQuery, setLiteratureQuery] = useState<string>('CRISPR Cas9 base editing sickle cell');
  const [articles, setArticles] = useState<PubMedArticle[]>([]);
  const [loadingLiterature, setLoadingLiterature] = useState<boolean>(false);

  // Sequence state
  const [rawSequence, setRawSequence] = useState<string>('ATGCGTACTAGCTAGCTAGCTAACCGATCGATCGATCGATCGATC');
  const [sequenceResult, setSequenceResult] = useState<SequenceAnalysis | null>(() => analyzeSequence('ATGCGTACTAGCTAGCTAGCTAACCGATCGATCGATCGATCGATC'));

  const handleSelectStructure = async (id: string, type: string) => {
    setSelectedStructureId(id);
    setLoadingStructure(true);
    if (id === '1BNA') setSceneMode('dna_helix');
    else if (type === 'AlphaFold') setSceneMode('protein_ribbon');
    else setSceneMode('protein_ribbon');

    if (type === 'PDB') {
      const meta = await fetchPdbMetadata(id);
      setPdbMeta(meta);
      setAfMeta(null);
    } else {
      const af = await fetchAlphaFoldPrediction(id);
      setAfMeta(af);
      setPdbMeta(null);
    }
    setLoadingStructure(false);
  };

  const handleSearchCompound = async (name: string) => {
    setLoadingCompound(true);
    const result = await fetchPubChemCompound(name);
    setCompoundData(result);
    setLoadingCompound(false);
  };

  const handleSearchLiterature = async () => {
    if (!literatureQuery.trim()) return;
    setLoadingLiterature(true);
    const result = await searchPubMed(literatureQuery, 6);
    setArticles(result);
    setLoadingLiterature(false);
  };

  const handleAnalyzeSeq = () => {
    if (!rawSequence.trim()) return;
    const res = analyzeSequence(rawSequence);
    setSequenceResult(res);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-slate-900 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Microscope className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-wide text-white flex items-center gap-2">
              Sovereign Bioscience & Molecular Codex
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Science Skills Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 3D Macromolecular Visualizer, RCSB PDB, AlphaFold DB, PubChem & PubMed Entrez Integration.
            </p>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('3d_structures')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === '3d_structures' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            3D Structures
          </button>
          <button
            onClick={() => {
              setActiveSubTab('chemistry');
              if (!compoundData) handleSearchCompound(compoundQuery);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'chemistry' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            PubChem Small Molecules
          </button>
          <button
            onClick={() => {
              setActiveSubTab('literature');
              if (articles.length === 0) handleSearchLiterature();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'literature' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            PubMed Literature
          </button>
          <button
            onClick={() => setActiveSubTab('sequence')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === 'sequence' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Codon / DNA Sequence
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 3D MACROMOLECULAR STRUCTURES */}
      {activeSubTab === '3d_structures' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preset selector & scientific metadata */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>Landmark Biomolecules</span>
                <span className="text-[10px] text-slate-500">RCSB PDB & AlphaFold</span>
              </h3>
              <div className="space-y-1.5">
                {LANDMARK_STRUCTURES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStructure(s.id, s.type)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                      selectedStructureId === s.id
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="font-mono text-emerald-400">{s.id}</span>
                        <span>{s.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{s.description}</p>
                    </div>
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {s.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Structure Metadata Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Structural Telemetry</span>
              </h4>

              {loadingStructure ? (
                <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
                  Retrieving crystallographic coordinates & PAE metrics...
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Target Identifier</span>
                    <span className="font-mono font-semibold text-emerald-300">{selectedStructureId}</span>
                  </div>
                  {pdbMeta && (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Method</span>
                        <span className="font-mono text-cyan-300">{pdbMeta.experimentalMethod}</span>
                      </div>
                      {pdbMeta.resolution && (
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="text-slate-400">Resolution</span>
                          <span className="font-mono text-amber-300">{pdbMeta.resolution} Å</span>
                        </div>
                      )}
                    </>
                  )}
                  {afMeta && (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Predicted Organism</span>
                        <span className="text-cyan-300 italic">{afMeta.organismScientificName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Sequence Length</span>
                        <span className="font-mono text-purple-300">{afMeta.uniprotSequence?.length} residues</span>
                      </div>
                    </>
                  )}
                  <div className="pt-2">
                    <button
                      onClick={() => onDelegateMission?.(
                        `Conduct an exhaustive structural audit and functional mechanism analysis for ${selectedStructureId} (${pdbMeta?.title || afMeta?.uniprotDescription || 'macromolecule'}).`,
                        `Structural Audit: ${selectedStructureId}`,
                        'curie'
                      )}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Delegate Research Mission to Marie Curie</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Three.js 3D Biological Scene */}
          <div className="lg:col-span-7">
            <ThreeBioScene 
              initialMode={sceneMode} 
              targetTitle={`${selectedStructureId}: Macromolecular Canvas`} 
              isEmbedded={true} 
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PUBCHEM SMALL MOLECULES */}
      {activeSubTab === 'chemistry' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-2">Presets:</span>
            {PRESET_COMPOUNDS.map((comp) => (
              <button
                key={comp}
                onClick={() => {
                  setCompoundQuery(comp);
                  handleSearchCompound(comp);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all border ${
                  compoundQuery.toLowerCase() === comp.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={compoundQuery}
                  onChange={(e) => setCompoundQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchCompound(compoundQuery)}
                  placeholder="Enter chemical name (e.g., Aspirin, Resveratrol)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleSearchCompound(compoundQuery)}
                  disabled={loadingCompound}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>

              {loadingCompound ? (
                <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                  Querying PubChem PUG REST API for physicochemical properties...
                </div>
              ) : compoundData ? (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white capitalize">{compoundData.name}</h3>
                      <p className="text-xs font-mono text-emerald-400">{compoundData.formula} • CID {compoundData.cid}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                      PubChem PUG
                    </span>
                  </div>

                  {/* Physicochemical table */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Molecular Weight</div>
                      <div className="text-sm font-semibold font-mono text-cyan-300">{compoundData.molecularWeight} g/mol</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Partition Coeff (XLogP)</div>
                      <div className="text-sm font-semibold font-mono text-amber-300">{compoundData.xLogP ?? 'N/A'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Polar Surface Area (TPSA)</div>
                      <div className="text-sm font-semibold font-mono text-purple-300">{compoundData.tpsa ? `${compoundData.tpsa} Å²` : 'N/A'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[11px] text-slate-400">H-Bond Donors / Acceptors</div>
                      <div className="text-sm font-semibold font-mono text-emerald-300">
                        {compoundData.hBondDonorCount ?? 0} / {compoundData.hBondAcceptorCount ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Canonical SMILES */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Canonical SMILES</div>
                    <div className="font-mono text-xs text-slate-300 break-all">{compoundData.canonicalSmiles}</div>
                  </div>

                  <button
                    onClick={() => onDelegateMission?.(
                      `Formulate bio-synthetic pathway and pharmacological profile for ${compoundData.name} (${compoundData.formula}, SMILES: ${compoundData.canonicalSmiles}).`,
                      `Pharmacological Analysis: ${compoundData.name}`,
                      'curie'
                    )}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Delegate Pharmacological Synthesis to Council</span>
                  </button>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <ThreeBioScene initialMode="molecule_cpk" targetTitle={`${compoundData?.name || 'CPK Molecule'}: 3D Conformation`} isEmbedded={true} />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PUBMED LITERATURE */}
      {activeSubTab === 'literature' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={literatureQuery}
              onChange={(e) => setLiteratureQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchLiterature()}
              placeholder="Search PubMed via NCBI Entrez (e.g. CRISPR, Telomerase, Neurogenesis)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSearchLiterature}
              disabled={loadingLiterature}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search PubMed</span>
            </button>
          </div>

          {loadingLiterature ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              Querying NCBI Entrez E-Utilities (esearch & esummary)...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div key={art.pmid} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-emerald-400">PMID: {art.pmid}</span>
                      <span>{art.pubdate}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white line-clamp-2">{art.title}</h4>
                    <p className="text-[11px] text-slate-400 italic line-clamp-1">
                      {art.authors.slice(0, 3).join(', ')}{art.authors.length > 3 ? ' et al.' : ''} — {art.source}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${art.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View on PubMed</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => onDelegateMission?.(
                        `Deeply evaluate the methodology, findings, and implications of biomedical publication PMID ${art.pmid}: "${art.title}".`,
                        `Paper Review: PMID ${art.pmid}`,
                        'curie'
                      )}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Delegate Review</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: SEQUENCE ANALYSIS */}
      {activeSubTab === 'sequence' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Nucleotide / Amino Acid Input Sequence</span>
              <span className="text-slate-500">FASTA / IUPAC Format</span>
            </label>
            <textarea
              value={rawSequence}
              onChange={(e) => setRawSequence(e.target.value)}
              rows={4}
              placeholder="Paste DNA/RNA nucleotide sequence (A, C, G, T, U) or amino acid sequence..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAnalyzeSeq}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Compute Translation & GC Metrics</span>
            </button>
          </div>

          {sequenceResult && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Molecule Class</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">{sequenceResult.type}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Sequence Length</div>
                  <div className="text-sm font-mono font-bold text-cyan-300">{sequenceResult.length} units</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400">GC Content</div>
                  <div className="text-sm font-mono font-bold text-amber-300">{sequenceResult.gcContentPercent ?? 'N/A'}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Approx. Mass</div>
                  <div className="text-sm font-mono font-bold text-purple-300">{sequenceResult.molecularWeightKDa} kDa</div>
                </div>
              </div>

              {sequenceResult.translatedPeptide && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Frame 1 Translated Peptide (Stop Codons: {sequenceResult.stopCodonsCount})
                  </div>
                  <div className="font-mono text-xs text-cyan-300 break-all bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {sequenceResult.translatedPeptide}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
