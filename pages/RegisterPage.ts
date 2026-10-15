import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the Conduit Registration (Sign Up) Page.
 * URL: /#/register
 */
export class RegisterPage {
  /* ── Locators ── */
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder(/Your Name|Username/i);
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    this.errorMessages = page.locator('.error-messages');
  }

  /* ── Actions ── */

  /** Navigate directly to the registration page. */
  async goto(): Promise<void> {
    await this.page.goto('/#/register');
  }

  /**
   * Fill out the registration form and submit.
   * @param username - Desired username
   * @param email    - Email address
   * @param password - Password (min 8 chars recommended)
   */
  async registerUser(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signUpButton.click();
  }

  /** Return the visible error message text. */
  async getErrorMessage(): Promise<string> {
    await this.errorMessages.waitFor({ state: 'visible', timeout: 10_000 });
    return this.errorMessages.innerText();
  }
}
