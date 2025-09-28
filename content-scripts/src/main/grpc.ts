import { type Message } from "google-protobuf";
import {
  type ClientReadableStream,
  type Request,
  type StreamInterceptor,
  type UnaryInterceptor,
  type UnaryResponse,
} from "grpc-web";
import { postMessageToContentScript } from "./post-message-to-content-script";

export class gRPCWebUnaryInterceptor<REQ extends Message, RESP extends Message>
  implements UnaryInterceptor<REQ, RESP>
{
  intercept(
    request: Request<REQ, RESP>,
    invoker: (request: Request<REQ, RESP>) => Promise<UnaryResponse<REQ, RESP>>,
  ): Promise<UnaryResponse<REQ, RESP>> {
    const id = Math.random().toString();
    postMessageToContentScript({
      id,
      methodName: (request.getMethodDescriptor() as any)["name"].split("/").pop(),
      serviceName: (request.getMethodDescriptor() as any)["name"].split("/").slice(1, -1).join("/"),
      requestMetadata: request.getMetadata(),
      requestMessage: request.getRequestMessage().toObject(),
    });
    return invoker(request)
      .then((response) => {
        postMessageToContentScript({
          id,
          responseMetadata: {
            ...response.getMetadata(),
            ...response.getStatus().metadata,
          },
          responseMessage: response.getResponseMessage().toObject(),
        });
        postMessageToContentScript({
          id,
          responseMessage: "EOF",
        });
        return response;
      })
      .catch((error) => {
        postMessageToContentScript({
          id,
          responseMessage: {
            name: error.name,
            code: error.code,
            message: error.message,
            stack: error.stack,
          },
          errorMetadata: error.metadata,
        });
        throw error;
      });
  }
}
class InterceptedStream<RESP extends Message> implements ClientReadableStream<RESP> {
  private id: string;
  private stream: ClientReadableStream<RESP>;

  constructor({ id, stream }: { id: string; stream: ClientReadableStream<RESP> }) {
    this.id = id;
    this.stream = stream;
    this.onError();
    this.onStatus();
    this.onData();
    this.onEnd();
  }

  onError = () => {
    this.stream.on("error", (error) => {
      postMessageToContentScript({
        id: this.id,
        responseMessage: {
          name: error.name,
          code: error.code,
          message: error.message,
          stack: error.stack,
        },
        errorMetadata: error.metadata,
      });
    });
  };

  onStatus = () => {
    this.stream.on("status", (status) => {
      if (status.code === 0) {
        postMessageToContentScript({
          id: this.id,
          responseMetadata: status.metadata,
        });
      } else {
        postMessageToContentScript({
          id: this.id,
          errorMetadata: status.metadata,
        });
      }
    });
  };

  onData = () => {
    this.stream.on("data", (data) => {
      postMessageToContentScript({
        id: this.id,
        responseMessage: data.toObject(),
      });
    });
  };

  onEnd = () => {
    this.stream.on("end", () => {
      postMessageToContentScript({
        id: this.id,
        responseMessage: "EOF",
      });
    });
  };

  on(eventType: any, callback: any) {
    this.stream.on(eventType, callback);
    return this;
  }
  removeListener(eventType: any, callback: any) {
    this.stream.removeListener(eventType, callback);
    return this;
  }
  cancel() {
    this.stream.cancel();
    return this;
  }
}
export class gRPCWebStreamInterceptor<REQ extends Message, RESP extends Message>
  implements StreamInterceptor<REQ, RESP>
{
  intercept(
    request: Request<REQ, RESP>,
    invoker: (request: Request<REQ, RESP>) => ClientReadableStream<RESP>,
  ): ClientReadableStream<RESP> {
    const id = Math.random().toString();
    postMessageToContentScript({
      id,
      methodName: (request.getMethodDescriptor() as any)["name"].split("/").pop(),
      serviceName: (request.getMethodDescriptor() as any)["name"].split("/").slice(1, -1).join("/"),
      requestMessage: request.getRequestMessage().toObject(),
      requestMetadata: request.getMetadata(),
    });
    return new InterceptedStream({ id, stream: invoker(request) });
  }
}
export const gRPCWebUnaryInterceptorInstance = new gRPCWebUnaryInterceptor();
export const gRPCWebStreamInterceptorInstance = new gRPCWebStreamInterceptor();

declare global {
  type __GRPCWEB_DEVTOOLS__ = (clients: any[]) => void;

  interface Window {
    __GRPCWEB_DEVTOOLS__: __GRPCWEB_DEVTOOLS__;
  }
}

let isWarned = false;
const __GRPCWEB_DEVTOOLS__: __GRPCWEB_DEVTOOLS__ = (clients) => {
  if (isWarned === false) {
    isWarned = true;
    console.info(
      "[gRPC Devtools] The `window.__GRPCWEB_DEVTOOLS__` method is injected for seamless migration with gRPC-Web Devtools chrome extension. To migrate, please follow the instructions by clicking the Setup button in the gRPC panel within the devtools and switch to using standard gRPC-Web interceptors instead.",
    );
  }
  clients.forEach((client) => {
    if (Array.isArray(client.client_.h)) {
      // grpc-web@^1.3.0
      client.client_.h = [
        ...client.client_.h,
        gRPCWebUnaryInterceptorInstance,
      ];
    } else {
      // grpc-web@^1.1.0
      client.client_.g = [
        ...client.client_.g,
        gRPCWebUnaryInterceptorInstance,
      ];
    }
    client.client_.b = [
      ...client.client_.b,
      gRPCWebStreamInterceptorInstance,
    ];
  });
};
window.__GRPCWEB_DEVTOOLS__ = window.__GRPCWEB_DEVTOOLS__ || __GRPCWEB_DEVTOOLS__;
setTimeout(() => {
  if (window.__GRPCWEB_DEVTOOLS__ !== __GRPCWEB_DEVTOOLS__) {
    console.error(
      "[gRPC DevTools] It seems you installed the gRPC-Web Developer Tools: https://chromewebstore.google.com/detail/kanmilmfkjnoladbbamlclhccicldjaj. This will cause all gRPC-web interceptors to stop working, please disable it. See more info in this issue: https://github.com/SafetyCulture/grpc-web-devtools/issues/80.",
    );
  }
}, 5000);
