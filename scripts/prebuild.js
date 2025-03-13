import fs from "fs";

fs.rmSync("content-scripts/dist", { recursive: true, force: true });
fs.rmSync("devtools/dist", { recursive: true, force: true });
fs.rmSync("devtools/panels/grpc/dist", { recursive: true, force: true });
fs.rmSync("dist", { recursive: true, force: true });
fs.rmSync("dist.zip", { force: true });
