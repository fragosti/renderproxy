import Box, { BoxProps } from '@material-ui/core/Box';
import { default as MLink, LinkProps as MLinkProps } from '@material-ui/core/Link';
import React from 'react';

export type LinkProps = BoxProps & MLinkProps;

export const Link: React.FC<LinkProps> = props => {
  const { variant, href, underline, color, TypographyClasses, ...boxProps } = props;
  const linkProps = { variant, href, underline, color, TypographyClasses };
  return (
    <MLink {...linkProps}>
      <Box component="span" {...boxProps} />
    </MLink>
  );
};

Link.defaultProps = {
  target: '_blank',
  fontFamily: 'Monospace',
  color: 'inherit',
};
