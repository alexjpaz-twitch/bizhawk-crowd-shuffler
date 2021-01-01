const net = require('net');
const ComfyJS = require("comfy.js");

const port = process.env.PORT || 7070;
//const host = '127.0.0.1';
const host = process.env.host || '0.0.0.0';

const channel = process.env.channel;

const server = net.createServer();

server.listen(port, host, () => {

  let sockets = [];

  server.on('connection', function(sock) {
    sockets.push(sock);

    sock.on('data', function(data) {
      console.log('DATA ' + sock.remoteAddress + ': ' + data);
      // Write the data back to all the connected, the client will receive it as data from the server
      sockets.forEach(function(sock, index, array) {
        sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
      });
    });

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
  ComfyJS.Init(channel);
  console.log(`TCP Server is running on ${host} ${port}`);
});


