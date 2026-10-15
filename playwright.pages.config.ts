import { defineConfig } from '@playwright/test';

// Exercise Pages routing/headers rather than Vite's development SPA fallback.
export default defineConfig({
  testDir: './tests',
  testMatch: ['asset-delivery.spec.ts', 'projects-navigation.spec.ts'],
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4176', browserName: 'chromium' },
  webServer: {
    command: 'npx --yes wrangler@4.86.0 pages dev dist --port 4176 --compatibility-date=2026-05-03',
    url: 'http://127.0.0.1:4176',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
