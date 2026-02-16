# CardCommand Frontend - Runbook

> Practical steps for developing, validating, and deploying frontend changes.

---

## 1) Local Development

```bash
cd cardcommand-frontend
npm install
npm run dev
```

Expected local env:
- `VITE_API_URL=http://localhost:3001/api` (or production API for remote testing)
- `VITE_USE_TCG_DATA_LAYER=true` is allowed, but Releases adapter remains sealed-only by design.

---

## 2) Build Validation

```bash
npm run build
```

If build fails:
- run clean install
- verify API type fields in `src/types/index.ts` match backend payload

---

## 3) Deploy (Vercel)

Primary path:
- push to `main` (auto deploy)

Manual path:
```bash
vercel login
vercel --prod
```

Required Vercel env:
- `VITE_API_URL=https://cardcommand-api-production.up.railway.app/api`

---

## 4) Releases UX Validation Checklist

After deploy, open Releases tab and confirm:
- only sealed products are shown
- market context line appears when matched listing exists
- missing prices render as `No market price`
- top chases show source label (`price-ranked` or `editorial fallback`)
- chase/source link appears in modal when available

---

## 5) Troubleshooting

### Releases shows individual cards

Likely regression in `releaseProductsAdapter`.
Check:
- `fetchReleaseProducts` should route Releases to `/releases/products` path.

### Missing provenance fields in UI

Check:
- API payload includes `setTopChasesSource` and `setTopChasesSourceUrl`
- `ReleaseProduct` type includes these fields

### UI shows misleading market price

Check:
- backend `marketPriceContext.matchedProductType` and `matchedProductName`
- modal/card should display context so users can verify what was matched

---

## 6) Rollback

Frontend rollback:
1. revert bad commit
2. push to `main`
3. verify Vercel promoted deployment

---

## 7) Next UX Direction

- Maintain provenance-first display style.
- Reuse same source-label + timestamp pattern for upcoming individual-card surfaces.

---

*Last Updated: 2026-02-15*
