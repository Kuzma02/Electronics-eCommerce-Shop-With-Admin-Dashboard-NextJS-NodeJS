import { test, expect } from '@playwright/test';

test.describe('UC002 - Filter and Sort Products', () => {
    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        await page.goto("http://localhost:3000/login");
        await page.getByLabel('Email address', { exact: true }).fill("admin@gmail.com");
        await page.getByLabel('Password', { exact: true }).fill("Admin12345!");
        await page.getByRole('button', { name: /SIGN IN/i }).click();

        await expect(page.getByText(/Successful login/i)).toBeVisible({ timeout: 10000 });
        // stop test for 10 seconds
        await page.waitForTimeout(5000);
    });

    // completed
    test('Main Flow', async ({ page }) => {
        await page.getByRole('link', { name: 'Head Phones Head Phones' }).click();
        // expect the URL to contain the word 'headphones'
        await expect(page).toHaveURL(/headphones/i);

        await expect(page.getByRole('heading', { name: /headphones/i })).toBeVisible({ timeout: 10000 });
    })

    // completed
    test('Alternate Flow 1 - filter by availability status', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(2000);

        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });

        await page.goto('http://localhost:3000/shop?outOfStock=false&inStock=true&rating=0&price=3000&sort=defaultSort&page=1');
        await page.waitForLoadState('networkidle');

        await page.getByRole('checkbox', { name: 'In stock' }).uncheck();
        await page.getByRole('checkbox', { name: 'Out of stock' }).check();

        await page.waitForTimeout(2000);

        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // same here

        await expect(page.getByText('Out of stock')).toBeVisible({ timeout: 10000 });
    })

    // completed
    test('Alternate Flow 2 - filter products by maximum price', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('slider').first().fill('40');
        
        await expect(page.getByText('Max price: $40')).toBeVisible({ timeout: 10000 });

        await page.waitForTimeout(2000); // wait for filtered results to load   

        const priceElements = page.locator('p').filter({ hasText: /^\$\d/ });
        const count = await priceElements.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const text = await priceElements.nth(i).textContent();
            const value = parseFloat(text!.replace('$', ''));
            expect(value).toBeLessThanOrEqual(40);
        }
    })

    test('Alternate Flow 3 - filter by minimum rating', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('slider').nth(1).fill('5');
        
        await page.waitForTimeout(2000);
        
        await expect(page).toHaveURL(/rating=5/i);
    })

    // figure out the best way to test the sort options

    test('Alternate Flow 4 - sorts products alphabetically from A to Z', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('combobox').selectOption('titleAsc');
        await page.waitForURL(/sort=titleAsc/);
        await page.waitForLoadState('networkidle');

        const titleLinks = page.locator('a.uppercase').filter({ hasNotText: /^VIEW PRODUCT$/i });
        const titles = await titleLinks.allTextContents();

        expect(titles.length).toBeGreaterThan(0);
        for (let i = 0; i < titles.length - 1; i++) {
            expect(titles[i].localeCompare(titles[i + 1], undefined, { sensitivity: 'base' }))
                .toBeLessThanOrEqual(0);
        }
    })

    test('Alternate Flow 5 - sorts products alphabetically from Z to A', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('combobox').selectOption('titleDesc');
        await page.waitForURL(/sort=titleDesc/);
        await page.waitForLoadState('networkidle');

        const titleLinks = page.locator('a.uppercase').filter({ hasNotText: /^VIEW PRODUCT$/i });
        const titles = await titleLinks.allTextContents();

        expect(titles.length).toBeGreaterThan(0);
        for (let i = 0; i < titles.length - 1; i++) {
            expect(titles[i].localeCompare(titles[i + 1], undefined, { sensitivity: 'base' }))
                .toBeGreaterThanOrEqual(0);
        }
    })

    test('Alternate Flow 6 - sorts products by lowest price', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('combobox').selectOption('lowPrice');
        await page.waitForURL(/sort=lowPrice/);
        await page.waitForLoadState('networkidle');

        const priceElements = page.locator('p').filter({ hasText: /^\$\d/ });
        const priceTexts = await priceElements.allTextContents();

        expect(priceTexts.length).toBeGreaterThan(0);
        const prices = priceTexts.map(t => parseFloat(t.replace('$', '')));
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
    })

    test('Alternate Flow 7 - sorts products by highest price.', async ({ page }) => {
        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('combobox').selectOption('highPrice');
        await page.waitForURL(/sort=highPrice/);
        await page.waitForLoadState('networkidle');

        const priceElements = page.locator('p').filter({ hasText: /^\$\d/ });
        const priceTexts = await priceElements.allTextContents();

        expect(priceTexts.length).toBeGreaterThan(0);
        const prices = priceTexts.map(t => parseFloat(t.replace('$', '')));
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
        }
    })

    test('Alternate Flow 8 - applies multiple filters and a sort option simultaneously', async ({ page }) => {
        await page.getByRole('link', { name: 'Laptops Laptops' }).click();
        await expect(page).toHaveURL(/laptops/i);
        await expect(page.getByRole('heading', { name: /laptops/i })).toBeVisible({ timeout: 10000 });

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();
        await page.waitForTimeout(1000);
        await page.getByRole('slider').first().fill('80');
        await page.waitForTimeout(1000);
        await page.getByRole('slider').nth(1).fill('4');
        await page.waitForTimeout(1000);
        await page.getByRole('combobox').selectOption('lowPrice');
        await page.waitForTimeout(1000);
        await page.waitForURL(/outOfStock=false&inStock=true&rating=4&price=80&sort=lowPrice/);
        await page.waitForLoadState('networkidle');

        const priceElements = page.locator('p').filter({ hasText: /^\$\d/ });
        const priceTexts = await priceElements.allTextContents();
        expect(priceTexts.length).toBeGreaterThan(0);
        const prices = priceTexts.map(t => parseFloat(t.replace('$', '')));
        for (const price of prices) {
            expect(price).toBeLessThanOrEqual(80);
        }

        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);
        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
})