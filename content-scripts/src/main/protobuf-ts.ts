import { postMessageToContentScript } from "./post-message-to-content-script";

type RpcMetadata = Record<string, string | readonly string[]>;

type ServiceInfo = {
  typeName: string;
};

type MethodInfo = {
  name: string;
  service: ServiceInfo;
};

type RpcOptions = Record<string, unknown>;

type RpcError = Error & {
  code?: string | number;
  meta?: RpcMetadata;
};

type FinishedUnaryCall<TResponse> = {
  response: TResponse;
  headers?: RpcMetadata;
};

type UnaryCall<TRequest, TResponse> = Promise<FinishedUnaryCall<TResponse>> & {
  method: MethodInfo;
  request: TRequest;
  requestHeaders?: RpcMetadata;
};

type ServerStreamingCall<TRequest, TResponse> = {
  method: MethodInfo;
  request: TRequest;
  requestHeaders?: RpcMetadata;
  responses: {
    onMessage(callback: (message: TResponse) => void): void;
    onComplete(callback: () => void): void;
    onError(callback: (error: RpcError) => void): void;
  };
};

type ProtobufTsInterceptor = {
  interceptUnary<TRequest, TResponse>(
    next: (
      method: MethodInfo,
      input: TRequest,
      options: RpcOptions,
    ) => UnaryCall<TRequest, TResponse>,
    method: MethodInfo,
    input: TRequest,
    options: RpcOptions,
  ): UnaryCall<TRequest, TResponse>;
  interceptServerStreaming<TRequest, TResponse>(
    next: (
      method: MethodInfo,
      input: TRequest,
      options: RpcOptions,
    ) => ServerStreamingCall<TRequest, TResponse>,
    method: MethodInfo,
    input: TRequest,
    options: RpcOptions,
  ): ServerStreamingCall<TRequest, TResponse>;
};

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

const toSerializableError = (error: RpcError) => ({
  name: error.name,
  code: error.code,
  message: error.message,
  stack: error.stack,
});

export const protobufTsInterceptor: ProtobufTsInterceptor = {
  interceptUnary(next, method, input, options) {
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

  interceptServerStreaming(next, method, input, options) {
    const id = Math.random().toString(36).slice(2, 6);
    const call = next(method, input, options);

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
        responseMessage: message,
      });
    });

    call.responses.onComplete(() => {
      postMessageToContentScript({
        id,
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
