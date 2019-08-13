import { Box, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { Done as DoneIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { Elements } from 'react-stripe-elements';

import { SubscriptionDialog } from './SubscriptionDialog';
import { Text } from './Text';

import { SubscriptionTierInfo } from '../types';

export interface SubscriptionTierProps extends SubscriptionTierInfo {
  domain: string;
  isActive?: boolean;
  requiresBillingInfo?: boolean;
  onSubscriptionChange: () => void;
}

export const SubscriptionTier: React.FC<SubscriptionTierProps> = ({
  id,
  domain,
  name,
  price,
  properties,
  ctaText,
  isActive,
  onSubscriptionChange,
  requiresBillingInfo,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);
  const onSuccess = async () => {
    onSubscriptionChange();
    closeDialog();
  };
  return (
    <>
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
          {properties.map(property => (
            <Typography key={property} variant="body2" component="p">
              {property}
              <br />
            </Typography>
          ))}
        </CardContent>
        {ctaText && !isActive && (
          <CardActions>
            <Button color="primary" onClick={openDialog}>
              {ctaText}
            </Button>
          </CardActions>
        )}
        {isActive && (
          <CardActions>
            <Text padding={1} color={'primary' as any} fontSize="14px" fontWeight={500}>
              SELECTED <DoneIcon style={{ top: '3px', position: 'relative' }} fontSize="small" />
            </Text>
          </CardActions>
        )}
      </Card>
      <Elements>
        <SubscriptionDialog
          domain={domain}
          planId={id}
          open={isDialogOpen}
          onClose={closeDialog}
          onSuccess={onSuccess}
          requiresBillingInfo={requiresBillingInfo}
        />
      </Elements>
    </>
  );
};

SubscriptionTier.defaultProps = {
  isActive: false,
};
