import { Application } from 'express';
import router from './router'
export default function routes(app: Application): void {
  app.use('/api/v1/', router);
};