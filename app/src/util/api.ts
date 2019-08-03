import { API_ENDPOINT } from '../constants';
import { ProxySettings } from '../types';

export const APIPaths = {
  proxySettings: 'proxy_settings',
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
    return resp.json();
  }

  public async getProxySettingsForDomainAsync(domain: string): Promise<ProxySettings> {
    const resp = await this._fetchAsync(`${APIPaths.proxySettings}/${domain}`, 'GET');
    return resp.json();
  }

  private async _fetchAsync(path: string, method: 'POST' | 'GET', body?: any): Promise<Response> {
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
