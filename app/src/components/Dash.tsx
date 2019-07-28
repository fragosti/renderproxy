import React, { useEffect, useState } from 'react';
import { useAuth0 } from '../util/Auth0';

import { ProxySettings } from '../types';

export const Dash: React.StatelessComponent = () => {
  const { user, api } = useAuth0();
  const [proxySettings, setProxySettings] = useState<ProxySettings[]>([]);

  useEffect(() => {
    const getUserProxySettings = async () => {
      const userProxySettings = await api.getUserProxySettingsAsync();
      setProxySettings(userProxySettings);
    };
    getUserProxySettings();
  }, []);
  return (
    <>
      <img src={user.picture} alt="Profile" />
      <button
        onClick={() =>
          api.addNewProxySettingsAsync({
            domain: 'sample-s3-spa.com',
            urlToProxy: 'https://medium.com/the-mission',
            shouldRedirectIfPossible: false,
            prerenderSetting: 'none',
          })
        }
      >
        Ping API
      </button>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
      <p>{JSON.stringify(proxySettings)}</p>
    </>
  );
};
