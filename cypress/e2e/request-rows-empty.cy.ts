import "cypress-network-idle";

beforeEach(() => {
  cy.visit("/");
});

it("should display 'Recording gRPC activity' when empty", () => {
  cy.contains("Recording gRPC activity");
});

it("should not display 'Recording gRPC activity' when non-empty", () => {
  cy.waitForNetworkIdle(1000);

  cy.sendGrpcRequest({
    id: "1",
    methodName: "sendMessage 1",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });

  cy.contains("Recording gRPC activity").should("not.exist");
});
