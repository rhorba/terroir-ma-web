import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.join(__dirname, '.auth/cooperative-member.json') });

test.describe('Cooperative member — happy path (authenticated)', () => {
  test('dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/cooperative-member');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('harvests list loads', async ({ page }) => {
    await page.goto('/fr/cooperative-member/harvests');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
