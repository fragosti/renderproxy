import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

import { usePersistProxySettings } from '../hooks/usePersistProxySettings';
import { SnackbarMessage } from './SnackbarMessage';

export interface AddProxyDialogProps extends DialogProps {
  onClose: () => void;
  onSuccess: (domain: string) => void;
}

export const AddProxyDialog: React.FC<AddProxyDialogProps> = props => {
  const { onSuccess, ...dialogProps } = props;
  const [domain, setDomain] = useState<string>('');
  const [persistProxySettings, isLoading, message, setMessage] = usePersistProxySettings(onSuccess);
  const resetMessage = () => setMessage(undefined);
  const onSubmit = async () => {
    if (!domain) {
      throw new Error('Tried to submit an empty domain.');
    }
    persistProxySettings({
      domain,
      urlToProxy: '',
      shouldRedirectIfPossible: false,
      prerenderSetting: 'none',
    });
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
            variant="outlined"
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
