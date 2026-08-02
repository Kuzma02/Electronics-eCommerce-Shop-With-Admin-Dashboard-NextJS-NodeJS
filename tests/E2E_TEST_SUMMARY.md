# E2E Test Suite Summary

## Application Overview

This is an electronics eCommerce platform with two distinct surfaces:

- **Public storefront** (`/`, `/shop`, `/product/[slug]`, `/cart`, `/checkout`) — accessible by any visitor; requires login for cart and checkout.
- **Admin dashboard** (`/admin`) — restricted to admin-role users; used to manage products, categories, merchants, and users.

The app runs locally at `http://localhost:3000`. The backend is a Node.js server; the frontend is Next.js.

---

## Test Infrastructure

- **Framework:** Playwright
- **Admin credentials used across most tests:** `admin@gmail.com` / `Admin12345!`
- **Auth pattern:** Most test files log in via `beforeEach` and clear browser cookies via `afterEach` to ensure test isolation.
- **Post-login wait:** A `waitForTimeout(5000)` is used after login before navigating to `/admin` to allow authentication to propagate.
- **Test fixtures (files used as upload inputs):**
  - `tests/fixtures/earbuds_black.jpg` — product image used in product create/update tests
  - `tests/fixtures/product-main-flow.csv` — valid CSV for bulk upload happy path
  - `tests/fixtures/product-alt-flow-1.csv` — CSV with a non-existent category
  - `tests/fixtures/product-alt-flow-2.csv` — CSV with empty required fields
  - `tests/fixtures/product-alt-flow-3.csv` — CSV with duplicate slugs
  - `tests/fixtures/product-alt-flow-5.csv` — CSV with an oversized field value

---

## Known Issues / Caveats

- **Commented-out tests:** Several tests that submit duplicate slugs are commented out with the note `"crashes the backend"`. These exist in UC004 (Alt Flow 3), UC005 (Alt Flow 3), and UC012 (Alt Flow 4). They are intentionally skipped.
- **UC007 file anomaly:** The `UC007-UpdateCategory.spec.ts` file contains test implementations that are identical to UC006 (create category). It appears the file was never updated with actual update-category logic.
- **Misnamed test — UC003 Alt Flow 3:** The test is named `"filter by minimum rating"` but its implementation tests the **Buy Now** checkout flow (not filtering). Treat it as a "Buy Now single-item checkout" test.
- **Unnamed tests:** UC003 Alt Flow 1 and UC010 Alt Flow 5 have empty descriptions in the test name (`'Alternate Flow 1 - '`). Their behaviour is documented below based on the implementation.
- **State reversion:** Some alternate flow tests modify shared data and revert it at the end (e.g., UC005 Alt Flow 2 toggles stock status back, UC009 Alt Flow 2 reverts merchant status, UC012 Alt Flows 1 & 2 revert user roles). These must complete fully to avoid polluting subsequent test runs.

---

## UC001 — User Authentication

**File:** `UC001-UserAuthentication.spec.ts`

Tests user self-registration and login on the public storefront. No `beforeEach` login — each test starts from the homepage unauthenticated.

| Flow | Description |
|------|-------------|
| **Main Flow** | Registers a new account with a unique random email, verifies the "Registration successful" toast, then immediately logs in with the same credentials and verifies the "Successful login" toast. |
| **Alt Flow 1** | Attempts registration using an already-registered email (`tharshen@gmail.com`). Expects "Email is already in use" error. |
| **Alt Flow 2** | Submits a password containing only digits (`12121212`) — no uppercase, lowercase, or special character. Expects the password complexity validation error. |
| **Alt Flow 3** | Submits mismatched Password and Confirm Password values. Expects "Passwords are not equal" error. |
| **Alt Flow 4** | Fills only Name and Lastname, leaves all other fields empty, and submits. Expects "Please fill in all required fields" error. |
| **Alt Flow 5** | Enters `invalid-email-format` (no `@` or domain) as the email. Expects "Invalid email format" error. |
| **Alt Flow 6** | Fills all fields correctly but does not check the Terms & Privacy Policy checkbox. Expects "Please accept our terms and privacy policy" error. |

---

## UC002 — Filter and Sort Products

**File:** `UC002-FilterAndSortProducts.spec.ts`

Tests the shop page filter panel and sort dropdown. Logs in as admin in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Clicks the "Head Phones" category navigation link, verifies the URL contains `headphones` and the correct page heading is visible. |
| **Alt Flow 1** | Unchecks "Out of stock" (shows in-stock only), opens the first product, verifies it shows "In stock". Then navigates to an explicit out-of-stock-only URL, verifies the first product shows "Out of stock". |
| **Alt Flow 2** | Drags the max price slider to `$40`, verifies the label updates, waits for filtered results, then asserts every displayed price is ≤ $40. |
| **Alt Flow 3** | Drags the minimum rating slider to `5` and verifies the URL updates to include `rating=5`. |
| **Alt Flow 4** | Selects sort option `titleAsc` from the dropdown, waits for the URL and page to update, then asserts all displayed product titles are in ascending (A→Z) alphabetical order. |
| **Alt Flow 5** | Selects sort option `titleDesc`, then asserts all titles are in descending (Z→A) alphabetical order. |
| **Alt Flow 6** | Selects sort option `lowPrice`, then asserts all displayed prices are in ascending (low→high) order. |
| **Alt Flow 7** | Selects sort option `highPrice`, then asserts all displayed prices are in descending (high→low) order. |
| **Alt Flow 8** | Navigates to the Laptops category, then simultaneously applies: in-stock only, max price $80, min rating 4, sort by low price. Verifies all results are ≤ $80 and the first product is in stock. |

---

## UC003 — Shopping Cart Management

**File:** `UC003-ShoppingCartManagement.spec.ts`

Tests the full add-to-cart, quantity management, and checkout flow including post-order notifications. Logs in as admin in `beforeEach`.

> All checkout tests fill the same shipping/contact form: Name, Lastname, Phone, Email, Company, Address, Apartment, City, Country, Postal Code, and an optional Order Notice. After a successful order, the test also opens the notification bell and marks the order confirmation notification as read.

| Flow | Description |
|------|-------------|
| **Main Flow** | Filters to in-stock products, adds the first product to cart (qty 1), proceeds to checkout, fills all fields, places the order, verifies the "Order created successfully!" toast, then marks the "Order Confirmed" notification as read. |
| **Alt Flow 1** *(unnamed — "increase quantity then checkout")* | Adds one in-stock product to cart, uses the `+` button in the cart twice to increase quantity to 3, verifies the cart subtotal equals `price × 3`, then completes checkout and verifies the order notification. |
| **Alt Flow 2** | Adds two different in-stock products to the cart (one each), then increases product 1 to qty 2 and product 2 to qty 4 in the cart. Verifies subtotal equals `(price1 × 2) + (price2 × 4)`, completes checkout, and verifies the notification. |
| **Alt Flow 3** ⚠️ *(misleadingly named "filter by minimum rating")* | Uses the **"Buy Now"** button on a single in-stock product (bypasses cart entirely), fills checkout details, places the order, and verifies the notification. |
| **Alt Flow 4** | Adds product 1 via "Add to cart", then uses **"Buy Now"** on product 2. Verifies the checkout subtotal reflects only product 2's price — i.e., "Buy Now" creates a one-item order that ignores the existing cart contents. |
| **Alt Flow 5** | Uses "Buy Now", enters an invalid email (missing `@`) in the checkout form. Expects "Please enter a valid email address" validation error. |
| **Alt Flow 6** | Uses "Buy Now", intentionally leaves Company, Address, and Apartment fields empty. Expects all three field-level validation errors to appear simultaneously. |
| **Alt Flow 7** | Uses "Buy Now", enters a phone number shorter than 10 digits (`12345`). Expects "Phone number must be at least 10 digits" error. |
| **Alt Flow 8** | Uses "Buy Now", enters single-character Name (`J`) and Lastname (`D`). Expects both "Name must be at least 2 characters" and "Lastname must be at least 2 characters" errors. |

---

## UC004 — Create Product

**File:** `UC004-CreateProduct.spec.ts`

Tests product creation via the admin dashboard (`/admin` → Products → Add new product). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Selects "Demo Merchant", fills all fields (name, slug, category, price, manufacturer, uploads `earbuds_black.jpg`, description), submits. Verifies "Product added successfully" toast, then confirms the new product name appears in the products list. |
| **Alt Flow 1** | Leaves name, slug, and manufacturer empty (only fills price, category, image, description). Expects "Please enter values in input fields" error. |
| **Alt Flow 2** | Fills all fields including uploading an image — but the test is structured to assert the product does **not** appear in the list afterward, implying a scenario where creation should fail. Note: the exact failure condition is unclear from the current implementation; this test may be incomplete. |
| ~~**Alt Flow 3**~~ | *(Commented out)* Submits a duplicate slug (`wireless-earbuds-demo`). Disabled because it crashes the backend. |

---

## UC005 — Update Product

**File:** `UC005-UpdateProduct.spec.ts`

Tests updating an existing product via the admin dashboard (`/admin` → Products → details). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Opens the first product's detail page, updates all fields (name, slug, category, price, manufacturer, image, description), submits. Verifies "Product successfully updated" toast and the updated name appears in the products list. |
| **Alt Flow 1** | Opens the second product, clears the name and price fields, submits. Expects "You need to enter values in input fields" error. |
| **Alt Flow 2** | Opens the fifth product, switches the stock status dropdown to **Out of stock** (no image re-upload needed), saves. Verifies success toast and "Out of stock" label in the products list. **Reverts the product back to In stock at the end** to preserve test isolation. |
| ~~**Alt Flow 3**~~ | *(Commented out)* Inputs a duplicate slug. Disabled because it crashes the backend. |

---

## UC006 — Create Category

**File:** `UC006-CreateCategory.spec.ts`

Tests category creation via the admin dashboard (`/admin` → Categories → Add new category). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Enters a random alphanumeric category name, submits. Verifies "Category added successfully" toast, navigates back to the category list, and confirms the new name is visible. |
| **Alt Flow 1** | Submits the form with the category name field empty. Expects "You need to enter values to add a category" error. |
| **Alt Flow 2** | Submits using the already-existing name `"cameras"`. Expects "Category with this name already exists" error. |

---

## UC007 — Update Category

**File:** `UC007-UpdateCategory.spec.ts`

> ⚠️ **File anomaly:** The test implementations in this file are identical to UC006 (create category). The file appears to have been created as a scaffold for update-category tests but was never updated with actual update logic. Treat this file as a duplicate of UC006 until it is corrected.

| Flow | Description |
|------|-------------|
| **Main Flow** | Same as UC006 Main Flow — creates a random category and verifies it in the list. |
| **Alt Flow 1** | Same as UC006 Alt Flow 1 — empty name submission. |
| **Alt Flow 2** | Same as UC006 Alt Flow 2 — duplicate name submission. |

---

## UC008 — Create Merchant

**File:** `UC008-CreateMerchant.spec.ts`

Tests merchant creation via the admin dashboard (`/admin` → Merchant → Add Merchant). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Fills all merchant fields (name, email, phone, address, description), submits. Expects "Merchant created successfully" toast. |
| **Alt Flow 1** | Leaves the name field empty, submits. Asserts the browser's native HTML5 `validationMessage` on the name input matches `/fill out/i`. |
| **Alt Flow 2** | Enters an invalid email (`"test"`, no `@`), submits. Asserts the browser's native `validationMessage` on the email input matches `/email address/i`. |
| **Alt Flow 3** | Enters a non-numeric string as the phone number, submits. Asserts the browser's native `validationMessage` on the phone input is non-empty. |
| **Alt Flow 4** | Fills all fields, then clicks **Cancel** instead of submitting. Note: a comment in the code says `"cancel button not working"` — this test may be flagging a known UI bug with the cancel/navigation link. |

---

## UC009 — Update Merchant

**File:** `UC009-UpdateMerchant.spec.ts`

Tests updating an existing merchant via the admin dashboard (`/admin` → Merchant → Edit). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Opens the first merchant's edit form, updates name, email, phone, and address (all with a random suffix), saves. Verifies "Merchant updated successfully" toast. |
| **Alt Flow 1** | Opens the second merchant, clears the name field, saves. Asserts the browser's native `validationMessage` matches `/fill out this field/i`. |
| **Alt Flow 2** | Opens the third merchant, changes the status dropdown to `INACTIVE`, saves. Verifies success toast and "INACTIVE" label in the merchant list. **Reverts back to `ACTIVE` at the end** for test isolation. |
| **Alt Flow 3** | Opens the fourth merchant, sets email to `"testgmailcom"` (no `@`), saves. Asserts the browser's native `validationMessage` matches `/email address/i`. |
| **Alt Flow 4** | Opens the fifth merchant, sets phone to a non-numeric string, saves. Asserts the native validation message is non-empty. |
| **Alt Flow 5** | Opens the sixth merchant, fills all fields with changes, then clicks **"Back to Merchants"** instead of saving. Verifies navigation away from the edit page. |

---

## UC010 — Bulk Upload

**File:** `UC010-BulkUpload.spec.ts`

Tests the CSV bulk product upload feature in the admin dashboard (`/admin` → Bulk Upload). Logs in and navigates to `/admin` in `beforeEach`. Every test first clicks "Download CSV Template" and asserts the downloaded filename is `product-template.csv` before uploading a fixture file.

| Flow | Description |
|------|-------------|
| **Main Flow** | Downloads the CSV template, uploads `product-main-flow.csv` (a valid, well-formed CSV). Expects "Products uploaded successfully" toast. |
| **Alt Flow 1** | Uploads `product-alt-flow-1.csv` which references a category that does not exist in the database. Expects a "Database operation failed" status toast and a "category not found" error message. |
| **Alt Flow 2** | Uploads `product-alt-flow-2.csv` which has empty required fields (category, slug, description). Expects a "Database operation failed" status toast and a "cannot be empty" error message. |
| **Alt Flow 3** | Uploads `product-alt-flow-2.csv` again, this time targeting duplicate slug detection. Expects a "Database operation failed" status toast and an "invalid slug or duplicate slug" error message. |
| **Alt Flow 4** | Attempts to upload `earbuds_black.jpg` (a JPEG, not a CSV). Expects an alert matching `/invalid file\|only csv\|unsupported format/i` and the "Upload Products" button to be disabled. |
| **Alt Flow 5** *(unnamed)* | Uploads `product-alt-flow-5.csv` which contains an oversized field value. Expects a "Database operation failed" status toast and a "too large" error message. |

---

## UC011 — Create User

**File:** `UC011-CreateUser.spec.ts`

Tests user creation via the admin dashboard (`/admin` → Users → Add new user). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Fills a unique random email and a valid password, submits. Expects "User added successfully" toast. |
| **Alt Flow 1** | Same as Main Flow but explicitly selects the `admin` role from the role dropdown before submitting. Expects "User added successfully" toast. |
| **Alt Flow 2** | Submits the form with both email and password fields empty. Expects "You must enter all input values to add a user" error. |
| **Alt Flow 3** | Attempts to create a user using the already-existing email `admin@gmail.com`. Expects "Error while creating user" error. |
| **Alt Flow 4** | Enters a malformed email (`testXXXgmail.com`, no `@`). Expects "You entered invalid email address format" error. |
| **Alt Flow 5** | Enters a password that is too short (`"123"`). Expects "Password must be longer than 7 characters" error. |

---

## UC012 — Update User

**File:** `UC012-UpdateUser.spec.ts`

Tests updating an existing user via the admin dashboard (`/admin` → User → details). Logs in and navigates to `/admin` in `beforeEach`.

| Flow | Description |
|------|-------------|
| **Main Flow** | Opens the first user, updates the email to a unique random address and sets a new password, saves. Verifies "User successfully updated" toast and the new email appears in the users list. |
| **Alt Flow 1** | Opens the second user, sets a new password and switches the role to `admin`, saves. Verifies success and the `admin` role label in the list. **Reverts back to `user` role at the end** for test isolation. |
| **Alt Flow 2** | Opens the third user, sets a new password and switches the role to `user`, saves. Verifies success. **Reverts back to `admin` role at the end** for test isolation. |
| **Alt Flow 3** | Opens the fourth user, sets an invalid email format (no `@`), submits. Expects "You entered invalid email address format" error. |
| ~~**Alt Flow 4**~~ | *(Commented out)* Updates a user to a duplicate email. Disabled because it crashes the backend. |
| **Alt Flow 5** | Opens the sixth user, sets a password of `"123"` (too short), submits. Expects "Password must be longer than 7 characters" error. |
| **Alt Flow 6** | Opens the seventh user, clears the email field entirely, submits. Expects "For updating a user you must enter all values" error. |
