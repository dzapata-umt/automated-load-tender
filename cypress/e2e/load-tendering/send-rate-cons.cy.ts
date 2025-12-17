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
      cy.contains('Print').click();
      cy.contains('Confirmation sheet').click();
      cy.get('.toolbar').eq(2).find('button').contains('Email').click();
      cy.get('.modal-body input')
        .eq(1)
        .then(($subject) => {
          const subject = `${$subject.val() as string} ${load.customerReference}`;
          cy.wrap($subject).type('{selectall}');
          cy.wrap($subject).type(subject);
        });

      cy.get('.modal-body button').eq(0).click(); // Sends email
      cy.closeTab(2);

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
