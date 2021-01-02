const chalk = require('chalk');
const logger = console;

const open = require('open');
const net = require('net');
const ComfyJS = require("comfy.js");

const port = process.env.PORT || 7070;
const host = process.env.HOST || '127.0.0.1';

const channel = process.env.CHANNEL;

const bizhawkPath = process.env.BIZHAWK_PATH;

const server = net.createServer();

const startBizhawk = (port, host) => {
  // TODO
  open('Start_BizHawk_Listen_To_Crowd_Shuffler.bat');
};

server.listen(port, host, () => {

  startBizhawk(port, host);

  let sockets = [];



  server.on('connection', function(sock) {
    sockets.push(sock);

    sock.on('close', function(data) {
      let index = sockets.findIndex(function(o) {
        return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
      })
      if (index !== -1) sockets.splice(index, 1);
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
  });

  ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
    console.log(user, command, message);

    // TODO - user level checks, last command sent, points, etc
    sockets.forEach((sock) => {
      sock.write(command);
    });
  }

  logger.info(`Connecting to twitch channel ${channel}`);
  ComfyJS.Init(channel);

  console.log(`TCP Server is running on ${host} ${port}`);
});


