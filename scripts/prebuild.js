import fs from "fs";

fs.rmSync("devtools/panels/grpc/dist", { recursive: true, force: true });
fs.rmSync("shell-chrome/dist", { recursive: true, force: true });
fs.rmSync("dist.zip", { force: true });
