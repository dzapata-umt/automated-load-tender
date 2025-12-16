export {};
Cypress.Commands.add('saveAndClose', () => {
  cy.get('button').contains('Save &').click();
});
