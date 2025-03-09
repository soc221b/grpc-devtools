beforeEach(() => {
  cy.visit("/");
});

it("should clear all requests", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.contains("sendMessage 1");
  cy.sendGrpcRequest({
    id: "2",
    methodName: "sendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.contains("sendMessage 2");

  cy.get("[data-clear-all").click();
  cy.contains("sendMessage 1").should("not.exist");
  cy.contains("sendMessage 2").should("not.exist");

  cy.sendGrpcRequest({
    id: "2",
    methodName: "sendMessage 2-1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "3",
    methodName: "sendMessage 3",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 1").should("not.exist");
  cy.contains("sendMessage 2").should("not.exist");
  cy.contains("sendMessage 2-1");
  cy.contains("sendMessage 3");
});

it("should clear request rows with hotkey", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.contains("sendMessage 1");

  cy.root().trigger("keydown", { metaKey: true, key: "k" });

  cy.contains("sendMessage 1").should("not.exist");
});
