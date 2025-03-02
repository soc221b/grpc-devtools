const PROTO_PATH = __dirname + "/../protos/chat.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chat_proto = grpc.loadPackageDefinition(packageDefinition).chat;

/**
 * @type {Record<string, grpc.ServerWritableStream<any, any>>}
 */
const enteredUsers = {};
/**
 * @type {Record<string, grpc.ServerWritableStream<any, any>>}
 */
const leavedUsers = {};

/**
 * @param {grpc.ServerUnaryCall<any, any>} call
 * @param {grpc.sendUnaryData<any>} callback
 */
function sendMessage(call, callback) {
  const request = call.request;

  if (leavedUsers[call.request.id]) {
    callback({
      code: grpc.status.ALREADY_EXISTS,
    });
  } else if (request.message.includes("leave")) {
    Object.values(enteredUsers).forEach((user) => {
      user.write({ id: "SYSTEM", message: `user ${call.request.id} leaved.` });
    });
    enteredUsers[call.request.id].end();
    delete enteredUsers[call.request.id];
    leavedUsers[call.request.id] = 1;

    const metadata = new grpc.Metadata();
    metadata.add("response-metadata-example-1", 1);
    metadata.add("response-metadata-example-2", 2);
    callback(null, null, metadata);
  } else {
    Object.values(enteredUsers).forEach((user) => {
      user.write(call.request);
    });

    const metadata = new grpc.Metadata();
    metadata.add("response-metadata-example-1", 1);
    metadata.add("response-metadata-example-2", 2);
    callback(null, null, metadata);
  }
}

/**
 * @param {grpc.ServerWritableStream<any, any>} call
 */
function onMessage(call) {
  enteredUsers[call.request.id] = call;

  Object.values(enteredUsers).forEach((user) => {
    user.write({ id: "SYSTEM", message: `user ${call.request.id} entered.` });
  });
}

/**
 * Starts an RPC server that receives requests for the Chat service at the
 * sample server port
 */
function main() {
  const host = "0.0.0.0";
  const port = 9090;
  const server = new grpc.Server();
  server.addService(chat_proto.ChatService.service, { sendMessage, onMessage });
  server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`Server running at ${host}:${port}`);
  });
}

main();
