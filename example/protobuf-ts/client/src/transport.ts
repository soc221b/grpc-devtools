import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { interceptors } from "./grpc-devtools";

export const transport = new GrpcWebFetchTransport({
  baseUrl: "http://localhost:3003",
  interceptors,
});
