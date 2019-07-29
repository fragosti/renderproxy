import { useEffect, useState } from 'react';

import { ProxySettings } from '../types';
import { useAuth0 } from '../util/Auth0';

export const useProxySettingsForDomain = (domain: string): ProxySettings | undefined => {
  const { api } = useAuth0();
  const [proxySettings, setProxySettings] = useState<ProxySettings>();
  useEffect(() => {
    const getProxySettings = async () => {
      const settings = await api.getProxySettingsForDomainAsync(domain);
      setProxySettings(settings);
    };
    getProxySettings();
  }, [api, domain]);
  return proxySettings;
};
