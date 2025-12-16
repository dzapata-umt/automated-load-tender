import type { CypressEnv } from './env/types';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable;
      clearSearchFilter(): Chainable;
      isComponentPresent(selector: string): Chainable;
      unlockLoad(): Chainable;
      saveAndClose(): Chainable;
      viewTrip(): Chainable;
      openSearchModule(): Chainable;
      closeTab(index: number): Chainable;
      env(variable: keyof CypressEnv): Chainable;
      setFilter(
        index: number,
        dropdown: string,
        filter: string,
        search: boolean
      ): Chainable;
    }
  }
}

export {};
