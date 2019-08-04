import * as R from 'ramda';

import { ProxySettings } from '../types';
import { ValidationError } from './validation';

export const noop = R.always(undefined);

export const noopAsync = R.always(Promise.resolve());

export const noopAsyncThrow = <T>(): Promise<T> => {
  throw new Error('Function not implemented');
};

const validationMessages = {
  domain: (domain: string): string => `The value '${domain}' is not a valid domain.`,
  urlToProxy: (url: string): string => `The value '${url}' is not a valid URL.`,
};

export const validatedOrCorrectedProxySettings = (settings: ProxySettings): ProxySettings => {
  const domain = correctedDomain(settings.domain);
  let urlToProxy: string | null = '';
  if (!R.isEmpty(settings.urlToProxy)) {
    urlToProxy = correctedURL(settings.urlToProxy);
  }
  if (R.isNil(urlToProxy) || R.isNil(domain)) {
    const domainError = !domain ? validationMessages.domain(settings.domain) : undefined;
    const urlError = !urlToProxy ? validationMessages.urlToProxy(settings.urlToProxy) : undefined;
    throw new ValidationError({ domain: domainError, urlToProxy: urlError });
  }
  return { ...settings, domain, urlToProxy };
};

export const correctedDomain = (domain: string): string | null => {
  const match = domain.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g);
  if (match) {
    return R.head(match);
  }
  return null;
};

export const correctedURL = (url: string): string | null => {
  const match = url.match(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/g);
  if (match) {
    return R.head(match);
  }
  const domain = correctedDomain(url);
  if (domain) {
    // Assume redirect or no HTTPS.
    return `http://${domain}/`;
  }
  return null;
};
