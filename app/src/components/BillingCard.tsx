import { Box, Breadcrumbs, Button, CircularProgress, Divider, Paper } from '@material-ui/core';
import { Done as DoneIcon } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Stripe from 'stripe';

import { useAuth0 } from '../util/Auth0';
import { Text } from './Text';

const cardOptions: any = {
  style: {
    base: {
      fontSize: '18px',
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Roboto, monospace',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export type FetchingState = 'progress' | 'success' | 'failure';

export const BillingCard = injectStripe(props => {
  const { api } = useAuth0();
  const [customer, setCustomer] = useState<Stripe.customers.ICustomer | undefined>();
  const [fetchingState, setFetchingState] = useState<FetchingState>('progress');
  const onSubmit = async () => {
    if (props.stripe) {
      const { token } = await props.stripe.createToken();
      if (token) {
        // TODO: handle failed
        const resp = await api.createCustomerAsync(token.id);
      }
    } else {
      console.error('Stripe.js not loaded');
    }
  };
  useEffect(() => {
    const getCustomer = async () => {
      setFetchingState('progress');
      try {
        const customerResponse = await api.getCustomerAsync();
        setCustomer(customerResponse.customer);
        setFetchingState('success');
      } catch (err) {
        console.error(err);
        setFetchingState('failure');
      }
    };
    getCustomer();
  }, [api]);

  const renderContent = (): React.ReactNode => {
    if (fetchingState === 'progress') {
      return (
        <Box display="flex" paddingY={1} alignItems="center" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      );
    }
    if (fetchingState === 'failure') {
      return (
        <Box display="flex" paddingY={1} alignItems="center" justifyContent="center">
          Something went wrong. Please try again later.
        </Box>
      );
    }
    if (customer && customer.sources) {
      const card: any = R.head(customer.sources.data);
      return (
        <Box display="flex" paddingY={1} alignItems="center">
          <Breadcrumbs>
            <Text fontWeight="bold" fontFamily="monospace" fontSize={18} color={'textPrimary' as any}>
              {`${card.brand.toUpperCase()} ${card.funding}`.toUpperCase()}
            </Text>
            <Text
              fontWeight="bold"
              fontFamily="monospace"
              fontSize={18}
              color={'textPrimary' as any}
            >{`•••• •••• •••• ${card.last4}`}</Text>
            <Text
              fontWeight="bold"
              fontFamily="monospace"
              fontSize={18}
              color={'textPrimary' as any}
            >{`${card.exp_month}-${card.exp_year}`}</Text>
          </Breadcrumbs>
        </Box>
      );
    }
    return (
      <>
        <Box marginBottom={2}>
          <CardElement {...cardOptions} />
        </Box>
        <Button variant="contained" color="primary" style={{ color: 'white' }} onClick={onSubmit}>
          Submit
          <DoneIcon style={{ left: '3px', position: 'relative' }} />
        </Button>
      </>
    );
  };
  return (
    <Paper elevation={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
        <Text align="left" variant="h5" fontWeight="bold">
          Billing
        </Text>
      </Box>
      <Divider />
      <Box paddingY={1} paddingX={3}>
        {renderContent()}
      </Box>
    </Paper>
  );
});
