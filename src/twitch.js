const logger = console;
const chalk = require('chalk');

const config = require('./config');

const ComfyJS = require("comfy.js");

const chatCommandRegExp = new RegExp(config.chatCommand);

const rewardNameRegExp = new RegExp(config.rewardNameRegExp);

class TwitchShufflerListener {
  constructor(props = {}) {
    this.swap = props.swap;

    this.lastCommandTimestamps = {};
  }

  async say(text) {
    ComfyJS.Say(text);
  }

  isCoolingDown(user, command, message, flags, extra) {
    let isCoolingDown = true;

    const now = new Date().getTime();

    let lastCommandTimestamp = this.lastCommandTimestamps[user] || 0;
    let lastCommandTimestampGlobal = this.lastCommandTimestamps['$$global$$'] || 0;

    if(config.chatCooldownGlobal && lastCommandTimestampGlobal > 0 && (lastCommandTimestampGlobal - now) <= config.chatCooldownGlobal) {
      let cooldownLeft = -1;
      logger.info(chalk.grey(`Ignoring swap due to the global cooldown ${cooldownLeft}`));
      this.say(`@${user} command ${command} has ${cooldownLeft}s left the cooldown.`);
    } else if(config.chatCooldownUser && lastCommandTimestamp > 0 && (lastCommandTimestamp - now) <= config.chatCooldownUser) {
      let cooldownLeft = -1;
      logger.info(chalk.grey(`Ignoring swap due to the user cooldown ${cooldownLeft}`));
      this.say(`@${user} command ${command} has ${cooldownLeft}s left the cooldown.`);
    } else {
      isCoolingDown = false;
    }

    return isCoolingDown;
  }

  async onCommand( user, command, message, flags, extra ) {
    if(chatCommandRegExp.test(command)) {
      const isCoolingDown = this.isCoolingDown(user, command, message, flags, extra);

      if(!isCoolingDown) {
        this.lastCommandTimestamps['$$global$$'] = new Date().getTime();
        this.lastCommandTimestamps[user] = new Date().getTime();
        this.swap(message, `${user} via command`);
      }
    }
  }

  async onReward( user, reward, cost, extra ) {
    if(rewardNameRegExp.test(reward)) {
      this.swap(extra, `${user} via reward`);
    }
  }

  async start() {

    if(!config.channel) {
      logger.warn(chalk.yellow("No twitch channel specified"));
      return;
    }
    ComfyJS.onCommand = this.onCommand.bind(this);
    ComfyJS.onReward = this.onReward.bind(this);

    logger.info(chalk.blue(`Connecting to twitch channel ${config.channel}`));

    if(!config.twitchToken) {
      logger.warn(chalk.yellow("No twitch token provided. Chat response and reward responses will not be enabled."));
    }

    ComfyJS.onConnected = () => {
      logger.info(chalk.green("Connected to twitch", config.channel));
    }

    ComfyJS.Init(config.channel, config.twitchToken);
  }
}

module.exports ={
  TwitchShufflerListener
};
