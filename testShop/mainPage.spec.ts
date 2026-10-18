import { test } from "@playwright/test";
import { MainPage } from "./src/mainPage";
import { ProductsPage } from "./src/productsPage";

test.describe("Main Page Tests", () => {
  let mainPage: MainPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    productsPage = new ProductsPage(page);

    await mainPage.goto(page);
  });
  test("verify main page is visible", async ({ page }) => {
    await mainPage.verifyLogo();
  });
  test("verify logo is visible", async ({ page }) => {
    await mainPage.verifyLogo();
  });

  test("Shop Now navigates to the products page", async ({ page }) => {
    await mainPage.navigateToShopNow();
    await productsPage.verifyProductsPage();
  });
});
