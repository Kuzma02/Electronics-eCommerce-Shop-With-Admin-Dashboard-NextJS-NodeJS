import { test, expect } from '@playwright/test';

// Login Verification Decision Table Test
test.describe('F001 - User Authentication and Session Management', () => {
  
    test('TCOV-01-013 |  Registered Email', async ({ page }) => {
        // Registered Email: yes
        // correct password: yes
        // expect redirect to homepage: yes
        // expect "invalid credentials"": no
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        
        await page.getByLabel('Email address', { exact: true }).fill('irfan@gmail.com');
        await page.getByLabel('Password', { exact: true }).fill('G0@wayh@ckers');
        await page.getByRole('button', { name: /SIGN IN/i }).click();

        // expect redirect to homepage based URL change with timeout of 10 seconds
        await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });

        await expect(page.getByText(/Invalid email or password/i)).not.toBeVisible({ timeout: 10000 });
    });

    test('TCOV-01-014 | Incorrect Password', async ({ page }) => {
        // Registered Email: yes
        // correct password: no
        // expect redirect to homepage: no
        // expect "invalid credentials"": yes

        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        
        await page.getByLabel('Email address', { exact: true }).fill('admin@gmail.com');
        await page.getByLabel('Password', { exact: true }).fill('incorrectPassword');
        await page.getByRole('button', { name: /SIGN IN/i }).click();

        // expect not redirect to homepage based URL change with timeout of 10 seconds
        await expect(page).not.toHaveURL('http://localhost:3000/', { timeout: 10000 });

        await expect(page.locator('p', { hasText: /Invalid email or password/i })).toBeVisible({ timeout: 10000 });
    });

    test('TCOV-01-015 | Unregistered Email', async ({ page }) => {
        // Registered Email: no
        // correct password: nothing
        // expect redirect to homepage: no
        // expect browser required validation: yes

        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        
        await page.getByLabel('Email address', { exact: true }).fill('unregistered@example.com');
        const passwordInput = page.getByLabel('Password', { exact: true });
        await passwordInput.fill('');
        await page.getByRole('button', { name: /SIGN IN/i }).click();

        const passwordValidationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(passwordValidationMessage).not.toBe('');
        
        // expect not redirect to homepage based URL change with timeout of 10 seconds
        await expect(page).not.toHaveURL('http://localhost:3000/', { timeout: 10000 });
    });

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});
