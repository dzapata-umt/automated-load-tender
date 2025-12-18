import { cypressEnv } from '../../helpers/cypressEnv';

describe('first', () => {
  const endpointBase = 'https://tmsapi01.ditat.net';
  const load = 'SH-0000000431';
  //   const load = 'SH-0000000426';
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('Resetting Rate Confirmation', () => {
    cy.openSearchModule();
    cy.clearSearchFilter();
    cy.clearSearchFilter();

    cy.intercept({
      method: 'POST',
      url: `${endpointBase}/api/tms/search/trips-shipments`,
    }).as('searchExecution');

    cy.setFilter(0, 'Shipment Id', load, true);
    cy.wait('@searchExecution');

    cy.contains(load).dblclick();
    cy.unlockLoad();
    cy.viewTrip();
    cy.unlockLoad();

    cy.get('dx-data-grid').then(({ length }) => {
      const hasRate = () => length === 2;
      if (hasRate()) {
        const input = cy.get('dx-data-grid .dx-texteditor-input').eq(1);
        input.type('{selectall}').type(cypressEnv('totalRate'));
        input.press(Cypress.Keyboard.Keys.TAB);
        cy.saveAndClose();
      } else {
        cy.get('button').contains('Add Pay').click();
        cy.wait(500);
        cy.get('dx-data-grid')
          .eq(1)
          .find('input')
          .eq(0)
          .type('FLAT')
          .press(Cypress.Keyboard.Keys.TAB);
        cy.get('input[inputmode="decimal"]')
          .eq(2)
          .type(cypressEnv('totalRate'));
        cy.wait(200);
        cy.get('input[inputmode="decimal"]').press(Cypress.Keyboard.Keys.TAB);
        cy.saveAndClose();
      }
    });

    // cy.get('dx-data-grid')
    //   .eq(1)
    //   .then(() => {
    //     cy.isComponentPresent('img[title="Delete"]').then(($is) => {
    //       if ($is) cy.log('Can delete');
    //       else cy.log('Cannot delete');
    //     });
    //   });
  });
});
