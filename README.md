# QA Candidate Automation Tests

Playwright end-to-end tests for the Waracle Store demo. Tests and page objects are under `testShop/`; shared test data and URLs are in `testShop/config/`.

## Run the tests

```bash
npm install
npm test
```

The app is expected to be available at `http://localhost:5173`.

## Project files

### Root

- `package.json` — project metadata, Playwright dependency, and `npm test` script.
- `package-lock.json` — locks installed npm dependency versions.
- `playwright.config.ts` — Playwright test configuration; sets `testShop` as the test directory.
- `.vscode/settings.json` — workspace-specific Visual Studio Code settings.

### Tests (`testShop/`)

- `mainPage.spec.ts` — homepage logo and Shop Now navigation checks.
- `loginPage.spec.ts` — login-page visibility and valid/invalid credential checks.
- `productPage.spec.ts` — product listing, product names/prices, and adding products to the cart.
- `cartPage.spec.ts` — coupon application, shipping, totals, and coupon validation acceptance criteria. Some coupon tests are skipped while the app behavior is incorrect.
- `checkoutPage.spec.ts` — checkout order-summary, payment/confirmation, and order-details checks. Coupon-dependent checks may be skipped while coupon behavior is incorrect.

### Page objects (`testShop/src/`)

- `mainPage.ts` — homepage navigation and logo verification.
- `loginPage.ts` — login form actions and login-state checks.
- `productsPage.ts` — product listing, price, and add-to-cart actions.
- `cartPage.ts` — cart navigation, item/price checks, and coupon/order-total verification.
- `checkoutPage.ts` — checkout form actions and order-summary/total verification.
- `orderSuccessPage.ts` — order confirmation email, date, purchased items, and total verification.

### Configuration (`testShop/config/`)

- `urls.config.ts` — base URL and application route paths.
- `login.config.ts` — valid and invalid login test data.
- `products.config.ts` — product names and prices used by tests.
- `discount.config.ts` — coupon codes, discount percentage, and shipping cost.
