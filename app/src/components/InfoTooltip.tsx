import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Info as InfoIcon } from '@material-ui/icons';
import React from 'react';

export interface InfoTooltipProps {
  description: string;
}

const useIconStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    marginLeft: '3px',
  },
}));

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ description }) => (
  <Tooltip title={description} placement="top">
    <IconButton size="small">
      <InfoIcon classes={useIconStyles()} />
    </IconButton>
  </Tooltip>
);
