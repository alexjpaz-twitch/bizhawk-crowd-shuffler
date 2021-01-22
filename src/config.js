const logger = console;

const merge = require('lodash/merge');

let config = null;

const path = require('path');
const fs = require('fs');

const loadConfigFromFile = (configPath) => {
  let newConfig = {};

  try {
    newConfig = JSON.parse(fs.readFileSync(configPath).toString());
  } catch(e) {
    logger.warn("Failed to load config from file", e.message);
  }

  return newConfig;

};

const getEnvironmentConfig = () => {
  let environmentConfig = {
    port: process.env.PORT,
    host: process.env.HOST,
    channel: process.env.CHANNEL,
    session: process.env.session,
    bizhawkPath: process.env.BIZHAWK_PATH,
    twitchToken: process.env.TWITCH_TOKEN
  };

  return environmentConfig;
};

const getUserConfig = () => {
  return loadConfigFromFile(path.join(process.cwd(), "config.json"));
};

const getDefaultConfig = () => {
  const defaults = {
    "version": "1",
    "port": 7070,
    "host": "127.0.0.1",
    "chatCommand": "^swap$",
    "chatListCommand": "^list$",
    "chatCooldownGlobal": "60000",
    "chatCooldownUser": "60000",
    "redemptionName": "^swap$",
    "redepmtionRandomText": "^rng$",
    "randomOnly": false,
    "session": "default",
    "timer": {
      "min": 5000,
      "max": 60000
    }
  };

  return defaults;
};

const getSessionConfig = ({ session }) => {
  if(!session) {
    return {};
  }

  const configPath = path.join(process.cwd(), 'sessions', session, 'config.json');
  return loadConfigFromFile(configPath);
};

function filterObject(obj) {
    const ret = {};
    Object.keys(obj)
        .filter((key) => obj[key] !== undefined)
        .forEach((key) => ret[key] = obj[key]);
    return ret;
}

const resetConfig = (
  defaultConfigProvider = () => getDefaultConfig(),
  environmentConfigProvider = () => getEnvironmentConfig(),
  userConfigProvider = () => getUserConfig(),
  sessionConfigProvider = (s) => getSessionConfig(s),
) => {
  config = {};

  merge(
    config,
    defaultConfigProvider(),
    environmentConfigProvider(),
    userConfigProvider(),
  );

  merge(
    config,
    getSessionConfig(config),
  );

  config.resetConfig = resetConfig;
  config.getDefaultConfig = getDefaultConfig;
  config.getUserConfig = getUserConfig;
  config.getEnvironmentConfig = getEnvironmentConfig;
  config.getSessionConfig = getSessionConfig;

  return config;
};

resetConfig();

console.log(JSON.stringify(config, null, 2));

module.exports = config;

module.exports.load


