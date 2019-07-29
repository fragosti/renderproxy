import { Breadcrumbs, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1, 2),
    },
    link: {
      display: 'flex',
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
  }),
);

interface Params {
  domain: string;
}

export interface BreadCrumb {
  text: string;
  Icon: React.ComponentType<any>;
  to?: string;
}

export interface BreadCrumbsProps {
  crumbs: BreadCrumb[];
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = props => {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {props.crumbs.map(crumb =>
        crumb.to ? (
          <Link key={crumb.text} component={RouterLink} color="inherit" to={crumb.to} className={classes.link}>
            <crumb.Icon className={classes.icon} />
            {crumb.text}
          </Link>
        ) : (
          <Typography key={crumb.text} color="textPrimary" className={classes.link}>
            <crumb.Icon className={classes.icon} />
            {crumb.text}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
};
