const fs = require("fs");
const path = require("path");

test("__GRPCWEB_DEVTOOLS__ grpc-web internals include interceptor arrays", () => {
  const grpcWebIndexPath = path.resolve(__dirname, "..", "node_modules", "grpc-web", "index.js");
  const grpcWebIndexContent = fs.readFileSync(grpcWebIndexPath, "utf-8");

  // grpc-web internals are minified and changed between versions.
  // Accept both older (h/g/b) and newer (h/m) interceptor field layouts.
  const hasLegacyLayout =
    grpcWebIndexContent.includes("this.h=[]") &&
    grpcWebIndexContent.includes("this.g=[]") &&
    grpcWebIndexContent.includes("this.b=[]");
  const hasModernLayout =
    grpcWebIndexContent.includes("this.h=[]") && grpcWebIndexContent.includes("this.m=[]");

  expect(hasLegacyLayout || hasModernLayout).toBe(true);
});
