export type PrerenderSetting = 'none' | 'all' | 'bot';

export interface ProxySettings {
  proxyToUrl: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
}
