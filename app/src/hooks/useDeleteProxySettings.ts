import { useState } from 'react';

import { LoadingStatus, Message, MessageResetter } from '../types';
import { useAuth0 } from '../util/Auth0';

type SuccessHanlder = () => void;
type ProxySettingDeleter = (domain: string) => void;

const messages = {
  error: (domain: string) => `Something went wrong while delete ${domain}. Please try again later.`,
  success: (domain: string) => `Successfully deleted ${domain}.`,
};

export const useDeleteProxySettings = (
  onSuccess?: SuccessHanlder,
): [ProxySettingDeleter, LoadingStatus, Message, MessageResetter] => {
  const { api } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>();
  const deleteProxySettings = async (domain: string) => {
    setIsLoading(true);
    try {
      await api.deleteProxySettingsForDomainAsync(domain);
      setMessage({
        variant: 'success',
        message: messages.success(domain),
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        variant: 'error',
        message: messages.error(domain),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return [deleteProxySettings, isLoading, message, () => setMessage(undefined)];
};
