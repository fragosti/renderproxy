import { useEffect, useState } from 'react';

import { ProxySettings } from '../types';
import { useAuth0 } from '../util/Auth0';

export const useUserProxySettings = (): [ProxySettings[] | undefined, boolean] => {
  const { api } = useAuth0();
  const [userProxySettings, setUserProxySettings] = useState<ProxySettings[] | undefined>();
  const [didError, setDidError] = useState(false);
  useEffect(() => {
    const getUserProxySettings = async () => {
      try {
        const settings = await api.getUserProxySettingsAsync();
        setUserProxySettings(settings);
      } catch (err) {
        console.error(err);
        setDidError(true);
      }
    };
    getUserProxySettings();
  }, [api]);

  return [userProxySettings, didError];
};
