# Test Failure Report — UC007 UpdateCategory, Alternate Flow 2

## Test Context

- **Test suite**: UC007 - Update Category (`tests/e2e/UC007-UpdateCategory.spec.ts`)
- **Flow**: Alternate Flow 2 — Duplicate Category Name
- **Description**: User attempts to update a category to a name that already exists in the database.
- **Expected outcome**: Server returns a 409 Conflict response; UI displays an error toast such as "Category with this name already exists".
- **Actual outcome**: Server crashes with two cascading errors; no response is sent to the client.

---

## Errors Observed

### Error 1 — Prisma P2002: Unique Constraint Violation

```
PrismaClientKnownRequestError:
Invalid `prisma.category.update()` invocation in
server/controllers/category.js:47:49

Unique constraint failed on the constraint: `Category_name_key`
  code: 'P2002',
  meta: { modelName: 'Category', target: 'Category_name_key' }
```

### Error 2 — TypeError in Error Handler (cascading)

```
TypeError: prismaError.meta.target.join is not a function
    at handlePrismaError (server/utills/errorHandler.js:49:47)
    at handleServerError (server/utills/errorHandler.js:124:27)
```

---

## Root Cause Analysis

### Error 1 — No duplicate name check before update

**File**: `server/controllers/category.js` — `updateCategory` function, line 47

The `updateCategory` controller does not check whether another category with the requested name already exists before calling `prisma.category.update()`. When a duplicate name is submitted, Prisma hits the `Category_name_key` unique constraint and throws a `PrismaClientKnownRequestError` with code `P2002`.

The controller relies entirely on the database to reject the duplicate rather than catching the conflict explicitly in application logic first.

### Error 2 — Prisma v6.x changed `meta.target` from array to string

**File**: `server/utills/errorHandler.js` — `handlePrismaError`, P2002 case, line 49

When Error 1 propagates to the error handler, the P2002 case tries to build a details string:

```js
`Field: ${prismaError.meta.target.join(", ")}`
```

In **Prisma v5 and earlier**, `meta.target` was an **array** (e.g. `['name']`), so `.join()` worked correctly.

In **Prisma v6.x** (version in use: `6.16.3`), `meta.target` is a **string** (e.g. `'Category_name_key'`). Strings do not have a `.join()` method, so this line throws a `TypeError`.

**Consequence**: The error handler itself crashes before it can send any JSON response to the client. The intended 409 Conflict response is never delivered, and the E2E test receives no response to assert against.

---

## Affected Files

| File | Location | Issue |
|---|---|---|
| `server/controllers/category.js` | `updateCategory`, line 47 | No pre-flight duplicate name check |
| `server/utills/errorHandler.js` | `handlePrismaError`, P2002 case, line 49 | `.join()` called on a string (Prisma v6 breaking change) |

---

## Proposed Fixes

### Fix 1 — Add duplicate name check in `server/controllers/category.js`

Before calling `prisma.category.update()`, query for an existing category with the same name that has a different ID. If found, throw a 409 `AppError` instead of letting Prisma hit the constraint:

```js
const duplicateCategory = await prisma.category.findFirst({
  where: {
    name: name.trim(),
    NOT: { id: id },
  },
});

if (duplicateCategory) {
  throw new AppError("Category with this name already exists", 409);
}
```

### Fix 2 — Guard against string `meta.target` in `server/utills/errorHandler.js`

Replace line 49:

```js
// Before
`Field: ${prismaError.meta.target.join(", ")}`

// After
`Field: ${Array.isArray(prismaError.meta.target) ? prismaError.meta.target.join(", ") : prismaError.meta.target}`
```

This handles both the old array format (Prisma v5) and the new string format (Prisma v6).

---

## Verification Steps

1. Apply Fix 1 and Fix 2.
2. Run Alternate Flow 2 of the UC007 E2E test.
3. Confirm the server returns a `409` response with body `{ "error": "Category with this name already exists" }`.
4. Confirm the UI displays the corresponding error toast.
5. Confirm no `TypeError` appears in the server logs.
