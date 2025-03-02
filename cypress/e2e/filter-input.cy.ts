beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should show initial filter input", () => {
  cy.root().find("[data-filter-input]").should("have.value", "");
});

it("should filter by text", () => {
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

  cy.root().find("[data-filter-input]").should("have.value", "1");
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2").should("not.exist");
});

it("should filter by regex", () => {
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

  cy.get("[data-filter-input]").type("/1$/");

  cy.root().find("[data-filter-input]").should("have.value", "/1$/");
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2").should("not.exist");
});

it("should handle backspace in filter input", () => {
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
  cy.get("[data-filter-input]").type("{backspace}");

  cy.root().find("[data-filter-input]").should("have.value", "");
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2");
});

it("should clear filter input when click clear icon", () => {
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
  cy.get("[data-filter] [data-icon-clear]").click();

  cy.root().find("[data-filter-input]").should("have.value", "");
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2");
});
