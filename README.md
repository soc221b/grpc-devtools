# gRPC Devtools

<div style="display: flex; justify-content: center;">
  <img src="./demo.png" width='720px'/>
</div>

## Usage

### [gRPC-Web](https://github.com/grpc/grpc-web)

`gRPC-Devtools` requires at least [`gRPC-Web` 1.1.0](https://grpc.io/blog/grpc-web-interceptor/), so make sure you upgrade your grpc-web if you're still running an older one.

grpc-devtools.ts

```ts
import type { StreamInterceptor, UnaryInterceptor } from "grpc-web";

declare const __gRPC_devtools__:
  | undefined
  | {
      gRPCWebUnaryInterceptor: UnaryInterceptor<unknown, unknown>;
      gRPCWebStreamInterceptor: StreamInterceptor<unknown, unknown>;
    };

export const unaryInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCWebUnaryInterceptor] : [];
export const streamInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCWebStreamInterceptor] : [];
```

example.ts

```ts
import { unaryInterceptors, streamInterceptors } from "./grpc-devtools";

const client = new ChatServiceClient(host, creds, { unaryInterceptors, streamInterceptors });
```

## [Connect-ES](https://github.com/connectrpc/connect-es)

grpc-devtools.ts

```ts
import type { Interceptor } from "@connectrpc/connect";

declare const __gRPC_devtools__:
  | undefined
  | {
      connectEsInterceptor: Interceptor;
    };

export const interceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.connectEsInterceptor] : [];
```

example.ts

```ts
import { interceptors } from "./grpc-devtools";

const transport = createConnectTransport({ baseUrl: "http://localhost:3003", interceptors });
```
