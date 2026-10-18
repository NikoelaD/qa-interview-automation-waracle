import { test } from "@playwright/test";
import { LoginPage } from "./src/loginPage";
import { LoginConfig } from "./config/login.config";
import { ProductsPage } from "./src/productsPage";
import { ProductsConfig } from "./config/products.config";
import { CartPage } from "./src/cartPage";

test.describe("Add Product to Cart", () => {
  test.describe.configure({ mode: "serial" });

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

  test("verify navigation to product page", async ({ page }) => {
    await productsPage.navigateShopNow();
    await productsPage.verifyProductsPage();
    await productsPage.verifyProductsInList();
  });

  test("verify all products are displayed on the product page", async ({
    page,
  }) => {
    await productsPage.navigateShopNow();
    await productsPage.verifyProductsInList();
  });

  test("verify adding product to cart and checking cart", async ({ page }) => {
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await productsPage.verifyNotificationProductAdded(
      ProductsConfig.products.product1.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.verifyProductInCart(ProductsConfig.products.product1.name);
    await cartPage.verifyProductPriceInCart(
      ProductsConfig.products.product1.name,
      ProductsConfig.products.product1.price,
    );
  });

  test("verify product prices in cart and product page", async ({ page }) => {
    await productsPage.navigateShopNow();
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product1.name,
    );
    await productsPage.addProductToCartByName(
      ProductsConfig.products.product2.name,
    );
    await productsPage.verifyNotificationProductAdded(
      ProductsConfig.products.product1.name,
    );
    await productsPage.verifyNotificationProductAdded(
      ProductsConfig.products.product2.name,
    );
    await cartPage.navigateToCartPage();
    await cartPage.verifyProductInCart(ProductsConfig.products.product1.name);
    await cartPage.verifyProductInCart(ProductsConfig.products.product2.name);
    await cartPage.verifyProductPriceInCart(
      ProductsConfig.products.product1.name,
      ProductsConfig.products.product1.price,
    );
    await cartPage.verifyProductPriceInCart(
      ProductsConfig.products.product2.name,
      ProductsConfig.products.product2.price,
    );
  });

  test("verify product price matches cart price", async ({ page }) => {
    const { name, price } = ProductsConfig.products.product1;
    await productsPage.navigateShopNow();
    await productsPage.verifyProductPrice(name, price);
    await productsPage.addProductToCartByName(name);
    await cartPage.navigateToCartPage();
    await cartPage.verifyProductPriceInCart(name, price);
  });

  test("verify adding all products to cart and checking cart", async ({
    page,
  }) => {
    await productsPage.navigateShopNow();
    for (const product of Object.values(ProductsConfig.products)) {
      await productsPage.addProductToCartByName(product.name);
      await productsPage.verifyNotificationProductAdded(product.name);
    }
    await cartPage.navigateToCartPage();
    for (const product of Object.values(ProductsConfig.products)) {
      await cartPage.verifyProductInCart(product.name);
      await cartPage.verifyProductPriceInCart(product.name, product.price);
    }
  });
});
