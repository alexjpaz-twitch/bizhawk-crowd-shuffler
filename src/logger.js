const chalk = require('chalk');

let logger = console;

//logger.info = () => {
  //let args = Array.prototype.slice.call(arguments);
  //args = args.map((v) => chalk.blue(v));
  //appender.info.apply(appender, args);
//};

module.exports = logger;
