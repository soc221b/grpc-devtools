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
