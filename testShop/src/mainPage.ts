import { Page, expect } from "@playwright/test";
import { URLConfig } from "../config/urls.config";

export class MainPage {
  page: any;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(page: Page) {
    await this.page.goto(URLConfig.baseURL);
  }

  async verifyLogo() {
    const logo = this.page.getByRole("link", { name: "Waracle home" });
    await expect(logo).toBeVisible();
  }

  async navigateToShopNow() {
    const shopNowButton = this.page.getByRole("link", { name: "Shop Now" });
    await shopNowButton.click();
  }
}
