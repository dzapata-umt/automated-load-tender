import eligibleShipments from '../../../fixtures/eligible_shipments.json';
import { Selectors } from '../../common/selectors';
import { cypressEnv } from '../../helpers/cypressEnv';

const config = {
  shipperReference: cypressEnv('shipperReference'),
  totalRate: cypressEnv('totalRate'),
  carrier: cypressEnv('carrier'),
};

describe('Trip Assignment Process', () => {
  const endpointBase = 'https://tmsapi01.ditat.net';

  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  eligibleShipments.forEach((s) => {
    it(`Assigning shipment ${s.shipmentId}`, () => {
      cy.openSearchModule();

      // <-- Find Single Shipment -->
      cy.intercept({
        method: 'POST',
        url: `${endpointBase}/api/tms/search/trips-shipments`,
      }).as('searchExecution');

      cy.clearSearchFilter();
      cy.clearSearchFilter();
      cy.setFilter(0, 'Shipment Id', s.shipmentId, true);

      cy.wait('@searchExecution');

      cy.contains(s.shipmentId).dblclick();
      cy.unlockLoad();
      cy.get(Selectors.CARD_BODY)
        .eq(3)
        .find('input')
        .eq(0)
        .then(($input) => {
          const customerRef = $input.val() as string;
          s.customerReference = customerRef;
        });

      // <-- Find Single Shipment -->
      cy.viewTrip();
      cy.get(Selectors.CARRIER_INPUT)
        .type(config.carrier)
        .press(Cypress.Keyboard.Keys.TAB);
      cy.get('button').contains('Finish').click();
      cy.get('button').contains('Add Pay').click();
      cy.wait(500);
      cy.get('dx-data-grid')
        .eq(1)
        .find('input')
        .eq(0)
        .type('FLAT')
        .press(Cypress.Keyboard.Keys.TAB);
      cy.get('input[inputmode="decimal"]').eq(2).type(config.totalRate);
      cy.wait(200);
      cy.get('input[inputmode="decimal"]').press(Cypress.Keyboard.Keys.TAB);

      cy.get('ditat-ext-data-entry-toolbar button').eq(1).click();

      cy.intercept({
        url: `${endpointBase}/api/tms/common/lock*`,
        method: 'DELETE',
      }).as('saveAndClose');

      cy.saveAndClose();

      cy.wait('@saveAndClose');
      cy.closeTab(1);

      cy.closeTab(0);
    });
  });
});
