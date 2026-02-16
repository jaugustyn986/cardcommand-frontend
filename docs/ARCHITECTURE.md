# CardCommand Frontend - Architecture

> Frontend architecture notes for Releases UX and provenance-first rendering.

---

## Stack

- React + TypeScript + Vite
- Tailwind for styling
- TanStack Query for server data
- Axios client in `src/services/api.ts`

## App Structure (Relevant to Current Work)

- `src/App.tsx` - tabs + Releases filters + as-of display wiring
- `src/hooks/useReleaseProducts.ts` - releases data hook
- `src/services/releaseProductsAdapter.ts` - backend contract adapter
- `src/components/ReleaseProductCard.tsx` - card UI for Releases grid
- `src/components/modals/ReleaseStrategyModal.tsx` - expanded detail/provenance
- `src/types/index.ts` - API contract types

## Releases Data Flow

1. `useReleaseProducts` requests data through adapter.
2. Adapter fetches `/api/releases/products`.
3. UI renders sealed products with trust/provenance metadata.

Intentional guardrail:
- Releases stays sealed-only, even when TCG card data layer exists.

## Provenance Rendering Rules

- If price exists and market match exists, show matched product name/link.
- If price is missing, show `No market price`.
- Show top-chase source label:
  - `price-ranked`
  - `editorial fallback`
- Show chase and market timestamps (`as of`) when provided.

## Contract Fields Expected from API

- `status`, `sourceType`, `sourceTier`, `confidence`, `confidenceScore`
- `marketPriceContext`
- `setTopChases`, `setTopChasesAsOf`, `setTopChasesSource`, `setTopChasesSourceUrl`

## UX Constraints (Current Product Rules)

- Do not default-hide low-confidence rows.
- Do not show individual cards as Releases products.
- Do not imply confidence without source/provenance context.

## Future Individual-Card Alignment

When card-level views are built:
- apply the same provenance rendering pattern
- keep deterministic-vs-fallback source labeling explicit
- include timestamp and source-link parity with Releases

---

*Last Updated: 2026-02-15*
