export type PrerenderSetting = 'none' | 'all' | 'bot';

export interface ProxySettings {
  urlToProxy: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
  userId: string;
}

export interface AuthorizedUser {
  sub: string;
}