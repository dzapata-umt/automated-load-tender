import eligibleShipments from '../../../fixtures/eligible_shipments.json';

describe('Send Rate Confirmation', () => {
  const endpointBase = 'https://tmsapi01.ditat.net';
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

      cy.get('.modal-body button').eq(0).click(); // Sends email
      cy.closeTab(2);

      cy.saveAndClose();

      cy.closeTab(1);
      cy.closeTab(0);
    });
  });
});
