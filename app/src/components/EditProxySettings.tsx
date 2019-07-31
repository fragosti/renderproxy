import { Box, Container, Typography } from '@material-ui/core';
import { Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { BreadCrumbs } from '../components/BreadCrumbs';
import { HOMEPAGE_TITLE } from '../constants';
import { useProxySettingsForDomain } from '../hooks/useProxySettingsForDomain';
import { Link } from './Link';

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
      {proxySettings && <Box>{proxySettings.urlToProxy}</Box>}
    </Container>
  );
};
