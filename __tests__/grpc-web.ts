const fs = require("fs");
const path = require("path");

test("__GRPCWEB_DEVTOOLS__", () => {
  const grpcWebIndexPath = path.resolve(__dirname, "..", "node_modules", "grpc-web", "index.js");
  const grpcWebIndexContent = fs.readFileSync(grpcWebIndexPath, "utf-8");

  expect(grpcWebIndexContent).toContain("this.b=[];this.h=[];this.g=[];this.f=[];this.c=[]");
});
