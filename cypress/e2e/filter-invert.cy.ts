beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should display the initial filter invert state", () => {
  cy.root().find('[data-filter-invert="false"]');
});

it("should filter by text when invert is toggled", () => {
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

  cy.root().find('[data-filter-invert="false"]').click();

  cy.root().find('[data-filter-invert="true"]');
  cy.contains("sendMessage 1").should("not.exist");
  cy.contains("sendMessage 2");
});

it("should filter by regex when invert is toggled", () => {
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
  cy.get("[data-filter-input]").type("/[1]/");

  cy.root().find('[data-filter-invert="false"]').click();

  cy.root().find('[data-filter-invert="true"]');
  cy.contains("sendMessage 1").should("not.exist");
  cy.contains("sendMessage 2");
});

it("should restore the filter invert state", () => {
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

  cy.root().find('[data-filter-invert="false"]').click();
  cy.root().find('[data-filter-invert="true"]').click();

  cy.root().find('[data-filter-invert="false"]');
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2").should("not.exist");
});
