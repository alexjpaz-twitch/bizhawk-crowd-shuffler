const express = require('express');
const HttpServer = require('./');
const supertest = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

describe('@wip HttpServer', () => {
  let request;
  let configService;
  let currentConfig;

  describe('public', () => {
    beforeEach(() => {
      const app = express();

      app.use(HttpServer({
      }));

      request = supertest(app);
    });

    it('@wip should show an index.html', async () => {
      const { text } = await request.get('/');

      expect(text).to.match(/data-app='bizhawk-crowd-shuffler/)
    });
  });

  describe('config', () => {

    beforeEach(() => {
      const app = express();

      currentConfig = {
        version: 1,
      };

      configService = {};

      configService.get = sinon.spy(() => currentConfig);
      configService.set = sinon.spy((inputConfig) => {
        console.log(inputConfig);
        currentConfig = Object.assign({}, currentConfig, inputConfig);
      });

      app.use(HttpServer({
        configService
      }));

      request = supertest(app);
    });

    it('get config', async () => {
      const { body } = await request.get('/api/config');

      expect(body.version).to.eql(1);

      expect(configService.get.called).to.eql(true);
    });

    it('set config', async () => {
      let body, code;

      ({ body, statusCode } = await request.get('/api/config'));

      expect(body.version).to.eql(1);
      expect(statusCode).to.eql(200);
      expect(configService.get.called).to.eql(true);

      ({ body, statusCode } = await request.post('/api/config')
        .send({
          version: 2
        }));

      expect(statusCode).to.eql(201);
      expect(configService.set.called).to.eql(true);

      ({ body, statusCode } = await request.get('/api/config'));
      expect(body.version).to.eql(2);
      expect(statusCode).to.eql(200);
    });
  });
});
