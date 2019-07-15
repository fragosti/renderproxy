export enum PrerenderSetting {
  None = 'none',
  BotOnly = 'botOnly',
  All = 'all',
}

export interface ProxySettings {
  proxyToUrl: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
}
