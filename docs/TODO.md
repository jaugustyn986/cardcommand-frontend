# CardCommand Frontend - TODO

> Focus: Releases trust/provenance UX and upcoming card-level extension.

---

## P0 (current)

- [ ] Add explicit sync-state UX on Releases page when backend sync is running long.
- [ ] Improve empty-state messaging for no-price sealed SKUs (explain source-quality reason).
- [ ] Add visual indicator for matched market listing type (pack/box/bundle/ETB).
- [ ] Add integration test for "Releases stays sealed-only" adapter rule.

## P1 (next)

- [ ] Add compact provenance tooltip for chase-source labels in cards.
- [ ] Add per-product freshness badge for price sample age.
- [ ] Add frontend telemetry for provenance field coverage regressions.

## P2 (future)

- [ ] Build individual-card intelligence surface (Deals / chase explorers) using same hybrid pattern.
- [ ] Reuse source labels and confidence UI patterns from Releases.
- [ ] Add side-by-side deterministic vs fallback source explanation in card detail views.

## Notes

- Any change that pulls Releases from `/tcg/*` card feed is a regression.
- Provenance clarity takes priority over showing a number at all costs.

---

*Last Updated: 2026-02-15*
