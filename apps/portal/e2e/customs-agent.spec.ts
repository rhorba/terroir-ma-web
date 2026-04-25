import { test, expect } from '@playwright/test';
import * as path from 'path';

test.use({ storageState: path.join(__dirname, '.auth/customs-agent.json') });

test.describe('Customs agent — export documents (authenticated)', () => {
  test('export documents list loads after login', async ({ page }) => {
    await page.goto('/fr/customs-agent/export-documents');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('generate new export document page renders form', async ({ page }) => {
    await page.goto('/fr/customs-agent/export-documents/new');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('form')).toBeVisible();
  });

  test('customs-agent dashboard renders', async ({ page }) => {
    await page.goto('/fr/customs-agent');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
