beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should display the initial case sensitive filter state", () => {
  cy.root().find('[data-filter-case-sensitive="false"]');
});

it("should filter by text when case sensitive is toggled", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "2",
    methodName: "SendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.get("[data-filter-input]").type("send");

  cy.root().find('[data-filter-case-sensitive="false"]').click();

  cy.root().find('[data-filter-case-sensitive="true"]');
  cy.contains("sendMessage 1");
  cy.contains("SendMessage 2").should("not.exist");
});

it("should filter by regex when case sensitive is toggled", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "2",
    methodName: "SendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.get("[data-filter-input]").type("/^s/");

  cy.root().find('[data-filter-case-sensitive="false"]').click();

  cy.root().find('[data-filter-case-sensitive="true"]');
  cy.contains("sendMessage 1");
  cy.contains("SendMessage 2").should("not.exist");
});

it("should restore the case sensitive filter state", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "2",
    methodName: "SendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.get("[data-filter-input]").type("send");

  cy.root().find('[data-filter-case-sensitive="false"]').click();
  cy.root().find('[data-filter-case-sensitive="true"]').click();

  cy.root().find('[data-filter-case-sensitive="false"]');
  cy.contains("sendMessage 1");
  cy.contains("SendMessage 2");
});
