import { useState } from 'react';

import { LoadingStatus, Message, MessageResetter } from '../types';
import { useAuth0 } from '../util/Auth0';

type SuccessHandler = () => void;
type CustomerSourceDeleter = () => Promise<void>;

const messages = {
  error: 'Something went wrong. Failed to remove billing information. Please try again later.',
  success: 'Successfully removed your billing information.',
};

export const useRemoveCustomer = (
  onSuccess?: SuccessHandler,
): [CustomerSourceDeleter, LoadingStatus, Message, MessageResetter] => {
  const { api } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message>();
  const removeCustomer = async () => {
    setIsLoading(true);
    try {
      await api.deleteCustomerAsync();
      setMessage({
        variant: 'success',
        message: messages.success,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessage({
        variant: 'error',
        message: messages.error,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return [removeCustomer, isLoading, message, () => setMessage(undefined)];
};
