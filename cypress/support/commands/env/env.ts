import type { CypressEnv } from './types';

Cypress.Commands.add('env', (variable: keyof CypressEnv) => {
  Cypress.env(variable);
});
