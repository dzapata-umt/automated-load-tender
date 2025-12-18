export const tripFormatter = (shipment: string) => {
  const trip = `${shipment.replace('SH', 'TR')}-01`;

  return trip;
};
