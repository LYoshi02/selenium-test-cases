import { Browser, Builder, By, WebDriver, until } from "selenium-webdriver";
import path from "path";
import fs from "fs";

const EMAIL_INPUT_NAME = "userLoginId";
const PASSWORD_INPUT_NAME = "password";

const DISPLAY_TIMEOUT = 10000; // 10 seconds in milliseconds

const saveOutputImage = (base64Image: string, imageName: string) => {
  const filePath = path.join(__dirname, "..", "..", "output", imageName);
  fs.writeFileSync(filePath, base64Image, "base64");
};

describe("Funcionalidad d - Inicio de Sesión", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  const openLoginPage = async () => {
    await driver.get("https://www.netflix.com/login");
  };

  const typeInInput = async (inputName: string, text: string) => {
    const inputElement = await driver.findElement(By.name(inputName));
    inputElement.sendKeys(text);
  };

  const clickLoginButton = async () => {
    const loginButtonElement = await driver.findElement(
      By.css('button[type="submit"]'),
    );
    loginButtonElement.click();
  };

  const saveScreenshot = async (screenshotName: string) => {
    const screenshot = await driver.takeScreenshot();
    saveOutputImage(screenshot, screenshotName);
    return await driver.takeScreenshot();
  };

  test("d2 - Inicio de sesión fallido con email inválido", async () => {
    // ACT
    const invalidEmail = "bisac33526@buzblox.com";
    const somePassword = "12345";

    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await openLoginPage();

    // 2. Ingresar el email inválido
    await typeInInput(EMAIL_INPUT_NAME, invalidEmail);

    // 3. Ingresar una contraseña de al menos 4 caracteres
    await typeInInput(PASSWORD_INPUT_NAME, somePassword);

    // 4. Hacer clic en el botón de "Iniciar sesión"
    await clickLoginButton();

    // ASSERT
    const displayedMessage = await driver
      .wait(until.elementLocated(By.css('div[role="alert"]')), DISPLAY_TIMEOUT)
      .getText();
    const expectedMessage =
      /No podemos encontrar una cuenta con esta dirección de email. Reinténtalo o crea una cuenta nueva./i;

    await saveScreenshot("d2-result.png");

    expect(displayedMessage).toMatch(expectedMessage);
  });

  test("d3 - Inicio de sesión fallido con contraseña incorrecta", async () => {
    // ACT
    const validEmail = "test@test.com";
    const invalidPassword = "12345";

    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await openLoginPage();

    // 2. Ingresar el email del usuario
    await typeInInput(EMAIL_INPUT_NAME, validEmail);

    // 3. Ingresar una contraseña incorrecta
    await typeInInput(PASSWORD_INPUT_NAME, invalidPassword);

    // 3. Hacer clic en el botón de "Iniciar sesión"
    await clickLoginButton();

    // ASSERT
    const displayedMessage = await driver
      .wait(until.elementLocated(By.css('div[role="alert"]')), DISPLAY_TIMEOUT)
      .getText();
    const expectedMessage = /Contraseña incorrecta para test@test.com/i;

    await saveScreenshot("d3-result.png");

    expect(displayedMessage).toMatch(expectedMessage);
  });

  test("d4 - Inicio de sesión sin carga de credenciales", async () => {
    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await openLoginPage();

    // 2. Hacer clic en el botón de "Iniciar sesión"
    await clickLoginButton();

    // ASSERT
    const displayedEmailErrorMessage = await driver
      .wait(
        until.elementLocated(
          By.css('div[data-uia="login-field+validationMessage"]'),
        ),
        DISPLAY_TIMEOUT,
      )
      .getText();
    const expectedEmailErrorMessage =
      /Ingresa un email o un número de teléfono válido./i;

    const displayedPasswordErrorMessage = await driver
      .wait(
        until.elementLocated(
          By.css('div[data-uia="password-field+validationMessage"]'),
        ),
        DISPLAY_TIMEOUT,
      )
      .getText();
    const expectedPasswordErrorMessage =
      /La contraseña debe tener entre 4 y 60 caracteres./i;

    await saveScreenshot("d4-result.png");

    expect(displayedEmailErrorMessage).toMatch(expectedEmailErrorMessage);
    expect(displayedPasswordErrorMessage).toMatch(expectedPasswordErrorMessage);
  });
});
