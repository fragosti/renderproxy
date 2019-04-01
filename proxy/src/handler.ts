import { Request, Response } from 'express';


import { rendertron } from './util/rendertron';
import logger from './util/logger';

export const handler = {
  root: async (req: Request, res: Response): Promise<void> => {
    logger.info('Called root endpoint');
    const response = await rendertron.render('http://sample-s3-spa.com.s3-website-us-west-2.amazonaws.com/');
    res.send(response.data);
  }
}