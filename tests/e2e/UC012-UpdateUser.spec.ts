import { test, expect } from "@playwright/test";

test.describe("UC012 -Update User", () => {    
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
    test("Main Flow - update email and password", async ({ page }) => { 
        const nameExtended = Math.random().toString(36).substring(2, 7);

        await page.getByRole('link', { name: 'User' }).click();
        
        await page.getByRole('link', { name: 'details' }).first().click();
        
        await page.getByRole('textbox', { name: 'Email:' }).click();
        await page.getByRole('textbox', { name: 'Email:' }).fill(`admin${nameExtended}@gmail.com`);
        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
                
        await page.getByRole('button', { name: 'Update user' }).click();

        await expect(page.getByText(/User successfully updated/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'User' }).click();

        await expect(page.getByText(`admin${nameExtended}@gmail.com`)).toBeVisible({ timeout: 10000 });
    });

    // should pass
    test("Alternate Flow 1 - switch role from user to admin", async ({ page }) => { 
        await page.getByRole('link', { name: 'User' }).click();
        
        await page.getByRole('link', { name: 'details' }).nth(1).click();

        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
        await page.getByLabel('User role: adminuser').selectOption('admin');
        
        await page.getByRole('button', { name: 'Update user' }).click();

        await expect(page.getByText(/User successfully updated/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'User' }).click();
        
        await expect(page.getByText('admin').nth(1)).toBeVisible({ timeout: 10000 });

        // change it back for future runs
        await page.getByRole('link', { name: 'details' }).nth(1).click();
        
        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
        await page.getByLabel('User role: adminuser').selectOption('user');

        await page.getByRole('button', { name: 'Update user' }).click();
    });

    // should pass 
    test("Alternate Flow 2 - switch role from admin to user", async ({ page }) => { 
        await page.getByRole('link', { name: 'User' }).click();
        
        await page.getByRole('link', { name: 'details' }).nth(2).click();

        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
        await page.getByLabel('User role: adminuser').selectOption('user');
        
        await page.getByRole('button', { name: 'Update user' }).click();

        await expect(page.getByText(/User successfully updated/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('link', { name: 'User' }).click();
        
        await expect(page.getByText('user').nth(2)).toBeVisible({ timeout: 10000 });

        // change it back for future runs
        await page.getByRole('link', { name: 'details' }).nth(2).click();
        
        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
        await page.getByLabel('User role: adminuser').selectOption('admin');

        await page.getByRole('button', { name: 'Update user' }).click();
    });

    // should pass
    test("Alternate Flow 3 - update to invalid email", async ({ page }) => {
        await page.getByRole('link', { name: 'User' }).click();
        
        await page.getByRole('link', { name: 'details' }).nth(3).click();
        
        await page.getByRole('textbox', { name: 'Email:' }).click();
        await page.getByRole('textbox', { name: 'Email:' }).fill(`invalidemail`);
        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
                
        await page.getByRole('button', { name: 'Update user' }).click();

        await expect(page.getByText(/You entered invalid email address format/i)).toBeVisible({ timeout: 10000 });
    })

    // expected to fail (crashes backend)
    // test("Alternate Flow 4 - update to a duplicate email", async ({ page }) => {
    //     await page.getByRole('link', { name: 'User' }).click();
        
    //     await page.getByRole('link', { name: 'details' }).nth(4).click();
        
    //     await page.getByRole('textbox', { name: 'Email:' }).click();
    //     await page.getByRole('textbox', { name: 'Email:' }).fill(`admin@gmail.com`);
    //     await page.getByRole('textbox', { name: 'New password:' }).click();
    //     await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
                
    //     await page.getByRole('button', { name: 'Update user' }).click();

    //     await expect(page.getByText(/Email already exists/i)).toBeVisible({ timeout: 10000 });
    // })

    // should pass
    test("Alternate Flow 5 - password does not requirements", async ({ page }) => { 
        await page.getByRole('link', { name: 'User' }).click();
        
        await page.getByRole('link', { name: 'details' }).nth(5).click();
        
        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('123');
                
        await page.getByRole('button', { name: 'Update user' }).click();

        await expect(page.getByText(/Password must be longer than 7 characters/i)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 6 - clears the email field to be empty", async ({ page }) => { 
        await page.getByRole('link', { name: 'User' }).click();
        
        await page.getByRole('link', { name: 'details' }).nth(6).click();
        
        await page.getByRole('textbox', { name: 'Email:' }).click();
        await page.getByRole('textbox', { name: 'Email:' }).fill('');
        await page.getByRole('textbox', { name: 'New password:' }).click();
        await page.getByRole('textbox', { name: 'New password:' }).fill('NewPass123!');
                
        await page.getByRole('button', { name: 'Update user' }).click();

        await expect(page.getByText(/For updating a user you must enter all values/i)).toBeVisible({ timeout: 10000 });
    });

    test.afterEach(async ({ context }) => {
      await context.clearCookies();
    });
});