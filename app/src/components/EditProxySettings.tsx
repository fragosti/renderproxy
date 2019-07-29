import { Box, Container, Link, Typography } from '@material-ui/core';
import { Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { BreadCrumbs } from '../components/BreadCrumbs';
import { useProxySettingsForDomain } from '../hooks/useProxySettingsForDomain';

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
              text: 'Dashboard',
            },
            {
              Icon: SettingsIcon,
              text: `Configure ${domain}`,
            },
          ]}
        />
        <Typography align="left" variant="h3">
          <Link href={`http://${domain}`} target="_blank" color="inherit">
            <Box marginY={4} display="flex" fontWeight="bold" justifyContent="space-between">
              {domain}
            </Box>
          </Link>
        </Typography>
      </Box>
      {proxySettings && <Box>{proxySettings.urlToProxy}</Box>}
    </Container>
  );
};
