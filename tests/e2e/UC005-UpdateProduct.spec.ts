import { test, expect } from "@playwright/test";

test.describe("UC005 - Update Product", () => {    
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

    // should pass
    test("Main Flow", async ({ page }) => { 
        const productNameExtended = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('link', { name: 'details' }).first().click();

        await page.getByRole('textbox', { name: 'Product name:' }).click();
        await page.getByRole('textbox', { name: 'Product name:' }).fill(`Product ${productNameExtended}`);
        await page.getByRole('textbox', { name: 'Slug:' }).click();
        await page.getByRole('textbox', { name: 'Slug:' }).fill(`product-${productNameExtended}`);
        await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
        await page.getByRole('textbox', { name: 'Product price:' }).click();
        await page.getByRole('textbox', { name: 'Product price:' }).fill('999.99');
        await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
        await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
        await page.locator('input[type="file"]').setInputFiles('tests/fixtures/earbuds_black.jpg');
        await page.getByRole('textbox', { name: 'Product description:' }).click();
        await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');
        
        await page.getByRole('button', { name: 'Update Product' }).click();

        await expect(page.getByText(/Product successfully updated/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'Products' }).click();
        
        await expect(page.getByText(`Product ${productNameExtended}`)).toBeVisible();
    });

    // should pass
    test("Alternate Flow 1 - product name and price are left empty", async ({ page }) => {   
        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('link', { name: 'details' }).nth(1).click();

        await page.getByRole('textbox', { name: 'Product name:' }).click();
        await page.getByRole('textbox', { name: 'Product name:' }).fill('');

        await page.getByRole('textbox', { name: 'Product price:' }).click();
        await page.getByRole('textbox', { name: 'Product price:' }).fill('');

        await page.getByRole('button', { name: 'Update Product' }).click();

        await expect(page.getByText(/You need to enter values in input fields/i)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 2 - change stock status to Out of stock", async ({ page }) => {   
        const productNameExtended = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('link', { name: 'details' }).nth(4).click();
        
        await page.getByRole('textbox', { name: 'Product name:' }).click();
        await page.getByRole('textbox', { name: 'Product name:' }).fill(`Product ${productNameExtended}`);
        await page.getByRole('textbox', { name: 'Slug:' }).click();
        await page.getByRole('textbox', { name: 'Slug:' }).fill(`product-${productNameExtended}`);
        await page.getByLabel('Is product in stock?YesNo').selectOption('1');
        await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
        await page.getByRole('textbox', { name: 'Product price:' }).click();
        await page.getByRole('textbox', { name: 'Product price:' }).fill('999.99');
        await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
        await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
        await page.getByRole('textbox', { name: 'Product description:' }).click();
        await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');

        await page.getByRole('button', { name: 'Update Product' }).click();

        await expect(page.getByText(/Product successfully updated/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'Products' }).click();
        
        await expect(page.getByText('Out of stock').first()).toBeVisible({ timeout: 10000 });

        // change it back for future runs
        await page.getByRole('link', { name: 'details' }).nth(4).click();
        
        await page.getByLabel('Is product in stock?YesNo').selectOption('1');
        
        await page.getByRole('button', { name: 'Update Product' }).click();
    });

    // test("Alternate Flow 3 - input duplicate slug", async ({ page }) => { 
    //     const productNameExtended = Math.random().toString(36).substring(2, 7)

    //     await page.getByRole('link', { name: 'Products' }).click();
    //     await page.getByRole('link', { name: 'details' }).nth(4).click();

    //     await page.getByRole('textbox', { name: 'Product name:' }).click();
    //     await page.getByRole('textbox', { name: 'Product name:' }).fill(`Product ${productNameExtended}`);
    //     await page.getByRole('textbox', { name: 'Slug:' }).click();
    //     await page.getByRole('textbox', { name: 'Slug:' }).fill(`wireless-earbuds-demo`);
    //     await page.getByLabel('Category:').selectOption('fs6412b4-22fd-4fbb-9741-d77512dfdfa3');
    //     await page.getByRole('textbox', { name: 'Product price:' }).click();
    //     await page.getByRole('textbox', { name: 'Product price:' }).fill('999.99');
    //     await page.getByRole('textbox', { name: 'Manufacturer:' }).click();
    //     await page.getByRole('textbox', { name: 'Manufacturer:' }).fill('Sime Darby');
    //     await page.locator('input[type="file"]').setInputFiles('tests/fixtures/earbuds_black.jpg');
    //     await page.getByRole('textbox', { name: 'Product description:' }).click();
    //     await page.getByRole('textbox', { name: 'Product description:' }).fill('A test product');

    //     await page.getByRole('button', { name: 'Update product' }).click();

    //     await expect(page.getByText(/Product successfully updated/i)).toBeVisible({ timeout: 10000 });
    // });

    test.afterEach(async ({ context }) => {
      await context.clearCookies();
    });
});