import { test, expect } from '@playwright/test';

test.describe('Authentication redirect', () => {
  test('unauthenticated user is redirected from customs-agent list', async ({ page }) => {
    await page.goto('/fr/customs-agent/export-documents');
    await expect(page).toHaveURL(/\/fr\/login|\/api\/auth\/signin/);
  });

  test('unauthenticated user is redirected from customs-agent dashboard', async ({ page }) => {
    await page.goto('/fr/customs-agent');
    await expect(page).toHaveURL(/\/fr\/login|\/api\/auth\/signin/);
  });

  test('login page renders without crashing', async ({ page }) => {
    await page.goto('/fr/login');
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('unauthorized page renders correctly', async ({ page }) => {
    await page.goto('/fr/unauthorized');
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
