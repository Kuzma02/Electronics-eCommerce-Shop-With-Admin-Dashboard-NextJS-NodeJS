import { test, expect } from "@playwright/test";

test.describe("UC008 - Create Merchant", () => {    
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

    // expected to fail (NO ISSUE)
    test("Main Flow", async ({ page }) => { 
        const emailExtended = Math.random().toString(36).substring(2, 7);

        await page.getByRole('link', { name: 'Merchant' }).click();
        await page.getByRole('link', { name: 'Add Merchant' }).click();
        
        await page.getByRole('textbox', { name: 'Merchant name' }).click();
        await page.getByRole('textbox', { name: 'Merchant name' }).fill('TechStore');
        await page.getByRole('textbox', { name: 'email@example.com' }).click();
        await page.getByRole('textbox', { name: 'email@example.com' }).fill(`tech${emailExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'Phone number' }).click();
        await page.getByRole('textbox', { name: 'Phone number' }).fill('0123456789');
        await page.getByRole('textbox', { name: 'Merchant address' }).click();
        await page.getByRole('textbox', { name: 'Merchant address' }).fill('No.4, Jalan NS 10/5, Bandar Sunway');
        await page.getByRole('textbox', { name: 'Enter merchant description' }).click();
        await page.getByRole('textbox', { name: 'Enter merchant description' }).fill('under sunway corp');
        
        await page.getByRole('button', { name: 'Create Merchant' }).click();

        await expect(page.getByText(/Merchant created successfully/i)).toBeVisible({ timeout: 10000 });
    });

    // expected to pass
    test("Alternate Flow 1 - name field is empty", async ({ page }) => { 
        const emailExtended = Math.random().toString(36).substring(2, 7);  
        await page.getByRole('link', { name: 'Merchant' }).click();
        await page.getByRole('link', { name: 'Add Merchant' }).click();
        
        await page.getByRole('textbox', { name: 'email@example.com' }).click();
        await page.getByRole('textbox', { name: 'email@example.com' }).fill(`tech${emailExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'Phone number' }).click();
        await page.getByRole('textbox', { name: 'Phone number' }).fill('60104441234');
        await page.getByRole('textbox', { name: 'Merchant address' }).click();
        await page.getByRole('textbox', { name: 'Merchant address' }).fill('No.4, Jalan NS 10/5, Bandar Sunway');
        await page.getByRole('textbox', { name: 'Enter merchant description' }).click();
        await page.getByRole('textbox', { name: 'Enter merchant description' }).fill('under sunway corp');
        
        await page.getByRole('button', { name: 'Create Merchant' }).click();

        const nameMessage = await page.locator('input[name="name"]').evaluate(
            (el) => (el as HTMLInputElement).validationMessage
        );
        
        // in the toContain, accept regardless of Upper or lower casing
        expect(nameMessage).toMatch(/fill out/i);    
    });

    // expected to pass
    test("Alternate Flow 2 - invalid email format", async ({ page }) => { 
        await page.getByRole('link', { name: 'Merchant' }).click();
        await page.getByRole('link', { name: 'Add Merchant' }).click();
        
        await page.getByRole('textbox', { name: 'Merchant name' }).click();
        await page.getByRole('textbox', { name: 'Merchant name' }).fill('TechStore');
        await page.getByRole('textbox', { name: 'email@example.com' }).click();
        await page.getByRole('textbox', { name: 'email@example.com' }).fill('techstore');
        await page.getByRole('textbox', { name: 'Phone number' }).click();
        await page.getByRole('textbox', { name: 'Phone number' }).fill('0123456789');
        await page.getByRole('textbox', { name: 'Merchant address' }).click();
        await page.getByRole('textbox', { name: 'Merchant address' }).fill('No.4, Jalan NS 10/5, Bandar Sunway');
        await page.getByRole('textbox', { name: 'Enter merchant description' }).click();
        await page.getByRole('textbox', { name: 'Enter merchant description' }).fill('under sunway corp');
        
        await page.getByRole('button', { name: 'Create Merchant' }).click();

        const emailMessage = await page.locator('input[name="email"]').evaluate(
            (el) => (el as HTMLInputElement).validationMessage
        );
        expect(emailMessage).toMatch(/email address/i);    
    });

    // expected to fail 
    test("Alternate Flow 3 - invalid phone number", async ({ page }) => {
        const emailExtended = Math.random().toString(36).substring(2, 7);

        await page.getByRole('link', { name: 'Merchant' }).click();
        await page.getByRole('link', { name: 'Add Merchant' }).click();
        
        await page.getByRole('textbox', { name: 'Merchant name' }).click();
        await page.getByRole('textbox', { name: 'Merchant name' }).fill('TechStore');
        await page.getByRole('textbox', { name: 'email@example.com' }).click();
        await page.getByRole('textbox', { name: 'email@example.com' }).fill(`tech${emailExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'Phone number' }).click();

        await page.getByRole('textbox', { name: 'Phone number' }).fill('abcdefg');
        await page.getByRole('textbox', { name: 'Merchant address' }).click();
        await page.getByRole('textbox', { name: 'Merchant address' }).fill('No.4, Jalan NS 10/5, Bandar Sunway');
        await page.getByRole('textbox', { name: 'Enter merchant description' }).click();
        await page.getByRole('textbox', { name: 'Enter merchant description' }).fill('under sunway corp');
        
        await page.getByRole('button', { name: 'Create Merchant' }).click();

        const phoneMessage = await page.locator('input[name="phone"]').evaluate(
            (el) => (el as HTMLInputElement).validationMessage
        );
        
        expect(phoneMessage).not.toBe('');
    })

    // expected to pass
    test("Alternate Flow 4 - cancel before submitting", async ({ page }) => {
        const emailExtended = Math.random().toString(36).substring(2, 7);
        await page.getByRole('link', { name: 'Merchant' }).click();
        await page.getByRole('link', { name: 'Add Merchant' }).click();
        
        await page.getByRole('textbox', { name: 'Merchant name' }).click();
        await page.getByRole('textbox', { name: 'Merchant name' }).fill('TechStore');
        await page.getByRole('textbox', { name: 'email@example.com' }).click();
        await page.getByRole('textbox', { name: 'email@example.com' }).fill(`tech${emailExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'Phone number' }).click();
        await page.getByRole('textbox', { name: 'Phone number' }).fill('0123456789');
        await page.getByRole('textbox', { name: 'Merchant address' }).click();
        await page.getByRole('textbox', { name: 'Merchant address' }).fill('No.4, Jalan NS 10/5, Bandar Sunway');
        await page.getByRole('textbox', { name: 'Enter merchant description' }).click();
        await page.getByRole('textbox', { name: 'Enter merchant description' }).fill('under sunway corp');

        await page.getByRole('link', { name: 'Cancel' }).click();
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});