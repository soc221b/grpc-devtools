import { postMessageToContentScript } from "./post-message-to-content-script";

type RpcMetadata = Record<string, string | readonly string[]>;

const toMetadataRecord = (
  metadata: undefined | RpcMetadata,
): Record<string, string> | undefined => {
  if (metadata === undefined) {
    return undefined;
  }

  return Object.entries(metadata).reduce<Record<string, string>>(
    (
      acc,
      [
        key,
        value,
      ],
    ) => {
      acc[key] = Array.isArray(value) ? String(value[0] ?? "") : String(value);
      return acc;
    },
    {},
  );
};

export const protobufTsInterceptor = {
  interceptUnary(next: any, method: any, input: any, options: any) {
    const id = Math.random().toString(36).slice(2, 6);
    const call = next(method, input, options);

    postMessageToContentScript({
      id,
      methodName: call.method.name,
      serviceName: call.method.service.typeName,
      requestMessage: call.request,
      requestMetadata: toMetadataRecord(call.requestHeaders),
    });

    call.then(
      (finishedUnaryCall: any) => {
        postMessageToContentScript({
          id,
          responseMetadata: toMetadataRecord(finishedUnaryCall.headers),
          responseMessage: finishedUnaryCall.response,
        });

        postMessageToContentScript({
          id,
          responseMessage: "EOF",
        });

        return finishedUnaryCall;
      },
      (error: any) => {
        postMessageToContentScript({
          id,
          responseMessage: {
            name: error.name,
            code: error.code,
            message: error.message,
            stack: error.stack,
          },
          errorMetadata: toMetadataRecord(error.meta),
        });
        throw error;
      },
    );

    return call;
  },

  interceptServerStreaming(next: any, method: any, input: any, options: any) {
    const id = Math.random().toString(36).slice(2, 6);
    const call = next(method, input, options);

    postMessageToContentScript({
      id,
      methodName: call.method.name,
      serviceName: call.method.service.typeName,
      requestMetadata: toMetadataRecord(call.requestHeaders),
      requestMessage: call.request,
    });

    call.responses.onMessage((message: any) => {
      postMessageToContentScript({
        id,
        responseMessage: message,
      });
    });

    call.responses.onComplete(() => {
      postMessageToContentScript({
        id,
        responseMessage: "EOF",
      });
    });

    call.responses.onError((error: any) => {
      postMessageToContentScript({
        id,
        responseMessage: {
          name: error.name,
          code: error.code,
          message: error.message,
          stack: error.stack,
        },
        errorMetadata: toMetadataRecord(error.meta),
      });

      throw error;
    });

    return call;
  },
};
