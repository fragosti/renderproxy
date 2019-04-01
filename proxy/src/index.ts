import Server from './server';

const port = parseInt(process.env.PORT);
export default new Server()
  .listen(port);
