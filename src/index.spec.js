const { expect } = require('chai');
const sinon = require('sinon');

const { Application } = require('./');

describe('Application', () => {
  it('construct', () => {
    new Application();
  });

  it('should construct a mediator', async () => {
    const app =  new Application();

    await buildBizhawkMediator();
  });
});
