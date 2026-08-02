import { test, expect } from '@playwright/test';

test.describe('F002 - Product Browsing & Discovery (Decision Table)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/shop');
        // Wait for page to load completely (Filters sidebar is always visible)
        await page.waitForSelector('text="Filters"');
    });

    test('TC-02-DT-001 | TCON-02-001 | TCOV-02-001 | Price filter only applied (no rating, no in-stock filter)', async ({ page }) => {
        const priceSlider = page.locator('input[type="range"]').first();
        await priceSlider.fill('40');
        
        await page.waitForTimeout(1000); 
        
        // Just verify the page still has products or empty state, 
        // to ensure it didn't crash.
        const productCount = await page.getByText('View product').count();
        if (productCount > 0) {
            // Price might be embedded in various tags, this is a basic assert
            const prices = await page.locator('.text-xl.font-bold, .text-lg.font-bold').allTextContents();
            for (const priceText of prices) {
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                if (!isNaN(price)) {
                    expect(price).toBeLessThanOrEqual(40);
                }
            }
        }
    });

    test('TC-02-DT-002 | TCON-02-002 | TCOV-02-002 | Price + rating filters combined', async ({ page }) => {
        const priceSlider = page.locator('input[type="range"]').first();
        await priceSlider.fill('100');

        const ratingSlider = page.locator('input[type="range"].range-info');
        await ratingSlider.fill('3');

        await page.waitForTimeout(1000);
        await expect(page.url()).toContain('price=100');
        await expect(page.url()).toContain('rating=3');
    });

    test('TC-02-DT-003 | TCON-02-003 | TCOV-02-003 | Price + rating + in-stock filters combined', async ({ page }) => {
        const priceSlider = page.locator('input[type="range"]').first();
        await priceSlider.fill('100');

        const ratingSlider = page.locator('input[type="range"].range-info');
        await ratingSlider.fill('3');

        await page.getByLabel('Out of stock').uncheck();
        
        await page.waitForTimeout(1000);
        
        await expect(page.url()).toContain('outOfStock=false');
    });

    test('TC-02-DT-004 | TCON-02-004 | TCOV-02-004 | All filters active but no matching items → empty state message', async ({ page }) => {
        const priceSlider = page.locator('input[type="range"]').first();
        await priceSlider.fill('0'); // Super low price

        const ratingSlider = page.locator('input[type="range"].range-info');
        await ratingSlider.fill('5'); // Max rating

        await page.getByLabel('Out of stock').uncheck();

        await page.waitForTimeout(1000);

        // Check empty state
        const emptyStateText = await page.getByText(/No Products Found/i).isVisible();
        if (!emptyStateText) {
            const productsCount = await page.getByText('View product').count();
            expect(productsCount).toBe(0);
        } else {
            await expect(page.getByText(/No Products Found/i)).toBeVisible();
        }
    });

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    });
});
