import { test, expect, Page } from '@playwright/test';

// Shared helper
async function goToCheckout(page: Page) {
    await page.goto('http://localhost:3000/shop');
    await page.getByText('View product').nth(2).click();
    await page.waitForURL('**/product/**');
    await page.getByRole('button', { name: /ADD TO CART/i }).click();
    await page.waitForTimeout(500);
    await page.goto('http://localhost:3000/cart');
    await page.getByRole('link', { name: /Checkout/i }).click();
}

// Function to fill checkout with default valid values except what needs overriding
async function fillCheckoutForm(page: Page, overrides: Record<string, string>) {
    const defaultData = {
        name: 'John',
        lastname: 'Doe',
        email: `irfan+${Date.now()}@gmail.com`,
        phone: '0123456789',
        company: 'Test Co',
        address: '123 Test Street',
        apartment: 'Apt 1',
        city: 'Kuala Lumpur',
        country: 'Malaysia',
        postalCode: '50000',
        orderNotice: 'Please deliver safely'
    };
    
    const data = { ...defaultData, ...overrides };

    // Fill fields using their exact IDs from app/checkout/page.tsx
    if (data.name) await page.locator('#name-input').fill(data.name);
    if (data.lastname) await page.locator('#lastname-input').fill(data.lastname);
    if (data.email) await page.locator('#email-address').fill(data.email);
    if (data.phone) await page.locator('#phone-input').fill(data.phone);
    if (data.company) await page.locator('#company').fill(data.company);
    if (data.address) await page.locator('#address').fill(data.address);
    if (data.apartment) await page.locator('#apartment').fill(data.apartment);
    if (data.city) await page.locator('#city').fill(data.city);
    if (data.postalCode) await page.locator('#postal-code').fill(data.postalCode);
    if (data.country) await page.locator('#region').selectOption({ label: data.country }).catch(async () => {
        // if it's a standard text input instead of select
        await page.locator('#region').fill(data.country);
    });
    if (data.orderNotice) await page.locator('#order-notice').fill(data.orderNotice);
}


test.describe('F004 - Order Processing & Checkout (Equivalence Partitioning)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address').fill('irfan@gmail.com');
        await page.getByLabel('Password').fill('G0@wayh@ckers');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page).toHaveURL('http://localhost:3000/');
        await goToCheckout(page);
    });

    test('TC-04-EP-001 | TCON-04-001 | TCOV-04-001 | Phone number too short (Length < 10) → rejected', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '12345' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Phone number must be at least 10 digits|invalid|short/i)).toBeVisible();
    });

    test('TC-04-EP-002 | TCON-04-002 | TCOV-04-002 | Phone number valid length (10 ≤ Length ≤ 15) → order created', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '0123456789' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Order created successfully! You will be contacted for payment./i)).toBeVisible({ timeout: 10000 });
    });

    test('TC-04-EP-003 | TCON-04-003 | TCOV-04-003 | Phone number too long (Length > 15) → rejected', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '1234567890123456789' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Phone number must be|invalid|long/i)).toBeVisible();
    });

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    });
});

test.describe('F004 - Order Processing & Checkout (Boundary Value Analysis)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address').fill('irfan@gmail.com');
        await page.getByLabel('Password').fill('G0@wayh@ckers');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page).toHaveURL('http://localhost:3000/');
        await goToCheckout(page);
    });

    test('TC-04-BVA-001 | TCON-04-004 | TCOV-04-004 | Phone = 9 digits (lower invalid boundary) → rejected', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '123456789' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Phone number must be|invalid/i)).toBeVisible();
    });

    test('TC-04-BVA-002 | TCON-04-005 | TCOV-04-005 | Phone = 10 digits (edge valid boundary) → accepted', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '1234567890' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Order created successfully! You will be contacted for payment./i)).toBeVisible({ timeout: 10000 });
    });

    test('TC-04-BVA-003 | TCON-04-006 | TCOV-04-006 | Phone = 15 digits (upper valid boundary) → accepted', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '123456789012345' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Order created successfully! You will be contacted for payment./i)).toBeVisible({ timeout: 10000 });
    });

    test('TC-04-BVA-004 | TCON-04-007 | TCOV-04-007 | Phone = 16 digits (upper invalid boundary) → rejected', async ({ page }) => {
        await fillCheckoutForm(page, { phone: '1234567890123456' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Phone number must be|invalid/i)).toBeVisible();
    });

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    });
});

test.describe('F004 - Order Processing & Checkout (Decision Table)', () => {
    // Tests manage their own login to allow the "not logged in" test

    test('TC-04-DT-001 | TCON-04-008 | TCOV-04-008 | Logged in + valid fields + valid email → order created', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address').fill('irfan@gmail.com');
        await page.getByLabel('Password').fill('G0@wayh@ckers');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page).toHaveURL('http://localhost:3000/');
        await goToCheckout(page);
        await fillCheckoutForm(page, { phone: '1234567890' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Order created successfully! You will be contacted for payment./i)).toBeVisible({ timeout: 10000 });
    });

    test('TC-04-DT-002 | TCON-04-009 | TCOV-04-009 | Logged in + invalid email format → display email error', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address').fill('irfan@gmail.com');
        await page.getByLabel('Password').fill('G0@wayh@ckers');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page).toHaveURL('http://localhost:3000/');
        await goToCheckout(page);
        await fillCheckoutForm(page, { email: 'invalidemail', phone: '1234567890' });
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/Please enter a valid email|Invalid email|must be a valid email/i)).toBeVisible();
    });

    test('TC-04-DT-003 | TCON-04-010 | TCOV-04-010 | Logged in + missing required fields → display missing fields error', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address').fill('irfan@gmail.com');
        await page.getByLabel('Password').fill('G0@wayh@ckers');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page).toHaveURL('http://localhost:3000/');
        await goToCheckout(page);
        // Leave name, address, city empty. Fill only Email and Phone.
        // We will clear them since fillCheckoutForm doesn't clear if not explicitly handled
        await page.locator('#name-input').fill('');
        await page.locator('#address').fill('');
        await page.locator('#city').fill('');
        
        await page.getByRole('button', { name: /Place order/i }).click();
        await expect(page.getByText(/required|must be at least/i).first()).toBeVisible();
    });

    test('TC-04-DT-004 | TCON-04-011 | TCOV-04-011 | Not logged in → redirect to login page', async ({ page, context }) => {
        await context.clearCookies();
        
        // Attempt to reach checkout directly or by adding an item
        await page.goto('http://localhost:3000/shop');
        await page.getByText('View product').nth(2).click();
        await page.waitForURL('**/product/**');
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await page.goto('http://localhost:3000/cart');
        await page.getByRole('link', { name: /Checkout/i }).click();
        
        // Should redirect to login
        await expect(page).toHaveURL(/.*\/login/);
    });

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    });
});
