const config = require('./config');
const assert = require('assert');
const chalk = require('chalk');

const logger = console;

const open = require('open');
const net = require('net');

const { RomShuffler } = require('./swap');
const { TwitchShufflerListener } = require('./twitch')

const server = net.createServer();

const fs = require('fs').promises;

const precondition = (expression, message) => {
  try {
    assert(expression)
  } catch(e) {
    const error = new Error(message || e.message);
    throw error;
  }
}

const startBizhawk = (port, host) => {
  // TODO
  const isWin = process.platform === "win32";
  if(isWin) {
    open('Start_BizHawk_Listen_To_Crowd_Shuffler.bat');
    logger.info(chalk.green("Bizhawk started"));
  } else {
    logger.error(chalk.yellow("Script not run in Windows. Starting the BizHawk process is a no-op: "));
  }
};

const startServer = async () => {
  let sockets = [];

  const switchRom = (rom) => {
    if(!rom) {
      return;
    }
    const romName = rom.replace(/\./g, '_');

    twitchShufflerListener.say(`/me Swapping to "${romName}"`);
    sockets.forEach((sock) => {
      sock.write(`switchRom\t${rom}\n`);
    });
  };

  const swap = async (index) => {
    const rom = await romShuffler.shuffle(index);

    switchRom(rom);
  };

  const romShuffler = new RomShuffler();
  const twitchShufflerListener = new TwitchShufflerListener({ swap });

  logger.info(chalk.blue(`TCP Server is starting on ${config.host} ${config.port}`));

  server.listen(config.port, config.host, async () => {

    logger.info(chalk.green(`Shuffler Server Started`));

    await startBizhawk(config.port, config.host);
    await twitchShufflerListener.start();


    server.on('connection', function(sock) {
      sockets.push(sock);

      const ping = () => {
        sockets.forEach((sock) => {
          sock.write("ping\n");
        });

        setTimeout(ping, 2000);
      };

      ping();

      sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
          return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
      });
    });

    server.on('data', function(data) {
      logger.info(chalk.purple(data));
    });

    });

}

async function main() {
  try {
    await startServer();
  } catch(e) {
    logger.error(e);
    process.exit(1);
  }
}

main();
