const defaults = {
  "port": 7070,
  "host": "127.0.0.1",
  "chatCommand": "^swap$",
  "chatCooldownGlobal": "60000",
  "chatCooldownUser": "60000",
  "redemptionName": "^swap$",
  "randomOnly": false,
};

let environmentConfig = {
  port: process.env.PORT,
  host: process.env.HOST,
  channel: process.env.CHANNEL,
  bizhawkPath: process.env.BIZHAWK_PATH,
  twitchToken: process.env.TWITCH_TOKEN
};



let userConfig = {};

try {
  userConfig = require(process.cwd()+'/config.json');
} catch(e) {
  //
}

const config = Object.assign({},
  environmentConfig,
  userConfig,
  defaults,
);

module.exports = config;


