import { test, expect } from "@playwright/test";

test.describe("F005 - Admin Inventory and Catalog Management (Bulk Upload) EP", () => {    
    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        await page.goto("http://localhost:3000/login");
        await page.getByLabel('Email address', { exact: true }).fill("admin@gmail.com");
        await page.getByLabel('Password', { exact: true }).fill("Admin12345!");
        await page.getByRole('button', { name: /SIGN IN/i }).click();

        await expect(page.getByText(/Successful login/i)).toBeVisible({ timeout: 10000 });
        
        // stop test for 5 seconds to wait for authentication to be processed before navigating to admin page
        await page.waitForTimeout(5000);
        
        await page.goto("http://localhost:3000/admin");
    });

    test("TCOV-05-001 | File size within limit (valid)", async ({ page }) => {
        await page.getByRole('link', { name: 'Bulk Upload' }).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV Template' }).click();
        const download = await downloadPromise;

        // expect if the file is called `product-template.csv`
        expect(download.suggestedFilename()).toBe('product-template.csv');
        await page.locator('#file-upload').setInputFiles('tests/fixtures/product-main-flow.csv');
        await page.getByRole('button', { name: 'Upload Products' }).click();

        await expect(page.getByText(/Products uploaded successfully/i)).toBeVisible({ timeout: 10000 });
    });

    // should pass
    test("TCOV-05-002 | File size exceeds limit (invalid)", async ({ page }) => { 
        await page.getByRole('link', { name: 'Bulk Upload' }).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV Template' }).click();
        const download = await downloadPromise;

        // expect if the file is called `product-template.csv`
        expect(download.suggestedFilename()).toBe('product-template.csv');
        await page.locator('#file-upload').setInputFiles('tests/fixtures/product-alt-flow-5.csv');
        await page.getByRole('button', { name: 'Upload Products' }).click();

        await expect(
            page.getByRole('status').filter({ hasText: 'Database operation failed' })
        ).toBeVisible({ timeout: 10000 });
        
        await expect(page.getByText(/too large/i)).toBeVisible({ timeout: 10000 });
    });

    test.afterEach(async ({ context }) => {
      await context.clearCookies();
    });
});