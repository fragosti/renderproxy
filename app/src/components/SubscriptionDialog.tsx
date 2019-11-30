import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import React, { useState } from 'react';
import { injectStripe } from 'react-stripe-elements';

import { CardInput, OnChangeEvent } from '../components/CardInput';
import { subscriptionTierInfoMap } from '../constants';
import { useSubscribeUser } from '../hooks/useSubscribeUser';
import { PlanId } from '../types';
import { useAuth0 } from '../util/Auth0';

import { SnackbarMessage } from './SnackbarMessage';

export interface SubscriptionDialogProps extends DialogProps {
  domain: string;
  planId: PlanId;
  onClose: () => void;
  onSuccess?: () => void;
  requiresBillingInfo?: boolean;
}

export const SubscriptionDialog = injectStripe<SubscriptionDialogProps>(props => {
  const { api } = useAuth0();
  const { onSuccess, domain, planId, requiresBillingInfo, ...dialogProps } = props;
  const [latestChangeEvent, setLatestChangeEvent] = useState<OnChangeEvent>();
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [subscribeUser, isLoading, message, resetMessage] = useSubscribeUser(onSuccess);
  const onSubmit = async () => {
    if (requiresBillingInfo) {
      if (props.stripe) {
        const { token } = await props.stripe.createToken();
        if (token) {
          setIsCreatingCustomer(true);
          try {
            await api.createCustomerAsync(token.id);
            await subscribeUser(planId, domain);
          } catch (err) {
            console.error(err);
          } finally {
            setIsCreatingCustomer(false);
          }
        }
      } else {
        console.error('Stripe.js not loaded');
      }
    } else {
      subscribeUser(planId, domain);
    }
  };
  const subscriptionInfo = subscriptionTierInfoMap[planId];
  if (!subscriptionInfo) {
    return null;
  }
  const canSubmit =
    !requiresBillingInfo || (latestChangeEvent && latestChangeEvent.complete && !latestChangeEvent.error);
  const isDisabled = !canSubmit || isLoading || isCreatingCustomer;
  return (
    <>
      <Dialog {...dialogProps} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{`Change to the ${subscriptionInfo.name} Plan`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The plan costs {subscriptionInfo.price} and{' '}
            {subscriptionInfo.id === 'spark'
              ? 'will unsubscribe you from your paid plans for this domain'
              : 'is billed a month from today because of the 30 day free trial'}
            . The plan includes:
          </DialogContentText>
          <Box display="flex" marginBottom={2}>
            <List>
              {subscriptionInfo.properties.map(property => (
                <ListItem key={property}>{property}</ListItem>
              ))}
            </List>
          </Box>
          {requiresBillingInfo && (
            <>
              <DialogContentText>Please insert your billing information below to continue:</DialogContentText>
              <Box border={1} padding={2} borderRadius={2} borderColor="secondary.main">
                <CardInput onChange={setLatestChangeEvent} />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={isDisabled}>
            {isLoading || isCreatingCustomer ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!isLoading && !!message}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={resetMessage}
      >
        {message && <SnackbarMessage {...message} onClose={resetMessage} />}
      </Snackbar>
    </>
  );
});
