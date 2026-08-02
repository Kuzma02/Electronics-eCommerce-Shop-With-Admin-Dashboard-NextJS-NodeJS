import { test, expect } from '@playwright/test';

test.describe('UC001 - User Authentication', () => {
  test('Main Flow', async ({ page }) => {
    const email = `${crypto.randomUUID()}@example.com`;
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    await page.getByText('Register').first().click();
    
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });

    await page.getByLabel('Name', { exact: true }).fill('John');
    await page.getByLabel('Lastname', { exact: true }).fill('Doe');
    await page.getByLabel('Email address', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill('ValidPass1!');
    await page.getByLabel('Confirm password', { exact: true }).fill('ValidPass1!');
    await page.getByLabel(/accept our terms and privacy policy/i).check();
    
    await page.getByRole('button', { name: /SIGN UP/i }).click();

    await expect(page.getByText(/Registration successful/i)).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    await page.getByLabel('Email address', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill('ValidPass1!');
    await page.getByRole('button', { name: /SIGN IN/i }).click();

    await expect(page.getByText(/Successful login/i)).toBeVisible({ timeout: 10000 });
  });

  test('Alternate Flow 1 - Duplicate Email', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    await page.getByText('Register').first().click();
    
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });

    await page.getByLabel('Name', { exact: true }).fill('John');
    await page.getByLabel('Lastname', { exact: true }).fill('Doe');
    await page.getByLabel('Email address', { exact: true }).fill('admin@gmail.com');
    await page.getByLabel('Password', { exact: true }).fill('ValidPass1!');
    await page.getByLabel('Confirm password', { exact: true }).fill('ValidPass1!');
    await page.getByLabel(/accept our terms and privacy policy/i).check();
    
    await page.getByRole('button', { name: /SIGN UP/i }).click();

    await expect(page.locator('text=Email is already in use').nth(1)).toBeVisible({ timeout: 5000 });
  })

  test('Alternate Flow 2 - Password does not meet requirements', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.getByText('Register').first().click();
    
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });
    
    await page.getByLabel('Name', { exact: true }).fill('John');
    await page.getByLabel('Lastname', { exact: true }).fill('Doe');
    await page.getByLabel('Email address', { exact: true }).fill(`${crypto.randomUUID()}@example.com`);
    await page.getByLabel('Password', { exact: true }).fill('short');
    await page.getByLabel('Confirm password', { exact: true }).fill('short');
    await page.getByLabel(/accept our terms and privacy policy/i).check();
    
    await page.getByRole('button', { name: /SIGN UP/i }).click();

    await expect(page.locator('text=Password must be 8 characters long').nth(1)).toBeVisible({ timeout: 5000 });
  })

  test('Alternate Flow 3 - Password and Confirm Password Mismatch', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.getByText('Register').first().click();
    
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });
    
    await page.getByLabel('Name', { exact: true }).fill('John');
    await page.getByLabel('Lastname', { exact: true }).fill('Doe');
    await page.getByLabel('Email address', { exact: true }).fill(`${crypto.randomUUID()}@example.com`);
    await page.getByLabel('Password', { exact: true }).fill('ValidPass1!');
    await page.getByLabel('Confirm password', { exact: true }).fill('Different1!');
    await page.getByLabel(/accept our terms and privacy policy/i).check();

    await page.getByRole('button', { name: /SIGN UP/i }).click();

    await expect(page.locator('text=Passwords are not equal').nth(1)).toBeVisible({ timeout: 5000 });
  })

  test('Alternate Flow 4 - Empty Fields', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.getByText('Register').first().click();
    // check back requirements if we use error messages 
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

    await page.getByRole('button', { name: /SIGN UP/i }).click();
    
    const fields = ['name', 'lastname', 'email', 'password', 'confirmpassword'];

    const messages = await Promise.all(
      fields.map((name) =>
        page.locator(`input[name="${name}"]`).evaluate(
          (el) => (el as HTMLInputElement).validationMessage
        )
      )
    );

    const hasValidationMessage = messages.some((msg) => /fill.?out this field|fill in this field/i.test(msg));
    expect(hasValidationMessage).toBe(true);
  })

  test('Alternate Flow 5 - Invalid Email Format', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.getByText('Register').first().click();
    
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });
    await page.getByLabel('Name', { exact: true }).fill('Eve');
    await page.getByLabel('Lastname', { exact: true }).fill('Davis');
    await page.getByLabel('Email address', { exact: true }).fill('johndoetest.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password', { exact: true }).fill('Password123!');
    await page.getByLabel(/accept our terms and privacy policy/i).check();
    
    await page.getByRole('button', { name: /SIGN UP/i }).click();
    
    const emailMessage = await page.locator('input[name="email"]').evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );

    expect(emailMessage).toMatch(/email address/i);    
  })

  test('Alternate Flow 6 - Terms Not Accepted', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.getByText('Register').first().click();
    
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible({ timeout: 10000 });
    
    await page.getByLabel('Name', { exact: true }).fill('Bob');
    await page.getByLabel('Lastname', { exact: true }).fill('Johnson');
    await page.getByLabel('Email address', { exact: true }).fill(`${crypto.randomUUID()}@example.com`);
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password', { exact: true }).fill('Password123!');
        
    await page.getByRole('button', { name: /SIGN UP/i }).click();

    await expect(page.getByText(/Please accept our terms and privacy policy/i)).toBeVisible({ timeout: 5000 });
  })

  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  })
});
