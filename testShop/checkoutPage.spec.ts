import { test } from "@playwright/test";
import { LoginPage } from "./src/loginPage";
import { LoginConfig } from "./config/login.config";
import { ProductsPage } from "./src/productsPage";
import { ProductsConfig } from "./config/products.config";
import { CartPage } from "./src/cartPage";
import { DiscountConfig } from "./config/discount.config";
import { CheckoutPage } from "./src/checkoutPage";
import { OrderSuccessPage } from "./src/orderSuccessPage";

test.describe("Checkout Page Tests", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let orderSuccessPage: OrderSuccessPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    orderSuccessPage = new OrderSuccessPage(page);

    await loginPage.openLoginPage(page);
    await loginPage.login(
      page,
      LoginConfig.credentials.valid.email,
      LoginConfig.credentials.valid.password,
    );
    await productsPage.navigateShopNow();
  });

  test("verify checkout page order summary", async ({ page }) => {
    const cap = ProductsConfig.products.product1;
    const shirt = ProductsConfig.products.product2;

    await productsPage.addProductToCartByName(cap.name);
    await productsPage.addProductToCartByName(cap.name);
    await productsPage.addProductToCartByName(shirt.name);

    await cartPage.navigateToCartPage();
    await checkoutPage.proceedToCheckout();

    await checkoutPage.verifyCheckoutPageURL();
    await checkoutPage.verifyEmailAndNameFields();
    await checkoutPage.verifyOrderSummary([
      { name: cap.name, price: cap.price },
      { name: cap.name, price: cap.price },
      { name: shirt.name, price: shirt.price },
    ]);
  });

  test("verify checkout page order summary with discount code", async () => {
    test.skip(
      true,
      "Skipped while the application applies an incorrect coupon discount.",
    );

    const cap = ProductsConfig.products.product1;
    const shirt = ProductsConfig.products.product2;
    const discount = DiscountConfig.discountValid;

    await productsPage.addProductToCartByName(cap.name);
    await productsPage.addProductToCartByName(cap.name);
    await productsPage.addProductToCartByName(shirt.name);

    await cartPage.navigateToCartPage();
    await cartPage.addDiscountCode(discount.code);
    await checkoutPage.proceedToCheckout();

    await checkoutPage.verifyCheckoutPageURL();
    await checkoutPage.verifyOrderSummary(
      [
        { name: cap.name, price: cap.price },
        { name: shirt.name, price: shirt.price },
      ],
      discount.code,
      discount.discountPercentage,
      discount.shippingCost,
    );
  });

  test("AC-6 order confirmation shows coupon, discount, and final total", async ({
    page,
  }) => {
    test.skip(
      true,
      "Known application bug: order confirmation omits coupon and discount details.",
    );
    const discountAmount = Math.round(
      (ProductsConfig.products.product1.price *
        DiscountConfig.discountValid.discountPercentage) /
        100,
    );
    const total =
      ProductsConfig.products.product1.price -
      discountAmount +
      DiscountConfig.discountValid.shippingCost;

    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.addDiscountCode(DiscountConfig.discountValid.code);
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo();
    await checkoutPage.fillPaymentInfo();
    await checkoutPage.paymentButton.click();

    await checkoutPage.verifyOrderConfirmation(
      DiscountConfig.discountValid.code,
      discountAmount,
      total,
    );
  });

  test("verify order confirmation email, date, items, and total", async ({
    page,
  }) => {
    const cap = ProductsConfig.products.product1;
    const shirt = ProductsConfig.products.product2;

    await productsPage.addProductToCartByName(cap.name);
    await productsPage.addProductToCartByName(shirt.name);
    await cartPage.navigateToCartPage();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo();
    await checkoutPage.fillPaymentInfo();

    const submittedAt = new Date();
    await checkoutPage.paymentButton.click();

    await orderSuccessPage.orderSuccessPage();
    await orderSuccessPage.verifyOrderConfirmationDetails(
      LoginConfig.credentials.valid.email,
      [
        { name: cap.name, price: cap.price },
        { name: shirt.name, price: shirt.price },
      ],
      submittedAt,
    );
  });
});
