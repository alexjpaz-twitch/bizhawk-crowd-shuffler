const { Server } = require('./server');

describe('Server', () => {
  let server;

  beforeEach(async () => {
    server = new Server();
    await server.start();
  });

  afterEach(() => {
    server.stop();
  });

  it('', () => {
  });
});
