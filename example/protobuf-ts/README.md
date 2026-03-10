# protobuf-ts Example

This example shows how to wire `grpc-devtools` with [`protobuf-ts`](https://github.com/timostamm/protobuf-ts) and the gRPC-Web transport.

## grpc-devtools.ts

```ts
import type { RpcInterceptor } from "@protobuf-ts/runtime-rpc";

declare const __gRPC_devtools__:
  | undefined
  | {
      protobufTsInterceptor: RpcInterceptor;
    };

export const interceptors: RpcInterceptor[] =
  typeof __gRPC_devtools__ === "object"
    ? [
        __gRPC_devtools__.protobufTsInterceptor,
      ]
    : [];
```

## transport.ts

```ts
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { interceptors } from "./grpc-devtools";

export const transport = new GrpcWebFetchTransport({
  baseUrl: "http://localhost:3003",
  interceptors,
});
```

## Included source snippets

- `client/src/grpc-devtools.ts`
- `client/src/transport.ts`
