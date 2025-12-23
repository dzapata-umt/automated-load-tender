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
      carrier: process.env.CARRIER,
    },
    retries: 3,
    experimentalMemoryManagement: true,
    baseUrl: 'https://ng01.ditat.net/',
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
