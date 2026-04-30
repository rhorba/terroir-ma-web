# Terroir.ma — Portal (Next.js)

The `@terroir/portal` Next.js 14 application serving all 9 Keycloak roles. Built with App Router, next-auth v5, next-intl (fr/ar/zgh), and TailwindCSS.

## Architecture

- **Next.js 14 App Router** — server components + server actions
- **next-auth v5 (Keycloak)** — JWT with `realm_access.roles` decoded client-side
- **next-intl** — trilingual support (French, Arabic, Amazigh/Tifinagh)
- **@terroir/api-client** — generated OpenAPI fetch client
- **TailwindCSS + shadcn/ui** — design system

## Role-based routing

| Path prefix | Keycloak role required |
|---|---|
| `/super-admin` | `super-admin` |
| `/cooperative-admin` | `cooperative-admin` |
| `/cooperative-member` | `cooperative-member` |
| `/lab-technician` | `lab-technician` |
| `/inspector` | `inspector` |
| `/certification-body` | `certification-body` |
| `/customs-agent` | `customs-agent` |

Unauthorized access redirects to `/fr/unauthorized`.

## Development

```bash
pnpm dev          # starts on :3001
pnpm typecheck    # TypeScript strict check
pnpm lint         # ESLint
```

## Testing

Unit tests use **Vitest + React Testing Library** with `jsdom` environment.

```bash
pnpm test             # run all unit tests (once)
pnpm test:watch       # watch mode
pnpm test:coverage    # run with V8 coverage report
```

### Coverage (2026-04-30)

| Metric | Result | Threshold |
|---|---|---|
| Statements | **100%** (149/149) | 80% |
| Branches | **100%** (70/70) | 70% |
| Functions | **100%** (42/42) | 80% |
| Lines | **100%** (143/143) | 80% |

**240 tests** across **24 test files** covering:
- `src/lib/` — `cn`, `apiFetch`, `getAccessToken`, `getRoles`, `getCooperativeId`
- `src/components/admin/` — `StatusBadge`, `DataTable`, `PageHeader`, `ActionButton`, `ConfirmModal`
- `src/components/ui/` — `Button` (all 6 variants × 4 sizes)
- `src/components/providers` — `Providers` wrapper
- `src/navigation.ts` — locale constants
- `src/app/**/actions.ts` — all 12 server action modules (harvest, batch, farm, members, cooperative, labs, settings, specifications, certification, inspection, export-document, lab-queue)

### Test structure

```
src/__tests__/
  setup.ts                  # @testing-library/jest-dom bootstrap
  lib/
    utils.test.ts
    auth-utils.test.ts
    api-server.test.ts
  components/
    status-badge.test.tsx
    data-table.test.tsx
    page-header.test.tsx
    action-button.test.tsx
    confirm-modal.test.tsx
    providers.test.tsx
    ui/button.test.tsx
  navigation.test.ts
  actions/
    harvest.test.ts
    batch.test.ts
    cooperative.test.ts
    certification.test.ts
    farm.test.ts
    members.test.ts
    inspection.test.ts
    export-document.test.ts
    lab-submit.test.ts
    lab-queue.test.ts
    labs.test.ts
    settings.test.ts
    specifications.test.ts
```

### Mock strategy

| Layer | Mocked | Reason |
|---|---|---|
| Server actions | `@/lib/api-server` (apiFetch), `next/cache` (revalidatePath) | Isolate network and cache calls |
| `auth-utils.ts` | `@/auth` (auth) | Avoid NextAuth runtime |
| `api-server.ts` | `@/lib/auth-utils`, `global.fetch` | Full fetch isolation |
| ActionButton | `react-dom` (useFormStatus) | Control pending state |
| Providers | `next-auth/react`, `@tanstack/react-query` | Avoid real QueryClient |
| navigation.ts | `next-intl/navigation` | Avoid intl runtime |

## E2E Tests (Playwright)

105 tests across 10 spec files (auth, roles, certification chain, QR, export docs).

```bash
# From workspace root:
pnpm test:e2e
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `KEYCLOAK_CLIENT_ID` | Yes | Keycloak client ID |
| `KEYCLOAK_CLIENT_SECRET` | Yes | Keycloak client secret |
| `KEYCLOAK_ISSUER` | Yes | Keycloak issuer URL |
| `NEXT_PUBLIC_API_URL` | No | Backend API base URL (default: `http://localhost:3000`) |
| `NEXTAUTH_URL` | Yes (prod) | Public URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | Yes | NextAuth session signing secret |
