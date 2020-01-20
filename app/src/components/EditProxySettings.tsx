import { Box, Container, Typography } from '@material-ui/core';
import { Home as HomeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { HOMEPAGE_TITLE } from '../constants';
import { useProxySettingsForDomain } from '../hooks/useProxySettingsForDomain';
import { BreadCrumbs } from './BreadCrumbs';
import { DeleteProxyDialog } from './DeleteProxyDialog';
import { InstructionsCard } from './InstructionsCard';
import { Link } from './Link';
import { ProxySettingForm } from './ProxySettingForm';
import { SubscriptionCard } from './SubscriptionCard';
import { UsageCard } from './UsageCard';

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
            <Link href={`http://${domain}`} fontWeight="bold" target="_blank">
              {domain}
            </Link>
          </Typography>
          <Typography align="left" variant="h6">
            <Link href={`http://${domain}.renderproxy.com`} target="_blank">
              Available at {domain}.renderproxy.com
            </Link>
          </Typography>
        </Box>
        {proxySettings && (
          <>
            <Box marginY={3}>
              <InstructionsCard domain={domain} originUrl={proxySettings.urlToProxy} />
            </Box>
            <Box marginY={3}>{proxySettings && <ProxySettingForm onDeleteClick={openDialog} {...proxySettings} />}</Box>
            <Box marginY={3}>
              <UsageCard domain={domain} />
            </Box>
            <Box marginY={3}>
              <SubscriptionCard domain={domain} />
            </Box>
          </>
        )}
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
