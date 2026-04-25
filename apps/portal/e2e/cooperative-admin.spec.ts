import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.join(__dirname, '.auth/cooperative-admin.json') });

test.describe('Cooperative admin — happy path (authenticated)', () => {
  test('dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/cooperative-admin');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('members list loads', async ({ page }) => {
    await page.goto('/fr/cooperative-admin/members');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('farms list loads', async ({ page }) => {
    await page.goto('/fr/cooperative-admin/farms');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
