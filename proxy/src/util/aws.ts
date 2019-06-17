import AWS from 'aws-sdk';

import { AWS_CREDENTIALS } from '../constants';

AWS.config.update({
  region: 'us-west-2',
  ...AWS_CREDENTIALS,
});

export {
  AWS,
};
