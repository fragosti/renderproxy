import { Box, Breadcrumbs, Button, CircularProgress, Divider, IconButton, Paper } from '@material-ui/core';
import { Delete as DeleteIcon, Done as DoneIcon } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Stripe from 'stripe';

import { useAuth0 } from '../util/Auth0';
import { RemoveCustomerDialog } from './RemoveCustomerDialog';
import { Text } from './Text';

const cardOptions: any = {
  style: {
    base: {
      fontSize: '20px',
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);
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
  const onSubmit = async () => {
    if (props.stripe) {
      const { token } = await props.stripe.createToken();
      if (token) {
        setIsSubmitting(true);
        try {
          await api.createCustomerAsync(token.id);
          await fetchCustomerAsync();
        } catch (err) {
          console.error(err);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      console.error('Stripe.js not loaded');
    }
  };
  const onRemoveSuccess = async () => {
    await fetchCustomerAsync();
    closeDialog();
  };
  useEffect(() => {
    fetchCustomerAsync();
  }, [fetchCustomerAsync]);

  const renderContent = (): React.ReactNode => {
    if (fetchingState === 'progress') {
      return (
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      );
    }
    if (fetchingState === 'failure') {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" paddingY={2}>
          Something went wrong. Please try again later.
        </Box>
      );
    }
    if (customer && customer.sources) {
      const card: any = R.head(customer.sources.data);
      return (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
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
            <IconButton onClick={openDialog}>
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
          <RemoveCustomerDialog onSuccess={onRemoveSuccess} open={isDialogOpen} onClose={closeDialog} />
        </>
      );
    }
    return (
      <>
        <Box marginBottom={2} paddingY={1}>
          <CardElement {...cardOptions} />
        </Box>
        <Box paddingBottom={1}>
          <Button
            variant="contained"
            color="primary"
            style={{ color: 'white' }}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <DoneIcon style={{ left: '3px', position: 'relative' }} />
          </Button>
        </Box>
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
