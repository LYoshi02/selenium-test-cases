import {
  Browser,
  Builder,
  By,
  WebDriver,
  WebElement,
} from "selenium-webdriver";
import path from "path";
import fs from "fs";

export const DEFAULT_DISPLAY_TIMEOUT = 10000; // 10 seconds in milliseconds

export abstract class TestUtils {
  protected driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public getDriver() {
    return this.driver;
  }

  protected async openPage(url: string) {
    await this.driver.get(url);
  }

  protected async typeInInput(inputName: string, text: string) {
    const inputElement = await this.driver.findElement(By.name(inputName));
    await inputElement.sendKeys(text);
  }

  protected async clickElement(element: WebElement) {
    await element.click();
  }

  protected async saveOutputScreenshot(
    screenshotName: string,
    screenshotFolder: string,
  ) {
    const screenshot = await this.driver.takeScreenshot();
    const screenshotPath = path.join(
      __dirname,
      "..",
      "..",
      "output",
      screenshotFolder,
    );
    this.saveImage(screenshot, screenshotName, screenshotPath);
  }

  private saveImage(base64Image: string, imageName: string, imagePath: string) {
    const filePath = path.join(imagePath, imageName);

    // Create the custom folder if it doesn't exist
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }

    fs.writeFileSync(filePath, base64Image, "base64");
  }
}

export async function initializeWebDriver(browser: string = Browser.CHROME) {
  return await new Builder().forBrowser(browser).build();
}

export async function terminateWebDriver(driver: WebDriver) {
  return await driver.quit();
}
