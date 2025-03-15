import fs from "fs";

fs.rmSync("dist", { force: true, recursive: true });
fs.rmSync("dist.zip", { force: true });
