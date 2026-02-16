# CardCommand Frontend - AI Handoff

> Resume guide for UI work, especially Releases trust/provenance UX.

---

## Current Frontend State

- Deployment: Vercel
- API base uses Railway backend
- Releases view is operational with:
  - trust badges (status/source/confidence)
  - market match context in card + modal
  - top-chase list with source provenance labels

## Critical Product Contract (Releases)

- Releases must display **sealed products only**.
- Frontend intentionally uses legacy releases endpoint:
  - `/api/releases/products`
- Do not switch Releases tab to card-level `/api/tcg/*` payloads.
- Individual cards belong to future Deals/card intelligence surfaces.

## Key Frontend Files

- `src/services/releaseProductsAdapter.ts`
- `src/hooks/useReleaseProducts.ts`
- `src/components/ReleaseProductCard.tsx`
- `src/components/modals/ReleaseStrategyModal.tsx`
- `src/types/index.ts`
- `src/App.tsx` (Releases filters/timestamp wiring)

## New/Important Fields in `ReleaseProduct`

- `marketPriceContext`:
  - `source`, `priceType`, `asOf`
  - `matchedProductType`, `matchedProductName`, `matchedProductUrl`
- `setTopChases`
- `setTopChasesAsOf`
- `setTopChasesSource` (`price_ranked | editorial_fallback`)
- `setTopChasesSourceUrl`

## UX Behavior Locked In

- Show `No market price` when price is unavailable.
- Show market sample context when available.
- Show top chase list and source provenance.
- Keep trust metadata visible and filterable.
- Do not hide low-confidence rows by default.

## Hybrid Strategy Context (UI Side)

- Top chases can come from deterministic price ranking or editorial fallback.
- UI must make source type visible to avoid over-trusting fallback data.
- `as of` timestamps matter and should remain visible in modal.

## What To Watch Out For

- Any adapter change that reintroduces card-level entries into Releases is a regression.
- Do not infer chase source in frontend; consume API fields directly.
- Avoid displaying ambiguous matched pricing without matched product context.

## Individual Card Future Alignment

When building card-level experiences, reuse the same UX pattern:
- deterministic source first
- fallback source second
- explicit provenance + timestamp in every displayed valuation

---

*Last Updated: 2026-02-15*
