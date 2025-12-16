import type { CypressEnv } from './../support/commands/env/types.d';

export const cypressEnv = (variable: keyof CypressEnv) => {
  return Cypress.env(variable);
};
