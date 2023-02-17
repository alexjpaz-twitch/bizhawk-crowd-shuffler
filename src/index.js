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

  async run() {
    // 1. Start a socket server. This is the socket server that Bizhawk will listen to
    let server = new SocketServer({
      host: this.config.host, // Since this is internal maybe just bind to any available port
      port: this.config.port, //
    });

    logger.info(chalk.blue(`TCP Server is starting on ${this.config.host} ${this.config.port}`));

    await server.start();

    // 2. Create a RomShuffler. This is a service to manage the rom state
    const romShuffler = new RomShuffler();

    // 3. Create a Mediator. This will mediate state between the rom shuffler, twitch, and bizhawk.
    const say = (message) => ComfyJS.Say(message);

    const bizhawkMediator = new BizhawkMediator({
      server,
      romShuffler,
      say,
    });

    // 3. Twitch shuffler listener. This listens for !swap command and calls injected functions
    const twitchShufflerListener = new TwitchShufflerListener({
      swap: (index, cause) => bizhawkMediator.swap(index, cause),
      list: () => bizhawkMediator.list(),
    });

    await twitchShufflerListener.start();

    // 4. Finally start the bizhawk process
    await bizhawkMediator.startBizhawkProcess(this.config.port, this.config.host);
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
