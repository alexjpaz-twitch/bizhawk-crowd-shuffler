const config = require('./config');

const { expect } = require('chai');
const sinon = require('sinon');

const { TwitchShufflerListener } = require('./twitch');

describe('twitch', () => {

  describe('onCommand', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener();
    });

    it('should swap on !swap', () => {
      listener.swap = sinon.spy();

      listener.isCoolingDown = sinon.spy(() => false);

      listener.onCommand(
        "fake_user",
        "swap", // TODO
        "fake_message",
        {},
        {
          sinceLastCommand: {
            any: 0
          }
        }
      );

      expect(listener.isCoolingDown.called).to.eql(true);
      expect(listener.swap.called).to.eql(true);
      expect(listener.swap.calledWith("fake_message")).to.eql(true);
    });

    it('should swap on swap redemption', () => {
      listener.swap = sinon.spy();

      listener.onReward(
        "fake_user",
        "swap", // TODO
        -1,
        "fake_message"
      );

      expect(listener.swap.called).to.eql(true);
      expect(listener.swap.calledWith("fake_message")).to.eql(true);
    });

    it('should swap on swap redemption', () => {
      listener.swap = sinon.spy();

      listener.onCommand(
        "fake_user",
        "swap", // TODO
        "fake_message",
        {},
        {
          sinceLastCommand: {
            any: 0
          }
        }
      );

      expect(listener.swap.called).to.eql(true);
      expect(listener.swap.calledWith("fake_message")).to.eql(true);
    });
  });

  describe('cooldown', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener();
    });

    it('should not cooldown on first command', () => {
      listener.lastCommandTimestamps = {};

      let isCoolingDown = listener.isCoolingDown(
        "fake_user",
        "fake_command",
        "fake_message",
        {},
      );

      expect(isCoolingDown).to.eql(false);
    });

    describe('display message', () => {
      it('user', () => {
        listener.lastCommandTimestamps = {
          'fake_user': new Date().getTime() - 1000,
        };
        listener.say = sinon.spy();

        const isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(true);
        expect(listener.say.args[0][0]).to.match(/has 59s left/);
      });


      it('global', () => {
        listener.lastCommandTimestamps['$$global$$'] = new Date().getTime();

        listener.say = sinon.spy();

        listener.lastCommandTimestamps['$$global$$'] -= 1000;

        const isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(true);
        expect(listener.say.args[0][0]).to.match(/has 59s left/);
      });
    });

    describe('global+user', () => {
      it('different user', () => {
        const now = new Date().getTime();

        let isCoolingDown;

        const updateIsCoolingDown = (timestamps, user) => {
          listener.lastCommandTimestamps = timestamps;
          isCoolingDown = listener.isCoolingDown(
            user,
            "fake_command",
            "fake_message",
            {},
          );
        };

        updateIsCoolingDown({
          '$$global$$': now - (+config.chatCooldownGlobal) - 1,
          'fake_user1': now - (+config.chatCooldownUser)   - 1,
          'fake_user2': now - (+config.chatCooldownUser)   - 1,
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(false);

        updateIsCoolingDown({
          '$$global$$': now - (+config.chatCooldownGlobal) - 1,
          'fake_user1': now - (+config.chatCooldownUser)   + 1,
          'fake_user2': now - (+config.chatCooldownUser)   - 1,
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(false);

        updateIsCoolingDown({
          '$$global$$': now - (+config.chatCooldownGlobal) + 1,
          'fake_user1': now - (+config.chatCooldownUser)   - 1,
          'fake_user2': now - (+config.chatCooldownUser)   - 1,
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(true);

        updateIsCoolingDown({
          '$$global$$': now - (+config.chatCooldownGlobal) - 1,
          'fake_user1': now - (+config.chatCooldownUser)   - 1,
          'fake_user2': now - (+config.chatCooldownUser)   + 1,
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(true);
     });
    });
  });
});
