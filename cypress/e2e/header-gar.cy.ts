beforeEach(() => {
  cy.visit("/");
});

it("should be able to download and upload a gar file", () => {
  cy.root().find('[data-download="true"]');
  cy.root().find('[data-upload="true"]');
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
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2");

  const now = new Date("2000-01-02T03:04:05.006Z");
  cy.clock(now);
  const fileName = `${now.toISOString().replace(/[^\d]/g, "").slice(0, -5)}.gar`;
  cy.root().find("[data-download]").click();
  cy.verifyDownload(fileName);
  cy.clock().then((clock) => {
    clock.restore();
  });

  cy.sendGrpcRequest({
    id: "3",
    methodName: "sendMessage 3",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.contains("sendMessage 3");

  cy.root().find("[data-upload]").click();
  cy.readFile("cypress/downloads/" + fileName, "binary")
    .then(Cypress.Blob.binaryStringToBlob)
    .then((fileContent) => {
      cy.root().find("input[data-upload]").attachFile({
        fileName,
        fileContent,
      });
    });

  cy.contains("sendMessage 3").should("not.exist");
  cy.contains("sendMessage 1");
  cy.contains("sendMessage 2");
});
