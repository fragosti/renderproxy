import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

import { useAuth0 } from '../util/Auth0';
import { SnackbarMessage } from './SnackbarMessage';

export interface AddProxyDialogProps extends DialogProps {
  onClose: () => void;
  onSuccess: (domain: string) => void;
}

const errorMessages = {
  domainClaimed: (domain: string) => `The domain ${domain} already has settings for it.`,
  generic: 'Something went wrong. Please try again later.',
};

export const AddProxyDialog: React.FC<AddProxyDialogProps> = props => {
  const { onSuccess, ...dialogProps } = props;
  const [domain, setDomain] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { api } = useAuth0();
  const resetErrorMessage = () => setErrorMessage(undefined);
  const onSubmit = async () => {
    if (!domain) {
      throw new Error('Tried to submit an empty domain.');
    }
    try {
      setIsLoading(true);
      const resp = await api.addNewProxySettingsAsync({
        domain,
        urlToProxy: '',
        shouldRedirectIfPossible: false,
        prerenderSetting: 'none',
      });

      if (resp.ok) {
        onSuccess(domain);
        return;
      } else {
        const { type } = await resp.json();
        if (type === 'domain_claimed') {
          setErrorMessage(errorMessages.domainClaimed(domain));
        } else {
          setErrorMessage(errorMessages.generic);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(errorMessages.generic);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog {...dialogProps} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Proxied Domain</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Get started by entering the domain (eg. mywebsite.com) you would like to set up a proxy for.
          </DialogContentText>
          <TextField
            autoFocus={true}
            margin="dense"
            id="name"
            label="Domain"
            type="text"
            fullWidth={true}
            onChange={event => setDomain(event.target.value)}
            value={domain}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={!domain || isLoading}>
            {isLoading ? 'Submitting...' : 'Continue'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!isLoading && !!errorMessage}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={resetErrorMessage}
      >
        <SnackbarMessage variant="error" message={errorMessage} onClose={resetErrorMessage} />
      </Snackbar>
    </>
  );
};
