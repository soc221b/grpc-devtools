import zip from "cross-zip";
import fs from "fs";

fs.cpSync("manifest.json", "dist/manifest.json");
fs.cpSync("icon.png", "dist/icon.png");
zip.zipSync("dist", "dist.zip");
