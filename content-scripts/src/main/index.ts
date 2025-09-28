import { type Interceptor } from "@connectrpc/connect";
import { type Message } from "google-protobuf";
import { connectEsInterceptor } from "./connect-es";
import {
  gRPCWebStreamInterceptor,
  gRPCWebStreamInterceptorInstance,
  gRPCWebUnaryInterceptor,
  gRPCWebUnaryInterceptorInstance,
} from "./grpc";

declare global {
  interface Window {
    __gRPC_devtools__: {
      gRPCWebUnaryInterceptor: gRPCWebUnaryInterceptor<Message, Message>;
      gRPCWebStreamInterceptor: gRPCWebStreamInterceptor<Message, Message>;
      connectEsInterceptor: Interceptor;
    };
  }
}
window.__gRPC_devtools__ = {} as any;
Object.defineProperties(window.__gRPC_devtools__, {
  gRPCDevtoolsUnaryInterceptor: {
    get() {
      console.info(
        "[gRPC Devtools] The `window.__gRPC_devtools__.gRPCDevtoolsUnaryInterceptor` method is deprecated. Please use the `window.__gRPC_devtools__.gRPCWebUnaryInterceptor` interceptor instead.",
      );
      return gRPCWebUnaryInterceptorInstance;
    },
  },
  gRPCDevtoolsStreamInterceptor: {
    get() {
      console.info(
        "[gRPC Devtools] The `window.__gRPC_devtools__.gRPCDevtoolsStreamInterceptor` method is deprecated. Please use the `window.__gRPC_devtools__.gRPCWebStreamInterceptor` interceptor instead.",
      );
      return gRPCWebStreamInterceptorInstance;
    },
  },
  gRPCWebUnaryInterceptor: {
    value: gRPCWebUnaryInterceptorInstance,
    writable: false,
  },
  gRPCWebStreamInterceptor: {
    value: gRPCWebStreamInterceptorInstance,
    writable: false,
  },
  connectEsInterceptor: {
    value: connectEsInterceptor,
    writable: false,
  },
});
