import { test } from "@playwright/test";
import { LoginPage } from "./src/loginPage";
import { LoginConfig } from "./config/login.config";

test.describe("Login Page Tests", () => {
  test.describe.configure({ mode: "serial" });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openLoginPage(page);
  });

  test("verify login page is visible", async ({ page }) => {
    await loginPage.verifyLoginPage();
    await loginPage.verifyLoginURL();
    await loginPage.verifyLoginFormatAvailability();
  });

  test("verify login with valid credentials", async ({ page }) => {
    await loginPage.login(
      page,
      LoginConfig.credentials.valid.email,
      LoginConfig.credentials.valid.password,
    );
    await loginPage.verifyLoginNotificationSuccess();
    await loginPage.verifyLoginSuccess();
  });

  test("verify login with invalid email", async ({ page }) => {
    await loginPage.login(
      page,
      LoginConfig.credentials.invalidEmail.email,
      LoginConfig.credentials.invalidEmail.password,
    );
    await loginPage.verifyLoginNotificationFailure();
  });

  test("verify login with invalid password", async ({ page }) => {
    await loginPage.login(
      page,
      LoginConfig.credentials.invalidPassword.email,
      LoginConfig.credentials.invalidPassword.password,
    );
    await loginPage.verifyLoginNotificationFailure();
  });
});
