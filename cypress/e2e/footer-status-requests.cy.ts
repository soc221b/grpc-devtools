beforeEach(() => {
  cy.visit("/");
});

it("should display the initial request count", () => {
  cy.root().find("[data-footer-status-requests]").should("contain.text", "0 requests");
});

it("should display all request count when no filter is applied", () => {
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

  cy.root().find("[data-footer-status-requests]").should("contain.text", "2 requests");
});

it("should update request count when a filter is applied", () => {
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

  cy.get("[data-filter-input]").type("1");

  cy.root().find("[data-footer-status-requests]").should("contain.text", "1 / 2 requests");
});
