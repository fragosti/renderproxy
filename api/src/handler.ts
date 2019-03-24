import { Request, Response } from 'express';

import logger from './util/logger';

export class Handler {
  health(req: Request, res: Response): void {
    logger.info('Called root endpoint');
    res.status(201).end();
  }
}
export default new Handler();
// all(req: Request, res: Response): void {
  //   ExamplesService.all().then(r => res.json(r));
  // }

  // byId(req: Request, res: Response): void {
  //   ExamplesService.byId(req.params.id).then(r => {
  //     if (r) res.json(r);
  //     else res.status(404).end();
  //   });
  // }

  // create(req: Request, res: Response): void {
  //   ExamplesService.create(req.body.name).then(r =>
  //     res
  //       .status(201)
  //       .location(`<%= apiRoot %>/examples/${r.id}`)
  //       .json(r),
  //   );
  // }