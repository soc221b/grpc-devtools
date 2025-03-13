import fs from "fs";
import zip from "cross-zip";

fs.mkdirSync("shell-chrome/dist/devtools/panels/grpc", { recursive: true });
fs.cpSync("devtools/panels/grpc/dist", "shell-chrome/dist/devtools/panels/grpc", {
  recursive: true,
});
zip.zipSync("shell-chrome", "dist.zip");
