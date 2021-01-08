const logger = console;

const fs = require('fs').promises;
const chalk = require('chalk');

const config = require('./config');

const isRNG = (t) => new RegExp(config.redepmtionRandomText).test(t);

class RomShuffler {
  constructor() {
    this.state = {};
  }

  async fetchCurrentRoms() {
    let roms = await fs.readdir("CurrentRoms");

    return roms;
  }

  async shuffle(index) {
    try {
      let roms = await this.fetchCurrentRoms();

      if(config.randomOnly) {
        index = null;
      }

      if(index) {
        index = index.trim();
      }

      if(index && index !== '' && !isRNG(index)) {
        roms = roms
          .filter((rom) => rom.toLowerCase().startsWith(index.toLowerCase()));
      } else {
        roms = roms
          .filter((rom) => rom !== this.state.currentRom)
          .filter((rom) => rom !== 'DeleteMe');
      }

      const rom = roms[Math.floor(Math.random() * roms.length)];
      this.state.currentRom = rom;

      logger.info(chalk.green(`Switching to ${this.state.currentRom}`));
      return rom;
    } catch(e) {
      logger.error(e);
    }

  }
}

module.exports = {
  RomShuffler
};
