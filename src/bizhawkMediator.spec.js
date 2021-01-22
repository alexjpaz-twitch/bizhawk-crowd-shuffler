const { BizhawkMediator } = require('./bizhawkMediator');
const { Server } = require('./server');

const { expect } = require('chai');
const sinon = require('sinon');

xdescribe('@wip2 BizhawkMediator', () => {
  it('construct', () => {
    new BizhawkMediator();
  });

  it('should send a list ', () => {
    const server = {
    };

    const mediator = new BizhawkMediator({
      server
    });
  });
});
