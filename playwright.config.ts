import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/portal/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    locale: 'fr-MA',
    timezoneId: 'Africa/Casablanca',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm dev:portal',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
