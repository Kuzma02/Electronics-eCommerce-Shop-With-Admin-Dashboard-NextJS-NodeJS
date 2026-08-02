# Playwright Test Guidance — F002, F003, F004, F007
**Project:** Singitronic E-Commerce Electronics Platform  
**For:** Antigravity (codebase owner)  
**Reference files:** `F001-UserAuthenticationAndSessionManagement_spec.ts`, `F005-AdminInventoryAndCatalogManagement_spec.ts`, `F006-AdminUserManagement_spec.ts`

---

## Context

We need Playwright E2E tests for four features. Use the existing spec files as your style reference — same import pattern, same `test.describe` / `test.beforeEach` / `test.afterEach` structure, same `context.clearCookies()` teardown convention. All tests run against `http://localhost:3000`.

Tests cover only the **non-use-case** test types for each feature (use case tests are handled separately). The test IDs, TCOV and TCON numbers, and expected behaviours come directly from the Part 1 Test Design Specification.

---

## Naming Convention

Looking at the existing spec files, F005 and F006 use **TCOV only** in the test title, while F001 uses **TCON | TCOV**. For consistency, use **all three IDs** — TC ID, TCON, and TCOV — in every test title:

```ts
test('TC-02-DT-001 | TCON-02-001 | TCOV-02-001 | Price filter only applied', ...)
```

For F007 STT, TCOV = TCON (same number per the spec), so:

```ts
test('TC-07-STT-001 | TCON-07-004 | TCOV-07-004 | PENDING → PROCESSING (valid)', ...)
```

---

## Global Setup Assumptions

- Backend at `http://localhost:3001`, frontend at `http://localhost:3000`
- MySQL seeded with demo data (`node insertDemoData.js`)
- Admin account: `admin@gmail.com` / `Admin12345!`
- Regular user account: `irfan@gmail.com` / `G0@wayh@ckers`
- Prisma client available for DB setup/teardown where needed (same pattern as F005 spec)

---

## F002 — Product Browsing & Discovery

**File:** `F002-ProductBrowsingAndDiscovery_spec.ts`  
**Test type:** Decision Table Testing  
**`test.describe`:** `'F002 - Product Browsing & Discovery (Decision Table)'`

No login needed. `beforeEach` navigates to the Shop page.

### Tests

| Test title | TC ID | TCON | TCOV | Setup | Expected |
|---|---|---|---|---|---|
| `Price filter only applied (no rating, no in-stock filter)` | TC-02-DT-001 | TCON-02-001 | TCOV-02-001 | Set Max Price slider to $40. Leave Min Rating = 0, both availability checkboxes checked (defaults). | Only products ≤ $40 shown. No products above $40 visible. |
| `Price + rating filters combined` | TC-02-DT-002 | TCON-02-002 | TCOV-02-002 | Set Max Price = $100, Min Rating = 3 stars. Leave availability defaults. | Only products ≤ $100 AND rated ≥ 3 shown. AND logic strictly applied. |
| `Price + rating + in-stock filters combined` | TC-02-DT-003 | TCON-02-003 | TCOV-02-003 | Set Max Price = $100, Min Rating = 3. Uncheck "Out of Stock", leave only "In stock" checked. | Only in-stock products ≤ $100 AND rated ≥ 3 shown. No out-of-stock products. |
| `All filters active but no matching items → empty state message` | TC-02-DT-004 | TCON-02-004 | TCOV-02-004 | Set Max Price = $1, Min Rating = 5, uncheck "Out of Stock". | No product cards visible (count = 0). "No Products Found" (or equivalent empty state) message shown. |

### Notes

- Price and rating filters are **range sliders** — use `.evaluate()` to set `.value` and dispatch `input` + `change` events. `page.fill()` does not work on range inputs.
- After changing a slider value, wait for the product grid to re-render before asserting (short `waitForTimeout` or wait for a network idle).
- `afterEach`: `context.clearCookies()`

---

## F003 — Shopping Cart Management

**File:** `F003-ShoppingCartManagement_spec.ts`  
**Test type:** Decision Table Testing  
**`test.describe`:** `'F003 - Shopping Cart Management (Decision Table)'`

Login as regular user (`irfan@gmail.com`) in `beforeEach`.

### Tests

| Test title | TC ID | TCON | TCOV | Setup | Expected |
|---|---|---|---|---|---|
| `Add item to cart → item added, cart badge updated` | TC-03-DT-001 | TCON-03-001 | TCOV-03-001 | Navigate to any in-stock product page. Record cart badge count before. Click ADD TO CART. | Cart badge count increases by 1. Success toast or confirmation shown. |
| `Increase item quantity within stock → quantity updated, total recalculated` | TC-03-DT-002 | TCON-03-002 | TCOV-03-002 | Add a product to cart. Go to `/cart`. Note subtotal at qty 1. Click `+` once. | Quantity shows 2. Subtotal updates to unit price × 2. |
| `Increase quantity beyond available stock → block with error` | TC-03-DT-003 | TCON-03-003 | TCOV-03-003 | Use Prisma to seed/find a product with `inStock: 1`. Add it to cart. Go to `/cart`. Click `+` more times than available stock. | Quantity does NOT exceed `inStock`. Error shown (e.g. "Out of Stock", "Limit Exceeded"). |
| `Proceed to checkout with items in cart → redirect to checkout` | TC-03-DT-004 | TCON-03-004 | TCOV-03-004 | Add an in-stock product to cart. Go to `/cart`. Click CHECKOUT. | User redirected to checkout page URL. Checkout form / Place Order button visible. |
| `Proceed to checkout with empty cart → block with warning` | TC-03-DT-005 | TCON-03-005 | TCOV-03-005 | Ensure cart is empty (remove all items or navigate before adding any). Attempt CHECKOUT. | CHECKOUT button disabled or not visible. "Your cart is empty" (or equivalent) message shown. |

### Notes

- For **TC-03-DT-003**: use Prisma in the test body (or `beforeEach`) to seed a product with low stock, same pattern as F005 `beforeEach`. Clean it up in `afterEach`.
- `afterEach`: `context.clearCookies()`
- `afterAll`: `prisma.$disconnect()`

---

## F004 — Order Processing & Checkout

**File:** `F004-OrderProcessingAndCheckout_spec.ts`  
**Test types:** Equivalence Partitioning + Boundary Value Analysis + Decision Table  
**Three separate `test.describe` blocks.**

All three blocks log in as `irfan@gmail.com`. Write a shared `goToCheckout(page)` helper that navigates to an in-stock product and reaches the checkout form (via BUY NOW or ADD TO CART → CHECKOUT).

For all EP and BVA tests, fill every **other** field with valid data — only the phone field changes per test:
- Name: `'John'`, Lastname: `'Doe'`, Email: `'irfan@gmail.com'`, Address: `'123 Test Street'`, City: `'Kuala Lumpur'`, Country: `'Malaysia'`, Postal: `'50000'`

---

### Block 1 — Equivalence Partitioning
**`test.describe`:** `'F004 - Order Processing & Checkout (Equivalence Partitioning)'`

| Test title | TC ID | TCON | TCOV | Phone input | Expected |
|---|---|---|---|---|---|
| `Phone number too short (Length < 10) → rejected` | TC-04-EP-001 | TCON-04-001 | TCOV-04-001 | `'12345'` (5 digits) | Order NOT created. Phone validation error shown (e.g. "Phone number must be at least 10 digits"). |
| `Phone number valid length (10 ≤ Length ≤ 15) → order created` | TC-04-EP-002 | TCON-04-002 | TCOV-04-002 | `'0123456789'` (10 digits) | Order created. Toast: "Order created successfully! You will be contacted for payment." |
| `Phone number too long (Length > 15) → rejected` | TC-04-EP-003 | TCON-04-003 | TCOV-04-003 | `'1234567890123456789'` (19 digits) | Order NOT created. Phone length error shown. |

---

### Block 2 — Boundary Value Analysis
**`test.describe`:** `'F004 - Order Processing & Checkout (Boundary Value Analysis)'`

| Test title | TC ID | TCON | TCOV | Phone input | Expected |
|---|---|---|---|---|---|
| `Phone = 9 digits (lower invalid boundary) → rejected` | TC-04-BVA-001 | TCON-04-004 | TCOV-04-004 | `'123456789'` (9 digits) | Order NOT created. Validation error shown. |
| `Phone = 10 digits (edge valid boundary) → accepted` | TC-04-BVA-002 | TCON-04-005 | TCOV-04-005 | `'1234567890'` (10 digits) | Order created. Success toast shown. |
| `Phone = 15 digits (upper valid boundary) → accepted` | TC-04-BVA-003 | TCON-04-006 | TCOV-04-006 | `'123456789012345'` (15 digits) | Order created. Success toast shown. |
| `Phone = 16 digits (upper invalid boundary) → rejected` | TC-04-BVA-004 | TCON-04-007 | TCOV-04-007 | `'1234567890123456'` (16 digits) | Order NOT created. Validation error shown. |

---

### Block 3 — Decision Table
**`test.describe`:** `'F004 - Order Processing & Checkout (Decision Table)'`

Each test manages its own login/logout — no shared `beforeEach` needed here since TC-04-DT-004 needs no login.

| Test title | TC ID | TCON | TCOV | Conditions | Expected |
|---|---|---|---|---|---|
| `Logged in + valid fields + valid email → order created` | TC-04-DT-001 | TCON-04-008 | TCOV-04-008 | Logged in. All fields filled and valid. Phone = 10 digits. | Order created. Success toast shown. |
| `Logged in + invalid email format → display email error` | TC-04-DT-002 | TCON-04-009 | TCOV-04-009 | Logged in. All fields filled. Email = `'invalidemail'` (no @ or domain). | Order NOT created. Email validation error shown. |
| `Logged in + missing required fields → display missing fields error` | TC-04-DT-003 | TCON-04-010 | TCOV-04-010 | Logged in. Leave Name, Address, City empty. Fill only Email and Phone. | Order NOT created. Error toast(s) for each empty field shown (e.g. "Name must be at least 5 characters"). |
| `Not logged in → redirect to login page` | TC-04-DT-004 | TCON-04-011 | TCOV-04-011 | No session (cleared cookies). Attempt to BUY NOW or reach checkout. | User redirected to `/login`. Checkout form never shown. |

### Notes

- Success toast exact text: **"Order created successfully! You will be contacted for payment."**
- `afterEach`: `context.clearCookies()`
- `afterAll`: `prisma.$disconnect()` if Prisma used in `goToCheckout`

---

## F007 — Admin Order Fulfilment

**File:** `F007-AdminOrderFulfilment_spec.ts`  
**Test type:** State Transition Testing  
**`test.describe`:** `'F007 - Admin Order Fulfilment (State Transition Testing)'`

Login as **admin** in `beforeEach`. For F007 STT, **TCOV = TCON** (same number — the spec uses a single column for both).

### DB helpers needed

```ts
// Creates a customer_order at the given status, returns the order ID
async function createOrderWithStatus(status: string): Promise<string>

// Deletes order_product records then the order itself
async function cleanupOrder(orderId: string): Promise<void>
```

Same Prisma pattern as F005 spec. Run `cleanupOrder` in `afterEach`. `prisma.$disconnect()` in `afterAll`.

### Tests

#### Valid transitions — must succeed, no error, status must change

| Test title | TC ID | TCON | TCOV | Starting state | Action | Expected |
|---|---|---|---|---|---|---|
| `PENDING → PROCESSING (valid transition)` | TC-07-STT-001 | TCON-07-004 | TCON-07-004 | Create order `'pending'` | Select "Processing", click Update | Status shows "Processing". No error. |
| `PROCESSING → SHIPPED (valid transition)` | TC-07-STT-002 | TCON-07-005 | TCON-07-005 | Create order `'processing'` | Select "Shipped", click Update | Status shows "Shipped". No error. |
| `SHIPPED → DELIVERED (valid transition)` | TC-07-STT-003 | TCON-07-006 | TCON-07-006 | Create order `'shipped'` | Select "Delivered", click Update | Status shows "Delivered". No error. |
| `PENDING → CANCELLED (valid transition)` | TC-07-STT-004 | TCON-07-007 | TCON-07-007 | Create order `'pending'` | Select "Cancelled", click Update | Status shows "Cancelled". No error. |
| `PROCESSING → CANCELLED (valid transition)` | TC-07-STT-005 | TCON-07-008 | TCON-07-008 | Create order `'processing'` | Select "Cancelled", click Update | Status shows "Cancelled". No error. |
| `SHIPPED → CANCELLED (valid transition)` | TC-07-STT-006 | TCON-07-009 | TCON-07-009 | Create order `'shipped'` | Select "Cancelled", click Update | Status shows "Cancelled". No error. |

#### Invalid transitions — system must block the change

| Test title | TC ID | TCON | TCOV | Starting state | Attempted action | Expected |
|---|---|---|---|---|---|---|
| `DELIVERED → CANCELLED (invalid — system blocks)` | TC-07-STT-007 | TCON-07-010 | TCON-07-010 | Create order `'delivered'` | Attempt to select "Cancelled", click Update | Blocked: error shown OR option not available in dropdown. DB confirms status still `'delivered'`. |
| `CANCELLED → PENDING (invalid — system blocks)` | TC-07-STT-008 | TCON-07-011 | TCON-07-011 | Create order `'cancelled'` | Attempt to select "Pending", click Update | Blocked: error shown OR option not available. DB confirms status still `'cancelled'`. |
| `DELIVERED → PENDING (invalid — system blocks)` | TC-07-STT-009 | TCON-07-012 | TCON-07-012 | Create order `'delivered'` | Attempt to select "Pending", click Update | Blocked: error shown OR option not available. DB confirms status still `'delivered'`. |

### Notes

- Navigate to `/admin/orders/:orderId` using the ID from `createOrderWithStatus()`
- For invalid transitions: two acceptable outcomes — (a) the option doesn't appear in the dropdown at all (UI guards), OR (b) the submit is rejected with an error. Always do a **final Prisma DB check** to confirm the status did not change — this is the ground truth assertion.
- `afterEach`: `cleanupOrder(orderId)` + `context.clearCookies()`
- `afterAll`: `prisma.$disconnect()`

---

## State Transition Matrix (F007 reference)

```
              │ → Processing │ → Shipped │ → Delivered │ → Cancelled
──────────────┼──────────────┼───────────┼─────────────┼─────────────
Pending       │    VALID     │  invalid  │   invalid   │    VALID
Processing    │   invalid    │   VALID   │   invalid   │    VALID
Shipped       │   invalid    │  invalid  │    VALID    │    VALID
Delivered     │   invalid    │  invalid  │   invalid   │   INVALID ← blocked
Cancelled     │   INVALID ←  │  invalid  │   invalid   │   invalid
              │   blocked    │           │             │
```

The 9 tests in scope cover all 6 valid transitions + 3 invalid ones (Delivered→Cancelled, Cancelled→Pending, Delivered→Pending).

---

## F007 — Decision Table Tests (MISSING — Added Now)

These 4 tests were missing from the guidance. They belong in **the same `F007-AdminOrderFulfilment_spec.ts` file**, as a second `test.describe` block.

**`test.describe`:** `'F007 - Admin Order Fulfilment (Decision Table)'`

These tests cover the admin **editing order contact/shipping details** form — the same validation rules as the checkout form (required fields, email format, phone length) but from the **admin order edit/update page**, not the customer-facing checkout.

Login as admin in `beforeEach`. Use Prisma to create a test order in `beforeEach`, clean up in `afterEach` (same `createOrderWithStatus` / `cleanupOrder` helpers).

### Decision Table Reference (Table 2.50 from spec)

| Condition | TCOV-07-001 | TCOV-07-002 | TCOV-07-003 | TCOV-07-004 |
|---|---|---|---|---|
| Required Fields Filled | Y | N | Y | Y |
| Valid Email Format | Y | N/A | N | Y |
| Valid Phone Length | Y | N | Y | N |
| **Output** | | | | |
| Update Order Successfully | **Y** | N | N | N |
| Block + Missing Fields Error | N | **Y** | N | N |
| Block + Invalid Email Error | N | N | **Y** | N |
| Block + Phone Length Error | N | N | N | **Y** |

### Tests

| Test title | TC ID | TCON | TCOV | Conditions | Expected |
|---|---|---|---|---|---|
| `All fields valid + valid email + valid phone → order updated` | TC-07-DT-001 | TCON-07-001 | TCOV-07-001 | Navigate to admin order edit page. Fill all required shipping/contact fields with valid data. Email = valid format. Phone = 10 digits. Click Update/Save. | Order updated successfully. Success toast shown. |
| `Missing required fields → block update, show missing fields error` | TC-07-DT-002 | TCON-07-002 | TCOV-07-002 | Leave required fields empty (e.g. Name, Address). Click Update/Save. | Update blocked. Missing fields error shown. |
| `Invalid email format → block update, show email error` | TC-07-DT-003 | TCON-07-003 | TCOV-07-003 | Fill all required fields. Set email = `'invalidemail'` (no @ or domain). Click Update/Save. | Update blocked. Invalid email error shown. |
| `Phone too short → block update, show phone length error` | TC-07-DT-004 | TCON-07-004 | TCOV-07-004 | Fill all required fields. Valid email. Phone = `'123'` (too short). Click Update/Save. | Update blocked. Phone length error shown. |

> ⚠️ **Important:** TCOV-07-004 (DT) and TCON-07-004 (STT: PENDING → PROCESSING) share the same number. They are different tests — the DT one tests the order edit form validation, the STT one tests the status transition. Keep them in separate `test.describe` blocks so they don't conflict.

### Notes for Antigravity

- The admin order edit page URL is likely `/admin/orders/:orderId` — the same page used for the STT tests, but here you're testing the **form fields** (Name, Address, Email, Phone etc.) not the status dropdown
- Valid fill values for non-tested fields: Name = `'John'`, Lastname = `'Doe'`, Address = `'123 Test Street'`, City = `'KL'`, Country = `'Malaysia'`, Postal = `'50000'`, Phone = `'0123456789'`, Email = `'irfan@gmail.com'`
- Create the order via `createOrderWithStatus('pending')` in `beforeEach`
- `afterEach`: `cleanupOrder(orderId)` + `context.clearCookies()`
