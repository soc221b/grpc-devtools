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
