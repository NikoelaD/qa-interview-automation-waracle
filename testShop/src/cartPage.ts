import { expect } from "@playwright/test";
import { Locator, Page } from "playwright-core";
import { DiscountConfig } from "../config/discount.config";
import { URLConfig } from "../config/urls.config";

export class CartPage {
  static openLoginPage(page: Page) {}
  readonly cartButton: Locator;
  readonly cartHeader: Locator;
  readonly discountInput: Locator;
  readonly discountApply: Locator;
  readonly orderSummary: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.getByRole("link", { name: "Cart", exact: true });
    this.cartHeader = page.getByRole("heading", { name: "Shopping Cart" });
    this.discountInput = page.getByRole("textbox", { name: "e.g. WARACLE25" });
    this.discountApply = page.getByRole("button", { name: "Apply" });
    this.orderSummary = page.getByRole("complementary");
  }

  async navigateToCartPage() {
    await this.cartButton.click();
  }

  async verifyCartPage() {
    await expect(this.page).toHaveURL(URLConfig.baseURL + URLConfig.cartPage);
    await expect(this.cartHeader).toBeVisible();
  }

  async verifyProductInCart(productName: string) {
    const productInCart = this.page.getByRole("heading", {
      name: productName,
      exact: true,
    });
    await expect(productInCart).toBeVisible();
  }

  async verifyProductPriceInCart(productName: string, productPrice: number) {
    const product = this.page
      .getByRole("heading", { name: productName, exact: true })
      .locator("xpath=ancestor::div[contains(@class, 'card')][1]");
    const productPriceInCart = product.getByText("£").first();
    await expect(productPriceInCart).toContainText(productPrice.toFixed(2));
  }

  async addDiscountCode(discountCode: string) {
    await this.discountInput.fill(discountCode);
    await this.discountApply.click();
  }

  async verifyCouponApplied(discountCode: string) {
    await expect(
      this.page.getByText(`Coupon “${discountCode}” applied`, { exact: true }),
    ).toBeVisible();
    await expect(
      this.orderSummary.getByText(`Coupon (${discountCode})`, {
        exact: true,
      }),
    ).toBeVisible();
  }

  async verifyOrderTotals(
    subtotal: number,
    discount = 0,
    shipping = DiscountConfig.discountValid.shippingCost,
  ) {
    const money = (amount: number) => `£${amount.toFixed(2)}`;
    const summaryValue = (label: string) =>
      this.orderSummary.getByText(label, { exact: true }).locator("../span[2]");

    await expect(summaryValue("Subtotal")).toHaveText(money(subtotal));
    await expect(summaryValue("Shipping")).toHaveText(money(shipping));
    await expect(summaryValue("Total")).toHaveText(
      money(subtotal - discount + shipping),
    );
  }

  async verifyDiscountCalculation(
    subtotal: number,
    discountCode: string,
    discountPercent = DiscountConfig.discountValid.discountPercentage,
    shipping = DiscountConfig.discountValid.shippingCost,
  ) {
    const subtotalPence = Math.round(subtotal * 100);
    const discountPence = Math.round((subtotalPence * discountPercent) / 100);
    const shippingPence = Math.round(shipping * 100);
    const totalPence = subtotalPence - discountPence + shippingPence;
    const formatPounds = (pence: number) =>
      (pence / 100).toFixed(2).replace(".", "\\.");
    const summaryText = await this.orderSummary.innerText();

    expect(summaryText).toMatch(
      new RegExp(`\\bSubtotal\\s*£${formatPounds(subtotalPence)}`),
    );
    const couponRow = this.orderSummary
      .getByText(`Coupon (${discountCode})`, { exact: true })
      .locator("..");
    await expect(couponRow).toContainText(
      new RegExp(`£${formatPounds(discountPence)}`),
    );
    expect(summaryText).toMatch(
      new RegExp(`\\bShipping\\s*£${formatPounds(shippingPence)}`),
    );
    expect(summaryText).toMatch(
      new RegExp(`\\bTotal\\s*£${formatPounds(totalPence)}`),
    );
  }

  async verifyInvalidDiscountMessage() {
    await expect(
      this.page.getByText(/Invalid Coupon/i, { exact: false }),
    ).toBeVisible();
  }
}
