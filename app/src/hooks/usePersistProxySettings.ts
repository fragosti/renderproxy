import { useState } from 'react';

import { LoadingStatus, Message, MessageResetter, ProxySettings } from '../types';
import { useAuth0 } from '../util/Auth0';

type ProxySettingsSetter = (settings: ProxySettings) => Promise<void>;
type SuccessHandler = (domain: string) => void;

const messages = {
  domainClaimed: (domain: string) => `The domain ${domain} already has already been claimed.`,
  upgradeRequired: `Your plan does not support that setting. Please upgrade or try a different setting.`,
  genericError: 'Something went wrong. Please try again later.',
  success: (domain: string) => `Successfully saved ${domain} settings.`,
};

export const usePersistProxySettings = (
  onSuccess?: SuccessHandler,
): [ProxySettingsSetter, LoadingStatus, Message, MessageResetter] => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | undefined>();
  const { api } = useAuth0();
  const persistProxySettings: ProxySettingsSetter = async (proxySettings: ProxySettings) => {
    try {
      setIsLoading(true);
      const resp = await api.addNewProxySettingsAsync(proxySettings);
      if (resp.ok) {
        setMessage({
          variant: 'success',
          message: messages.success(proxySettings.domain),
        });
        if (onSuccess) {
          onSuccess(proxySettings.domain);
        }
        return;
      } else {
        const { type } = await resp.json();
        if (type === 'domain_claimed') {
          setMessage({
            variant: 'error',
            message: messages.domainClaimed(proxySettings.domain),
          });
        } else if (type === 'plan_upgrade_required') {
          setMessage({
            variant: 'error',
            message: messages.upgradeRequired,
          });
        } else {
          setMessage({
            variant: 'error',
            message: messages.genericError,
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({
        variant: 'error',
        message: messages.genericError,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return [persistProxySettings, isLoading, message, () => setMessage(undefined)];
};
