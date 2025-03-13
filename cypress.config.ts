import { verifyDownloadTasks } from "cy-verify-downloads";
import { defineConfig } from "cypress";

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    experimentalStudio: true,
    baseUrl: "http://localhost:4000/",
    setupNodeEvents(on) {
      on("task", verifyDownloadTasks);
    },
  },
});
