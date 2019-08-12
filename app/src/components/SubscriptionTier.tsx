import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import React, { useState } from 'react';

import { SubscriptionTierInfo } from '../types';
import { SubscriptionDialog } from './SubscriptionDialog';

export interface SubscriptionTierProps extends SubscriptionTierInfo {
  domain: string;
  isActive?: boolean;
}

export const SubscriptionTier: React.FC<SubscriptionTierProps> = ({
  id,
  domain,
  name,
  price,
  properties,
  ctaText,
  isActive,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);
  return (
    <>
      <Box border={isActive ? 1 : 0} width="220px" borderRadius={2}>
        <Card elevation={0}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom={true}>
              {name}
            </Typography>
            <Box marginBottom={1}>
              <Typography variant="h5" component="h2">
                {price}
              </Typography>
            </Box>
            <Typography variant="body2" component="p">
              {properties.map(property => (
                <>
                  {property}
                  <br />
                </>
              ))}
            </Typography>
          </CardContent>
          {ctaText && !isActive && (
            <CardActions>
              <Button size="small" color="primary" onClick={openDialog}>
                {ctaText}
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
      <SubscriptionDialog domain={domain} planId={id} open={isDialogOpen} onClose={closeDialog} />
    </>
  );
};

SubscriptionTier.defaultProps = {
  isActive: false,
};
