# Terroir MA Web

A full-stack web platform for agricultural product traceability and certification management, built for Moroccan cooperatives and certification bodies.

## Overview

Terroir MA is a role-based system that lets certification bodies, cooperative administrators, and cooperative members manage the full lifecycle of agricultural certifications — from harvest logging and batch tracking to export document generation and public certification verification.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 + React 18 |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | NextAuth 5 (Keycloak) |
| Data fetching | TanStack Query 5 |
| i18n | next-intl |
| API client | openapi-fetch (generated from OpenAPI schema) |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Package manager | pnpm (monorepo) |

## Repository Structure

```
terroir-ma-web/
├── apps/
│   ├── portal/          # Authenticated dashboard (port 3001)
│   └── public/          # Public certification verification (port 3002)
└── packages/
    └── api-client/      # Auto-generated TypeScript API client
```

### Portal app roles

- **Certification body** — review and approve certifications
- **Cooperative admin** — manage farms, members, batches, and products
- **Cooperative member** — log harvests, manage batches, generate export documents

### Public app

Unauthenticated page for verifying certifications by UUID (`/verify/[uuid]`).

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- A running instance of the [terroir-ma backend](https://github.com/rhorba/terroir-ma) (or a compatible API)
- Keycloak instance for authentication

### Install dependencies

```bash
pnpm install
```

### Environment variables

Create `.env.local` in `apps/portal/` and `apps/public/` as needed:

```env
NEXTAUTH_SECRET=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=
KEYCLOAK_ISSUER=
NEXT_PUBLIC_API_URL=
```

### Development

```bash
pnpm dev:portal   # http://localhost:3001
pnpm dev:public   # http://localhost:3002
```

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev:portal` | Start portal in development mode |
| `pnpm dev:public` | Start public app in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test:unit` | Run unit tests with coverage |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm generate-api` | Regenerate API client from OpenAPI schema |

## Regenerating the API client

The `packages/api-client` is generated from the backend's OpenAPI schema. To update it:

1. Export the schema from the backend repo: `npm run export:openapi`
2. Run `pnpm generate-api` in this repo

## Docker (production)

```bash
docker compose -f docker-compose.prod.yml up --build
```

## License

MIT — see [LICENSE](LICENSE).
