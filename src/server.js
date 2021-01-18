class Server {

  constructor(props = {}) {
    this.port = props.port;
    this.host = props.host;
  }

  async start() {
    this.server = await server.listen(config.port, config.host);
  }

  async stop() {
    this.server.close();
  }
}
module.exports = {
  Server
};
