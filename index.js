const assert = require('assert');
const chalk = require('chalk');

const logger = console;

console.log = (e) => console.info(chalk.cyan(e));

const open = require('open');
const net = require('net');
const ComfyJS = require("comfy.js");

const port = process.env.PORT || 7070;
const host = process.env.HOST || '127.0.0.1';

const channel = process.env.CHANNEL;

const bizhawkPath = process.env.BIZHAWK_PATH;

const twitchToken = process.env.TWITCH_TOKEN;

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
    logger.error(chalk.yellow("Script not run in Windows. Starting the BizHawk process is a no-op"));
  }
};

const main = () => {
  precondition(channel, "channel must be provided");
  precondition(port, "port must be provided");
  precondition(host, "host must be provided");

  logger.info(chalk.blue(`TCP Server is starting on ${host} ${port}`));

  server.listen(port, host, () => {

    logger.info(chalk.green(`Shuffler Server Started`));

    startBizhawk(port, host);

    let sockets = [];

    server.on('connection', function(sock) {
      sockets.push(sock);

      const ping = () => {
        sockets.forEach((sock) => {
          sock.write("ping");
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

    let state = {
      currentRom: null,
    };

    server.on('data', function(data) {
      logger.info(chalk.purple(data));
    });

    const switchRom = (rom) => {
      ComfyJS.Say(`/me Swapping to "${rom}"`);
      sockets.forEach((sock) => {
        sock.write(`switchRom\t${rom}`);
      });
    };

    const swap = async (index) => {
      try {
        let roms = await fs.readdir("CurrentRoms");

        roms = roms.filter((rom) => rom !== state.currentRom);

        const rom = roms[Math.floor(Math.random() * roms.length)];

        state.currentRom = rom;

        switchRom(state.currentRom);
      } catch(e) {
        logger.error(e);
      }
    };

    ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
      if(command === 'swap') {
        swap(message);
      }
    }

    ComfyJS.onReward = ( user, reward, cost, extra ) => {
      if(command === 'swap') {
        swap(extra);
      }
    }

    logger.info(chalk.blue(`Connecting to twitch channel ${channel}`));

    if(!twitchToken) {
      logger.warn(chalk.yellow("No twitch token provided. Chat response and reward responses will not be enabled."));
    }

    ComfyJS.onConnected = () => {
      logger.info(chalk.green("Connected to twitch", channel));
    }

    ComfyJS.Init(channel, twitchToken);
  });

}

main();
