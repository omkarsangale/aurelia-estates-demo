import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests', timeout:45000, workers:1, reporter:'list',
  use:{baseURL:'http://127.0.0.1:4173',channel:'chrome',headless:true},
  webServer:{command:'node server.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:true},
});
