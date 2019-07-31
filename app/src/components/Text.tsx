import Box, { BoxProps } from '@material-ui/core/Box';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';

export type TextProps = BoxProps & TypographyProps;

export const Text: React.FC<TextProps> = props => {
  const { align, color, gutterBottom, noWrap, paragraph, variant, variantMapping, ...boxProps } = props;
  const typographyProps = { align, color, gutterBottom, noWrap, paragraph, variant, variantMapping };
  return (
    <Typography {...typographyProps}>
      <Box component="span" {...boxProps} />
    </Typography>
  );
};
