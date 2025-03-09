import * as jspb from 'google-protobuf'



export class SendMessageRequest extends jspb.Message {
  getId(): string;
  setId(value: string): SendMessageRequest;

  getMessage(): string;
  setMessage(value: string): SendMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendMessageRequest): SendMessageRequest.AsObject;
  static serializeBinaryToWriter(message: SendMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMessageRequest;
  static deserializeBinaryFromReader(message: SendMessageRequest, reader: jspb.BinaryReader): SendMessageRequest;
}

export namespace SendMessageRequest {
  export type AsObject = {
    id: string,
    message: string,
  }
}

export class SendMessageResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendMessageResponse): SendMessageResponse.AsObject;
  static serializeBinaryToWriter(message: SendMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMessageResponse;
  static deserializeBinaryFromReader(message: SendMessageResponse, reader: jspb.BinaryReader): SendMessageResponse;
}

export namespace SendMessageResponse {
  export type AsObject = {
  }
}

export class OnMessageRequest extends jspb.Message {
  getId(): string;
  setId(value: string): OnMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OnMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OnMessageRequest): OnMessageRequest.AsObject;
  static serializeBinaryToWriter(message: OnMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OnMessageRequest;
  static deserializeBinaryFromReader(message: OnMessageRequest, reader: jspb.BinaryReader): OnMessageRequest;
}

export namespace OnMessageRequest {
  export type AsObject = {
    id: string,
  }
}

export class OnMessageResponse extends jspb.Message {
  getId(): string;
  setId(value: string): OnMessageResponse;

  getMessage(): string;
  setMessage(value: string): OnMessageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OnMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OnMessageResponse): OnMessageResponse.AsObject;
  static serializeBinaryToWriter(message: OnMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OnMessageResponse;
  static deserializeBinaryFromReader(message: OnMessageResponse, reader: jspb.BinaryReader): OnMessageResponse;
}

export namespace OnMessageResponse {
  export type AsObject = {
    id: string,
    message: string,
  }
}

