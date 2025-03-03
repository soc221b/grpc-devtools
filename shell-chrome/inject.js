{
  let isUnloading = false;
  window.addEventListener("beforeunload", () => {
    isUnloading = true;
    const message = {
      source: "__gRPC_devtools__",
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
  }) => {
    if (isUnloading) {
      return;
    }

    const timestamp = Date.now();
    const message = JSON.parse(
      JSON.stringify({
        source: "__gRPC_devtools__",
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
      }),
    );
    window.postMessage(message, "*");
  };

  class gRPCDevtoolsUnaryInterceptor {
    intercept = (request, invoker) => {
      const id = Math.random().toString();
      postMessageToContentScript({
        id,
        methodName: request.getMethodDescriptor().name.split("/").pop(),
        serviceName: request.getMethodDescriptor().name.split("/").slice(1, -1).join("/"),
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
    };
  }

  class InterceptedStream {
    constructor({ id, stream }) {
      this.id = id;
      this.stream = stream;
      this.onError();
      this.onStatus();
      this.onData();
      this.onEnd();
    }

    onError = () => {
      const errorCallback = (error) => {
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
      };
      this.stream.on("error", errorCallback);
    };

    onStatus = () => {
      const statusCallback = (status) => {
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
      };
      this.stream.on("status", statusCallback);
    };

    onData = () => {
      const dataCallback = (data) => {
        postMessageToContentScript({
          id: this.id,
          responseMessage: data.toObject(),
        });
      };
      this.stream.on("data", dataCallback);
    };

    onEnd = () => {
      const endCallback = () => {
        postMessageToContentScript({
          id: this.id,
          responseMessage: "EOF",
        });
      };
      this.stream.on("end", endCallback);
    };

    on = (eventType, callback) => {
      this.stream.on(eventType, callback);
      return this;
    };
    removeListener(eventType, callback) {
      this.stream.removeListener(eventType, callback);
      return this;
    }
    cancel = () => {
      this.stream.cancel();
      return this;
    };
  }

  class gRPCDevtoolsStreamInterceptor {
    intercept = function (request, invoker) {
      const id = Math.random().toString();
      postMessageToContentScript({
        id,
        methodName: request.getMethodDescriptor().name.split("/").pop(),
        serviceName: request.getMethodDescriptor().name.split("/").slice(1, -1).join("/"),
        requestMessage: request.getRequestMessage().toObject(),
        requestMetadata: request.getMetadata(),
      });
      return new InterceptedStream({ id, stream: invoker(request) });
    };
  }

  const unaryInterceptor = new gRPCDevtoolsUnaryInterceptor();
  const streamInterceptor = new gRPCDevtoolsStreamInterceptor();
  window.__gRPC_devtools__ = {
    gRPCDevtoolsUnaryInterceptor: unaryInterceptor,
    gRPCDevtoolsStreamInterceptor: streamInterceptor,
  };

  let isWarned = false;
  window.__GRPCWEB_DEVTOOLS__ = window.__GRPCWEB_DEVTOOLS__ || __GRPCWEB_DEVTOOLS__;
  function __GRPCWEB_DEVTOOLS__(clients) {
    if (isWarned === false) {
      isWarned = true;
      console.warn(
        "[gRPC Web Devtools] The `window.__GRPCWEB_DEVTOOLS__` method is injected for seamless migration with gRPC-Web Devtools chrome extension. To migrate, please follow the instructions by clicking the Setup button in the gRPC panel within the devtools and switch to using standard gRPC-Web interceptors instead.",
      );
    }
    clients.forEach((client) => {
      if (Array.isArray(client.client_.h)) {
        // grpc-web@^1.3.0
        client.client_.h = [...client.client_.h, unaryInterceptor];
      } else {
        // grpc-web@^1.1.0
        client.client_.g = [...client.client_.g, unaryInterceptor];
      }
      client.client_.b = [...client.client_.b, streamInterceptor];
    });
  }
  setTimeout(() => {
    if (window.__GRPCWEB_DEVTOOLS__ !== __GRPCWEB_DEVTOOLS__) {
      console.error(
        "[gRPC Web DevTools] It seems you installed the gRPC-Web Developer Tools: https://chromewebstore.google.com/detail/kanmilmfkjnoladbbamlclhccicldjaj. This will cause all gRPC-web interceptors to stop working, please disable it. See more info in this issue: https://github.com/SafetyCulture/grpc-web-devtools/issues/80.",
      );
    }
  }, 5000);
}
