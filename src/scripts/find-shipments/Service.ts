import 'dotenv/config';

import path from 'path';
import fs from 'fs';

import { DitatService } from './../../services/DitatService';
import { TripSearchResponse } from '../../types/TripSearchResponse';

export class FindShipmentsService {
  private service: DitatService = new DitatService({
    accountId: process.env.ACCOUNT_ID || '',
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
  });

  async login(): Promise<void> {
    await this.service.login();
  }

  async logout(): Promise<void> {
    await this.service.logout();
  }

  private async findLoadsByPickupNumber(): Promise<TripSearchResponse> {
    const pickupNumber = process.env.SHIPPER_REFERENCE;
    const endpoint = '/api/tms/search/trips-shipments';

    if (!pickupNumber) throw new Error('Pickup number not found.');

    const response = await fetch(`${this.service.utils.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...this.service.utils.headers,
      },
      body: JSON.stringify({
        FilterItems: [
          {
            columnName: 'referenceId3',
            filterType: 5,
            filterFromValue: pickupNumber,
          },
        ],
      }),
    });

    const loadsByPickupNumber = await response.json();

    return loadsByPickupNumber;
  }

  private async filterPendingShipments(): Promise<void> {
    const { data } = await this.findLoadsByPickupNumber();
    const workdir = path.join(
      __dirname,
      '../../../fixtures/eligible_shipments.json'
    );
    const eligibleLoads = data
      .filter((load) => !load.tripId)
      .map((s) => ({
        shipmentId: s.shipmentId,
        customerReference: s.referenceId1,
      }));

    fs.writeFileSync(workdir, JSON.stringify(eligibleLoads, null, 2));
  }

  async start() {
    await this.filterPendingShipments();
  }
}
