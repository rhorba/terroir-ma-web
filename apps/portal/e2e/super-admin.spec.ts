import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.join(__dirname, '.auth/super-admin.json') });

test.describe('Super admin — cooperative management (authenticated)', () => {
  test('cooperatives list loads after login', async ({ page }) => {
    await page.goto('/fr/super-admin/cooperatives');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('audit log table loads', async ({ page }) => {
    await page.goto('/fr/super-admin/audit-log');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('super-admin dashboard renders', async ({ page }) => {
    await page.goto('/fr/super-admin');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
