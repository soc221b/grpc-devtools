chrome.devtools.panels.create("gRPC", "", "dist/devtools/panels/grpc/index.html", (panel) => {
  panel.onShown.addListener(() => {
    chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
      source: "__gRPC_devtools__panel__",
      payload: "shown",
    });
  });
});
