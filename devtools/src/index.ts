chrome.devtools.panels.create("gRPC", "", "devtools/panels/grpc/index.html", (panel) => {
  panel.onShown.addListener(() => {
    chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
      source: "__gRPC_devtools_devtools__",
      payload: "shown",
    });
  });
});
