import { Selectors } from '../../common/selectors';
import { cypressEnv } from '../../helpers/cypressEnv';
import { tripFormatter } from '../../helpers/tripFormatter';

interface ShipmentInfo {
  shipmentNumber: string;
  customerReference: string;
}

interface ProcessedLoads {
  pickupNumber: string;
  shipment: {
    id: string;
    trip: string;
    status: string;
  };
}

const config = {
  shipperReference: cypressEnv('shipperReference'),
  totalRate: cypressEnv('totalRate'),
};

const endpointBase = 'https://tmsapi01.ditat.net';

describe('Automate Load Tendering process', () => {
  const shipments: ShipmentInfo[] = [];
  const processedLoads: ProcessedLoads[] = [];

  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('Eligible shipment numbers detected', () => {
    cy.intercept({
      method: 'POST',
      url: `${endpointBase}/api/tms/search/trips-shipments`,
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
  });

  it(`All trips assigned`, () => {
    cy.openSearchModule();

    if (shipments.length) {
      shipments.forEach((s) => {
        // <-- Find Single Shipment -->
        cy.intercept({
          method: 'POST',
          url: `${endpointBase}/api/tms/search/trips-shipments`,
        }).as('searchExecution');

        cy.clearSearchFilter();
        cy.clearSearchFilter();
        cy.setFilter(0, 'Shipment Id', s.shipmentNumber, true);

        cy.wait('@searchExecution');

        cy.contains(s.shipmentNumber).dblclick();
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
          .type('Intermodal')
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

        // <-- Send Email -->
        cy.contains('Print').click();
        cy.contains('Confirmation sheet').click();
        cy.get('.toolbar').eq(2).find('button').contains('Email').click();
        cy.get('.modal-body input')
          .eq(1)
          .then(($subject) => {
            const subject = `${$subject.val() as string} ${s.customerReference}`;
            cy.wrap($subject).type('{selectall}');
            cy.wrap($subject).type(subject);
          });
        cy.get('.modal-body button').eq(0).click();
        cy.closeTab(2);
        cy.intercept({
          url: `${endpointBase}/api/tms/common/lock*`,
          method: 'DELETE',
        }).as('saveAndClose');

        cy.saveAndClose();

        cy.wait('@saveAndClose');
        cy.closeTab(1);
        processedLoads.push({
          pickupNumber: config.shipperReference,
          shipment: {
            id: s.shipmentNumber,
            trip: tripFormatter(s.shipmentNumber),
            status: 'Passed',
          },
        });
      });
    } else {
      cy.log('No eligible shipments found');
    }
    cy.closeTab(0);
    cy.writeFile('report.json', JSON.stringify(processedLoads, null, 2));
  });
});
