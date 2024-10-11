const { defineConfig } = require("cypress");
// import { defineConfig } from "cypress";


module.exports = defineConfig({
  video: true,
  viewportWidth: 1600,
  viewportHeight: 741,
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
