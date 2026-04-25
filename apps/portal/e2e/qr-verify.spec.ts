import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// These tests target the public app on port 3002.
// Run with: pnpm test:e2e --project=public (requires both dev servers running)

const PUBLIC_BASE = 'http://localhost:3002';
const UNKNOWN_UUID = '00000000-0000-0000-0000-000000000000';

function getSeedData(): { cooperativeId: string } | null {
  const seedPath = path.join(__dirname, '.auth/seed.json');
  if (fs.existsSync(seedPath)) {
    return JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as { cooperativeId: string };
  }
  return null;
}

test.describe('QR verification — public app (unknown UUID)', () => {
  test('verify page renders without server crash for unknown UUID', async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/fr/verify/${UNKNOWN_UUID}`);
    await expect(page).not.toHaveTitle(/500|Internal Server Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('verify page shows content (error or status) — no blank page', async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/fr/verify/${UNKNOWN_UUID}`);
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('verify page available in Arabic locale', async ({ page }) => {
    await page.goto(`${PUBLIC_BASE}/ar/verify/${UNKNOWN_UUID}`);
    await expect(page).not.toHaveTitle(/500|Internal Server Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('QR verification — seeded cooperative UUID', () => {
  test('verify page loads for a real seeded UUID', async ({ page }) => {
    const seed = getSeedData();
    if (!seed) {
      test.skip();
      return;
    }
    await page.goto(`${PUBLIC_BASE}/fr/verify/${seed.cooperativeId}`);
    await expect(page).not.toHaveTitle(/500|Internal Server Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
