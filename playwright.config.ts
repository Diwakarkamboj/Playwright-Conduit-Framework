import { defineConfig } from '@playwright/test';
import { envConfig } from './utils/envConfig';

/**
 * Playwright configuration for Conduit RealWorld App.
 * The baseURL is driven by the active environment (TEST_ENV).
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directory where tests are located */
  testDir: './tests',

  /* Maximum time one test can run */
  timeout: 30_000,

  /* Assertion timeout */
  expect: {
    timeout: 5_000,
  },

  /* Run tests in parallel */
  workers: 1,
  fullyParallel: false,

  /* Fail the build on CI if test.only is left in source code */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests once on CI */
  retries: process.env.CI ? 1 : 0,

  /* Reporter — HTML report for rich debugging */
  reporter: [['html', { open: 'never' }]],

  /* Shared settings for all projects */
  use: {
    /* Base URL sourced from the active environment config */
    baseURL: envConfig.baseUrl,

    /* Always run in headed (visible browser) mode */
    headless: false,

    /* Maximise the browser window — requires viewport: null so Playwright
       doesn't override the window size with a fixed viewport */
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record trace on first retry */
    trace: 'on-first-retry',
  },

  /* Run tests exclusively on Chromium */
  projects: [
    {
      name: 'chromium',
      use: {
        /* Do NOT spread devices['Desktop Chrome'] here as it overrides viewport: null with 1280x720 */
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
