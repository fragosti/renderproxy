import { useState } from 'react';

import { LoadingStatus, Message, MessageResetter, PlanId } from '../types';
import { useAuth0 } from '../util/Auth0';

type UserSubscriber = (planId: PlanId, domain: string) => Promise<void>;
type SuccessHandler = () => void;

const messages = {
  genericError: 'Something went wrong. Please try again later.',
  success: (domain: string) => `Succesfully changed your subscription for ${domain}.`,
};

export const useSubscribeUser = (
  onSuccess?: SuccessHandler,
): [UserSubscriber, LoadingStatus, Message, MessageResetter] => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | undefined>();
  const { api } = useAuth0();
  const persistProxySettings: UserSubscriber = async (planId: PlanId, domain: string) => {
    try {
      setIsLoading(true);
      const resp = await api.subscribeUserAsync(planId, domain);
      if (resp.ok) {
        setMessage({
          variant: 'success',
          message: messages.success(domain),
        });
        if (onSuccess) {
          onSuccess();
        }
        return;
      } else {
        setMessage({
          variant: 'error',
          message: messages.genericError,
        });
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
