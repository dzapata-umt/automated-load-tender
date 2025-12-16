export {};
Cypress.Commands.add('clearSearchFilter', () => {
  cy.get('button').contains('Reset').click();
});
