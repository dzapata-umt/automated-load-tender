import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    requestTimeout: 20000,
    env: {
      shipperReference: process.env.SHIPPER_REFERENCE,
      totalRate: process.env.TOTAL_RATE,
      ditatAccount: process.env.ACCOUNT_ID,
      ditatUsername: process.env.USERNAME,
      ditatPassword: process.env.PASSWORD,
    },
    retries: 2,
    experimentalMemoryManagement: true,
    baseUrl: process.env.BASE_URL,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
