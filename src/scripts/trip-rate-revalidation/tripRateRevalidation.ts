import 'dotenv/config';

import { DitatService } from '../../services/DitatService';
import { LoadTenderingService } from './Service';

(async () => {
  const ditat = new DitatService({
    accountId: process.env.ACCOUNT_ID || '',
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
  });
  const service = new LoadTenderingService(ditat);

  await service.login();
  await service
    .checkTripRates(Number(process.env.TOTAL_RATE!))
    .then(async () => {
      await service.logout();
    });
})();
