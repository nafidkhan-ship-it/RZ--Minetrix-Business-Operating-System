# ERP Quarry Vertical Slice — Implementation Plan

Status: **Quarry API TEST VERIFIED locally. Operations vertical slice (production/stock/gate pass/dispatch/settlement) implemented with migration `0006_erp_operations_vertical_slice.sql`.**

GCP Stage 5A remains **PARKED / NOT LIVE VERIFIED**.

## UI source mapping (Phase 17 Mining Operations)

| UI area | Mock source | Backend entity (planned) |
|---------|-------------|--------------------------|
| Quarry bench location | `MiningOperationsPhase17Section` cutting form `siteName` | `erp_quarries`, `erp_quarry_locations` |
| Land owner / lease | `LandOwnerRecord` in `miningPlatformPhase17Data.ts` | `erp_land_parcels`, `erp_quarry_leases` |
| Building materials catalog | `BuildingMaterialItem` | `erp_products`, `erp_product_sizes`, `erp_product_prices` |
| Crusher shift production | `CrusherShiftProductionLog` | `erp_production_batches` (+ future line items) |
| Laterite cutting register | `LateriteStoneProductionEntry` | `erp_production_batches.details_json` |
| Pricing tiers / dispatch | pricing-dispatch tab | `erp_product_prices` → later gate pass/dispatch tables |

## Authoritative entities (Quarry slice)

1. **Quarry** (`erp_quarries`) — tenant-owned site master
2. **Location** (`erp_quarry_locations`) — bench/haul road/stockpile within quarry
3. **Land parcel** (`erp_land_parcels`) — ownership/survey registry
4. **Lease** (`erp_quarry_leases`) — links parcel ↔ quarry, royalty terms
5. **Product** (`erp_products`) — material master (20mm metal, M-Sand, laterite piece, etc.)
6. **Product size** (`erp_product_sizes`) — grade/dimension variants
7. **Product price** (`erp_product_prices`) — quarry/product pricing tiers
8. **Production batch** (`erp_production_batches`) — shift/batch production header

## Tenant ownership

- Every ERP table includes `tenant_id VARCHAR(128)` aligned with Shared Core tenant IDs.
- `company_id` / `branch_id` on quarry reference Shared Core org hierarchy.
- RLS policies mirror Shared Core pattern (`app.current_tenant_id`, FORCE RLS).
- Client-supplied `tenantId` is never trusted; derived from JWT + user record.

## Foreign keys and indexes

- Quarry → company/branch (application-level validation against Shared Core)
- Location → quarry (CASCADE delete)
- Lease → land parcel (RESTRICT), optional quarry (SET NULL)
- Product size → product (CASCADE)
- Product price → product (+ optional size/quarry)
- Production batch → quarry (RESTRICT)

Indexes: `(tenant_id)`, `(tenant_id, company_id)`, `(tenant_id, product_id)`, `(tenant_id, quarry_id)`.

## RBAC permissions (to add with APIs)

| Permission | Scope |
|------------|-------|
| `erp:quarry:read` | List/view quarries |
| `erp:quarry:write` | Create/update quarries |
| `erp:product:read` | View products/prices |
| `erp:product:write` | Manage products/prices |
| `erp:production:read` | View production batches |
| `erp:production:write` | Post production batches |

## API boundaries (not yet implemented)

```
GET  /api/v1/erp/quarries
POST /api/v1/erp/quarries
GET  /api/v1/erp/quarries/:id
GET  /api/v1/erp/products
POST /api/v1/erp/products
GET  /api/v1/erp/production/batches
POST /api/v1/erp/production/batches
```

All routes: `authenticateJwt` → `enforceTenantContext` → `requirePermission` → validation → repository → audit.

## Transaction boundaries

- Quarry create/update: single `withTenantTransaction`
- Production posting (future): batch insert + stock ledger in one transaction
- Price effective-dating: close prior price row + insert new row atomically

## Downstream slice order

```
QUARRY (current groundwork)
  ↓
PRODUCTION (batch line items, operator linkage)
  ↓
STOCK (ledger, balances — new tables)
  ↓
GATE PASS
  ↓
DISPATCH
  ↓
SETTLEMENT
```

## What is NOT done

- HTTP APIs not exposed
- UI not connected
- Stock ledger, gate pass, dispatch, settlement tables not created
- Finance posting not implemented

## Next implementation step

Implement `GET/POST /api/v1/erp/quarries` with repository, validation, RBAC, and integration tests — then connect Mining UI quarry tab only after API tests pass.
