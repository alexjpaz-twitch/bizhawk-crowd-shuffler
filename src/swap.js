const logger = console;

const fs = require('fs').promises;
const chalk = require('chalk');

const config = require('./config');

const isRNG = (t) => new RegExp(config.redepmtionRandomText).test(t);

const TOKEN_SEPARATOR = "_";

class RomShuffler {
  constructor() {
    this.state = {};
    this.randomIfNoMatch = config.randomIfNoMatch;
    this.randomOnly = config.randomOnly;
  }

  async fetchCurrentRoms() {
    let roms = await fs.readdir(`./sessions/${config.session}/CurrentRoms`);

    return roms;
  }

  async shuffle(index) {
    try {
      let roms = await this.fetchCurrentRoms();

      if(this.randomOnly) {
        index = null;
      }

      if(index) {
        index = index.trim();
      }

      if(index && index !== '' && !isRNG(index)) {
        roms = roms
          .filter((rom) => {
            const p = rom.split(TOKEN_SEPARATOR);

            console.log(p, index);
            if(p[0] && p[0] === index) {
              return true;
            }

            if(p[1] && p[1].startsWith(index)) {
              return true;
            }

            return rom.toLowerCase().startsWith(index.toLowerCase());
          });

        if(roms.length > 1) {
          roms = roms.filter((rom) => rom.split(TOKEN_SEPARATOR)[0] === index);
        }
      } else {
        roms = roms
          .filter((rom) => rom !== this.state.currentRom)
          .filter((rom) => rom !== 'DeleteMe');
      }

      let rom = roms[Math.floor(Math.random() * roms.length)];

      if(!rom && this.randomIfNoMatch) {
        rom = await this.shuffle(null);
      } 
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
