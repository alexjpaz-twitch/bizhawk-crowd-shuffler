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

    describe('global', () => {
      it('should end cooldown if greater than global', () => {
        let isCoolingDown;

        listener.lastCommandTimestamps = {
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) - 1,
        };

        isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(true);

        listener.lastCommandTimestamps = {
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) + 1,
        };

        isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(false);
      });

      it('should cooldown if less than global', () => {
        listener.lastCommandTimestamps['$$global$$'] = new Date().getTime();

        let isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(true);
      });

      it('should display a message on cooldown', () => {
        listener.lastCommandTimestamps['$$global$$'] = new Date().getTime() + 1000;
        listener.say = sinon.spy();

        listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(listener.say.args[0][0]).to.match(/has 59s left/);
      });
    });

    describe('user', () => {
      it('should cooldown if less than user', () => {

        listener.lastCommandTimestamps = {
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) - 1,
        };

        let isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
          {
            sinceLastCommand: {
              user: config.chatCooldownUser - 1
            }
          }
        );

        expect(isCoolingDown).to.eql(true);
      });

      it('should end cooldown if greater than user', () => {
        let isCoolingDown;

        listener.lastCommandTimestamps = {
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) - 1,
        };

        isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(true);

        listener.lastCommandTimestamps = {
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) + 1,
        };

        isCoolingDown = listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(isCoolingDown).to.eql(false);
      });

      it('should display a message on cooldown', () => {
         listener.lastCommandTimestamps = {
          'fake_user': new Date().getTime() + 1000,
        };
        listener.say = sinon.spy();

        listener.isCoolingDown(
          "fake_user",
          "fake_command",
          "fake_message",
          {},
        );

        expect(listener.say.args[0][0]).to.match(/has 59s left/);
      });

    });

    describe('global+user', () => {
      it('same user', () => {
        let isCoolingDown;

        const updateIsCoolingDown = (timestamps) => {
          listener.lastCommandTimestamps = timestamps;
          isCoolingDown = listener.isCoolingDown(
            "fake_user",
            "fake_command",
            "fake_message",
            {},
          );
        };

        updateIsCoolingDown({
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) - 1,
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) - 1,
        });

        expect(isCoolingDown).to.eql(true);

        updateIsCoolingDown({
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) + 1,
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) - 1,
        });

        expect(isCoolingDown).to.eql(true);

        updateIsCoolingDown({
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) - 1,
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) + 1,
        });

        expect(isCoolingDown).to.eql(true);

        updateIsCoolingDown({
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) + 1,
          'fake_user': new Date().getTime() + (+config.chatCooldownUser) + 1,
        });

        expect(isCoolingDown).to.eql(false);
      });

      it('different user', () => {
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
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) - 1,
          'fake_user1': new Date().getTime() + (+config.chatCooldownUser) - 1,
          'fake_user2': new Date().getTime() + (+config.chatCooldownUser) - 1,
        }, 'fake_user1');

        expect(isCoolingDown).to.eql(true);

        updateIsCoolingDown({
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) + 1,
          'fake_user1': new Date().getTime() + (+config.chatCooldownUser) + 1,
          'fake_user2': new Date().getTime() + (+config.chatCooldownUser) - 1,
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(true);

        updateIsCoolingDown({
          '$$global$$': new Date().getTime() + (+config.chatCooldownGlobal) + 1,
          'fake_user1': new Date().getTime() + (+config.chatCooldownUser) - 1,
          'fake_user2': new Date().getTime() + (+config.chatCooldownUser) + 1,
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(false);

        updateIsCoolingDown({
        }, 'fake_user2');

        expect(isCoolingDown).to.eql(false);
      });

    });
  });
});
