/* eslint-disable no-console */
import 'dotenv/config';
import affectedLoads from '../../../fixtures/affected_loads.json';

(async () => {
  const URL =
    'https://umt-orchestrator.server.umtbots.cloud/webhook/send-report-email';
  const token = process.env.N8N_TOKEN!;

  try {
    const request = await fetch(URL, {
      method: 'POST',
      headers: {
        'x-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(affectedLoads),
    });

    if (!request.ok)
      throw new Error('Failed to send Email', { cause: request.status });

    const res = await request.json();
    console.log(res);
  } catch (error) {
    const err = error as Error;
    console.log(err);
  }
})();
