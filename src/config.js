const logger = console;

let config = null;

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
  let userConfig = {};

  try {
    userConfig = require(process.cwd()+'/config.json');
  } catch(e) {
    //
  }

  return userConfig;
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

const resetConfig = (
  defaultConfig = getDefaultConfig(),
  environmentConfig = getEnvironmentConfig(),
  userConfig = getUserConfig(),
) => {
  config = {};

  Object.assign(config,
    defaultConfig,
    environmentConfig,
    userConfig,
  );

  config.resetConfig = resetConfig;
  config.getDefaultConfig = getDefaultConfig;
  config.getUserConfig = getUserConfig;
  config.getEnvironmentConfig = getEnvironmentConfig;

  return config;
};

resetConfig();

console.log(JSON.stringify(config, null, 2));

module.exports = config;


