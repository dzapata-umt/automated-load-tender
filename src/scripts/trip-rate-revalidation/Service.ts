/* eslint-disable @typescript-eslint/no-explicit-any */
import { tripFormatter } from '../../helpers/tripFormatter';

import fs from 'fs';
import path from 'path';
import eligibleShipments from '../../../fixtures/eligible_shipments.json';

import type { FilteredShipments } from './types';

import { TripSearchResponse } from '../../types/TripSearchResponse';
import { DitatService } from '../../services/DitatService';

export class LoadTenderingService {
  private shipments: FilteredShipments[] = [];
  private path = '/api/tms/search/trips-shipments';

  private service: DitatService;
  constructor(service: DitatService) {
    this.service = service;
  }

  get getShipments() {
    return this.shipments;
  }

  private async fetchTrip(id: string): Promise<TripSearchResponse> {
    const res = await fetch(`${this.service.utils.baseUrl}${this.path}`, {
      method: 'POST',
      headers: {
        ...this.service.utils.headers,
      },
      body: JSON.stringify({
        FilterItems: [
          {
            columnName: 'tripId',
            filterType: 1,
            filterFromValue: id,
          },
        ],
      }),
    });

    const response = (await res.json()) as TripSearchResponse;

    return response;
  }

  async login() {
    await this.service.login();
  }

  async logout() {
    await this.service.logout();
  }

  async checkTripRates(rate: number): Promise<void> {
    const wrongLoads: { shipmentId: string }[] = [];
    const workdir = path.join(
      __dirname,
      '../../../fixtures/wrong_rate_trips.json'
    );

    for (const load of eligibleShipments) {
      const ditatLoad = await this.fetchTrip(
        tripFormatter((load as any).shipmentId)
      );
      const [tripInfo] = ditatLoad.data;

      console.log(tripInfo?.totalPayAmount, rate);

      if (tripInfo?.totalPayAmount !== rate) {
        wrongLoads.push(load);
      }
    }

    fs.writeFileSync(workdir, JSON.stringify(wrongLoads, null, 2));
  }
}
