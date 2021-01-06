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

      let isCoolingDown = listener.isCoolingDown(
        "fake_user",
        "fake_command",
        "fake_message",
        {},
        {
          sinceLastCommand: {
            any: 0
          }
        }
      );

      expect(isCoolingDown).to.eql(false);
    });

    it('should end cooldown if greater than global', () => {
      let isCoolingDown = listener.isCoolingDown(
        "fake_user",
        "fake_command",
        "fake_message",
        {},
        {
          sinceLastCommand: {
            any: config.chatCooldownGlobal + 1
          }
        }
      );

      expect(isCoolingDown).to.eql(false);
    });

    it('should cooldown if less than global', () => {
      let isCoolingDown = listener.isCoolingDown(
        "fake_user",
        "fake_command",
        "fake_message",
        {},
        {
          sinceLastCommand: {
            any: config.chatCooldownGlobal - 1
          }
        }
      );

      expect(isCoolingDown).to.eql(true);
    });

    it('should cooldown if less than user', () => {
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
      let isCoolingDown = listener.isCoolingDown(
        "fake_user",
        "fake_command",
        "fake_message",
        {},
        {
          sinceLastCommand: {
            user: config.chatCooldownGlobal + 1
          }
        }
      );

      expect(isCoolingDown).to.eql(false);
    });
  });
});
