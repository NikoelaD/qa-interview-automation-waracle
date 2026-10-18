import { Locator, Page, expect } from "@playwright/test";
import { MainPage } from "./mainPage";
import { URLConfig } from "../config/urls.config";
import { LoginConfig } from "../config/login.config";
import { DiscountConfig } from "../config/discount.config";

type ExpectedOrderItem = {
  name: string;
  price: number;
  quantity?: number;
};

export class CheckoutPage extends MainPage {
  static openCheckoutPage(page: Page) {
    throw new Error("Method not implemented.");
  }
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly emailInput: Locator;
  readonly fullNameInput: Locator;
  readonly orderSummary: Locator;
  readonly checkoutButton: Locator;
  readonly paymentButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addressInput = page.getByPlaceholder("10 Digital Drive");
    this.cityInput = page.getByPlaceholder("Edinburgh");
    this.postalCodeInput = page.getByPlaceholder("EH1 1AA");
    this.cardNumberInput = page.getByPlaceholder("4242 4242 4242 4242");
    this.expiryDateInput = page.getByPlaceholder("12 / 26");
    this.cvvInput = page.getByPlaceholder("123");
    this.emailInput = page.getByPlaceholder(
      LoginConfig.credentials.valid.email,
    );
    this.fullNameInput = page.getByPlaceholder("John Doe");
    this.orderSummary = page.locator(
      "//div[h2[normalize-space()='Order Summary']]",
    );
    this.checkoutButton = page.getByRole("button", {
      name: "Proceed to Checkout",
    });
    this.paymentButton = page.getByRole("button", { name: "Pay £" });
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async fillShippingInfo() {
    await this.addressInput.fill("123 Main St");
    await this.cityInput.fill("Anytown");
    await this.postalCodeInput.fill("12345");
  }

  async fillPaymentInfo() {
    await this.cardNumberInput.fill("4242424242424242");
    await this.expiryDateInput.fill("12/30");
    await this.cvvInput.fill("123");
  }

  async verifyCheckoutPageURL() {
    await expect(this.page).toHaveURL(
      URLConfig.baseURL + URLConfig.checkoutPage,
    );
  }

  async verifyEmailAndNameFields() {
    await expect(this.fullNameInput).toHaveValue("John Doe");
    await expect(this.emailInput).toHaveValue(
      LoginConfig.credentials.valid.email,
    );
  }

  async verifyOrderSummary(
    items: ExpectedOrderItem[],
    discountCode?: string,
    discountPercent = discountCode
      ? DiscountConfig.discountValid.discountPercentage
      : 0,
    shipping = DiscountConfig.discountValid.shippingCost,
  ) {
    const toPence = (amount: number) => Math.round(amount * 100);
    const money = (pence: number) => `£${(pence / 100).toFixed(2)}`;

    const summaryValue = (label: string) =>
      this.orderSummary.getByText(label, { exact: true }).locator("../span[2]");

    // Combine repeated entries for the same product.
    const products = new Map<string, { price: number; quantity: number }>();

    for (const item of items) {
      const quantity = item.quantity ?? 1;
      const price = toPence(item.price);
      const existing = products.get(item.name);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Invalid quantity for "${item.name}"`);
      }

      if (existing && existing.price !== price) {
        throw new Error(`Conflicting prices for "${item.name}"`);
      }

      products.set(item.name, {
        price,
        quantity: (existing?.quantity ?? 0) + quantity,
      });
    }

    const rows = this.orderSummary.locator("xpath=./div[1]/div");
    await expect(rows).toHaveCount(products.size);

    let subtotal = 0;

    for (const [name, item] of products) {
      const row = rows.filter({
        hasText: name,
      });

      const lineTotal = item.price * item.quantity;

      await expect(row).toHaveCount(1);
      const displayedName = row.locator("xpath=./span[1]");
      await expect(displayedName).toContainText(name);
      if (item.quantity > 1) {
        await expect(displayedName).toContainText(
          new RegExp(`×\\s*${item.quantity}\\b`),
        );
      }
      await expect(row.locator("xpath=./span[2]")).toHaveText(money(lineTotal));

      subtotal += lineTotal;
    }

    const discount = discountCode
      ? Math.round((subtotal * discountPercent) / 100)
      : 0;

    await expect(summaryValue("Subtotal")).toHaveText(money(subtotal));
    await expect(summaryValue("Shipping")).toHaveText(money(toPence(shipping)));

    if (discountCode) {
      const amount = money(discount).replace(".", "\\.");

      await expect(summaryValue(`Coupon (${discountCode})`)).toHaveText(
        new RegExp(`^[-–−]\\s*${amount}$`),
      );
    }

    await expect(summaryValue("Total")).toHaveText(
      money(subtotal - discount + toPence(shipping)),
    );
  }

  async verifyOrderConfirmation(
    discountCode: string,
    discountAmount: number,
    total: number,
  ) {
    const confirmation = this.page.getByRole("main");
    const money = (amount: number) => `£${amount.toFixed(2)}`;

    await expect(
      confirmation.getByRole("heading", {
        name: "Thank you for your order!",
      }),
    ).toBeVisible();
    await expect(
      confirmation.getByText(discountCode, { exact: false }),
    ).toBeVisible();

    const discountLabel = confirmation.getByText(/discount/i).locator("..");
    await expect(discountLabel).toContainText(money(discountAmount));

    const totalPaid = confirmation
      .getByText("Total Paid", { exact: true })
      .locator("..");
    await expect(totalPaid).toContainText(money(total));
  }
}
