import { By, WebDriver, until } from "selenium-webdriver";

import { DEFAULT_DISPLAY_TIMEOUT, TestUtils } from ".";

export class LoginTestUtils extends TestUtils {
  constructor(driver: WebDriver) {
    super(driver);
  }

  public async openLoginPage() {
    const LOGIN_PAGE_URL = "https://www.netflix.com/login";
    await this.openPage(LOGIN_PAGE_URL);
  }

  public async typeInEmailInput(email: string) {
    const EMAIL_INPUT_NAME = "userLoginId";
    await this.typeInInput(EMAIL_INPUT_NAME, email);
  }

  public async typeInPasswordInput(password: string) {
    const PASSWORD_INPUT_NAME = "password";
    await this.typeInInput(PASSWORD_INPUT_NAME, password);
  }

  public async clickLoginButton() {
    const loginButtonElement = await this.driver.findElement(
      By.css('button[type="submit"]'),
    );
    this.clickElement(loginButtonElement);
  }

  public async getAlertText() {
    return await this.driver
      .wait(
        until.elementLocated(By.css('div[role="alert"]')),
        DEFAULT_DISPLAY_TIMEOUT,
      )
      .getText();
  }

  public async getEmailErrorText() {
    return await this.driver
      .wait(
        until.elementLocated(
          By.css('div[data-uia="login-field+validationMessage"]'),
        ),
        DEFAULT_DISPLAY_TIMEOUT,
      )
      .getText();
  }

  public async getPasswordErrorText() {
    return await this.driver
      .wait(
        until.elementLocated(
          By.css('div[data-uia="password-field+validationMessage"]'),
        ),
        DEFAULT_DISPLAY_TIMEOUT,
      )
      .getText();
  }

  public async getManageProfilesButtonText() {
    return await this.driver
      .wait(
        until.elementLocated(By.css('a[href="/ManageProfiles"]')),
        DEFAULT_DISPLAY_TIMEOUT,
      )
      .getText();
  }

  public async saveScreenshot(screenshotName: string) {
    const screenshotFolder = "login";
    await this.saveOutputScreenshot(screenshotName, screenshotFolder);
  }
}
