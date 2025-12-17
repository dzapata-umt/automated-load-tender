/* eslint-disable no-console */
export interface DitatClientOptions {
  baseUrl?: string;
  accountId: string;
  username: string;
  password: string;
}

export class DitatService {
  private baseUrl = 'https://api01.ditat.net';
  private applicationRole = 'Login to TMS';
  private accountId: string;
  private username: string;
  private password: string;
  private token: string | null = '';

  constructor(options: DitatClientOptions) {
    this.accountId = options.accountId;
    this.username = options.username;
    this.password = options.password;
  }

  get utils() {
    return {
      headers: {
        Authorization: `Ditat-Token ${this.token}`,
        'Content-Type': 'application/json',
      },
      baseUrl: this.baseUrl,
    };
  }

  async login() {
    const loginEndpoint = `${this.baseUrl}/api/tms/auth/login`;

    const basicAuth = Buffer.from(
      `${this.username}:${this.password}`,
      'utf-8'
    ).toString('base64');

    const res = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        'Ditat-Application-Role': this.applicationRole,
        'Ditat-Account-Id': this.accountId,
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Login failed ${res.status}, ${res.statusText}`);
    }

    const token = await res.text();
    this.token = token.trim();

    console.log('1 > Login OK');
  }

  async logout() {
    if (!this.token) return;

    const url = `${this.baseUrl}/api/tms/auth/login`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Ditat-token ${this.token}`,
      },
    }).then(() => {
      this.token = null;
      console.log('Logged out > Bye');
    });
  }
}
