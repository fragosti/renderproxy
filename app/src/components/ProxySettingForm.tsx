import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete as DeleteIcon, Done as DoneIcon, Info as InfoIcon } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useState } from 'react';

import { usePersistProxySettings } from '../hooks/usePersistProxySettings';
import { useValidateProxySettings } from '../hooks/useValidateProxySettings';
import { ProxySettings } from '../types';
import { SnackbarMessage } from './SnackbarMessage';
import { Text } from './Text';

export interface ProxySettingsFormProps extends ProxySettings {
  onDeleteClick: () => void;
}

export const ProxySettingForm: React.FC<ProxySettingsFormProps> = props => {
  const { onDeleteClick, ...proxySettings } = props;
  const [newSettings, setNewSettings] = useState(R.clone(proxySettings));
  const areSettingsEqual = R.equals(proxySettings, newSettings);
  const [persistProxySettings, isLoading, message, resetMessage] = usePersistProxySettings();
  const [validateProxySettings, validations, resetValidations] = useValidateProxySettings();
  const createOnChange = (propertyName: string) => (event: React.ChangeEvent<any>) => {
    resetValidations();
    const settings = {
      ...newSettings,
      [propertyName]: event.target.value,
    };
    setNewSettings(settings);
  };
  const onSaveClick = () => {
    const validatedSettings = validateProxySettings(newSettings);
    if (validatedSettings) {
      persistProxySettings(validatedSettings);
    }
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
            <FormControl variant="outlined" style={{ backgroundColor: 'white' }}>
              <InputLabel htmlFor="prerender-setting">Pre-render</InputLabel>
              <Select
                value={newSettings.prerenderSetting}
                onChange={createOnChange('prerenderSetting')}
                input={<OutlinedInput labelWidth={75} name="prerender-setting" id="prerender-setting" />}
              >
                <MenuItem value="none">No Requests</MenuItem>
                <MenuItem value="all">All Requests</MenuItem>
                <MenuItem value="bot">Bot Requests</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
          <Box marginTop={3} marginBottom={1} display="flex">
            <Box marginRight={1}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: 'white' }}
                disabled={areSettingsEqual || !R.isEmpty(validations) || isLoading}
                onClick={onSaveClick}
              >
                {isLoading ? 'Saving...' : 'Save'}
                <DoneIcon style={{ left: '3px', position: 'relative' }} />
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
