# Issue #101 Plan: Integrate protobuf-ts support

## Goal

Add first-class support for applications using `protobuf-ts` with gRPC-Web transport so requests and responses are captured in gRPC Devtools without custom user code.

## Delivery plan

1. **Expose a built-in protobuf-ts interceptor in injected globals**
   - Add `window.__gRPC_devtools__.protobufTsInterceptor` to the main injected entrypoint.
   - Keep existing `gRPC-Web` and `Connect-ES` support unchanged.

2. **Implement protobuf-ts interceptor behavior**
   - Add unary interception:
     - send request metadata and request message;
     - send response metadata + response message;
     - send EOF marker;
     - capture and forward error metadata/message details.
   - Add server-streaming interception:
     - send initial request metadata and message;
     - forward each streamed message;
     - send EOF on completion;
     - send structured error payload on stream errors.

3. **Normalize protobuf-ts metadata for Devtools transport format**
   - Convert `Record<string, string | string[]>` metadata to `Record<string, string>` for existing message pipeline compatibility.

4. **Document public usage in README**
   - Add a `protobuf-ts` section with a `grpc-devtools.ts` snippet and transport wiring example for `@protobuf-ts/grpcweb-transport`.

5. **Validation**
   - Build content scripts to ensure TypeScript/webpack compilation succeeds.
   - Build the full extension workspace to verify no regressions across packages.

## Non-goals (for this PR)

- Auto-detection/injection into user transports without adding the interceptor.
- New UI behavior in Devtools panel.
- Support beyond unary and server-streaming APIs used in gRPC-Web transport.
