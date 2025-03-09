beforeEach(() => {
  cy.visit("/");
});

it("should use virtual list for displaying request rows", () => {
  for (let i = 0; i < 100; ++i) {
    cy.sendGrpcRequest({
      id: i.toString(),
      methodName: `sendMessage ${i}`,
      serviceName: "chat.ChatService",
      requestMessage: {},
      timestamp: Date.now(),
    });
  }

  cy.root().find("[data-request-row-id='0']");
  cy.root().find("[data-request-row-id='99']").should("not.exist");

  cy.root().find("[data-request-rows]").scrollTo(0, 100_000);
  cy.root().find("[data-request-row-id='0']").should("not.exist");
  cy.root().find("[data-request-row-id='99']");
});
