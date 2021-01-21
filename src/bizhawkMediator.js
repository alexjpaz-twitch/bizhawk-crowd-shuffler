class BizhawkMediator {
  constructor(props = {}) {
    this.server = props.server;
    this.romShuffler = props.romShuffler;
    this.say = props.say;
  }

  async say() {
  }

  async list() {
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
  }

  switchRom(rom, cause) {
    if(!rom) {
      return;
    }
    const romName = rom.replace(/\.[a-zA-Z]+$/, '')

    this.say(`/me Swapping to "${romName}" (${cause})`);

    const input = `switchRom\t${rom}\n`;

    this.server.write(input);
  };

  async swap(index, cause) {
    const rom = await this.romShuffler.shuffle(index);

    if(!rom || rom === '') {
      this.say(`/me No rom matches "${index}"`);
    }

    this.switchRom(rom, cause);
  }

  startTimer() {
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
}

module.exports = {
  BizhawkMediator
};
