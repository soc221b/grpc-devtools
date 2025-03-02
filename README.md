# gRPC Web Devtools

`grpc-devtools` requires at least [`grpc-web` 1.1.0](https://grpc.io/blog/grpc-web-interceptor/), so make sure you upgrade your grpc-web if you're still running an older one.

<div style="display: flex; justify-content: center;">
  <img src="./demo.png" width='720px'/>
</div>

## Usage

grpc-devtools.ts

```ts
import type { StreamInterceptor, UnaryInterceptor } from "grpc-web";

declare const __gRPC_devtools__:
  | undefined
  | {
      gRPCDevtoolsUnaryInterceptor: UnaryInterceptor<unknown, unknown>;
      gRPCDevtoolsStreamInterceptor: StreamInterceptor<unknown, unknown>;
    };

export const gRPCDevtoolsUnaryInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCDevtoolsUnaryInterceptor] : [];
export const gRPCDevtoolsStreamInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCDevtoolsStreamInterceptor] : [];
```

example.ts

```ts
import { gRPCDevtoolsUnaryInterceptors, gRPCDevtoolsStreamInterceptors } from "./grpc-devtools";

const client = new ChatServiceClient(host, creds, {
  unaryInterceptors: gRPCDevtoolsUnaryInterceptors,
  streamInterceptors: gRPCDevtoolsStreamInterceptors,
});
```
