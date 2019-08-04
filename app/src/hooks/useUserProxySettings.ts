import { useEffect, useState } from 'react';

import { ProxySettings } from '../types';
import { useAuth0 } from '../util/Auth0';

export const useUserProxySettings = (): ProxySettings[] | undefined => {
  const { api } = useAuth0();
  const [userProxySettings, setUserProxySettings] = useState<ProxySettings[] | undefined>();

  useEffect(() => {
    const getUserProxySettings = async () => {
      const settings = await api.getUserProxySettingsAsync();
      setUserProxySettings(settings);
    };
    getUserProxySettings();
  }, [api]);

  return userProxySettings;
};
