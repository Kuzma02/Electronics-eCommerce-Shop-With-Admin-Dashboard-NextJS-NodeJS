import { test, expect } from '@playwright/test';

test.describe('UC003 - Shopping Cart Management', () => {
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
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await page.getByRole('button', { name: 'Add to cart' }).click();
        
        await page.getByRole('link', { name: '1' }).click();

        await page.getByRole('link', { name: 'Checkout' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('John');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Deriv ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();
        
        await expect(page.getByText('Order created successfully!')).toBeVisible({ timeout: 10000 })

        await page.getByRole('button', { name: 'Notifications (1 unread)' }).click();
        await page.getByRole('link', { name: 'View in Notification Center →' }).click();
        await expect(page.locator('div').filter({ hasText: 'Order ConfirmedHighGreat news' }).nth(3)).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'Mark as read' }).click();
        
        await expect(page.getByText('Notification marked as read')).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 1 - ', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        // extract product price and calculate expected subtotal
        await page.getByText('$').click();

        const priceText = await page.getByText('$').textContent();
        const price = parseFloat(priceText!.replace('$', ''));
        const expectedSubtotal = price * 3;

        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });

        await page.getByRole('button', { name: 'Add to cart' }).click();
        await page.getByRole('link', { name: '1' }).click();

        await page.waitForURL(/\/cart/);

        await page.getByRole('button').nth(4).click();
        await page.waitForTimeout(500);
        await page.getByRole('button').nth(4).click();

        // check if subtotal is correct
        // Cart renders "Subtotal" (dt) and "$total" (dd) as separate elements, so locate the dd paired with Subtotal
        const subtotalDd = page.locator('dl div').filter({ has: page.getByText('Subtotal', { exact: true }) }).locator('dd');
        await expect(subtotalDd).toBeVisible({ timeout: 10000 });
        const subtotalText = await subtotalDd.textContent();
        const actualSubtotal = parseFloat(subtotalText!.replace('$', ''));
        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

        await page.getByRole('link', { name: 'Checkout' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('John');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Deriv ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();
        
        await expect(page.getByText('Order created successfully!')).toBeVisible({ timeout: 10000 })

        await page.getByRole('button', { name: 'Notifications (1 unread)' }).click();
        await page.getByRole('link', { name: 'View in Notification Center →' }).click();
        await expect(page.locator('div').filter({ hasText: 'Order ConfirmedHighGreat news' }).nth(3)).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'Mark as read' }).click();
        
        await expect(page.getByText('Notification marked as read')).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 2 - multiple products to checkout', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();
        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();
        await page.waitForTimeout(1500);

        // === Product 1 ===
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);

        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });

        await page.getByText('$').click();
        const price1Text = await page.getByText('$').textContent();
        const price1 = parseFloat(price1Text!.replace('$', ''));

        await page.getByRole('button', { name: 'Add to cart' }).click();

        // === Back to shop for Product 2 ===
        await page.goBack();
        await page.waitForURL(/\/shop/);
        await page.waitForTimeout(1000);
        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();
        await page.waitForTimeout(1500);

        await page.getByRole('link', { name: 'View product' }).nth(1).click();
        await page.waitForURL(/\/product\//);

        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });

        await page.getByText('$').click();
        const price2Text = await page.getByText('$').textContent();
        const price2 = parseFloat(price2Text!.replace('$', ''));

        await page.getByRole('button', { name: 'Add to cart' }).click();

        // === Navigate to cart (shows 2 items) ===
        await page.getByRole('link', { name: '2' }).click();
        await page.waitForURL(/\/cart/);

        await page.getByRole('button').nth(4).click();
        await page.waitForTimeout(500);

        // Increase product 2: qty 1 → 4 (three clicks)
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
        await page.waitForTimeout(500);
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
        await page.waitForTimeout(500);
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
        await page.waitForTimeout(500);

        // Verify subtotal = (price1 × 2) + (price2 × 4)
        const expectedSubtotal = price1 * 2 + price2 * 4;
        const subtotalDd = page.locator('dl div').filter({ has: page.getByText('Subtotal', { exact: true }) }).locator('dd');
        await expect(subtotalDd).toBeVisible({ timeout: 10000 });
        const subtotalText = await subtotalDd.textContent();
        const actualSubtotal = parseFloat(subtotalText!.replace('$', ''));
        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

        await page.getByRole('link', { name: 'Checkout' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('John');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Deriv ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');

        await page.getByRole('button', { name: 'Place Order' }).click();

        await expect(page.getByText('Order created successfully!')).toBeVisible({ timeout: 10000 });

        await page.waitForURL('http://localhost:3000/', { timeout: 10000 });

        await page.getByRole('button', { name: 'Notifications (1 unread)' }).click();
        await page.getByRole('link', { name: 'View in Notification Center →' }).click();
        await expect(page.locator('div').filter({ hasText: 'Order ConfirmedHighGreat news' }).nth(3)).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'Mark as read' }).click();

        await expect(page.getByText('Notification marked as read')).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 3 - filter by minimum rating', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await page.getByRole('button', { name: 'Buy Now' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('John');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Deriv ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();
        
        await expect(page.getByText('Order created successfully!')).toBeVisible({ timeout: 10000 })

        await page.getByRole('button', { name: 'Notifications (1 unread)' }).click();
        await page.getByRole('link', { name: 'View in Notification Center →' }).click();
        await expect(page.locator('div').filter({ hasText: 'Order ConfirmedHighGreat news' }).nth(3)).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'Mark as read' }).click();
        
        await expect(page.getByText('Notification marked as read')).toBeVisible({ timeout: 10000 });
    })

    // figure out the best way to test the sort options

    test('Alternate Flow 4 - cart has item but buys 1 item via Buy Now', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();
        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();
        await page.waitForTimeout(1500);

        // === select product 1 ===
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);

        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });

        await page.getByText('$').click();
        const price1Text = await page.getByText('$').textContent();
        const price1 = parseFloat(price1Text!.replace('$', ''));

        await page.getByRole('button', { name: 'Add to cart' }).click();

        // === Back to shop for selecting product 2 but via "Buy Now" instead of "Add to cart" ===
        await page.goBack();
        await page.waitForURL(/\/shop/);
        await page.waitForTimeout(1000);
        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();
        await page.waitForTimeout(1500);

        await page.getByRole('link', { name: 'View product' }).nth(1).click();
        await page.waitForURL(/\/product\//);

        await expect(page.getByText('In stock')).toBeVisible({ timeout: 10000 });

        await page.getByText('$').click();
        const price2Text = await page.getByText('$').textContent();
        const price2 = parseFloat(price2Text!.replace('$', ''));

        await page.getByRole('button', { name: 'Buy Now' }).click();

        // Verify subtotal for the single item from Buy Now
        const expectedSubtotal = price2;
        const subtotalDd = page.locator('dl div').filter({ has: page.getByText('Subtotal', { exact: true }) }).locator('dd');
        await expect(subtotalDd).toBeVisible({ timeout: 10000 });
        const subtotalText = await subtotalDd.textContent();
        const actualSubtotal = parseFloat(subtotalText!.replace('$', ''));
        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('John');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Deriv ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');

        await page.getByRole('button', { name: 'Place Order' }).click();

        await expect(page.getByText('Order created successfully!')).toBeVisible({ timeout: 10000 });

        await page.waitForURL('http://localhost:3000/', { timeout: 10000 });

        await page.getByRole('button', { name: 'Notifications (1 unread)' }).click();
        await page.getByRole('link', { name: 'View in Notification Center →' }).click();
        await expect(page.locator('div').filter({ hasText: 'Order ConfirmedHighGreat news' }).nth(3)).toBeVisible({ timeout: 10000 });
        await page.getByRole('button', { name: 'Mark as read' }).click();

        await expect(page.getByText('Notification marked as read')).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 5 - invalid email in contact info from Checkout', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await page.getByRole('button', { name: 'Buy Now' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('John');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`invalidemail`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Deriv ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();
        await expect(page.getByText(/Please enter a valid email address/i)).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 6 - Empty Required Fields at Checkout', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await page.getByRole('button', { name: 'Buy Now' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Batista');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill('Sime Darby');
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill('');
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill('Amanda Apartment');
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();

        await expect(page.getByText(/Name must be at least 2 characters/i)).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/Address must be at least 5 characters/i)).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/City must be at least 5 characters/i)).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 7 - phone number too short.', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await page.getByRole('button', { name: 'Buy Now' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('Jo');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('Do');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('12345');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Company ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();

        await expect(page.getByText(/Phone number must be at least 10 digits/i)).toBeVisible({ timeout: 10000 });
    })

    test('Alternate Flow 8 - name and lastname fewer than 2 characters', async ({ page }) => {
        const inputExtension = Math.random().toString(36).substring(2, 7)

        await page.getByRole('link', { name: 'SHOP NOW' }).click();

        await page.getByRole('checkbox', { name: 'Out of stock' }).uncheck();

        await page.waitForTimeout(1500);
        await page.getByRole('link', { name: 'View product' }).first().click();
        await page.waitForURL(/\/product\//);  // wait for product page nav to complete

        await page.getByRole('button', { name: 'Buy Now' }).click();

        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).click();
        await page.getByRole('textbox', { name: 'Name * (min 2 characters)', exact: true }).fill('A');
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).click();
        await page.getByRole('textbox', { name: 'Lastname * (min 2 characters)' }).fill('A');
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).click();
        await page.getByRole('textbox', { name: 'Phone number * (min 10 digits)' }).fill('60104456678');
        await page.getByRole('textbox', { name: 'Email address *' }).click();
        await page.getByRole('textbox', { name: 'Email address *' }).fill(`johndoe${inputExtension}@gmail.com`);
        await page.getByRole('textbox', { name: 'Company *' }).click();
        await page.getByRole('textbox', { name: 'Company *' }).fill(`Company ${inputExtension}`);
        await page.getByRole('textbox', { name: 'Address *', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address *', exact: true }).fill(`Jalan Sumetera ${inputExtension}, Lorong 10/5`);
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).click();
        await page.getByRole('textbox', { name: 'Apartment, suite, etc. * (' }).fill(`Office Building ${inputExtension}`);
        await page.getByRole('textbox', { name: 'City *' }).click();
        await page.getByRole('textbox', { name: 'City *' }).fill('Selangor');
        await page.getByRole('textbox', { name: 'Country *' }).click();
        await page.getByRole('textbox', { name: 'Country *' }).fill('Malaysia');
        await page.getByRole('textbox', { name: 'Postal code *' }).click();
        await page.getByRole('textbox', { name: 'Postal code *' }).fill('42610');
        await page.getByRole('textbox', { name: 'Order notice' }).click();
        await page.getByRole('textbox', { name: 'Order notice' }).fill('Place it near guard house.');
        
        await page.getByRole('button', { name: 'Place Order' }).click();

        await expect(page.getByText('Lastname must be at least 2 characters', { exact: true })).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Name must be at least 2 characters', { exact: true })).toBeVisible({ timeout: 10000 });
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
})