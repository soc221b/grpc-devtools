beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should keep detail open when the request row is still visible", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "2",
    methodName: "sendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 1").click();
  cy.get("[data-filter-input]").type("1");

  cy.root().find("[data-detail-request-id='1']");
});

it("should close detail when the request row is filtered out", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "2",
    methodName: "sendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 1").click();
  cy.get("[data-filter-input]").type("2");

  cy.root().find("[data-detail-request-id='1']").should("not.exist");
});
