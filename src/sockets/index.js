const net = require('net');

class SocketServer {

  constructor(props = {}) {
    this.port = props.port;
    this.host = props.host;
    this.sockets = [];
  }

  write(data) {
    this.sockets.forEach((sock) => {
      sock.write(data);
    });
  }

  async start() {

    const server = net.createServer();

    server.on('connection', (sock) => {
      this.sockets.push(sock);

      sock.on('close', (data) => {
        let index = this.sockets.findIndex((o) => {
          return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) this.sockets.splice(index, 1);
      });

    });

    return new Promise((res, reject) => {
      this.server = server.listen(this.port, this.host, () => {
        res(this.server);
      });
    });

  }

  async stop() {
    return new Promise((res, reject) => {
      this.sockets.forEach((sock) => {
        sock.destroy();
      });

      this.server.close(() => {
        res(this.server);
      });
    });
  }
}
module.exports = {
  SocketServer
};
