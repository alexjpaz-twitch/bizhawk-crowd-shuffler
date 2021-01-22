const { expect } = require('chai');
const net = require('net');

const { Server } = require('./server');

describe('Server', () => {
  let server;
  let port;

  beforeEach(async () => {
    server = new Server();

    await server.start();

    port = server.server.address().port;
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should add a socket to the array on the connection', (done) => {
    const client = new net.Socket();

    client.connect({ port }, () => {
      // WOWOWOWO Bad
      setTimeout(() => {
        try {
          expect(server.sockets.length).to.eql(1);
          client.end();
          done();
        } catch(e) {
          client.end();
          done(e);
        }
      }, 50);
    });
  });

  it('should write to sockets in the array', (done) => {
    const client = new net.Socket();

    client.connect({ port }, () => {
      // WOWOWOWO Bad
      setTimeout(() => {
        try {
          server.write("TEST");
        } catch(e) {
          client.end();
          done(e);
        }
      }, 50);
    });

    client.on('data', (data) => {
      try {
        expect(data.toString()).to.eql("TEST");
        done();
      } catch(e) {
        client.end();
        done(e);
      }
    });
  });

  it('should remove sockets after closing', (done) => {
    const client = new net.Socket();

    client.connect({ port }, () => {
      // WOWOWOWO Bad
      setTimeout(() => {
        try {
          client.end();
        } catch(e) {
          client.end();
          done(e);
        }
      }, 50);
    });

    client.on('end', (data) => {
      try {
        expect(server.sockets.length).to.eql(0);
        done();
      } catch(e) {
        client.end();
        done(e);
      }
    });
  });
});
