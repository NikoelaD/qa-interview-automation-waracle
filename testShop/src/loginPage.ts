import { Locator, Page, expect } from "@playwright/test";
import { MainPage } from "./mainPage";
import { URLConfig } from "../config/urls.config";

export class LoginPage extends MainPage {
  static openLoginPage(page: Page) {
    throw new Error("Method not implemented.");
  }
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Sign in" });
  }

  async openLoginPage(page: Page) {
    await this.page.goto(URLConfig.baseURL);
    await this.page.getByRole("button", { name: "Account" }).click();
  }

  async login(page: Page, username: string, password: string) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginPage() {
    const loginPage = this.page.getByRole("heading", { name: "Welcome back" });
    await expect(loginPage).toBeVisible();
  }

  async verifyLoginURL() {
    await expect(this.page).toHaveURL(URLConfig.baseURL + URLConfig.loginPage);
  }

  async verifyLoginFormatAvailability() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyLoginNotificationSuccess() {
    const notification = this.page.getByText("Welcome back");
    await expect(notification).toBeVisible();
  }

  async verifyLoginSuccess() {
    const userProfile = this.page.getByText("Hi, John");
    await expect(userProfile).toBeVisible();
  }

  async verifyLoginNotificationFailure() {
    const notification = this.page.getByText("Incorrect email or password.");
    await expect(notification).toBeVisible();
  }
}
