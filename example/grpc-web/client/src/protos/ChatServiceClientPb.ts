/**
 * @fileoverview gRPC-Web generated client stub for chat
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as chat_pb from './chat_pb';


export class ChatServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorsendMessage = new grpcWeb.MethodDescriptor(
    '/chat.ChatService/sendMessage',
    grpcWeb.MethodType.UNARY,
    chat_pb.SendMessageRequest,
    chat_pb.SendMessageResponse,
    (request: chat_pb.SendMessageRequest) => {
      return request.serializeBinary();
    },
    chat_pb.SendMessageResponse.deserializeBinary
  );

  sendMessage(
    request: chat_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<chat_pb.SendMessageResponse>;

  sendMessage(
    request: chat_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: chat_pb.SendMessageResponse) => void): grpcWeb.ClientReadableStream<chat_pb.SendMessageResponse>;

  sendMessage(
    request: chat_pb.SendMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: chat_pb.SendMessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/chat.ChatService/sendMessage',
        request,
        metadata || {},
        this.methodDescriptorsendMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/chat.ChatService/sendMessage',
    request,
    metadata || {},
    this.methodDescriptorsendMessage);
  }

  methodDescriptoronMessage = new grpcWeb.MethodDescriptor(
    '/chat.ChatService/onMessage',
    grpcWeb.MethodType.SERVER_STREAMING,
    chat_pb.OnMessageRequest,
    chat_pb.OnMessageResponse,
    (request: chat_pb.OnMessageRequest) => {
      return request.serializeBinary();
    },
    chat_pb.OnMessageResponse.deserializeBinary
  );

  onMessage(
    request: chat_pb.OnMessageRequest,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<chat_pb.OnMessageResponse> {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/chat.ChatService/onMessage',
      request,
      metadata || {},
      this.methodDescriptoronMessage);
  }

}

