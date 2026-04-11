import { test, expect } from '@playwright/test';

test('home page shows Login / Log In action', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByRole('button', { name: /LEARN\s?MORE/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /BUY\s?NOW/i })).toBeVisible();
});

