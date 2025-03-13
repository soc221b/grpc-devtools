import fs from "fs";
import zip from "cross-zip";

fs.mkdirSync("dist");
fs.cpSync("content-scripts/dist", "dist/content-scripts", { recursive: true });
fs.cpSync("devtools/dist", "dist/devtools", { recursive: true });
fs.cpSync("devtools/panels/grpc/dist", "dist/devtools/panels/grpc", { recursive: true });
fs.cpSync("manifest.json", "dist/manifest.json");
fs.cpSync("icon.png", "dist/icon.png");
zip.zipSync("dist", "dist.zip");
