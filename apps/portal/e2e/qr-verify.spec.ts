import { test, expect } from '@playwright/test';

// These tests target the public app on port 3002.
// Run with: pnpm test:e2e --project=chromium (requires both dev servers running)

const PUBLIC_BASE = 'http://localhost:3002';
const UNKNOWN_UUID = '00000000-0000-0000-0000-000000000000';

test.describe('QR verification — public app', () => {
  test('verify page renders without server crash for unknown UUID', async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/fr/verify/${UNKNOWN_UUID}`);
    await expect(page).not.toHaveTitle(/500|Internal Server Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('verify page shows content (error or status) — no blank page', async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/fr/verify/${UNKNOWN_UUID}`);
    // Page must show something — either an error message or a status section
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('verify page available in Arabic locale', async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/ar/verify/${UNKNOWN_UUID}`);
    await expect(page).not.toHaveTitle(/500|Internal Server Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
