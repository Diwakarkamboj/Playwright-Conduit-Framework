import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the Conduit Home Page.
 * Encapsulates navigation bar interactions and page-level actions.
 */
export class HomePage {
  /* ── Locators ── */
  readonly page: Page;
  readonly navBar: Locator;
  readonly signUpLink: Locator;
  readonly signInLink: Locator;
  readonly profileLink: (username: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.navBar = page.locator('nav.navbar');
    this.signUpLink = page.getByRole('link', { name: /Sign up/i });
    this.signInLink = page.getByRole('link', { name: /Login|Sign in/i });
    this.profileLink = (username: string) =>
      this.navBar.getByText(username);
  }

  /* ── Actions ── */

  /** Navigate to the home page via baseURL. */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Click the "Sign up" nav link to navigate to the registration page. */
  async navigateToRegister(): Promise<void> {
    await this.signUpLink.click();
  }

  /** Click the "Sign in" nav link to navigate to the login page. */
  async navigateToLogin(): Promise<void> {
    await this.signInLink.click();
  }

  /**
   * Check whether the nav bar shows a profile link for the given username,
   * indicating the user is logged in.
   */
  async isUserLoggedIn(username: string): Promise<boolean> {
    return this.profileLink(username).isVisible();
  }
}
