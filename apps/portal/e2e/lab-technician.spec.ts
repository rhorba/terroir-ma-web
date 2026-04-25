import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.join(__dirname, '.auth/lab-technician.json') });

test.describe('Lab technician — happy path (authenticated)', () => {
  test('dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/lab-technician');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('lab tests queue loads', async ({ page }) => {
    await page.goto('/fr/lab-technician/lab-tests');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
