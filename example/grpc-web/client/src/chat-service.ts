import { unaryInterceptors, streamInterceptors } from "./grpc-devtools";
import { ChatServiceClient } from "./protos/ChatServiceClientPb";
import { SendMessageRequest, OnMessageRequest } from "./protos/chat_pb";

class ChatService {
  private id;
  private chatService;
  private channel;

  constructor() {
    this.id = Math.random().toString(36).slice(2, 6);
    this.chatService = new ChatServiceClient("http://localhost:3003", null, {
      unaryInterceptors: unaryInterceptors,
      streamInterceptors: streamInterceptors,
    });

    const metadata = {
      "request-metadata-example-1": "1",
      "request-metadata-example-2": "2",
    };
    const req = new OnMessageRequest();
    req.setId(this.id);
    this.channel = this.chatService.onMessage(req, metadata);
  }

  sendMessage(message: string): void {
    const request = new SendMessageRequest();
    request.setId(this.id);
    request.setMessage(message);

    const metadata = {
      "request-metadata-example-1": "1",
      "request-metadata-example-2": "2",
    };
    if (Math.random() > 0.5) {
      console.log("[sendMessage] by promise-based request");
      this.chatService.sendMessage(request, metadata).catch(() => void 0);
    } else {
      console.log("[sendMessage] by callback-based request");
      this.chatService.sendMessage(request, metadata, () => void 0);
    }
  }

  onMessage(listener: (message: string) => void): void {
    this.channel.on("data", (response) => {
      listener(`${response.getId()}: ${response.getMessage()}`);
    });
  }
}

export default ChatService;
