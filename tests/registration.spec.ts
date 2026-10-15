import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';

/**
 * Registration test suite for the Conduit RealWorld application.
 * Covers both positive (successful sign-up) and negative (duplicate email) flows.
 */
test.describe('User Registration', () => {
  let homePage: HomePage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);

    // Navigate to the home page, then click "Sign up"
    await homePage.goto();
    await homePage.navigateToRegister();
  });

  test('should register a new user with valid, unique credentials', async ({
    page,
  }) => {
    // Generate unique credentials using a timestamp to avoid collisions
    const timestamp = Date.now();
    const username = `user_${timestamp}`;
    const email = `user_${timestamp}@test.com`;
    const password = 'SecurePass123!';

    // Fill the form and submit
    await registerPage.registerUser(username, email, password);

    // Assert: user is redirected to the home page and their profile link is visible in the nav bar
    await expect(page).toHaveURL(/\/#\/$/, { timeout: 10_000 });
    await expect(
      page.getByRole('link', { name: username, exact: true }),
    ).toBeVisible();
  });

  test('should display an error when registering with an already taken email', async () => {
    // Use static credentials that we assume already exist in the database
    const existingUsername = 'duplicateUser';
    const existingEmail = 'existing@test.com';
    const password = 'SecurePass123!';

    // Attempt registration with the duplicate email
    await registerPage.registerUser(existingUsername, existingEmail, password);

    // Assert: error message is displayed on the registration page
    const errorText = await registerPage.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('email');

    // Assert: user stays on the register page (not redirected)
    await expect(registerPage.page).toHaveURL(/\/#\/register/);
  });
});

