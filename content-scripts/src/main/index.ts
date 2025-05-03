import { type Interceptor } from "@connectrpc/connect";
import { type Message } from "google-protobuf";
import {
  type ClientReadableStream,
  type Request,
  type StreamInterceptor,
  type UnaryInterceptor,
  type UnaryResponse,
} from "grpc-web";

let isUnloading = false;
window.addEventListener("beforeunload", () => {
  isUnloading = true;
  const message = {
    source: "__gRPC_devtools_content_scripts_main__",
    payload: {
      action: "unload",
    },
  };
  window.postMessage(message, "*");
});

const postMessageToContentScript = ({
  id,
  methodName,
  serviceName,
  requestMessage,
  requestMetadata,
  responseMetadata,
  responseMessage,
  errorMetadata,
}: {
  id: string;
  methodName?: undefined | string;
  serviceName?: undefined | string;
  requestMessage?: undefined | unknown;
  requestMetadata?: undefined | Record<string, string>;
  responseMetadata?: undefined | Record<string, string>;
  responseMessage?: undefined | unknown;
  errorMetadata?: undefined | Record<string, string>;
}) => {
  if (isUnloading) {
    return;
  }

  const timestamp = Date.now();
  const message = JSON.parse(
    JSON.stringify(
      {
        source: "__gRPC_devtools_content_scripts_main__",
        payload: {
          id,
          timestamp,
          methodName,
          serviceName,
          requestMetadata,
          requestMessage,
          responseMetadata,
          responseMessage: responseMessage === "EOF" ? { EOF: timestamp } : responseMessage,
          errorMetadata,
        },
      },
      (_, value) => (typeof value === "bigint" ? value.toString() + "n" : value),
    ),
  );
  window.postMessage(message, "*");
};

class gRPCWebUnaryInterceptor<REQ extends Message, RESP extends Message>
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
class gRPCWebStreamInterceptor<REQ extends Message, RESP extends Message>
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
const gRPCWebUnaryInterceptorInstance = new gRPCWebUnaryInterceptor();
const gRPCWebStreamInterceptorInstance = new gRPCWebStreamInterceptor();

const connectEsInterceptor: Interceptor = (next) => {
  return async (req) => {
    const id = Math.random().toString(36).slice(2, 6);
    if (req.stream) {
      const originalMessage = req.message;
      const message = {
        [Symbol.asyncIterator]: () => {
          const iterator = originalMessage[Symbol.asyncIterator]();
          return {
            next: async () => {
              const { done, value } = await iterator.next();
              if (done) {
                postMessageToContentScript({
                  id,
                  methodName: req.method.name,
                  serviceName: req.service.name,
                  requestMetadata: Array.from(req.header.entries()).reduce(
                    (
                      acc,
                      [
                        key,
                        value,
                      ],
                    ) => ({ ...acc, [key]: value }),
                    {},
                  ),
                  requestMessage: "EOF",
                });
                return { done: true, value: undefined };
              }
              postMessageToContentScript({
                id,
                methodName: req.method.name,
                serviceName: req.service.name,
                requestMetadata: Array.from(req.header.entries()).reduce(
                  (
                    acc,
                    [
                      key,
                      value,
                    ],
                  ) => ({ ...acc, [key]: value }),
                  {},
                ),
                requestMessage: { ...value, $typeName: undefined, $unknown: undefined },
              });
              return { done: false, value };
            },
          };
        },
      };
      (req as any).message = message;
    } else {
      postMessageToContentScript({
        id,
        methodName: req.method.name,
        serviceName: req.service.name,
        requestMetadata: Array.from(req.header.entries()).reduce(
          (
            acc,
            [
              key,
              value,
            ],
          ) => ({ ...acc, [key]: value }),
          {},
        ),
        requestMessage: { ...req.message, $typeName: undefined, $unknown: undefined },
      });
    }

    const res = await next(req);
    if (res.stream) {
      return {
        ...res,
        message: (async function* () {
          for await (const message of res.message) {
            postMessageToContentScript({
              id,
              methodName: req.method.name,
              serviceName: req.service.name,
              responseMetadata: Array.from(res.header.entries()).reduce(
                (
                  acc,
                  [
                    key,
                    value,
                  ],
                ) => ({ ...acc, [key]: value }),
                {},
              ),
              responseMessage: { ...message, $typeName: undefined, $unknown: undefined },
            });
            yield message;
          }
          postMessageToContentScript({
            id,
            methodName: req.method.name,
            serviceName: req.service.name,
            responseMetadata: Array.from(res.header.entries()).reduce(
              (
                acc,
                [
                  key,
                  value,
                ],
              ) => ({ ...acc, [key]: value }),
              {},
            ),
            responseMessage: "EOF",
          });
        })(),
      };
    } else {
      postMessageToContentScript({
        id,
        methodName: req.method.name,
        serviceName: req.service.name,
        responseMetadata: Array.from(res.header.entries()).reduce(
          (
            acc,
            [
              key,
              value,
            ],
          ) => ({ ...acc, [key]: value }),
          {},
        ),
        responseMessage: { ...res.message, $typeName: undefined, $unknown: undefined },
      });
      postMessageToContentScript({
        id,
        methodName: req.method.name,
        serviceName: req.service.name,
        responseMetadata: Array.from(res.header.entries()).reduce(
          (
            acc,
            [
              key,
              value,
            ],
          ) => ({ ...acc, [key]: value }),
          {},
        ),
        responseMessage: "EOF",
      });
      return res;
    }
  };
};

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
