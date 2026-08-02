import { test, expect } from '@playwright/test';

// Password Boundary Value Analysis
test.describe('F001 - User Authentication and Session Management', () => {
  
    test('TCON-01-008 | TCOV-01-008 | Lower invalid boundary (invalid)', async ({ page }) => {
        // Test Condition: Length = 0
        // Example of test data: [Empty Field]
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('');
        await page.getByLabel('Confirm password', { exact: true }).fill('');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    });

    test('TCON-01-009 | TCOV-01-009 | Edge invalid boundary (invalid)', async ({ page }) => {
        // Test Condition: Length = 7
        // Example of test data: Aa1!bcd
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('Aa1!bcd');
        await page.getByLabel('Confirm password', { exact: true }).fill('Aa1!bcd');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    });

    test('TCON-01-010 | TCOV-01-010 | Edge valid boundary (valid)', async ({ page }) => {
        // Test Condition: Length = 8
        // Example of test data: Aa1!bcde

        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('Aa1!bcde');
        await page.getByLabel('Confirm password', { exact: true }).fill('Aa1!bcde');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).toBeVisible({ timeout: 10000 });
    });

    test('TCON-01-011 | TCOV-01-011 | Upper valid boundary (valid)', async ({ page }) => {
        // Test Condition: Length = 128
        // Example of test data = 128 character valid string

        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('Aa1!bcde'.repeat(16));
        await page.getByLabel('Confirm password', { exact: true }).fill('Aa1!bcde'.repeat(16));
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).toBeVisible({ timeout: 10000 });
    })

    test('TCON-01-012 | TCOV-01-012 | Upper invalid boundary (invalid)', async ({ page }) => {
        // Test Condition: Length = 129
        // Example of test data = 129 character valid string
        
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('Aa1!bcde'.repeat(17) + 'A');
        await page.getByLabel('Confirm password', { exact: true }).fill('Aa1!bcde'.repeat(17) + 'A');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});
