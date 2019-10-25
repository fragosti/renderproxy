import { API_ENDPOINT } from '../constants';
import { GetCustomerResponse, PlanId, ProxySettings, UsageData } from '../types';

export const APIPaths = {
  proxySettings: 'proxy_settings',
  customer: 'customer',
  subscribe: 'subscribe',
  usage: 'usage',
};

export class API {
  private token: string;
  constructor(token: string) {
    this.token = token;
  }

  public async addNewProxySettingsAsync(proxySettings: ProxySettings): Promise<Response> {
    return this._fetchAsync(APIPaths.proxySettings, 'POST', proxySettings);
  }

  public async getUserProxySettingsAsync(): Promise<ProxySettings[]> {
    const resp = await this._fetchAsync(APIPaths.proxySettings, 'GET');
    if (!resp.ok) {
      throw new Error('Failed to fetch user proxy settings.');
    }
    return resp.json();
  }

  public async getProxySettingsForDomainAsync(domain: string): Promise<ProxySettings> {
    const resp = await this._fetchAsync(`${APIPaths.proxySettings}/${domain}`, 'GET');
    return resp.json();
  }

  public async deleteProxySettingsForDomainAsync(domain: string): Promise<ProxySettings> {
    const resp = await this._fetchAsync(`${APIPaths.proxySettings}/${domain}`, 'DELETE');
    return resp.json();
  }

  public async createCustomerAsync(cardToken: string): Promise<Response> {
    return this._fetchAsync(APIPaths.customer, 'POST', {
      cardToken,
    });
  }

  public async getCustomerAsync(): Promise<GetCustomerResponse> {
    const resp = await this._fetchAsync(APIPaths.customer, 'GET');
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`Fetching customer information for user failed.`);
  }

  public async deleteCustomerAsync(): Promise<void> {
    const resp = await this._fetchAsync(APIPaths.customer, 'DELETE');
    if (resp.ok) {
      return;
    }
    throw new Error('Failed to delete customer.');
  }

  public async subscribeUserAsync(planId: PlanId, domain: string): Promise<Response> {
    return this._fetchAsync(APIPaths.subscribe, 'POST', {
      planId,
      domain,
    });
  }

  public async getUsageAsync(domain: string): Promise<UsageData> {
    const resp = await this._fetchAsync(`${APIPaths.usage}/${domain}`, 'GET');
    if (resp.ok) {
      return resp.json();
    }
    throw new Error('Failed to get usage');
  }

  private async _fetchAsync(path: string, method: 'POST' | 'GET' | 'DELETE', body?: any): Promise<Response> {
    const resp = await fetch(`${API_ENDPOINT}/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return resp;
  }
}
