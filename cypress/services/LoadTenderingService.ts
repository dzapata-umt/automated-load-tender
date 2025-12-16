export class LoadTenderingService {
  private endpointBase: string;

  constructor(endpointBase: string) {
    this.endpointBase = endpointBase;
  }

  detectPendingLoads() {
    cy.intercept({
      method: 'POST',
      url: `${this.endpointBase}/api/tms/search/trips-shipments`,
    }).as('searchExecution');

    cy.openSearchModule();
    cy.wait(500);
    cy.clearSearchFilter();
    cy.setFilter(0, 'Shipper reference', config.shipperReference, false);
    cy.get('button').contains('Add').click();
    cy.get('select').eq(1).select('Shipment Status', { force: true });
    cy.get('select').eq(2).select('Pending');
    cy.get(Selectors.CARD_BODY).eq(0).find('button').contains('Search').click();

    cy.wait('@searchExecution');

    cy.isComponentPresent(Selectors.SHIPMENT_ID_LIST_CONTAINER).then(
      ($isPresent) => {
        if ($isPresent) {
          cy.get(Selectors.SHIPMENT_ID_LIST_CONTAINER).each(($shipment) => {
            const item: ShipmentInfo = {
              shipmentNumber: $shipment.text(),
              customerReference: '',
            };
            shipments.push(item);
          });
        }
      }
    );
  }
}
