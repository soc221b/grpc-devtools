import type { StreamInterceptor, UnaryInterceptor } from "grpc-web";

declare const __gRPC_devtools__:
  | undefined
  | {
      gRPCDevtoolsUnaryInterceptor: UnaryInterceptor<unknown, unknown>;
      gRPCDevtoolsStreamInterceptor: StreamInterceptor<unknown, unknown>;
    };

export const unaryInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCDevtoolsUnaryInterceptor] : [];
export const streamInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCDevtoolsStreamInterceptor] : [];
