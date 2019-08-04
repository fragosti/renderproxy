import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon, Done as DoneIcon, Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { BreadCrumbs } from '../components/BreadCrumbs';
import { DeleteProxyDialog } from '../components/DeleteProxyDialog';
import { HOMEPAGE_TITLE } from '../constants';
import { usePersistProxySettings } from '../hooks/usePersistProxySettings';
import { useProxySettingsForDomain } from '../hooks/useProxySettingsForDomain';
import { useValidateProxySettings } from '../hooks/useValidateProxySettings';
import { ProxySettings } from '../types';
import { Link } from './Link';
import { SnackbarMessage } from './SnackbarMessage';
import { Text } from './Text';

interface Params {
  domain: string;
}

export interface EditProxySettingsProps extends RouteComponentProps<Params> {}

export const EditProxySettings: React.FC<EditProxySettingsProps> = props => {
  const { domain } = props.match.params;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);
  const proxySettings = useProxySettingsForDomain(domain);
  const handleSuccessfulDeletion = () => {
    props.history.replace('/');
  };
  return (
    <>
      <Container maxWidth="md">
        <Box marginTop={3}>
          <BreadCrumbs
            crumbs={[
              {
                to: '/',
                Icon: HomeIcon,
                text: HOMEPAGE_TITLE,
              },
              {
                Icon: SettingsIcon,
                text: `Configure ${domain}`,
              },
            ]}
          />
          <Typography align="left" variant="h3">
            <Link href={`http://${domain}`} fontWeight="bold">
              {domain}
            </Link>
          </Typography>
        </Box>
        {proxySettings && <ProxySettingForm onDeleteClick={openDialog} {...proxySettings} />}
      </Container>
      <DeleteProxyDialog
        domain={domain}
        onSuccess={handleSuccessfulDeletion}
        open={isDialogOpen}
        onClose={closeDialog}
      />
    </>
  );
};

interface ProxySettingsFormProps extends ProxySettings {
  onDeleteClick: () => void;
}

const ProxySettingForm: React.FC<ProxySettingsFormProps> = props => {
  const { onDeleteClick, ...proxySettings } = props;
  const [newSettings, setNewSettings] = useState(R.clone(proxySettings));
  const areSettingsEqual = R.equals(props, newSettings);
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
      <Box marginY={3}>
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
                  <MenuItem value="none">Never</MenuItem>
                  <MenuItem value="all">Always</MenuItem>
                  <MenuItem value="bot">Bot Only</MenuItem>
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
            <Box marginY={3} display="flex">
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
      </Box>
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
