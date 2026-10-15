import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { envConfig } from '../utils/envConfig';

/**
 * Authentication test suite for the Conduit RealWorld application.
 * Covers user registration (unique credentials) and login (env-driven credentials).
 */
test.describe('Authentication', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
  });

  // ── Registration ──────────────────────────────────────────────────────────

  test(
    'should register a new user with valid, unique credentials',
    { tag: ['@register', '@RegisterAndLoginCheck'] },
    async ({ page }) => {
      // Generate unique credentials using a timestamp to avoid collisions
      const timestamp = Date.now();
      const username = `user_${timestamp}`;
      const email = `user_${timestamp}@test.com`;
      const password = 'SecurePass123!';

      // Navigate to the registration page via the home page nav bar
      await homePage.goto();
      await homePage.navigateToRegister();

      // Fill the form and submit
      await registerPage.registerUser(username, email, password);

      // Assert: user is redirected to the home page
      await expect(page).toHaveURL(/\/#\/?$/, { timeout: 10_000 });

      // Assert: profile name appears in the nav bar
      await expect(homePage.profileLink(username)).toBeVisible({ timeout: 10_000 });
    },
  );

  // ── Login ─────────────────────────────────────────────────────────────────

  test(
    'should login successfully using environment-specific credentials',
    { tag: ['@login', '@RegisterAndLoginCheck'] },
    async ({ page }) => {
    // Use email & password from the active environment config (st / uat)
    const { email, password } = envConfig;

    // Navigate to the login page via the home page nav bar
    await homePage.goto();
    await homePage.navigateToLogin();

    // Fill the form and submit
    await loginPage.login(email, password);

    // Assert: user is redirected to the home page
    await expect(page).toHaveURL(/\/#\/?$/, { timeout: 10_000 });

    // Assert: Login/Sign in link is no longer visible (user is logged in)
    await expect(homePage.signInLink).not.toBeVisible({ timeout: 10_000 });
  });
});

