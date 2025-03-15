let messageQueue: unknown[] = [];
let isSending = false;
let isPending = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message === null) return;
  if (typeof message !== "object") return;
  if (message.source !== "__gRPC_devtools_devtools__") return;
  if (message.payload !== "shown") return;

  tryToSendMessages();
});

window.addEventListener("message", (event) => {
  if (event.data === null) return;
  if (typeof event.data !== "object") return;
  if (event.data.source !== "__gRPC_devtools_content_scripts_main__") return;

  const message = {
    source: "__gRPC_devtools_content_scripts_isolated__",
    payload: event.data.payload,
  };
  messageQueue.push(message);
  tryToSendMessages();
});

async function tryToSendMessages() {
  if (isSending) {
    isPending = true;
    return;
  }

  isSending = true;
  await sendMessages();
  isSending = false;

  if (isPending) {
    isPending = false;
    tryToSendMessages();
  }
}
async function sendMessages() {
  let i = 0;
  while (i < messageQueue.length) {
    try {
      const response = await chrome.runtime.sendMessage(messageQueue[i]);

      if (response === null) break;
      if (typeof response !== "object") break;
      if (response.source !== "__gRPC_devtools_devtools_panels_grpc__") break;
      if (response.payload !== "ACK") break;

      ++i;
    } catch (e) {
      break;
    }
  }
  messageQueue = messageQueue.slice(i);
}
