import ChatService from "./chat-service";
import "./index.css";
import { mountForm, mountMessages, unmountMessages } from "./render";

const chatApi = new ChatService();

const messages: string[] = [];
chatApi.onMessage((message) => {
  messages.push(message);

  unmountMessages();
  mountMessages({ messages });
});

mountForm({ onSubmit: (message) => chatApi.sendMessage(message) });
