export interface ShipmentRecord {
  isShipmentRecord: boolean;
  isTripRecord: boolean;

  tripKey: number | null;
  tripUpdatedOn: string | null;
  tripId: string;
  tripStatus: number | null;

  shipmentKey: number;
  shipmentUpdatedOn: string;
  shipmentId: string;
  billByCompanyId: string;
  shipmentStatus: number;
  shipmentPaymentStatus: number;
  shipmentPreassignedTrailerId: string;

  bookedByUserName: string;
  bookedForUserName: string;
  createdByUserName: string;

  carrierId: string;
  carrierCompany: string;

  primaryDriverId: string;
  primaryDriverName: string;
  secondaryDriverId: string;
  secondaryDriverName: string;

  truckId: string;
  primaryTrailerId: string;
  incomingTrailerId: string;
  outgoingTrailerId: string;
  secondaryTrailer1Id: string;
  secondaryTrailer2Id: string;

  dispatchedByUserName: string;

  customerId: string;
  customerCompany: string;
  billToCustomerId: string;
  billToCustomerCompany: string;

  referenceId1: string;
  referenceId2: string;
  referenceId3: string;
  referenceId4: string;
  referenceId5: string;

  uoZoneKey: number | null;
  uoDepartedOnLocal: string | null;
  uoLocationId: string;
  uoCompany: string;
  uoAddress1: string;
  uoMunicipality: string;
  uoAdministrativeArea: string;
  uoPostalCode: string;
  uoCountryId: string;

  fromZoneKey: number | null;
  fromArriveOnLocal: string | null;
  fromLateWhenAfterLocal: string | null;
  fromIsAppointmentRequired: boolean;
  fromIsAppointmentSet: boolean;
  fromArrivedOnLocal: string | null;
  fromDepartedOnLocal: string | null;
  fromLocationId: string;
  fromCompany: string;
  fromAddress1: string;
  fromMunicipality: string;
  fromAdministrativeArea: string;
  fromPostalCode: string;
  fromCountryId: string;

  toZoneKey: number | null;
  toArriveOnLocal: string | null;
  toLateWhenAfterLocal: string | null;
  toIsAppointmentRequired: boolean;
  toIsAppointmentSet: boolean;
  toArrivedOnLocal: string | null;
  toDepartedOnLocal: string | null;
  toLocationId: string;
  toCompany: string;
  toAddress1: string;
  toMunicipality: string;
  toAdministrativeArea: string;
  toPostalCode: string;
  toCountryId: string;

  emptyDrivingDistance: number;
  loadedDrivingDistance: number;

  totalPayAmount: number;
  totalRevenueAmount: number;
  totalAdjustedRevenueAmount: number;
  totalVolume: number;
  totalWeight: number;
  totalUnitsCount: number;
  totalPalletsCount: number;

  equipmentTypeId: string;

  vendor1Id: string;
  vendor2Id: string;
  vendor3Id: string;
  vendor4Id: string;
  vendor5Id: string;
  vendor6Id: string;
}
