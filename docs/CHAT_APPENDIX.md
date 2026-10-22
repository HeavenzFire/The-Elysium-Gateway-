# Chat Appendix and Provenance

## Source
Qwen chat session link:
https://chat.qwen.ai/s/t_2de951c4-390c-4d2b-8da3-3ee805b45433?fev=0.2.91

## Summary
This chat contains design discussion and brainstorming around:
- Consensus tuning and Lamport clock behavior
- Error frame sealing and provenance
- Chorus metadata and aggregation semantics
- Admission control and load protection
- Validation pathway and TLA+ model checking

## How to Treat This Material
- **Design notes only**: do not treat as scientific validation.
- **Actionable items**: convert algorithmic suggestions into tests and TLA+ refinements.
- **Provenance**: keep the link and a signed snapshot in `provenance/` for traceability.

## Mapping to Repo Artifacts
- `docs/DESIGN_NOTES_FROM_QWEN.md` — actionable mapping of chat ideas to tasks.
- `tests/CHAT_TEST_VECTORS.json` — concrete test vectors derived from chat examples.
- `tla/MeshConsensus.tla` — ensure spec aligns with consensus parameter suggestions from chat.
