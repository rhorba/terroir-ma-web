import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.join(__dirname, '.auth/inspector.json') });

test.describe('Inspector — happy path (authenticated)', () => {
  test('dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/inspector');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('inspections list loads', async ({ page }) => {
    await page.goto('/fr/inspector/inspections');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
