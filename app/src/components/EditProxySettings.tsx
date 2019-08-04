import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Done as DoneIcon, Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import * as R from 'ramda';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { BreadCrumbs } from '../components/BreadCrumbs';
import { HOMEPAGE_TITLE } from '../constants';
import { usePersistProxySettings } from '../hooks/usePersistProxySettings';
import { useProxySettingsForDomain } from '../hooks/useProxySettingsForDomain';
import { ProxySettings } from '../types';
import { Link } from './Link';
import { SnackbarMessage } from './SnackbarMessage';

interface Params {
  domain: string;
}

export interface EditProxySettingsProps extends RouteComponentProps<Params> {}

export const EditProxySettings: React.FC<EditProxySettingsProps> = props => {
  const { domain } = props.match.params;
  const proxySettings = useProxySettingsForDomain(domain);
  return (
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
      {proxySettings && <ProxySettingForm {...proxySettings} />}
    </Container>
  );
};

type ProxySettingsFormProps = ProxySettings;

const ProxySettingForm: React.FC<ProxySettingsFormProps> = props => {
  const [newSettings, setNewSettings] = useState(R.clone(props));
  const areSettingsEqual = R.equals(props, newSettings);
  const [persistProxySettings, isLoading, message, setMessage] = usePersistProxySettings();
  const createOnChange = (propertyName: string) => (e: React.ChangeEvent<any>) => {
    setNewSettings({
      ...newSettings,
      [propertyName]: e.target.value,
    });
  };
  const resetMessage = () => setMessage(undefined);
  const onSave = () => persistProxySettings(newSettings);
  return (
    <>
      <Box marginY={3}>
        <Box marginY={2}>
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
        <Box marginY={2}>
          <TextField
            type="url"
            label="Origin URL"
            placeholder="http://youroriginurl.com/"
            variant="outlined"
            fullWidth={true}
            onChange={createOnChange('urlToProxy')}
            value={newSettings.urlToProxy}
            style={{ backgroundColor: 'white' }}
          />
        </Box>
        <Box marginY={2}>
          <Button
            variant="contained"
            color="primary"
            style={{ color: 'white' }}
            disabled={areSettingsEqual}
            onClick={onSave}
          >
            Save
            <DoneIcon style={{ left: '3px', position: 'relative' }} />
          </Button>
        </Box>
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
