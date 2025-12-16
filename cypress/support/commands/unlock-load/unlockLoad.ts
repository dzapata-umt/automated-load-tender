export {};
const SELECTOR = '.btn-outline-light';
Cypress.Commands.add('unlockLoad', () => {
  cy.wait(800);
  cy.isComponentPresent(SELECTOR).then(($isPresent) => {
    if ($isPresent) {
      cy.get(SELECTOR).click();
    }
  });
});
