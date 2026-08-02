import { test, expect } from "@playwright/test";

test.describe("UC004 - Create Product", () => {    
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
        const productNameExtended = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('button', { name: 'Add new product' }).click();

        // Wait for merchant dropdown to be populated from the API before proceeding
        await page.locator('option', { hasText: 'Demo Merchant' }).first().waitFor({ state: 'attached' });
        await page.getByLabel('Merchant Info:').selectOption({ label: 'Demo Merchant' });

        await page.getByRole('textbox', { name: 'Product name:' }).click();
        await page.getByRole('textbox', { name: 'Product name:' }).fill(`Product ${productNameExtended}`);
        await page.getByRole('textbox', { name: 'Product slug:' }).click();
        await page.getByRole('textbox', { name: 'Product slug:' }).fill(`product-${productNameExtended}`);
        await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
        await page.getByRole('textbox', { name: 'Product price:' }).click();
        await page.getByRole('textbox', { name: 'Product price:' }).fill('999.99');
        await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
        await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
        await page.locator('input[type="file"]').setInputFiles('tests/fixtures/earbuds_black.jpg');
        await page.getByRole('textbox', { name: 'Product description:' }).click();
        await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');
        
        await page.getByRole('button', { name: 'Add product' }).click();

        await expect(page.getByText(/Product added successfully/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'Products' }).click();
        
        await expect(page.getByText(`Product ${productNameExtended}`)).toBeVisible();
    });

    // expected to pass (ERROR - cannot find name locator error)
    test("Alternate Flow 1 - empty required fields", async ({ page }) => {   
        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('button', { name: 'Add new product' }).click();

        await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
        await page.locator('input[type="file"]').setInputFiles('tests/fixtures/earbuds_black.jpg');
        await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
        await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
        await page.getByRole('textbox', { name: 'Product description:' }).click();
        await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');
        
        await page.getByRole('button', { name: 'Add product' }).click();

        await expect(page.getByText(/Please enter values in input fields/i)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 2 - not uploading an image", async ({ page }) => {   
        const productNameExtended = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('button', { name: 'Add new product' }).click();

        // Wait for merchant dropdown to be populated from the API before proceeding
        await page.locator('option', { hasText: 'Demo Merchant' }).first().waitFor({ state: 'attached' });
        await page.getByLabel('Merchant Info:').selectOption({ label: 'Demo Merchant' });

        await page.getByRole('textbox', { name: 'Product name:' }).click();
        await page.getByRole('textbox', { name: 'Product name:' }).fill(`Product ${productNameExtended}`);
        await page.getByRole('textbox', { name: 'Product slug:' }).click();
        await page.getByRole('textbox', { name: 'Product slug:' }).fill(`product-${productNameExtended}`);
        await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
        await page.getByRole('textbox', { name: 'Product price:' }).click();
        await page.getByRole('textbox', { name: 'Product price:' }).fill('999.99');
        await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
        await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
        await page.getByRole('textbox', { name: 'Product description:' }).click();
        await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');

        await page.getByRole('button', { name: 'Add product' }).click();

        await expect(page.getByText(/Please enter values in input fields/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'Products' }).click();
        
        await expect(page.getByText(`Product ${productNameExtended}`)).not.toBeVisible({ timeout: 10000});
    });

    // crashes the backend
    // test("Alternate Flow 3 - input duplicate slug", async ({ page }) => { 
    //     const productNameExtended = Math.random().toString(36).substring(2, 7)

    //     await page.getByRole('link', { name: 'Products' }).click();
    //     await page.getByRole('button', { name: 'Add new product' }).click();

    //     // Wait for merchant dropdown to be populated from the API before proceeding
    //     await page.locator('option', { hasText: 'Demo Merchant' }).first().waitFor({ state: 'attached' });
    //     await page.getByLabel('Merchant Info:').selectOption({ label: 'Demo Merchant' });

    //     await page.getByRole('textbox', { name: 'Product name:' }).click();
    //     await page.getByRole('textbox', { name: 'Product name:' }).fill(`Product ${productNameExtended}`);
    //     await page.getByRole('textbox', { name: 'Product slug:' }).click();
    //     await page.getByRole('textbox', { name: 'Product slug:' }).fill(`wireless-earbuds-demo`);
    //     await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
    //     await page.getByRole('textbox', { name: 'Product price:' }).click();
    //     await page.getByRole('textbox', { name: 'Product price:' }).fill('999.99');
    //     await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
    //     await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
    //     await page.locator('input[type="file"]').setInputFiles('tests/fixtures/earbuds_black.jpg');
    //     await page.getByRole('textbox', { name: 'Product description:' }).click();
    //     await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');
        
    //     await page.getByRole('button', { name: 'Add product' }).click();

    //     await expect(page.getByText(/Duplicate slug not allowed/i)).toBeVisible({ timeout: 10000 });

    //     await page.getByRole('link', { name: 'Products' }).click();
        
    //     await expect(page.getByText(`Product ${productNameExtended}`)).not.toBeVisible();
    // });
    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});