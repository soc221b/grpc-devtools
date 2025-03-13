import { expressConnectMiddleware } from "@connectrpc/connect-express";
import cors from "cors";
import express from "express";
import http from "http";
import routes from "./connect";

const port = 3003;
const app = express();
app.use(cors());
app.use(expressConnectMiddleware({ routes }));

const server = http.createServer(app).listen(port, () => {
  console.log(`Server running at :${port}`);
});
process.on("exit", () => {
  server.close();
  console.log("exit");
});
