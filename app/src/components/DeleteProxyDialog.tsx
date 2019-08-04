import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import React from 'react';

import { useDeleteProxySettings } from '../hooks/useDeleteProxySettings';
import { SnackbarMessage } from './SnackbarMessage';

export interface DeleteProxyDialogProps extends DialogProps {
  domain: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteProxyDialog: React.FC<DeleteProxyDialogProps> = props => {
  const { domain, onSuccess, ...dialogProps } = props;
  const [deleteProxySettings, isLoading, message, resetMessage] = useDeleteProxySettings(onSuccess);
  const onSubmit =  () => {
    deleteProxySettings(domain);
  };
  return (
    <>
    <Dialog
        {...dialogProps}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure you want to remove this proxy?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`This means that requests  to ${domain} will no longer be supported.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" autoFocus={true} disabled={isLoading}>
            {isLoading ? 'Removing...' : 'Remove'}
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
