import { Box, Button, Divider, Paper, Snackbar, TextField } from '@material-ui/core';
import { Cached as CachedIcon, Delete as DeleteIcon, Done as DoneIcon } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useState } from 'react';

import { usePersistProxySettings } from '../hooks/usePersistProxySettings';
import { useValidateProxySettings } from '../hooks/useValidateProxySettings';
import { Message, ProxySettings } from '../types';
import { useAuth0 } from '../util/Auth0';
import { SnackbarMessage } from './SnackbarMessage';
import { Text } from './Text';

export interface ProxySettingsFormProps extends ProxySettings {
  onDeleteClick: () => void;
}

export const ProxySettingForm: React.FC<ProxySettingsFormProps> = props => {
  const { onDeleteClick, ...proxySettings } = props;
  const [newSettings, setNewSettings] = useState(R.clone(proxySettings));
  const { api } = useAuth0();
  const [persistProxySettings, isPersisting, persistMessage, resetPersistMessage] = usePersistProxySettings();
  const [validateProxySettings, validations, resetValidations] = useValidateProxySettings();
  const [clearCacheMessage, setClearCacheMessage] = useState<Message>(undefined);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const createOnChange = (propertyName: string, isNumber: boolean = false) => (event: React.ChangeEvent<any>) => {
    resetValidations();
    let value = event.target.value;
    if (value && isNumber) {
      value = +value;
    }
    const settings = {
      ...newSettings,
      [propertyName]: value,
    };
    setNewSettings(settings);
  };
  const onSaveClick = () => {
    const validatedSettings = validateProxySettings(newSettings);
    if (validatedSettings) {
      persistProxySettings(validatedSettings);
    }
  };
  const onClearCacheClick = async () => {
    setIsClearingCache(true);
    try {
      await api.clearCache(proxySettings.domain);
      setClearCacheMessage({
        variant: 'success',
        message: 'Successfully cleared the cache.',
      });
    } catch (err) {
      setClearCacheMessage({
        variant: 'error',
        message: 'Something went wrong while clearing the cache.',
      });
    } finally {
      setIsClearingCache(false);
    }
  };
  const message = persistMessage || clearCacheMessage;
  const isLoading = isPersisting || isClearingCache;
  const resetMessage = () => {
    resetPersistMessage();
    setClearCacheMessage(undefined);
  };
  return (
    <>
      <Paper elevation={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
          <Text align="left" variant="h5" fontWeight="bold">
            Settings
          </Text>
        </Box>
        <Divider />
        <Box paddingY={1} paddingX={3}>
          <Box marginY={3}>
            <TextField
              error={!!validations.urlToProxy}
              helperText={validations.urlToProxy}
              type="url"
              label="Origin URL"
              placeholder="http://youroriginurl.com/"
              variant="outlined"
              fullWidth={true}
              onChange={createOnChange('urlToProxy')}
              value={newSettings.urlToProxy}
              inputProps={{ style: { backgroundColor: 'white' } }}
            />
          </Box>
          <Box marginY={3}>
            <TextField
              error={!!validations.cacheExpirySeconds}
              helperText={validations.cacheExpirySeconds}
              type="number"
              label="Cache TTL (seconds)"
              variant="outlined"
              fullWidth={true}
              onChange={createOnChange('cacheExpirySeconds')}
              value={newSettings.cacheExpirySeconds}
              inputProps={{ style: { backgroundColor: 'white' } }}
            />
          </Box>
          <Box marginTop={3} marginBottom={1} display="flex">
            <Box marginRight={1}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: 'white' }}
                disabled={!R.isEmpty(validations) || isLoading}
                onClick={onSaveClick}
              >
                {isLoading ? 'Saving...' : 'Save'}
                <DoneIcon style={{ left: '3px', position: 'relative' }} />
              </Button>
            </Box>
            <Box marginRight={1}>
              <Button variant="contained" color="secondary" style={{ color: 'white' }} onClick={onClearCacheClick}>
                Clear Cache
                <CachedIcon style={{ left: '3px', position: 'relative' }} />
              </Button>
            </Box>
            <Button variant="contained" color="secondary" style={{ color: 'white' }} onClick={onDeleteClick}>
              Remove
              <DeleteIcon style={{ left: '3px', position: 'relative' }} />
            </Button>
          </Box>
        </Box>
      </Paper>
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
