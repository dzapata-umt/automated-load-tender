import { cypressEnv } from '../../../helpers/cypressEnv';

export {};
const endpointBase = 'https://tmsapi01.ditat.net';

Cypress.Commands.add('login', () => {
  cy.intercept({
    method: 'POST',
    url: `${endpointBase}/api/tms/auth/login`,
  }).as('login');
  cy.get('#txtAccountId').type(cypressEnv('ditatAccount'));
  cy.get('#username').type(cypressEnv('ditatUsername'));
  cy.get('#txtPassword')
    .type(cypressEnv('ditatPassword'))
    .press(Cypress.Keyboard.Keys.TAB);
  cy.get('button').click();
  cy.wait('@login');
});
