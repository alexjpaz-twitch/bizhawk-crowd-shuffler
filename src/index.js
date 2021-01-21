const config = require('./config');
const assert = require('assert');
const chalk = require('chalk');

const ComfyJS = require("comfy.js");

const logger = console;

const open = require('open');
const net = require('net');

const { BizhawkMediator } = require('./bizhawkMediator');
const { RomShuffler } = require('./swap');
const { TwitchShufflerListener } = require('./twitch')

const { Server } = require('./server');

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

    if(!process.env.session) {
      process.env.session = config.session;
    }

    open('Start_BizHawk_Listen_To_Crowd_Shuffler.bat');
    logger.info(chalk.green("Bizhawk started"));
  } else {
    logger.error(chalk.yellow("Script not run in Windows. Starting the BizHawk process is a no-op: "));
  }
};

const startServer = async () => {
  let server = new Server();

  const say = (message) => ComfyJS.Say(message);

  const romShuffler = new RomShuffler();

  const bizhawkMediator = new BizhawkMediator({
    server,
    romShuffler,
    say,
  });

  const twitchShufflerListener = new TwitchShufflerListener({
    swap: (index, cause) => bizhawkMediator.swap(index, cause),
    list: () => bizhawkMediator.list(),
  });

  logger.info(chalk.blue(`TCP Server is starting on ${config.host} ${config.port}`));

  await server.start();
  await twitchShufflerListener.start();

  await startBizhawk(config.port, config.host);
};

async function main() {
  try {
    await startServer();
  } catch(e) {
    logger.error(e);
    process.exit(1);
  }
}

main();
