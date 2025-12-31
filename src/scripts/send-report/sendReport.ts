/* eslint-disable no-console */
import 'dotenv/config';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { DitatService } from '../../services/DitatService';

const affectedLoadsPath = path.resolve(
  __dirname,
  '../../../fixtures/affected_loads.json'
);

const loadAffectedLoads = async () => {
  const raw = await readFile(affectedLoadsPath, 'utf-8');
  return JSON.parse(raw);
};

const saveAffectedLoads = async (data: unknown) => {
  await writeFile(affectedLoadsPath, JSON.stringify(data, null, 2), 'utf-8');
};

(async () => {
  const engine = {
    getCarrierName: async () => {
      const ditat = new DitatService({
        accountId: process.env.ACCOUNT_ID || '',
        username: process.env.USERNAME || '',
        password: process.env.PASSWORD || '',
      });

      await ditat.login();

      const req = await fetch(
        `${ditat.utils.baseUrl}/api/tms/data/carrier?id=${process.env.CARRIER}`,
        {
          method: 'GET',
          headers: {
            ...ditat.utils.headers,
          },
        }
      );

      const carrier = await req.json();
      const carrierEmail =
        carrier.data.entityGraph.locPrimaryContact.emailAddress;

      const affectedLoads = await loadAffectedLoads();

      if (!carrierEmail) {
        affectedLoads.carrierEmail = 'brokerage@umtglobal.com';

        return;
      }

      affectedLoads.carrierEmail = carrierEmail;

      await saveAffectedLoads(affectedLoads);

      await ditat.logout();
    },

    sendReport: async () => {
      const affectedLoads = await loadAffectedLoads();

      const URL =
        'https://umt-orchestrator.server.umtbots.cloud/webhook-test/send-report-email';
      const token = process.env.N8N_TOKEN!;

      const request = await fetch(URL, {
        method: 'POST',
        headers: {
          'x-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(affectedLoads),
      });

      if (!request.ok) {
        throw new Error('Failed to send Email', {
          cause: request.status,
        });
      }

      console.log(await request.json());
    },
  };

  await engine.getCarrierName();
  await engine.sendReport();
})();
