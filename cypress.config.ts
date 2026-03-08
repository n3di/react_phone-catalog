// cypress.config.ts (ESM + TS)
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // zmień, jeśli używasz innego portu
    specPattern: 'cypress/{e2e,integration}/**/*.{spec,cy}.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: true,
    video: true,
  },

  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'raw_reports',
    overwrite: false,
    html: false,
    json: true,
  },

  viewportHeight: 1920,
  viewportWidth: 1080,

  component: {
    specPattern: 'src/**/*.spec.{js,jsx,ts,tsx}', // jeśli faktycznie trzymasz specy w src
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
