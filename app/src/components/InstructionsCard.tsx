import { Box, Divider, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import React from 'react';

import { Text } from './Text';

export interface InstructionsCardProps {
  domain: string;
}

const isApexDomain = (domain: string) => {
  return domain.split('.').length === 2;
};

export const InstructionsCard: React.FC<InstructionsCardProps> = props => {
  const isApex = isApexDomain(props.domain);
  return (
    <Paper elevation={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
        <Text align="left" variant="h5" fontWeight="bold">
          Instructions
        </Text>
      </Box>
      <Divider />
      <Box paddingY={3} paddingX={3}>
        <Text mb={2}>
          Configuring your settings for <i>{props.domain}</i> below will tell us how to proxy content for your domain.
          However, you still need to configure your DNS settings through your DNS provider to allow{' '}
          <i>{props.domain}</i> to resolve to our servers.
        </Text>
        {isApex ? (
          <>
            <Text mb={2}>
              It looks like <i>{props.domain}</i> is an apex domain (also known as root, bare, or naked domain) so you
              need to use an <b>A</b> DNS entry type:{' '}
            </Text>
            <Box display="flex" justifyContent="center" py={2} mb={2}>
              <DNSTable
                entries={[
                  {
                    name: props.domain,
                    type: 'A',
                    value: '35.224.107.18',
                  },
                ]}
              />
            </Box>
            <Text mb={2}>
              If it is not an apex domain, or if your DNS provider supports CNAME-like records for apex domains then you
              can use the following DNS settings:
              <Box display="flex" justifyContent="center" py={2}>
                <DNSTable
                  entries={[
                    {
                      name: props.domain,
                      type: 'CNAME',
                      value: 'go.renderproxy.com',
                    },
                  ]}
                />
              </Box>
            </Text>
            <Text mb={2}>
              Once you have that set-up and have configured your settings below you will be able to visit{' '}
              <i>{props.domain}</i> and see proxied content.
            </Text>
          </>
        ) : (
          <>
            <Text mb={2}>
              It looks like <i>{props.domain}</i> is a subdomain so you need to use a <b>CNAME</b> DNS entry type:{' '}
            </Text>
            <Box display="flex" justifyContent="center" py={2} mb={2}>
              <DNSTable
                entries={[
                  {
                    name: props.domain,
                    type: 'CNAME',
                    value: 'go.renderproxy.com',
                  },
                ]}
              />
            </Box>
            <Text mb={2}>
              If it is not a subdomain, or if you prefer to use an <b>A</b> record, you can use the following settings:
              <Box display="flex" justifyContent="center" py={2}>
                <DNSTable
                  entries={[
                    {
                      name: props.domain,
                      type: 'A',
                      value: '35.224.107.18',
                    },
                  ]}
                />
              </Box>
            </Text>
            <Text mb={2}>
              Once you have that set-up and have configured your settings below you will be able to visit{' '}
              <i>{props.domain}</i> and see proxied content.
            </Text>
          </>
        )}
      </Box>
    </Paper>
  );
};

interface DNSTableEntry {
  name: string;
  type: string;
  value: string;
}

interface DNSTableProps {
  entries: DNSTableEntry[];
}

const DNSTable: React.FC<DNSTableProps> = props => (
  <Box width={{ xs: 300, md: 500 }}>
    <Table size="small" aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right">Type</TableCell>
          <TableCell align="right">Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.entries.map(entry => (
          <TableRow key={entry.name}>
            <TableCell component="th" scope="row">
              {entry.name}
            </TableCell>
            <TableCell align="right">{entry.type}</TableCell>
            <TableCell align="right">{entry.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);
