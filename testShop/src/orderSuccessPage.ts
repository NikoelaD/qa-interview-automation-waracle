import { Locator, Page, expect } from "@playwright/test";
import { MainPage } from "./mainPage";
import { URLConfig } from "../config/urls.config";
import { LoginConfig } from "../config/login.config";

type ExpectedOrderItem = {
  name: string;
  price: number;
  quantity?: number;
};

type NormalizedOrderItem = {
  name: string;
  pricePence: number;
  quantity: number;
};

export class OrderSuccessPage extends MainPage {
  static openOrderSuccessPage(page: Page) {
    throw new Error("Method not implemented.");
  }
  readonly thankyouMessage: Locator;
  readonly successMessage: Locator;
  readonly confirmationEmail: Locator;
  readonly orderNumber: Locator;
  readonly orderDate: Locator;
  readonly totalPaid: Locator;
  readonly purchasedItems: Locator;
  readonly continueShopping: Locator;
  readonly orderDetails: Locator;

  constructor(page: Page) {
    super(page);
    const confirmation = page.getByRole("main");

    this.thankyouMessage = confirmation.getByRole("heading", {
      name: "Thank you for your order!",
      exact: true,
    });

    this.successMessage = confirmation.getByText(
      "Your order has been placed successfully.",
      { exact: true },
    );

    this.confirmationEmail = confirmation.getByText(
      /^A confirmation email has been sent to .+\.$/,
    );

    this.orderNumber = confirmation.getByText(/^#WS-\d{4}-\d+$/);

    this.orderDate = confirmation.getByText(
      /^\d{1,2} [A-Za-z]{3} \d{4}, \d{2}:\d{2}$/,
    );

    this.totalPaid = confirmation
      .getByText("Total Paid", { exact: true })
      .locator("xpath=following-sibling::p[1]");
    this.purchasedItems = confirmation.getByText(/×\s*\d+\s*\(/);

    this.continueShopping = confirmation.getByRole("button", {
      name: "Continue Shopping",
      exact: true,
    });

    this.orderDetails = confirmation.getByRole("link", {
      name: "Order Details",
      exact: true,
    });
  }

  async orderSuccessPage() {
    await expect(this.thankyouMessage).toBeVisible();
    await expect(this.successMessage).toBeVisible();
    await expect(this.confirmationEmail).toBeVisible();
    await expect(this.orderNumber).toBeVisible();
    await expect(this.orderDate).toBeVisible();
    await expect(this.totalPaid).toBeVisible();
    await expect(this.continueShopping).toBeVisible();
    await expect(this.orderDetails).toBeVisible();
    await expect(this.page).toHaveURL(
      new RegExp(
        `^${URLConfig.baseURL}${URLConfig.orderSuccessPage}[^/]+$`,
      ),
    );
  }

  async verifyOrderDetailsPage() {
    await this.verifyConfirmationEmail(LoginConfig.credentials.valid.email);
    await expect(this.totalPaid).toHaveText(/^£\d+\.\d{2}$/);
  }

  async verifyConfirmationEmail(email: string) {
    await expect(this.confirmationEmail).toHaveText(
      `A confirmation email has been sent to ${email}.`,
    );
  }

  async verifyOrderDate(submittedAt: Date) {
    const month = submittedAt.toLocaleString("en-GB", { month: "short" });
    const hours = String(submittedAt.getHours()).padStart(2, "0");
    const minutes = String(submittedAt.getMinutes()).padStart(2, "0");
    const expectedDate = `${submittedAt.getDate()} ${month} ${submittedAt.getFullYear()}, ${hours}:${minutes}`;

    await expect(this.orderDate).toHaveText(expectedDate);
  }

  private normalizeItems(items: ExpectedOrderItem[]): NormalizedOrderItem[] {
    const products = new Map<
      string,
      NormalizedOrderItem
    >();

    for (const item of items) {
      const quantity = item.quantity ?? 1;
      const pricePence = Math.round(item.price * 100);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Invalid quantity for "${item.name}"`);
      }

      const existing = products.get(item.name);
      if (existing && existing.pricePence !== pricePence) {
        throw new Error(`Conflicting prices for "${item.name}"`);
      }
      products.set(item.name, {
        name: item.name,
        pricePence,
        quantity: (existing?.quantity ?? 0) + quantity,
      });
    }

    return [...products.values()];
  }

  async verifyPurchasedItems(items: ExpectedOrderItem[]) {
    const products = this.normalizeItems(items);
    const escapeRegExp = (value: string) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    await expect(this.purchasedItems).toHaveCount(products.length);
    for (const item of products) {
      const itemDetails = this.purchasedItems.filter({
        hasText: new RegExp(
          `^${escapeRegExp(item.name)}\\s*×\\s*${item.quantity}\\b`,
        ),
      });
      await expect(itemDetails).toHaveCount(1);
      await expect(
        itemDetails.locator("xpath=following-sibling::*[1]"),
      ).toHaveText(`£${((item.pricePence * item.quantity) / 100).toFixed(2)}`);
    }
  }

  async verifyTotalPaid(
    items: ExpectedOrderItem[],
    discountPercent = 0,
    shipping = 5,
  ) {
    const products = this.normalizeItems(items);
    const subtotalPence = products.reduce(
      (sum, item) => sum + item.pricePence * item.quantity,
      0,
    );
    const discountPence = Math.round(
      (subtotalPence * discountPercent) / 100,
    );
    const totalPence =
      subtotalPence - discountPence + Math.round(shipping * 100);
    await expect(this.totalPaid).toHaveText(
      `£${(totalPence / 100).toFixed(2)}`,
    );
  }

  async verifyOrderConfirmationDetails(
    email: string,
    items: ExpectedOrderItem[],
    submittedAt: Date,
    discountPercent = 0,
    shipping = 5,
  ) {
    await this.verifyConfirmationEmail(email);
    await this.verifyOrderDate(submittedAt);
    await this.verifyPurchasedItems(items);
    await this.verifyTotalPaid(items, discountPercent, shipping);
  }
}
