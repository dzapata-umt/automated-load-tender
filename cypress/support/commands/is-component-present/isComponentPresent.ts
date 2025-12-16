export {};
Cypress.Commands.add('isComponentPresent', (selector: string) =>
  cy.get('body').then(($body) => $body.find(selector).length > 0)
);
