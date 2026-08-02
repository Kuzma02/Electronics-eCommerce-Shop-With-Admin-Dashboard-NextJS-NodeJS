# Testing Guide

This project has two main test areas:
- Frontend (root project: Next.js)
- Backend (`server/` project: Node.js API)

## 1. Frontend unit tests (root project)

Run from the project root:

```bash
npm run test:unit
```

What it does:
- Runs Jest unit tests for frontend code.
- Uses root Jest config (`jest.config.js`).
- Looks for tests in `tests/unit/**/*.test.{js,jsx,ts,tsx}`.

## 2. Backend unit tests (`server/` project)

Run from the `server/` folder:

```bash
npm run test:unit
```

Or run from root in one command:

```bash
cd server && npm run test:unit
```

What it does:
- Runs Jest unit tests for backend code.
- Uses backend Jest config (`server/jest.config.js`).
- Looks for tests in `server/tests/unit/**/*.test.js`.

## 3. Playwright tests (frontend E2E)

Run from the project root:

```bash
npm run test:e2e
```

What it does:
- Runs Playwright end-to-end tests using `playwright.config.ts`.
- Uses tests under the root `tests/` area (for E2E scenarios).

## 4. Run all frontend tests together (Jest + Playwright)

Run from the project root:

```bash
npm test
```

What it does:
1. Runs frontend Jest unit tests (`npm run test:unit`)
2. Runs Playwright E2E tests (`npm run test:e2e`)

## 5. Recommended test placement and practices

### Where to put tests

- Frontend unit tests:
  - Put in `tests/unit/`
  - File name pattern: `*.test.ts` or `*.test.tsx`
  - Focus on UI helpers, utility functions, hooks, and component behavior (small isolated logic)

- Frontend E2E tests:
  - Put in root `tests/` E2E area (as configured by Playwright)
  - Use user-flow scenarios (login, checkout, navigation, form submission)

- Backend unit tests:
  - Put in `server/tests/unit/`
  - File name pattern: `*.test.js`
  - Focus on validation logic, service-layer functions, and pure backend utilities

### What to test

- Unit tests:
  - Test one function/module behavior at a time
  - Cover both valid and invalid input paths
  - Include edge cases (empty values, trimmed values, boundary lengths, malformed input)

- E2E tests:
  - Test complete user journeys from browser perspective
  - Keep flows realistic and stable (avoid brittle selectors)

### Good practices

- Keep tests deterministic and independent.
- Use clear test names that describe expected behavior.
- Prefer small, focused assertions.
- Avoid coupling frontend tests to backend implementation details.
- For backend validations, assert both success outputs and thrown error messages when relevant.
