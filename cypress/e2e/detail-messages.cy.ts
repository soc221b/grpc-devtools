beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should close the message preview when pressing escape", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.contains("sendMessage 1").trigger("pointerdown");
  cy.root().find("[data-detail-request-id='1']");
  cy.root().find("[data-detail-tab='messages']").click();
  cy.root().find("[data-detail-messages] [data-index='0']").click();
  cy.root().find("[data-detail-messages-preview]");

  cy.root().trigger("keydown", { key: "Escape" });

  cy.root().find("[data-detail-messages-preview]").should("not.exist");
  cy.root().find("[data-detail-request-id='1']");
});

it("should clear all messages when click clear icon", () => {
  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.contains("sendMessage 1").trigger("pointerdown");
  cy.root().find("[data-detail-request-id='1']");
  cy.root().find("[data-detail-tab='messages']").click();
  cy.root().find("[data-detail-messages] [data-index='0']").should("exist");

  cy.root().find("[data-detail-messages-clear-all-messages]").click();

  cy.root().find("[data-detail-messages] [data-index='0']").should("not.exist");
});
