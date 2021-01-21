const config = require('./config');
const assert = require('assert');
const chalk = require('chalk');

const logger = console;

const open = require('open');
const net = require('net');

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

  const switchRom = (rom, cause) => {
    if(!rom) {
      return;
    }
    const romName = rom.replace(/\.[a-zA-Z]+$/, '')

    twitchShufflerListener.say(`/me Swapping to "${romName}" (${cause})`);

    const input = `switchRom\t${rom}\n`;

    server.write(input);
  };

  const list = async () => {
    let roms = await romShuffler.fetchCurrentRoms();

    let filteredRoms = roms
      .map((rom) => rom.replace(/\.[a-zA-Z]+$/, ''))
      .filter((rom) => rom !== 'DeleteMe')
    ;

    let total = filteredRoms.length;

    let partition = filteredRoms;

    const join = () => {
      return partition.join(', ');
    };

    while(join().length >= 500) {
      partition.pop();
    }

    let chatText = `ExtraLife ${join()} (${total}/${total})`;

    return chatText;
  };

  const swap = async (index, cause) => {
    const rom = await romShuffler.shuffle(index);

    if(!rom || rom === '') {
      twitchShufflerListener.say(`/me No rom matches "${index}"`);
    }

    switchRom(rom, cause);
  };

  const startTimer = () => {
    if(!config.timer) {
      logger.info(chalk.blue(`Timer is disabled`));
      return;
    }

    let timeoutId =  null;

    let { min, max } = config.timer;

    logger.info(chalk.blue(`Timer is enabled between ${min / 1000} and ${max / 1000} seconds`));

    function tick() {
      swap(null, "auto timer");
      let timeout = Math.floor(Math.random() * max) + min;

      setTimeout(tick, timeout);
    }

    tick();
  };

  const romShuffler = new RomShuffler();
  const twitchShufflerListener = new TwitchShufflerListener({
    swap,
    list,
  });

  logger.info(chalk.blue(`TCP Server is starting on ${config.host} ${config.port}`));

  await server.start();
  await startBizhawk(config.port, config.host);
  await twitchShufflerListener.start();
  await startTimer();
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
