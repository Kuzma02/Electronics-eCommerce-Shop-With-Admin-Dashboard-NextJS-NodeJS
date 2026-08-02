import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const MERCHANT_ID = '0123100001';

test.describe('F005 - Delete Product', () => {
    let testCategoryId: string;
    let testProductId: string;
    let testOrderId: string | null = null;
    let suffix: string;

    test.beforeEach(async ({ page, context }) => {
        suffix = randomUUID();

        const category = await prisma.category.create({
            data: { name: `test-delete-category-${suffix}` }
        });
        testCategoryId = category.id;

        const product = await prisma.product.create({
            data: {
                slug: `test-delete-product-${suffix}`,
                title: `Test Delete Product ${suffix}`,
                mainImage: 'placeholder.jpg',
                description: 'Test product for delete testing',
                manufacturer: 'Test Manufacturer',
                price: 100,
                categoryId: category.id,
                merchantId: MERCHANT_ID,
            }
        });
        testProductId = product.id;
        testOrderId = null;

        await context.clearCookies();
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address', { exact: true }).fill('admin@gmail.com');
        await page.getByLabel('Password', { exact: true }).fill('Admin12345!');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page.getByText(/Successful login/i)).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(5000);
    });

    test('TCOV-05-003 | Product has Linked Dependencies', async ({ page }) => {
        const order = await prisma.customer_order.create({
            data: {
                name: 'Test',
                lastname: 'User',
                phone: '0123456789',
                email: 'test@example.com',
                company: 'Test Co',
                adress: '123 Test St',
                apartment: 'Unit 1',
                postalCode: '50000',
                status: 'pending',
                city: 'Kuala Lumpur',
                country: 'Malaysia',
                total: 100,
                products: {
                    create: {
                        productId: testProductId,
                        quantity: 1,
                    }
                }
            }
        });
        testOrderId = order.id;

        await page.goto(`http://localhost:3000/admin/products/${testProductId}`);
        await page.getByRole('button', { name: /Delete product/i }).click();

        await expect(page.getByText(/Cannot delete the product because of foreign key constraint/i)).toBeVisible({ timeout: 10000 });
        await expect(page).not.toHaveURL('http://localhost:3000/admin/products', { timeout: 5000 });
    });

    test('TCOV-05-004 | Product has no Linked Dependencies', async ({ page }) => {
        await page.goto(`http://localhost:3000/admin/products/${testProductId}`);
        await page.getByRole('button', { name: /Delete product/i }).click();

        await expect(page.getByText(/Product deleted successfully/i)).toBeVisible({ timeout: 10000 });
        await page.goto('http://localhost:3000/admin/products', { timeout: 10000 });

        const modProductTitle = `test delete product ${suffix.replace(/-/g, ' ')}`;
        await expect(page.getByText(modProductTitle)).not.toBeVisible();
    });

    test.afterEach(async ({ context }) => {
        if (testCategoryId) {
            if (testOrderId) {
                await prisma.customer_order_product.deleteMany({ where: { productId: testProductId } });
                await prisma.customer_order.deleteMany({ where: { id: testOrderId } });
            }
            // deleteMany is a no-op if record is already gone (e.g. deleted by the test)
            await prisma.product.deleteMany({ where: { categoryId: testCategoryId } });
            await prisma.category.deleteMany({ where: { id: testCategoryId } });
        }
        await context.clearCookies();
    });

});

test.describe('F005 - Delete Category', () => {
    let testCategoryId: string;
    let testProductId: string | null = null;
    let suffix: string;

    test.beforeEach(async ({ page, context }) => {
        suffix = randomUUID();

        const category = await prisma.category.create({
            data: { name: `test-delete-cat-${suffix}` }
        });
        testCategoryId = category.id;
        testProductId = null;

        await context.clearCookies();
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Email address', { exact: true }).fill('admin@gmail.com');
        await page.getByLabel('Password', { exact: true }).fill('Admin12345!');
        await page.getByRole('button', { name: /SIGN IN/i }).click();
        await expect(page.getByText(/Successful login/i)).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(5000);
    });

    test('TCOV-05-005 | Category has Linked Dependencies', async ({ page }) => {
        const product = await prisma.product.create({
            data: {
                slug: `test-cascade-product-${randomUUID()}`,
                title: 'Test Cascade Product',
                mainImage: 'placeholder.jpg',
                description: 'Product for cascade delete test',
                manufacturer: 'Test Manufacturer',
                price: 100,
                categoryId: testCategoryId,
                merchantId: MERCHANT_ID,
            }
        });
        testProductId = product.id;

        await page.goto(`http://localhost:3000/admin/categories/${testCategoryId}`);
        await page.getByRole('button', { name: /Delete category/i }).click();

        const modCategoryName = suffix.replace(/-/g, ' ');
        const categoryName = `test delete cat ${modCategoryName}`; 

        await expect(page.getByText(/There was an error deleting category/i)).toBeVisible({ timeout: 10000 });
        
        await page.goto('http://localhost:3000/admin/categories', { timeout: 10000 });
        await expect(page.getByText(categoryName)).toBeVisible();
    });

    test('TCOV-05-006 | Category has no Linked Dependencies', async ({ page }) => {
        await page.goto(`http://localhost:3000/admin/categories/${testCategoryId}`);
        await page.getByRole('button', { name: /Delete category/i }).click();

        await expect(page.getByText(/Category deleted successfully/i)).toBeVisible({ timeout: 10000 });
        await page.goto('http://localhost:3000/admin/categories', { timeout: 10000 });

        const modCategoryName = `test delete cat ${suffix.replace(/-/g, ' ')}`;
        await expect(page.getByText(modCategoryName)).not.toBeVisible();
    });

    test.afterEach(async ({ context }) => {
        if (testCategoryId) {
            await prisma.product.deleteMany({ where: { categoryId: testCategoryId } });
            await prisma.category.deleteMany({ where: { id: testCategoryId } });
        }
        await context.clearCookies();
    });

    test.afterAll(async () => {
        await prisma.$disconnect();
    });
});
