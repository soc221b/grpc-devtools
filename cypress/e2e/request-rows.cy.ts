beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
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
  cy.sendGrpcRequest({
    id: "3",
    methodName: "sendMessage 3",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "4",
    methodName: "sendMessage 4",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
  cy.sendGrpcRequest({
    id: "5",
    methodName: "sendMessage 5",
    serviceName: "chat.ChatService",
    requestMessage: {},
    timestamp: Date.now(),
  });
});

it("should open detail when pointerdown", () => {
  openAndAssert3();
});
function openAndAssert3() {
  cy.contains("sendMessage 3").click();

  cy.root().find("[data-detail-request-id='3']");
  cy.root().find("[data-request-rows]").should("have.focus");
}

it("should close detail when click", () => {
  openAndAssert3();

  cy.root().find("[data-detail-tab-close]").click();

  cy.root().find("[data-detail-request-id='3']").should("not.exist");
  cy.root().find("[data-request-rows]").should("have.focus");
});

it("should close detail when keydown Escape", () => {
  focusAndAssert3();
});
function focusAndAssert3() {
  openAndAssert3();

  cy.root().find("[data-request-rows]").trigger("keydown", { key: "Escape" });

  cy.root().find("[data-detail-request-id='3']").should("not.exist");
  cy.root().find("[data-request-rows]").should("have.focus");
}

it("should open detail when keydown Enter", () => {
  focusAndAssert3();

  cy.root().find("[data-request-rows]").trigger("keydown", { key: "Enter" });

  cy.root().find("[data-detail-request-id='3']");
  cy.root().find("[data-request-rows]").should("have.focus");
});

describe("it should open detail when keydown", () => {
  beforeEach(() => {
    openAndAssert3();
  });

  it("Meta+ArrowUp", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { metaKey: true, key: "ArrowUp" });

    cy.root().find("[data-detail-request-id='1']");
  });

  it("ArrowUp", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { key: "ArrowUp" });

    cy.root().find("[data-detail-request-id='2']");
  });

  it("ArrowDown", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { key: "ArrowDown" });

    cy.root().find("[data-detail-request-id='4']");
  });

  it("Meta+ArrowDown", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { metaKey: true, key: "ArrowDown" });

    cy.root().find("[data-detail-request-id='5']");
  });
});

describe("it should not open detail when keydown", () => {
  beforeEach(() => {
    focusAndAssert3();
  });

  it("Meta+ArrowUp", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { metaKey: true, key: "ArrowUp" });

    cy.root().find("[data-detail-request-id='3']").should("not.exist");
    cy.root().find("[data-detail-request-id='1']").should("not.exist");
  });

  it("ArrowUp", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { key: "ArrowUp" });

    cy.root().find("[data-detail-request-id='3']").should("not.exist");
    cy.root().find("[data-detail-request-id='2']").should("not.exist");
  });

  it("ArrowDown", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { key: "ArrowDown" });

    cy.root().find("[data-detail-request-id='3']").should("not.exist");
    cy.root().find("[data-detail-request-id='4']").should("not.exist");
  });

  it("Meta+ArrowDown", () => {
    cy.root().find("[data-request-rows]").trigger("keydown", { metaKey: true, key: "ArrowDown" });

    cy.root().find("[data-detail-request-id='3']").should("not.exist");
    cy.root().find("[data-detail-request-id='5']").should("not.exist");
  });
});
