export type PrerenderSetting = 'none' | 'all' | 'bot';

export interface ProxySettings {
  domain: string;
  urlToProxy: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
  cacheExpirySeconds: number;
  userId: string;
  subscriptionId?: string;
}

export interface AuthorizedUser {
  sub: string;
}

export interface DatabaseUser {
  domains: string[];
  customerId?: string;
  hasBillingInfo?: boolean;
}

export interface ObjectMap<T> {
  [key: string]: T | undefined;
}
