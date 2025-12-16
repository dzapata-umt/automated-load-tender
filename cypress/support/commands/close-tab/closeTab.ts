export {};
Cypress.Commands.add('closeTab', (index: number) => {
  cy.get('.btn-close.btn-close-white').eq(index).click();
});
