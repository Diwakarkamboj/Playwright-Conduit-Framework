import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the Conduit Login (Sign In) Page.
 * URL: /#/login
 */
export class LoginPage {
  /* ── Locators ── */
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signInButton = page.getByRole('button', { name: /Login|Sign in/i });
    this.errorMessages = page.locator('.error-messages');
  }

  /* ── Actions ── */

  /** Navigate directly to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/#/login');
  }

  /**
   * Fill out the login form and submit.
   * @param email    - User's email address
   * @param password - User's password
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /** Return the visible error message text. */
  async getErrorMessage(): Promise<string> {
    await this.errorMessages.waitFor({ state: 'visible', timeout: 10_000 });
    return this.errorMessages.innerText();
  }
}

