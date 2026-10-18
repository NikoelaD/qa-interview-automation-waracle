import { expect } from "@playwright/test";
import { Locator, Page } from "playwright-core";
import { ProductsConfig } from "../config/products.config";
import { URLConfig } from "../config/urls.config";

export class ProductsPage {
  static openLoginPage(page: Page) {}
  readonly allProducts: Locator;
  readonly accessoaries: Locator;
  readonly categoryFilter: Locator;
  readonly shopNowButton: Locator;
  readonly productName: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.allProducts = page.getByRole("heading", { name: "All Products" });
    this.accessoaries = page.locator(
      '//a[starts-with(@href, "/products/")][.//h3]',
    );
    this.categoryFilter = page.locator(
      "//aside[h2[normalize-space()='Filters']]",
    );
    this.shopNowButton = page.getByRole("link", { name: "Shop Now" });
    this.productName = page.locator(
      "//a[starts-with(@href, '/products/')]//h3",
    );
  }

  async verifyProductsPage() {
    await expect(this.page).toHaveURL(
      URLConfig.baseURL + URLConfig.productsPage,
    );
    await expect(this.allProducts).toBeVisible();
    expect(await this.accessoaries.count()).toBeGreaterThan(0);
    await expect(this.categoryFilter).toBeVisible();
  }

  async navigateShopNow() {
    await this.shopNowButton.click();
  }

  async addProductToCartByName(productName: string) {
    const product = this.page.getByRole("heading", {
      name: productName,
      exact: true,
    });

    await expect(product).toBeVisible();
    await product.hover();
    const addToCartButton = product
      .locator("xpath=../..")
      .getByRole("button", { name: "Add to Cart" });
    await addToCartButton.click();
  }

  async verifyProductPrice(productName: string, productPrice: number) {
    const productCard = this.page
      .getByRole("heading", { name: productName, exact: true })
      .locator("xpath=../..");
    const price = productCard.getByText("£").first();
    await expect(price).toContainText(productPrice.toFixed(2));
  }

  async verifyProductsInList() {
    const pageProducts = await this.productName.allTextContents();
    const productNames = pageProducts.map((name) => name.trim());
    const configuredNames = Object.values(ProductsConfig.products).map(
      (product) => product.name,
    );

    for (const name of productNames) {
      expect(configuredNames).toContain(name);
    }
  }

  async verifyNotificationProductAdded(productName: string) {
    const notification = this.page.getByText(`✓${productName} added to cart`, {
      exact: true,
    });
    await expect(notification).toBeVisible();
  }
}
