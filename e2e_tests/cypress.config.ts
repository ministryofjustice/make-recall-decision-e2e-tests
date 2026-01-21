import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";
import { readDocX } from "../cypress_shared/plugins";
import { configureVisualRegression } from "cypress-visual-regression";

export default defineConfig({
  viewportHeight: 720,
  viewportWidth: 1280,
  pageLoadTimeout: 120000,
  chromeWebSecurity: false,
  downloadsFolder: "e2e_tests/downloads",
  fixturesFolder: "e2e_tests/fixtures",
  screenshotsFolder: "e2e_tests/screenshots",
  screenshotOnRunFailure: false,
  videosFolder: "e2e_tests/videos",
  video: process.env.ENVIRONMENT !== "local",
  videoCompression: process.env.ENVIRONMENT !== "local",
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reportDir: "e2e_tests/reports",
    charts: true,
    reportPageTitle: "Make recall decisions E2E tests",
    embeddedScreenshots: false,
    reporterEnabled: "spec, mocha-junit-reporter",
    reporterOptions: {
      mochaFile: "e2e_tests/junit/results-[hash].xml",
    },
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config);

      /**
       * force specific browser size in headless mode,
       * see: https://docs.cypress.io/api/node-events/browser-launch-api#Set-screen-size-when-running-headless
      **/
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--window-size=1280,720')
          launchOptions.args.push('--force-device-scale-factor=1')
        }

        return launchOptions
      })

      configureVisualRegression(on);

      installLogsPrinter(on, {
        printLogsToFile: "always",
        printLogsToConsole: "always",
        outputRoot: `${config.projectRoot}/e2e_tests/logs`,
        outputTarget: { "out.txt": "txt", "out.json": "json" },
      });
      on(
        "file:preprocessor",
        createBundler({
          plugins: [nodeModulesPolyfillPlugin(), createEsbuildPlugin(config)],
        })
      );

      on("task", {
        readDocX,
      });
      return config;
    },
    baseUrl: "http://localhost:3000",
    excludeSpecPattern: "**/!(*.cy).ts",
    specPattern: "**/*.feature",
    supportFile: "e2e_tests/support/index.ts",
    experimentalRunAllSpecs: true,
  },
  env: {
    visualRegressionType: "regression",
    visualRegressionFailSilently: true,
    pluginVisualRegressionCleanupUnusedImages: true,
    visualRegressionBaseDirectory: './visualRegression/base',
    visualRegressionDiffDirectory: './visualRegression/diff',
    pluginVisualRegressionUpdateImages: false,
    visualRegressionGenerateDiff: 'fail'
  },
});
