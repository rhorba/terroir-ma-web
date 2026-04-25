import { defineConfig, devices } from '@playwright/test';

const STAFF_ROLES = [
  'cooperative-admin',
  'certification-body',
  'customs-agent',
  'super-admin',
  'inspector',
  'lab-technician',
  'cooperative-member',
];

export default defineConfig({
  testDir: './apps/portal/e2e',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    locale: 'fr-MA',
    timezoneId: 'Africa/Casablanca',
  },
  globalSetup: './apps/portal/e2e/global-setup.ts',
  globalTeardown: './apps/portal/e2e/global-teardown.ts',
  projects: [
    // Public / unauthenticated tests — auth redirects, QR verify, login page
    {
      name: 'public',
      testMatch: /(auth|export-documents|qr-verify)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Authenticated role projects — depend on global-setup producing .auth/*.json
    ...STAFF_ROLES.map((role) => ({
      name: role,
      testMatch: new RegExp(`${role}\\.spec\\.ts|certification-chain\\.spec\\.ts|customs-agent\\.spec\\.ts|super-admin\\.spec\\.ts`),
      use: {
        ...devices['Desktop Chrome'],
        storageState: `apps/portal/e2e/.auth/${role}.json`,
      },
    })),
  ],
  webServer: {
    command: 'pnpm dev:portal',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
