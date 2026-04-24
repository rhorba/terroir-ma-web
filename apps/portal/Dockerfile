# Build context: repo root (terroir-ma-web/)
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /repo
# Copy workspace manifests for layer-cache isolation
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/portal/package.json apps/portal/
COPY apps/public/package.json apps/public/
COPY packages/api-client/package.json packages/api-client/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /repo
# Copy root + per-app node_modules from deps stage (preserves pnpm symlinks)
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/portal/node_modules ./apps/portal/node_modules
# Copy all workspace source files
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT=standalone
WORKDIR /repo/apps/portal
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /repo/apps/portal/.next/standalone ./
COPY --from=builder /repo/apps/portal/.next/static ./.next/static
COPY --from=builder /repo/apps/portal/public ./public
USER nextjs
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
