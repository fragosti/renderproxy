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
import React from 'react';

import { subscriptionTierInfoMap } from '../constants';
import { useSubscribeUser } from '../hooks/useSubscribeUser';
import { PlanId } from '../types';

import { SnackbarMessage } from './SnackbarMessage';

export interface SubscriptionDialogProps extends DialogProps {
  domain: string;
  planId: PlanId;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubscriptionDialog: React.FC<SubscriptionDialogProps> = props => {
  const { onSuccess, domain, planId, ...dialogProps } = props;
  const [subscribeUser, isLoading, message, resetMessage] = useSubscribeUser(onSuccess);
  const onSubmit = async () => {
    subscribeUser(planId, domain);
  };
  const subscriptionInfo = subscriptionTierInfoMap[planId];
  if (!subscriptionInfo) {
    return null;
  }
  return (
    <>
      <Dialog {...dialogProps} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{`Change to the ${subscriptionInfo.name} Plan`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The plan costs {subscriptionInfo.price} and{' '}
            {subscriptionInfo.id === 'free'
              ? 'will unsubscribe you from your paid plans for this domain'
              : 'is billed a month from today'}
            . The plan includes:
          </DialogContentText>
          <Box display="flex">
            <List>
              {subscriptionInfo.properties.map(property => (
                <ListItem key={property}>{property}</ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
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
};
