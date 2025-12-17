export interface TripRecord {
  isShipmentRecord: boolean;
  isTripRecord: boolean;
  tripKey: number;
  tripUpdatedOn: string; // ISO Date string
  tripId: string;
  tripStatus: number;
  shipmentKey: number;
  shipmentUpdatedOn: string; // ISO Date string
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
  fromArriveOnLocal: string; // ISO Date string
  fromLateWhenAfterLocal: string; // ISO Date string
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
  toArriveOnLocal: string; // ISO Date string
  toLateWhenAfterLocal: string; // ISO Date string
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

export interface TripSearchResponse {
  data: TripRecord[];
  url: string;
  serverTime: string; // ISO Date string
  timeTook: string; // Time span string (e.g., "00:00:00.0312527")
  error: string | null;
}
