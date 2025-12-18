export {};
const endpointBase = 'https://tmsapi01.ditat.net';
Cypress.Commands.add('saveAndClose', () => {
  cy.intercept({
    url: `${endpointBase}/api/tms/common/lock*`,
    method: 'DELETE',
  }).as('saveAndClose');
  cy.get('button').contains('Save &').click();
  cy.wait('@saveAndClose');
});
