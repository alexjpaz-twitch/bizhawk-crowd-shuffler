const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const HttpServer = ({ configService }) => {
  const app = express();

  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname,'public')));

  app.get('/api/config', (req, res) => {
    res.json(configService.get());
  });

  app.post('/api/config', (req, res) => {
    configService.set(req.body);
    res.sendStatus(201);
  });

  return app;
};

module.exports = HttpServer;
