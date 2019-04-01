import { Request, Response } from 'express';
import isBot from 'isbot';

import { rendertron } from './util/rendertron';
import logger from './util/logger';

export const handler = {
  root: async (req: Request, res: Response): Promise<void> => {
    if (isBot(req.headers["user-agent"])) {
      return handler.handleBotRequest(req, res);
    }
    return handler.handleRegularRequest(req, res);
  },
  handleBotRequest: async (req: Request, res: Response): Promise<void> => {
    logger.info('Called root endpoint');
    const response = await rendertron.render('http://sample-s3-spa.com.s3-website-us-west-2.amazonaws.com/');
    res.send(response.data);
  },
  handleRegularRequest: async (req: Request, res: Response): Promise<void> => {
    res.redirect('http://sample-s3-spa.com.s3-website-us-west-2.amazonaws.com/');
  }
}