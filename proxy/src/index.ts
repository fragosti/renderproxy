import Server from './server';

const port = parseInt(process.env.PORT, 10);
export default new Server()
  .listen(port);
