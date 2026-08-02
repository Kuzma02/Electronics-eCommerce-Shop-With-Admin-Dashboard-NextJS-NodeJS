import { test, expect } from "@playwright/test";

test.describe("UC009 - Update Merchant", () => {    
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
    test("Main Flow - update name, email, phone number, address and description", async ({ page }) => { 
        const nameExtended = Math.random().toString(36).substring(2, 7);

        await page.getByRole('link', { name: 'Merchant' }).click();
        
        await page.getByRole('link', { name: 'Edit' }).first().click();
        
        await page.locator('input[name="name"]').click();
        await page.locator('input[name="name"]').fill(`TechStore Updated ${nameExtended}`);
        
        await page.getByRole('button', { name: 'Save Changes' }).click();

        await expect(page.getByText(/Merchant updated successfully/i)).toBeVisible({ timeout: 10000 });
    });

    // should pass
    test("Alternate Flow 1 - name field is empty", async ({ page }) => { 
        await page.getByRole('link', { name: 'Merchant' }).click();
        
        await page.getByRole('link', { name: 'Edit' }).nth(1).click();
        
        await page.locator('input[name="name"]').click();
        await page.locator('input[name="name"]').fill('');
        
        await page.getByRole('button', { name: 'Save Changes' }).click();

        const nameMessage = await page.locator('input[name="name"]').evaluate(
            (el) => (el as HTMLInputElement).validationMessage
        );
        
        // in the toContain, accept regardless of Upper or lower casing
        expect(nameMessage).toMatch(/fill out this field/i);    
    });

    // should pass 
    test("Alternate Flow 2 - change status from active to inactive", async ({ page }) => { 
        await page.getByRole('link', { name: 'Merchant' }).click();

        await page.getByRole('link', { name: 'Edit' }).nth(2).click();
        
        await page.getByRole('combobox').selectOption('INACTIVE');
        
        await page.getByRole('button', { name: 'Save Changes' }).click();

        await expect(page.getByText(/Merchant updated successfully/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'Merchant', exact: true }).click();
        
        await expect(page.getByText('INACTIVE')).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'Edit' }).nth(2).click();
        
        await page.getByRole('combobox').selectOption('ACTIVE');
        
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });

    // should pass
    test("Alternate Flow 3 - update to invalid email", async ({ page }) => {
        await page.getByRole('link', { name: 'Merchant' }).click();

        await page.getByRole('link', { name: 'Edit' }).nth(3).click();
        
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').fill('invalidemail');
        
        await page.getByRole('button', { name: 'Save Changes' }).click();

        const emailMessage = await page.locator('input[name="email"]').evaluate(
            (el) => (el as HTMLInputElement).validationMessage
        );

        expect(emailMessage).toMatch(/email address/i);    
    })

    // should fail
    test("Alternate Flow 4 - update to invalid phone number", async ({ page }) => {
        await page.getByRole('link', { name: 'Merchant' }).click();

        await page.getByRole('link', { name: 'Edit' }).nth(4).click();
        
        await page.locator('input[name="phone"]').click();
        await page.locator('input[name="phone"]').fill('abcdefg');
        
        await page.getByRole('button', { name: 'Save Changes' }).click();

        const phoneMessage = await page.locator('input[name="phone"]').evaluate(
            (el) => (el as HTMLInputElement).validationMessage
        );
        
        expect(phoneMessage).not.toBe('');
    })

    // should pass
    test("Alternate Flow 5 - cancel instead of submitting", async ({ page }) => { 
        const nameExtended = Math.random().toString(36).substring(2, 7);

        await page.getByRole('link', { name: 'Merchant' }).click();
        
        await page.getByRole('link', { name: 'Edit' }).nth(5).click();
        
        await page.locator('input[name="name"]').click();
        await page.locator('input[name="name"]').fill(`Updated name ${nameExtended}`);
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').fill(`email${nameExtended}@gmail.com`);
        await page.locator('input[name="phone"]').click();
        await page.locator('input[name="phone"]').fill('60104441234');
        await page.locator('input[name="address"]').click();
        await page.locator('input[name="address"]').fill(`No.4, Jalan NS 10/5, Bandar Sunway, ${nameExtended}`);

        await page.getByRole('link', { name: 'Back to Merchants' }).click();
    });

    test.afterEach(async ({ context }) => {
      await context.clearCookies();
  });
});