import { Box, Divider, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

import React from 'react';

import { Text } from './Text';
import { Link } from './Link';

export interface InstructionsCardProps {
  domain: string;
  originUrl: string;
}

const isApexDomain = (domain: string) => {
  return domain.split('.').length === 2;
};

export const InstructionsCard: React.FC<InstructionsCardProps> = props => {
  const { domain, originUrl } = props;
  const isApex = isApexDomain(domain);
  const defaultOriginUrl = `http://${domain}/`;
  const renderProxyUrl = `http://${domain}.renderproxy.com`;
  const hasSetCustomOriginUrl = !!originUrl && originUrl !== defaultOriginUrl;
  const defaultStep = hasSetCustomOriginUrl ? 2 : 0;
  const [activeStep, setActiveStep] = React.useState(defaultStep);
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  const steps = [
    'Verify Your Integration',
    'Set a Valid Origin URL (Required for Custom Domain)',
    'Change Your DNS Settings (Required for Custom Domain)',
    'Distribute Your Website on a CDN (Optional)',
  ];
  let instructions: React.ReactNode | null = null;
  if (activeStep === 0) {
    instructions = (
      <>
        <Text mb={2}>
          If <i>{domain}</i> is a real domain and website, you can preview your integration by visiting:
        </Text>
        <Link mb={2} fontSize="16px" href={renderProxyUrl} target="_blank">
          {renderProxyUrl}
        </Link>
        <Text mb={2}>
          The website should be working normally for you, but will be serving pre-rendered content to search engine bots
          behind the scenes.
        </Text>
        <Text mb={2}>
          You can quickly verify that dynamic rendering works by using this{' '}
          <Link fontSize="16px" href="https://technicalseo.com/tools/pre-rendering/">
            pre-rendering tester tool{' '}
          </Link>{' '}
          and inputting the URL above, along with the different user-agents you'd like to test.
        </Text>
      </>
    );
  }
  if (activeStep === 1) {
    instructions = (
      <>
        <Text mb={2}>
          To set up your own domain you'll have to provide a different Origin URL than <i>{defaultOriginUrl}</i> in the
          settings panel below.
        </Text>
        <Text mb={2}>
          Usually this will be the URL or IP address that your domain is pointing to in your DNS settings. In general,
          it should be a URL or IP address that serves your website that isn't your domain.
        </Text>
        <Text mb={2}>
          For example, if your website is deployed on AWS S3, the URL will look like{' '}
          <i>bucket-name.s3-website-us-west-2.amazonaws.com</i>. You can check out integration examples from various
          providers at our{' '}
          <Link href="https://renderproxy.com/blog" fontSize="16px">
            blog.
          </Link>
        </Text>
      </>
    );
  }
  if (activeStep === 2) {
    if (isApex) {
      instructions = (
        <>
          <Text mb={2}>
            Configuring your settings for <i>{domain}</i> below will tell us how to proxy content for your domain.
            However, you still need to configure your DNS settings through your DNS provider to allow <i>{domain}</i> to
            resolve to our servers.
          </Text>
          <Text mb={2}>
            It looks like <i>{domain}</i> is an apex domain (also known as root, bare, or naked domain) so you need to
            use an <b>A</b> DNS entry type:{' '}
          </Text>
          <Box display="flex" justifyContent="center" py={2} mb={2}>
            <DNSTable
              entries={[
                {
                  name: domain,
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
                    name: domain,
                    type: 'CNAME',
                    value: 'go.renderproxy.com',
                  },
                ]}
              />
            </Box>
          </Text>
          <Text mb={2}>
            Again, you can check out our{' '}
            <Link href="https://renderproxy.com/blog" fontSize="16px">
              blog
            </Link>{' '}
            for some examples.
          </Text>
        </>
      );
    } else {
      instructions = (
        <>
          <Text mb={2}>
            Configuring your settings for <i>{domain}</i> below will tell us how to proxy content for your domain.
            However, you still need to configure your DNS settings through your DNS provider to allow <i>{domain}</i> to
            resolve to our servers.
          </Text>
          <Text mb={2}>
            It looks like <i>{domain}</i> is a subdomain so you need to use a <b>CNAME</b> DNS entry type:{' '}
          </Text>
          <Box display="flex" justifyContent="center" py={2} mb={2}>
            <DNSTable
              entries={[
                {
                  name: domain,
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
                    name: domain,
                    type: 'A',
                    value: '35.224.107.18',
                  },
                ]}
              />
            </Box>
          </Text>
          <Text mb={2}>
            Once you have that set-up and have configured your settings below you will be able to visit <i>{domain}</i>{' '}
            and see proxied content.
          </Text>
        </>
      );
    }
  }
  if (activeStep === 3) {
    instructions = (
      <>
        <Text mb={2}>
          If you haven't already, you can boost the performance of your pre-rendered site using a CDN like{' '}
          <Link href="https://www.cloudflare.com/" fontSize="16px">
            Cloudflare.
          </Link>
        </Text>
        <Text mb={2}>
          <Link href="https://www.cloudflare.com/" fontSize="16px">
            Cloudflare
          </Link>{' '}
          is completely free, easy to set up, and 100% compatible with Renderproxy. Cloudflare's caching will even save
          you some usage costs with Renderproxy.
        </Text>
        <Text mb={2}>
          Once you move your nameservers to Cloudflare, the set-up instructions are the same as the previous step. No
          additional steps required.
        </Text>
      </>
    );
  }
  return (
    <Paper elevation={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
        <Text align="left" variant="h5" fontWeight="bold">
          Instructions
        </Text>
      </Box>
      <Divider />
      <Box paddingY={3} paddingX={3}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Box>{instructions}</Box>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    disabled={activeStep === steps.length - 1}
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
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
