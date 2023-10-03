const { defineConfig } = require("cypress");
​
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3000',
    fixturesFolder: './e2e',
    supportFile: false,
    specPattern: './e2e/*.js'
  },
});