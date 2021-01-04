const assert = require('assert');
const chalk = require('chalk');

const logger = console;

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

const defaults = {
  "chatCommand": "^swap$",
  "chatCooldownGlobal": "60000",
  "chatCooldownUser": "60000",
  "redemptionName": "^swap$",
  "randomOnly": false,
};

let userConfig = {};

try {
  userConfig = require(process.cwd()+'/config.json');
} catch(e) {
  //
}

let config = { ...defaults, ...userConfig };

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

    let state = {
      currentRom: null,
    };

    server.on('data', function(data) {
      logger.info(chalk.purple(data));
    });

    const switchRom = (rom) => {
      if(!rom) {
        return;
      }
      const romName = rom.replace(/\./g, '_');
      ComfyJS.Say(`/me Swapping to "${romName}"`);
      sockets.forEach((sock) => {
        sock.write(`switchRom\t${rom}\n`);
      });
    };

    const swap = async (index) => {
      try {
        let roms = await fs.readdir("CurrentRoms");

        if(config.randomOnly) {
          index = null;
        }

        if(index) {
          roms = roms
            .filter((rom) => rom.startsWith(index));
        } else {
          roms = roms
            .filter((rom) => rom !== state.currentRom)
            .filter((rom) => rom !== 'DeleteMe');
        }

        const rom = roms[Math.floor(Math.random() * roms.length)];
        state.currentRom = rom;

        logger.info(chalk.green(`Switching to ${state.currentRom}`));
        switchRom(state.currentRom);
      } catch(e) {
        logger.error(e);
      }
    };

    const chatCommandRegExp = new RegExp(config.chatCommand);
    const rewardNameRegExp = new RegExp(config.rewardNameRegExp);

    ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
      if(chatCommandRegExp.test(command)) {
        if(extra.sinceLastCommand.any > 0 && extra.sinceLastCommand.any <= config.chatCooldownGlobal) {
          // noop
        } else if(extra.sinceLastCommand.any > 0 && extra.sinceLastCommand.user <= config.chatCooldownUser) {
          // noop
        } else {
          swap(message);
        }
      }
    }

    ComfyJS.onReward = ( user, reward, cost, extra ) => {
      if(rewardNameRegExp.test(reward)) {
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
