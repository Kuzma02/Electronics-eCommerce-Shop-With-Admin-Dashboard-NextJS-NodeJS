import { test, expect } from "@playwright/test";

test.describe("UC007 - Update Category", () => {    
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/login");
        await page.getByLabel('Email address', { exact: true }).fill("admin@gmail.com");
        await page.getByLabel('Password', { exact: true }).fill("Admin12345!");
        await page.getByRole('button', { name: /SIGN IN/i }).click();

        await expect(page.getByText(/Successful login/i)).toBeVisible({ timeout: 10000 });
        
        // stop test for 5 seconds to wait for authentication to be processed before navigating to admin page
        await page.waitForTimeout(5000);
        
        await page.goto("http://localhost:3000/admin");
    });

    test("Main Flow", async ({ page }) => {
        const extendCategoryName = Math.random().toString(36).substring(2, 7);

        await page.getByRole('link', { name: 'Categories' }).click();
        await page.getByRole('link', { name: 'details' }).first().click();
        
        await page.getByRole('textbox', { name: 'Category name:' }).click();
        await page.getByRole('textbox', { name: 'Category name:' }).fill(`0 category ${extendCategoryName}`);
        await page.getByRole('button', { name: 'Update category' }).click();
        
        await expect(page.getByText(/Category successfully updated/i)).toBeVisible({ timeout: 10000 });
        
        await page.getByRole('link', { name: 'Categories' }).click();
        await expect(page.getByText(`0 category ${extendCategoryName}`)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 1 - Empty Category Name", async ({ page }) => {        
        await page.getByRole("link", { name: "Categories" }).click();
        await page.getByRole('link', { name: 'details' }).first().click();
        
        await page.getByRole("textbox", { name: "Category name:" }).click();
        await page.getByRole("textbox", { name: "Category name:" }).fill("");
        await page.getByRole("button", { name: "Update category" }).click();
        
        await expect(page.getByText(/For updating a category you must enter all values/i)).toBeVisible({ timeout: 10000 });
    });

    // test("Alternate Flow 2 - Duplicate Category Name", async ({ page }) => {
    //     const categoryName = "laptops";
    
    //     await page.goto("http://localhost:3000/admin");
        
    //     await page.getByRole("link", { name: "Categories" }).click();
    //     await page.getByRole('link', { name: 'details' }).first().click();
        
    //     await page.getByRole("textbox", { name: "Category name:" }).click();
    //     await page.getByRole("textbox", { name: "Category name:" }).fill(categoryName);
    //     await page.getByRole("button", { name: "Update category" }).click();
        
    //     await expect(page.getByText(/duplicate/i)).toBeVisible({ timeout: 10000 });
    // })
});