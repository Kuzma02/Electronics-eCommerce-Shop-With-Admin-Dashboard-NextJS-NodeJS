import { test, expect } from '@playwright/test';

// Password Boundary Value Analysis
test.describe('F001 - User Authentication and Session Management', () => {
    test('TCON-01-001 | TCOV-01-001 | Length too short (invalid)', async ({ page }) => {
        // Test Condition (Rule): 0 <= Length < 8
        // Example of test data: Aa1!bcd (7 chars)
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

    test('TCON-01-002 | TCOV-01-002 | Edge within range (valid)', async ({ page }) => {
        // Test Condition: 8 <= Length <= 128
        // Example of test data: ValidPassw0rd! (14 chars)
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('ValidPassw0rd!');
        await page.getByLabel('Confirm password', { exact: true }).fill('ValidPassw0rd!');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).toBeVisible({ timeout: 10000 });
    });

    test('TCON-01-003 | TCOV-01-003 | Length too long (invalid)', async ({ page }) => {
        // Test Condition: Length = Length > 128
        // Example of test data: 129-character string

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
    });

    test('TCON-01-004 | TCOV-01-004 | Fails (?=.*[A-Z]) (Invalid)', async ({ page }) => {
        // Test Condition: Length = Regex: Missing Uppercase
        // Example of test data = alllower1!

        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('alllower1!');
        await page.getByLabel('Confirm password', { exact: true }).fill('alllower1!');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    })

    test('TCON-01-005 | TCOV-01-005 | Fails (?=.*d) (Invalid)', async ({ page }) => {
        // Test Condition: Length = Regex: Missing Digit
        // Example of test data = NoDigitsHere!
        
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('NoDigitsHere!');
        await page.getByLabel('Confirm password', { exact: true }).fill('NoDigitsHere!');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    })

    test('TCON-01-006 | TCOV-01-006 | Fails (?=.*[@$!%*?&]) (invalid)', async ({ page }) => {
        // Test Condition: Length = Regex: Missing Special Char
        // Example of test data = NoSpecialChar123
        
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('NoSpecialChar123');
        await page.getByLabel('Confirm password', { exact: true }).fill('NoSpecialChar123');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    })

    test('TCON-01-007 | TCOV-01-007 | Password in blocklist (Invalid)', async ({ page }) => {
        // Test Condition: Length = Blocklist active
        // Example of test data = password123
        
        const email = `${crypto.randomUUID()}@example.com`;
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        await page.getByText('Register').first().click();
        
        await page.getByLabel('Name', { exact: true }).fill('John');
        await page.getByLabel('Lastname', { exact: true }).fill('Doe');
        await page.getByLabel('Email address', { exact: true }).fill(email);
        await page.getByLabel('Password', { exact: true }).fill('password123');
        await page.getByLabel('Confirm password', { exact: true }).fill('password123');
        await page.getByLabel(/accept our terms and privacy policy/i).check();
        
        await page.getByRole('button', { name: /SIGN UP/i }).click();

        await expect(page.getByText(/Registration successful/i)).not.toBeVisible({ timeout: 10000 });
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});
