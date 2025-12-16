export {};
Cypress.Commands.add(
  'setFilter',
  (index: number, dropdown: string, filter: string, search: boolean) => {
    cy.get('select').eq(index).select(dropdown, { force: true });
    cy.get('input').eq(index).type('{selectall}');
    cy.get('input').eq(index).type(filter);
    if (search) {
      cy.get('input').eq(index).focus().press(Cypress.Keyboard.Keys.ENTER);
    }
  }
);
