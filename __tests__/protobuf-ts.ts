const fs = require("fs");
const path = require("path");

test("protobuf-ts interceptor is exposed in injected globals", () => {
  const indexPath = path.resolve(__dirname, "..", "content-scripts", "src", "main", "index.ts");
  const content = fs.readFileSync(indexPath, "utf-8");

  expect(content).toContain("protobufTsInterceptor");
  expect(content).toContain("value: protobufTsInterceptor");
});

test("protobuf-ts interceptor handles unary and server streaming flows", () => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "content-scripts",
    "src",
    "main",
    "protobuf-ts.ts",
  );
  const content = fs.readFileSync(filePath, "utf-8");

  expect(content).toContain("interceptUnary");
  expect(content).toContain("interceptServerStreaming");
  expect(content).toContain('responseMessage: "EOF"');
  expect(content).toContain("toMetadataRecord(call.requestHeaders)");
  expect(content).toContain("responseMetadata");
});

test("protobuf-ts interceptor avoids creating unhandled rejections", () => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "content-scripts",
    "src",
    "main",
    "protobuf-ts.ts",
  );
  const content = fs.readFileSync(filePath, "utf-8");

  expect(content).toContain("void call");
  expect(content).toContain(".catch((error: RpcError) => {");
  expect(content).not.toContain(
    "call.responses.onError((error) => {\n      postMessageToContentScript({\n        id,\n        responseMessage: toSerializableError(error),\n        errorMetadata: toMetadataRecord(error.meta),\n      });\n\n      throw error;\n    });",
  );
});
