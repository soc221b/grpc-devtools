import { interceptors } from "./grpc-devtools";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { ChatService as ChatDescService } from "./protos/chat_pb";

class ChatService {
  private id;
  private client;

  constructor() {
    this.id = Math.random().toString(36).slice(2, 6);
    const transport = createConnectTransport({
      baseUrl: "http://localhost:3003",
      interceptors,
      useBinaryFormat: true,
    });
    this.client = createClient(ChatDescService, transport);
  }

  sendMessage(message: string): void {
    this.client.sendMessage(
      { id: this.id, message: message },
      { headers: { "request-metadata-example-1": "1", "request-metadata-example-2": "2" } },
    );
  }

  onMessage(listener: (message: string) => void): void {
    (async () => {
      for await (const response of this.client.onMessage(
        { id: this.id },
        { headers: { "request-metadata-example-1": "1", "request-metadata-example-2": "2" } },
      )) {
        listener(`${response.id}: ${response.message}`);
      }
    })();
  }
}

export default ChatService;
