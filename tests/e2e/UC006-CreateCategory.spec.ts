import { test, expect } from "@playwright/test";

test.describe("UC006 - Create Category", () => {    
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

    test("Main Flow", async ({ page }) => {
        const categoryName = Math.random().toString(36).substring(2, 7);

        await page.getByRole("link", { name: "Categories" }).click();
        await page.getByRole("button", { name: "Add new category" }).click();
        await page.getByRole("textbox", { name: "Category name:" }).click();
        await page.getByRole("textbox", { name: "Category name:" }).fill(`Category ${categoryName}`);
        await page.getByRole("button", { name: "Create category" }).click();

        await expect(page.getByText(/Category added successfully/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole("link", { name: "Categories" }).click();

        await expect(page.getByText(`Category ${categoryName}`)).toBeVisible({ timeout: 10000 });
    });

    test("Alternate Flow 1 - Empty Category Name", async ({ page }) => {        
        await page.getByRole("link", { name: "Categories" }).click();
        await page.getByRole("button", { name: "Add new category" }).click();
        await page.getByRole("textbox", { name: "Category name:" }).click();
        await page.getByRole("textbox", { name: "Category name:" }).fill("");
        await page.getByRole("button", { name: "Create category" }).click();
        await expect(page.getByText(/You need to enter values to add a category/i)).toBeVisible({ timeout: 10000 });
    });

    // test("Alternate Flow 2 - Duplicate Category Name", async ({ page }) => {
    //     const categoryName = "laptops";
    
    //     await page.goto("http://localhost:3000/admin");
    //     await page.getByRole("link", { name: "Categories" }).click();
    //     await page.getByRole("button", { name: "Add new category" }).click();
    //     await page.getByRole("textbox", { name: "Category name:" }).click();
    //     await page.getByRole("textbox", { name: "Category name:" }).fill(categoryName);

    //     await page.getByRole("button", { name: "Create category" }).click();

    //     await expect(page.getByText(/Category with this name already exists/i)).toBeVisible({ timeout: 10000 });
    // })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })
});