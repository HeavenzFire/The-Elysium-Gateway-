# Design Notes Extracted from Qwen Chat

## Purpose
This document converts informal chat notes into actionable engineering items. Each entry lists the chat idea, its technical interpretation, and the concrete validation action required.

## 1. Multi-Agent Consensus Parameters
**Chat idea**: consensus tuning, quorum behavior, Lamport clocks, signed proposals.  
**Interpretation**: consensus parameters (n, f), clock skew assumptions, signature verification path.  
**Action**:
- Add explicit parameter table to `src/mesh/config.ts`.
- Add unit tests for quorum thresholds: require `n >= 3*f + 1`.
- Add property-based tests for Lamport clock monotonicity under message reordering.

## 2. Error Frame Schema and Seals
**Chat idea**: sealed error frames, HMAC/Ed25519, timestamped provenance.  
**Interpretation**: canonical JSON schema for error frames and deterministic sealing algorithm.  
**Action**:
- Add `schemas/error_frame.schema.json` with required fields: `entity`, `context`, `coherence_pct`, `timestamp`, `seal`.
- Implement `crypto/seal.ts` with Ed25519 signing and HMAC fallback.
- Add test vectors in `tests/CHAT_TEST_VECTORS.json` for seal verification.

## 3. Chorus Voice Parameters
**Chat idea**: voice frequency, coherence metric, multi-agent resonance.  
**Interpretation**: treat as metadata vectors used by coordination logic, not physical frequency claims.  
**Action**:
- Define `types/chorus.ts` with `coherence_pct` and `resonance_score` as normalized floats.
- Add tests that validate aggregation functions (mean, weighted mean, variance) used by `chorus.resonate()`.

## 4. Bounded Admission and Rate Control
**Chat idea**: bounded admission prevents flooding.  
**Interpretation**: admission control algorithm with token bucket or leaky bucket semantics.  
**Action**:
- Implement `admission/limit.ts` with configurable tokens per second and burst size.
- Add load tests that assert system remains responsive under 10x nominal load.

## 5. Formal Spec Gaps
**Chat idea**: TLA+ spec needs syntax fixes and model checking.  
**Interpretation**: TLA+ spec currently compiles but contains constructs that TLC flags.  
**Action**:
- Fix TLA+ syntax issues in `tla/MeshConsensus.tla`.
- Add `ci/tlc-run.sh` and CI job to run TLC and publish counterexamples.

## 6. Separation of Domains
**Chat idea**: symbolic resonance vs physical claims.  
**Interpretation**: metadata and symbolic anchors are non-consensus-critical; physical claims are explicitly excluded.  
**Action**:
- Add `UNIFIED_FIELD_DOCTRINE.md` excerpt to `docs/` clarifying explicit exclusions.
- Ensure code paths that accept `resonance_score` treat it as metadata only.

## 7. Provenance and Audit Packaging
**Chat idea**: preserve chat link as design provenance.  
**Interpretation**: keep the Qwen chat as an internal design note, not evidence.  
**Action**:
- Add `docs/CHAT_APPENDIX.md` with the chat link and a short summary.
- Add a `provenance/` folder with signed snapshots of design notes.

## Validation Mapping Table
| Idea | File to Add/Modify | Test Type |
| Error frame schema | schemas/error_frame.schema.json | Unit + Seal verification |
| Consensus params | src/mesh/config.ts | Property-based tests |
| Admission control | admission/limit.ts | Load tests |
| TLA+ fixes | tla/MeshConsensus.tla | TLC model checking |
| Chorus metadata | types/chorus.ts | Aggregation unit tests |
