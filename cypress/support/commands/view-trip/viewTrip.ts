export {};
Cypress.Commands.add('viewTrip', () => {
  cy.get('button.toolbar-btn').contains('View').click();
});
