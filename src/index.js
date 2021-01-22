const config = require('./config');

const logger = require('./logger');

const chalk = require('chalk');

const ComfyJS = require("comfy.js");

const { BizhawkMediator } = require('./bizhawkMediator');
const { RomShuffler } = require('./swap');
const { TwitchShufflerListener } = require('./twitch')

const { SocketServer } = require('./sockets');

const defaultConfiguration = () => ({
  config
});

class Application {
  constructor(args = defaultConfiguration()) {
    this.config = args.config;
    this.environment = {};
  }

  async bootstrap() {
  }

  async buildBizhawkMediator(romShuffler) {
    let server = new Server({
      host: this.config.host,
      port: this.config.port,
    });

    const say = (message) => ComfyJS.Say(message);

    const bizhawkMediator = new BizhawkMediator({
      server,
      romShuffler,
      say,
    });

    await server.start();

    return bizhawkMediator;
  }

  async run() {
    // 1. Start a socket server. This is the socket server that Bizhawk will listen to
    let server = new Server({
      host: this.config.host,
      port: this.config.port,
    });

    await server.start();

    // 2. Create a RomShuffler. This is a service to manage the rom state
    const romShuffler = new RomShuffler();

    //const bizhawkMediator = await this.buildBizhawkMediator(romShuffler);

    // 3. Twitch shuffler listener. This listens for !swap command and calls injected functions
    const twitchShufflerListener = new TwitchShufflerListener({
      swap: (index, cause) => bizhawkMediator.swap(index, cause),
      list: () => bizhawkMediator.list(),
    });

    //logger.info(chalk.blue(`TCP Server is starting on ${this.config.host} ${this.config.port}`));

    //await twitchShufflerListener.start();

    //await bizhawkMediator.startBizhawkProcess(this.config.port, this.config.host);
  }

  static async main() {
    const app = new Application();

    try {
      await app.bootstrap();
      await app.run();
    } catch(e) {
      logger.error(e);
      process.exit(1);
    }
  }
}

if (require.main === module) {
    Application.main();
}

exports.Application = Application;
