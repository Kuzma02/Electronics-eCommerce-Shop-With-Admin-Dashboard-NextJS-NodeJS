import { test, expect } from "@playwright/test";

test.describe("UC010 - Bulk Upload", () => {    
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

    test("Main Flow", async ({ page }) => {
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
    test("Alternate Flow 1 - non-existent category", async ({ page }) => { 
        await page.getByRole('link', { name: 'Bulk Upload' }).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV Template' }).click();
        const download = await downloadPromise;

        // expect if the file is called `product-template.csv`
        expect(download.suggestedFilename()).toBe('product-template.csv');
        await page.locator('#file-upload').setInputFiles('tests/fixtures/product-alt-flow-1.csv');
        await page.getByRole('button', { name: 'Upload Products' }).click();

        await expect(
            page.getByRole('status').filter({ hasText: 'Database operation failed' })
        ).toBeVisible({ timeout: 10000 });
        
        await expect(page.getByText(/category not found/i)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 2 - empty fields (category, slug and description)", async ({ page }) => { 
        await page.getByRole('link', { name: 'Bulk Upload' }).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV Template' }).click();
        const download = await downloadPromise;

        // expect if the file is called `product-template.csv`
        expect(download.suggestedFilename()).toBe('product-template.csv');
        await page.locator('#file-upload').setInputFiles('tests/fixtures/product-alt-flow-2.csv');
        await page.getByRole('button', { name: 'Upload Products' }).click();

        await expect(
            page.getByRole('status').filter({ hasText: 'Database operation failed' })
        ).toBeVisible({ timeout: 10000 });

        await expect(page.getByText(/cannot be empty/i)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 3 - upload duplicate products with duplicate slugs", async ({ page }) => {
        await page.getByRole('link', { name: 'Bulk Upload' }).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV Template' }).click();
        const download = await downloadPromise;

        // expect if the file is called `product-template.csv`
        expect(download.suggestedFilename()).toBe('product-template.csv');
        await page.locator('#file-upload').setInputFiles('tests/fixtures/product-alt-flow-2.csv');
        await page.getByRole('button', { name: 'Upload Products' }).click();

        await expect(
            page.getByRole('status').filter({ hasText: 'Database operation failed' })
        ).toBeVisible({ timeout: 10000 });

        // check if words like `invalid slug or duplicate slug` are visible in the error message
        await expect(page.getByText(/invalid slug|duplicate slug/i)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 4 - upload invalid format of file (not csv)", async ({ page }) => {
        await page.getByRole('link', { name: 'Bulk Upload' }).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV Template' }).click();
        const download = await downloadPromise;

        expect(download.suggestedFilename()).toBe('product-template.csv');

        await page.locator('#file-upload').setInputFiles('tests/fixtures/earbuds_black.jpg');

        // Assert the app rejects the file via an error message
        await expect(
            page.getByRole('alert').filter({ hasText: /invalid file|only csv|unsupported format/i })
        ).toBeVisible({ timeout: 10000 });

        // Optionally also assert the Upload button stays disabled
        await expect(page.getByRole('button', { name: 'Upload Products' })).toBeDisabled();
    });

    // should pass
    test("Alternate Flow 5 - File exceeds 5 MB", async ({ page }) => { 
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