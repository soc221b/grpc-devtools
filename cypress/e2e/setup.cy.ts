beforeEach(() => {
  cy.clearLocalStorage();
});

it("should open the setup dialog", () => {
  cy.visit("/");
  cy.root().find("[data-setup-show-this-again]").click();
  cy.root().find("[data-setup-close]").click();
  cy.reload();
  cy.root().find('[data-setup-state="false"]');

  cy.root().find("[data-setup-open]").click();

  cy.root().find('[data-setup-state="true"]');
});

it("should close the setup dialog", () => {
  cy.visit("/");
  cy.root().find('[data-setup-state="true"]');

  cy.root().find("[data-setup-close]").click();

  cy.root().find('[data-setup-state="false"]');
});

it("should display the setup dialog on initial load", () => {
  cy.visit("/");

  cy.root().find('[data-setup-state="true"]');
});

it("should display the setup dialog again after reload", () => {
  cy.visit("/");

  cy.root().find("[data-setup-close]").click();
  cy.root().find('[data-setup-state="false"]');
  cy.reload();

  cy.root().find('[data-setup-state="true"]');
});

it("should not display the setup dialog again after toggling", () => {
  cy.visit("/");

  cy.root().find("[data-setup-show-this-again]").click();
  cy.root().find("[data-setup-close]").click();
  cy.root().find('[data-setup-state="false"]');
  cy.reload();

  cy.root().find('[data-setup-state="false"]');
});

it("should display the setup dialog again after toggling twice", () => {
  cy.visit("/");

  cy.root().find("[data-setup-show-this-again]").click();
  cy.root().find("[data-setup-show-this-again]").click();
  cy.root().find("[data-setup-close]").click();
  cy.root().find('[data-setup-state="false"]');
  cy.reload();

  cy.root().find('[data-setup-state="true"]');
});
