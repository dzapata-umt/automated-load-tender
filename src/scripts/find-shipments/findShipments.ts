import 'dotenv/config';

import { FindShipmentsService } from './Service';

(async () => {
  const service = new FindShipmentsService();

  await service.login();
  await service.start();
  await service.logout();
})();

/* 
affected_loads.json
eligible_shipments.json
wrong_rate_trips.json
*/
