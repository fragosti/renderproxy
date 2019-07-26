import { AppBar, Avatar, Box, Grid, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import * as React from 'react';

import { Logo } from '../components/Logo';
import { RETURN_TO_URL } from '../constants';
import { useAuth0 } from '../util/Auth0';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth0();
  const handleLogoutClick = () => logout({ returnTo: RETURN_TO_URL });
  return (
    <AppBar color="secondary">
      <Toolbar>
        <Grid container={true} spacing={3} justify="space-between" alignItems="center">
          <Box ml={10} p={4}>
            <Logo height={36} />
          </Box>
          <Box display="flex" alignItems="center">
            {user && (
              <Typography>
                <Box mr={2} fontSize={15} fontWeight="fontWeightBold" fontFamily="Monospace">
                  {user.email || user.nickname}
                </Box>
              </Typography>
            )}
            {user && (
              <Box mr={3} width={30}>
                <Avatar alt={user.name} src={user.picture} />
              </Box>
            )}
            <Tooltip title="Log Out">
              <IconButton color="inherit" size="medium" onClick={handleLogoutClick}>
                <InputIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
