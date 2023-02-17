const { BizhawkMediator } = require('./bizhawkMediator');
const { Server } = require('./server');

const { expect } = require('chai');
const sinon = require('sinon');

describe('BizhawkMediator', () => {
  it('construct', () => {
    new BizhawkMediator();
  });

  it('should send a list ', async () => {
    const romShuffler = {
      fetchCurrentRoms: async () => {
        return [
          "A.nes",
          "B.nes",
          "C.nes",
        ]
      }
    };

    const mediator = new BizhawkMediator({
      romShuffler,
    });

    const chatText = await mediator.list();

    expect(chatText).match(/A, B, C/);
    expect(chatText).match(/\(3\/3\)/);
  });

  it('should swap', async () => {
    const say = sinon.spy();

    const romShuffler = {
      shuffle: sinon.spy(async (index) => "A.nes"),
    };

    const server = {
      write: sinon.spy()
    };

    const mediator = new BizhawkMediator({
      server,
      say,
      romShuffler,
    });

    await mediator.swap("A.nes", "via test");

    expect(romShuffler.shuffle.calledWith("A.nes")).to.eql(true);
    expect(say.args[0][0]).to.match(/"A"/);
    expect(say.args[0][0]).to.match(/via test/);
    expect(server.write.calledWith("switchRom\tA.nes\n")).to.eql(true);
  });
});
