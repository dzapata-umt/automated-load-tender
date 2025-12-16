import { Selectors } from '../../../common/selectors';

export {};
Cypress.Commands.add('openSearchModule', () => {
  cy.get(Selectors.SEARCH_BUTTON).click();
});
