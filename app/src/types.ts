export type PrerenderSetting = 'none' | 'all' | 'bot';

export interface ProxySettings {
  domain: string;
  urlToProxy: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
}

export interface ObjectMap<T> {
  [key: string]: T | undefined;
}

export interface MessageStruct {
  variant: 'success' | 'error';
  message: string;
}

export type Message = MessageStruct | undefined;

export type MessageResetter = () => void;

export type LoadingStatus = boolean;
