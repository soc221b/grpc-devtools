const fs = require("fs");
const childProcess = require("child_process");
const rimraf = require("rimraf").sync;
const zip = require("cross-zip");

function build() {
  rimraf("shell-chrome/dist");
  rimraf("dist.zip");
  childProcess.execSync("npx cross-env NODE_ENV=production webpack", {
    stdio: "inherit",
  });
  fs.renameSync("dist", "shell-chrome/dist");
  zip.zipSync("shell-chrome", "dist.zip");

  console.log("Finished.");
}

build();
