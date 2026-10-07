import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Tests run in real Chromium, not a simulated DOM: focus, :has(), validity
// states and Base UI's portaled popups behave differently in jsdom.
export default defineConfig({
  test: {
    include: ['test/**/*.test.tsx'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
