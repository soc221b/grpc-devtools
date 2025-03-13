forwardMessage();

function forwardMessage() {
  let messageQueue = [];
  let isSending = false;
  let isPending = false;

  chrome.runtime.onMessage.addListener((message) => {
    if (message === null) return;
    if (typeof message !== "object") return;
    if (message.source !== "__gRPC_devtools__panel__") return;
    if (message.payload !== "shown") return;

    tryToSendMessages();
  });

  window.addEventListener("message", (event) => {
    if (!event.data) return;
    if (event.data.source !== "__gRPC_devtools__") return;

    const message = {
      source: "__gRPC_devtools__content_script__",
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
        if (response.source !== "__gRPC_devtools_background__") break;
        if (response.payload !== "forwarded") break;

        ++i;
      } catch (e) {
        break;
      }
    }
    messageQueue = messageQueue.slice(i);
  }
}
