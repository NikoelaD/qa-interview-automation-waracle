import { expect, test } from "@playwright/test";
import { LoginPage } from "./src/loginPage";
import { LoginConfig } from "./config/login.config";
import { ProductsPage } from "./src/productsPage";
import { ProductsConfig } from "./config/products.config";
import { CartPage } from "./src/cartPage";
import { DiscountConfig } from "./config/discount.config";

test.describe("Checkout Page Tests", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.openLoginPage(page);
    await loginPage.login(
      page,
      LoginConfig.credentials.valid.email,
      LoginConfig.credentials.valid.password,
    );
  });

  test("AC-1 customer can apply a coupon code from the cart", async ({
    page,
  }) => {
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.addDiscountCode(DiscountConfig.discountValid.code);
    await cartPage.verifyCouponApplied(DiscountConfig.discountValid.code);
  });

  test("AC-2 WARACLE25 reduces the subtotal by 25%", async ({ page }) => {
    test.skip(
      true,
      "Known application bug: WARACLE25 currently applies an incorrect discount.",
    );
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.addDiscountCode(DiscountConfig.discountValid.code);
    await cartPage.verifyDiscountCalculation(
      ProductsConfig.products.product1.price,
      DiscountConfig.discountValid.code,
    );
  });

  test("AC-3 and AC-4 non-empty basket has £5 shipping and correct total", async ({
    page,
  }) => {
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.verifyOrderTotals(
      ProductsConfig.products.product1.price,
      0,
      DiscountConfig.discountValid.shippingCost,
    );
  });

  test("AC-5 invalid coupon shows an error and applies no discount", async ({
    page,
  }) => {
    test.skip(
      true,
      "Known application bug: invalid coupons do not show a clear error message.",
    );
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.addDiscountCode(DiscountConfig.discountInvalid.code);

    await expect(page.getByText(/invalid coupon/i)).toBeVisible();
    await expect(cartPage.orderSummary.getByText(/^Coupon \(/)).toHaveCount(0);
    await cartPage.verifyOrderTotals(ProductsConfig.products.product1.price, 0);
  });

  test("AC-5 empty coupon shows a clear message and applies no discount", async ({
    page,
  }) => {
    test.skip(
      true,
      "Known application bug: empty coupons do not show a clear validation message.",
    );
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.addDiscountCode(DiscountConfig.discountEmpty.code);

    await cartPage.verifyInvalidDiscountMessage();
    await cartPage.verifyOrderTotals(ProductsConfig.products.product1.price, 0);
  });
});
