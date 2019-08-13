import { useCallback, useState } from 'react';
import Stripe from 'stripe';

import { FetchingState } from '../types';
import { useAuth0 } from '../util/Auth0';

type Customer = Stripe.customers.ICustomer | undefined;

export const useFetchCustomerAsync = (): [Customer, () => Promise<void>, FetchingState] => {
  const { api } = useAuth0();
  const [customer, setCustomer] = useState<Customer>();
  const [fetchingState, setFetchingState] = useState<FetchingState>('progress');
  const fetchCustomerAsync = useCallback(async () => {
    setFetchingState('progress');
    try {
      const customerResponse = await api.getCustomerAsync();
      setCustomer(customerResponse.customer);
      setFetchingState('success');
    } catch (err) {
      console.error(err);
      setFetchingState('failure');
    }
  }, [api]);
  return [customer, fetchCustomerAsync, fetchingState];
};
