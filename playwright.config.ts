import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test',
  timeout: 60000,
  use: {
    headless: true,
  },
});
