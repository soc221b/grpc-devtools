beforeEach(() => {
  cy.visit("/");
  cy.root().find("[data-setup-close]").click();
});

it("should display the initial filter bar", () => {
  cy.root().find('[data-should-show-filter="true"]');
  cy.root().find("[data-filter]");
});

it("should hide the filter bar when toggled", () => {
  cy.get("[data-should-show-filter]").click();

  cy.root().find('[data-should-show-filter="false"]');
  cy.root().find("[data-filter]").should("not.exist");
});

it("should show the filter bar when toggled again", () => {
  cy.get("[data-should-show-filter]").click();
  cy.get("[data-should-show-filter]").click();

  cy.root().find('[data-should-show-filter="true"]');
  cy.root().find("[data-filter]");
});
