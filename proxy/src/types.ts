export enum PrerenderSetting {
  None,
  BotOnly,
  All,
}

export interface ProxySettings {
  proxyToUrl: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
}
