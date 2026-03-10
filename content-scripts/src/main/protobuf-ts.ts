import type {
  NextServerStreamingFn,
  NextUnaryFn,
  RpcError,
  RpcInterceptor,
  RpcMetadata,
  ServerStreamingCall,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { postMessageToContentScript } from "./post-message-to-content-script";

const toMetadataRecord = (
  metadata: undefined | Readonly<RpcMetadata>,
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

const toSerializableError = (error: RpcError) => ({
  name: error.name,
  code: error.code,
  message: error.message,
  stack: error.stack,
});

export const protobufTsInterceptor: RpcInterceptor = {
  interceptUnary(next: NextUnaryFn, method, input, options): UnaryCall {
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
      (finishedUnaryCall) => {
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
      (error: RpcError) => {
        postMessageToContentScript({
          id,
          responseMessage: toSerializableError(error),
          errorMetadata: toMetadataRecord(error.meta),
        });
        throw error;
      },
    );

    return call;
  },

  interceptServerStreaming(
    next: NextServerStreamingFn,
    method,
    input,
    options,
  ): ServerStreamingCall {
    const id = Math.random().toString(36).slice(2, 6);
    const call = next(method, input, options);
    let responseMetadata: Record<string, string> | undefined;

    call.headers
      .then((headers) => {
        responseMetadata = toMetadataRecord(headers);
      })
      .catch(() => {
        responseMetadata = undefined;
      });

    postMessageToContentScript({
      id,
      methodName: call.method.name,
      serviceName: call.method.service.typeName,
      requestMetadata: toMetadataRecord(call.requestHeaders),
      requestMessage: call.request,
    });

    call.responses.onMessage((message) => {
      postMessageToContentScript({
        id,
        responseMetadata,
        responseMessage: message,
      });
    });

    call.responses.onComplete(() => {
      postMessageToContentScript({
        id,
        responseMetadata,
        responseMessage: "EOF",
      });
    });

    call.responses.onError((error) => {
      postMessageToContentScript({
        id,
        responseMessage: toSerializableError(error),
        errorMetadata: toMetadataRecord(error.meta),
      });

      throw error;
    });

    return call;
  },
};
