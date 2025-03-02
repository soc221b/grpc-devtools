beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should display the initial recording state", () => {
  cy.root().find('[data-should-record="true"]');

  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 1");
});

it("should stop recording when toggled", () => {
  cy.get("[data-should-record]").click();
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 1").should("not.exist");
});

it("should restart recording when toggled again", () => {
  cy.get("[data-should-record]").click();
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 1").should("not.exist");

  cy.get("[data-should-record]").click();
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 2",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("sendMessage 2");
});

it("should toggle recording state with hotkey", () => {
  cy.root().find('[data-should-record="true"]');

  cy.root().trigger("keydown", { metaKey: true, key: "e" });

  cy.root().find('[data-should-record="false"]');
});
