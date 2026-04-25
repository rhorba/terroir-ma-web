import { FullConfig } from '@playwright/test';

// Teardown stub — dev DB is ephemeral (Docker volume); CI resets on each run
export default async function globalTeardown(_config: FullConfig) {}
