import { Request, Response } from 'express';

export const handler = {
  root: async (req: Request, res: Response): Promise<void> => {
    res.send('hello workd');
  },
};
