import eligibleShipments from '../../../fixtures/eligible_shipments.json';
import { cypressEnv } from '../../helpers/cypressEnv';
import path from 'path';
interface Loads {
  pickupNumber: string;
  loads: string[];
}

describe('Send Rate Confirmation', () => {
  const endpointBase = 'https://tmsapi01.ditat.net';
  const affectedLoads: Loads = {
    pickupNumber: cypressEnv('shipperReference'),
    loads: [],
  };
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  eligibleShipments.forEach((load) => {
    it(`Sending Rate Confirmation for ${load.shipmentId}`, () => {
      cy.openSearchModule();

      cy.intercept({
        method: 'POST',
        url: `${endpointBase}/api/tms/search/trips-shipments`,
      }).as('searchExecution');

      cy.clearSearchFilter();
      cy.clearSearchFilter();

      // Finds the load
      cy.setFilter(0, 'Shipment Id', load.shipmentId, true);
      cy.wait('@searchExecution');
      cy.contains(load.shipmentId).dblclick();
      cy.unlockLoad();

      // Opens trip side
      cy.viewTrip();
      cy.unlockLoad();
      cy.contains('Print').click();
      cy.contains('Confirmation sheet').click();
      cy.get('.toolbar').eq(2).find('button').contains('Email').click();
      cy.get('.modal-body input').then(($inputs) => {
        const totalInputs = $inputs.length;
        let inputIndex: number;

        if (totalInputs === 3) {
          inputIndex = 2;
        } else if (totalInputs === 2) {
          inputIndex = 1;
        }

        cy.get('.modal-body input')
          .eq(inputIndex)
          .then(($subject) => {
            const subject = `${$subject.val() as string} ${load.customerReference}`;
            cy.wrap($subject).type('{selectall}');
            cy.wrap($subject).type(subject);
          });
      });
      cy.intercept({
        url: `${endpointBase}/api/tms/mail/email*`,
        method: 'POST',
      }).as('emailRequest');

      cy.get('.modal-body button').eq(0).click(); // Sends email
      cy.wait('@emailRequest');
      cy.closeTab(2);

      cy.saveAndClose();

      cy.closeTab(1);
      cy.closeTab(0);
      if (!affectedLoads.loads.includes(load.shipmentId)) {
        affectedLoads.loads.push(load.shipmentId);
      }

      cy.writeFile(
        path.join(__dirname, '../../../fixtures/affected_loads.json'),
        JSON.stringify(affectedLoads, null, 2)
      );
    });
  });
});
