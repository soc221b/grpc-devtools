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
      acc[key] = Array.isArray(value) ? value.map(String).join(", ") : String(value);
      return acc;
    },
    {},
  );
};

const mergeMetadata = (
  ...metadataItems: Array<undefined | Readonly<RpcMetadata>>
): Record<string, string> | undefined => {
  const records = metadataItems
    .map((metadata) => toMetadataRecord(metadata))
    .filter((metadata): metadata is Record<string, string> => metadata !== undefined);

  if (records.length === 0) {
    return undefined;
  }

  return Object.assign({}, ...records);
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
      methodName: method.name,
      serviceName: method.service.typeName,
      requestMessage: call.request,
      requestMetadata: toMetadataRecord(call.requestHeaders),
    });

    void call
      .then((finishedUnaryCall) => {
        postMessageToContentScript({
          id,
          responseMetadata: mergeMetadata(finishedUnaryCall.headers, finishedUnaryCall.trailers),
          responseMessage: finishedUnaryCall.response,
        });

        postMessageToContentScript({
          id,
          responseMessage: "EOF",
        });
      })
      .catch((error: RpcError) => {
        postMessageToContentScript({
          id,
          responseMessage: toSerializableError(error),
          errorMetadata: toMetadataRecord(error.meta),
        });
      });

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

    void call.headers
      .then((headers) => {
        responseMetadata = mergeMetadata(headers, responseMetadata);
        postMessageToContentScript({
          id,
          responseMetadata,
        });
      })
      .catch(() => void 0);

    void call.trailers
      .then((trailers) => {
        responseMetadata = mergeMetadata(responseMetadata, trailers);
        postMessageToContentScript({
          id,
          responseMetadata,
        });
      })
      .catch(() => void 0);

    postMessageToContentScript({
      id,
      methodName: method.name,
      serviceName: method.service.typeName,
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
    });

    return call;
  },
};
