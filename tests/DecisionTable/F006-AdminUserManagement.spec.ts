import { test, expect } from "@playwright/test";

test.describe("F006 - Admin User Management (Create User) DT", () => {   
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

    // expected to fail
    test("TCOV-06-001 | Required Field Filled", async ({ page }) => { 
        const emailExtended = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'Users' }).click();
        await page.getByRole('button', { name: 'Add new user' }).click();
        
        await page.getByRole('textbox', { name: 'Email:' }).click();
        await page.getByRole('textbox', { name: 'Email:' }).fill(`test${emailExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'Password:' }).click();
        await page.getByRole('textbox', { name: 'Password:' }).fill('SecurePass1!');
        
        await page.getByRole('button', { name: 'Create user' }).click();
        
        await expect(page.getByText(/User added successfully/i)).toBeVisible({ timeout: 10000 });
    });

    test("TCOV-06-002 | Empty Fields", async ({ page }) => { 
        await page.getByRole('link', { name: 'Users' }).click();
        await page.getByRole('button', { name: 'Add new user' }).click();
        
        await page.getByRole('button', { name: 'Create user' }).click();
        
        await expect(page.getByText(/You must enter all input values to add a user/i)).toBeVisible({ timeout: 10000 });
    });

    test("TCOV-06-003 | Invalid Email Format", async ({ page }) => {
        const emailExtended = Math.random().toString(36).substring(2, 7)
        await page.getByRole('link', { name: 'Users' }).click();
        await page.getByRole('button', { name: 'Add new user' }).click();
        
        await page.getByRole('textbox', { name: 'Email:' }).click();
        await page.getByRole('textbox', { name: 'Email:' }).fill(`invalidemail`);
        await page.getByRole('textbox', { name: 'Password:' }).click();
        await page.getByRole('textbox', { name: 'Password:' }).fill('SecurePass1!');
        
        await page.getByRole('button', { name: 'Create user' }).click();
        
        await expect(page.getByText(/You entered invalid email address format/i)).toBeVisible({ timeout: 10000 });
    })

    // crashes the backend
    // test("TCOV-06-004 | Non Unique Email", async ({ page }) => {
    //     await page.getByRole('link', { name: 'Users' }).click();
    //     await page.getByRole('button', { name: 'Add new user' }).click();
        
    //     await page.getByRole('textbox', { name: 'Email:' }).click();
    //     await page.getByRole('textbox', { name: 'Email:' }).fill(`admin@gmail.com`);
    //     await page.getByRole('textbox', { name: 'Password:' }).click();
    //     await page.getByRole('textbox', { name: 'Password:' }).fill('SecurePass1!');
        
    //     await page.getByRole('button', { name: 'Create user' }).click();
        
    //     await expect(page.getByText(/Error while creating user/i)).toBeVisible({ timeout: 10000 });
    // })

    test("TCOV-06-005 | Invalid Password Length", async ({ page }) => {
        const emailExtended = Math.random().toString(36).substring(2, 7)
        await page.getByRole('link', { name: 'Users' }).click();
        await page.getByRole('button', { name: 'Add new user' }).click();
        
        await page.getByRole('textbox', { name: 'Email:' }).click();
        await page.getByRole('textbox', { name: 'Email:' }).fill(`test${emailExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'Password:' }).click();
        await page.getByRole('textbox', { name: 'Password:' }).fill('12345');
        
        await page.getByRole('button', { name: 'Create user' }).click();
        
        await expect(page.getByText(/Password must be longer than 7 characters/i)).toBeVisible({ timeout: 10000 });
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});