import { envVariables } from "../config";
import { initializeWebDriver, terminateWebDriver } from "../utils";
import { LoginTestUtils } from "../utils/login";

describe("Funcionalidad d - Inicio de Sesión", () => {
  let loginTestUtils: LoginTestUtils;

  beforeEach(async () => {
    const driver = await initializeWebDriver();
    loginTestUtils = new LoginTestUtils(driver);
  });

  afterEach(async () => {
    await terminateWebDriver(loginTestUtils.getDriver());
  });

  test.skip("d1 - Inicio de sesión exitoso con credenciales válidas", async () => {
    // ACT
    const validEmail = envVariables.netflixEmail;
    const validPassword = envVariables.netflixPassword;

    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await loginTestUtils.openLoginPage();

    // 2. Ingresar el email y contraseña válidos del usuario.
    await loginTestUtils.typeInEmailInput(validEmail);
    await loginTestUtils.typeInPasswordInput(validPassword);

    // 3. Hacer clic en el botón de "Iniciar sesión"
    await loginTestUtils.clickLoginButton();

    // ASSERT
    const manageProfilesButtonText =
      await loginTestUtils.getManageProfilesButtonText();
    const expectedMessage = /administrar perfiles/i;

    await loginTestUtils.saveScreenshot("d1-result.png");

    expect(manageProfilesButtonText).toMatch(expectedMessage);
  });

  test("d2 - Inicio de sesión fallido con email inválido", async () => {
    // ACT
    const invalidEmail = "bisac33526@buzblox.com";
    const somePassword = "12345";

    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await loginTestUtils.openLoginPage();

    // 2. Ingresar el email inválido
    await loginTestUtils.typeInEmailInput(invalidEmail);

    // 3. Ingresar una contraseña de al menos 4 caracteres
    await loginTestUtils.typeInPasswordInput(somePassword);

    // 4. Hacer clic en el botón de "Iniciar sesión"
    await loginTestUtils.clickLoginButton();

    // ASSERT
    const displayedAlertMessage = await loginTestUtils.getAlertText();
    const expectedMessage =
      /No podemos encontrar una cuenta con esta dirección de email. Reinténtalo o crea una cuenta nueva./i;

    await loginTestUtils.saveScreenshot("d2-result.png");

    expect(displayedAlertMessage).toMatch(expectedMessage);
  });

  test("d3 - Inicio de sesión fallido con contraseña incorrecta", async () => {
    // ACT
    const validEmail = "test@test.com";
    const invalidPassword = "12345";

    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await loginTestUtils.openLoginPage();

    // 2. Ingresar el email del usuario
    await loginTestUtils.typeInEmailInput(validEmail);

    // 3. Ingresar una contraseña incorrecta
    await loginTestUtils.typeInPasswordInput(invalidPassword);

    // 3. Hacer clic en el botón de "Iniciar sesión"
    await loginTestUtils.clickLoginButton();

    // ASSERT
    const displayedAlertMessage = await loginTestUtils.getAlertText();
    const expectedMessage = /Contraseña incorrecta para test@test.com/i;

    await loginTestUtils.saveScreenshot("d3-result.png");

    expect(displayedAlertMessage).toMatch(expectedMessage);
  });

  test("d4 - Inicio de sesión sin carga de credenciales", async () => {
    // ARRANGE
    // 1. Abrir la página de inicio de sesión de Netflix
    await loginTestUtils.openLoginPage();

    // 2. Hacer clic en el botón de "Iniciar sesión"
    await loginTestUtils.clickLoginButton();

    // ASSERT
    const displayedEmailErrorMessage = await loginTestUtils.getEmailErrorText();
    const expectedEmailErrorMessage =
      /Ingresa un email o un número de teléfono válido./i;

    const displayedPasswordErrorMessage =
      await loginTestUtils.getPasswordErrorText();
    const expectedPasswordErrorMessage =
      /La contraseña debe tener entre 4 y 60 caracteres./i;

    await loginTestUtils.saveScreenshot("d4-result.png");

    expect(displayedEmailErrorMessage).toMatch(expectedEmailErrorMessage);
    expect(displayedPasswordErrorMessage).toMatch(expectedPasswordErrorMessage);
  });
});
