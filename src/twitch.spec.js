const config = require('./config');

const { expect } = require('chai');
const sinon = require('sinon');

const ComfyJS = require("comfy.js");

const { TwitchShufflerListener } = require('./twitch');

const ComfyJSSpy = sinon.spy(ComfyJS, 'Say');

describe('twitch', () => {

  describe('ComfyJS', () => {

    beforeEach(() => {
      ComfyJSSpy.resetHistory();
    });

    it('should say using ComfyJS', () => {
      const listener = new TwitchShufflerListener();

      listener.say("fake_message");
      expect(ComfyJSSpy.called).to.be.true
    });

    it('should not say using ComfyJS when suppressed', () => {
      const listener = new TwitchShufflerListener({
        chatSuppressMessages: true
      });

      listener.say("fake_message");
      expect(ComfyJSSpy.called).to.be.false
    });
  });

  describe('defaults', () => {

    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener();
    });

    it('should NOT swap on sub by default', () => {
      it('should swap on sub gift', () => {
        listener.swap = sinon.spy();
  
        listener.onSubGift(
          "fake_user",
          "fake_message",
          {},
          {
            sinceLastCommand: {
              any: 0
            }
          }
        );
  
        expect(listener.swap.called).to.eql(false);
        expect(listener.swap.calledWith("fake_message")).to.eql(false);
      });
    });

    it('should NOT swap on cheer', () => {
      listener.swap = sinon.spy();

      listener.onCheer(
        "fake_user",
        "fake_message",
        100,
        {

        },
        {
          sinceLastCommand: {
            any: 0
          }
        }
      );

      expect(listener.swap.called).to.eql(false);
    });

  });

  describe('onCommand', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener();
    });

    describe('advanced regex', () => {
      let listener;

      beforeEach(() => {

        listener = new TwitchShufflerListener({
          chatCommand: 'swappy([0-9]*)'
        });
      });

      it('should allow advanced regex usage', async () => {
        listener.swap = sinon.spy();

        listener.isCoolingDown = sinon.spy(() => false);

        await listener.onCommand(
          "fake_user",
          "swappy",
          "123",
          {},
          {
            sinceLastCommand: {
              any: 0
            }
          }
        );

        expect(listener.isCoolingDown.called).to.eql(true);
        expect(listener.swap.called).to.eql(true);
        expect(listener.swap.calledWith("123")).to.eql(true);
      });

      it('should allow the first match to be the argument for swap', async () => {
        listener.swap = sinon.spy();

        listener.isCoolingDown = sinon.spy(() => false);

        await listener.onCommand(
          "fake_user",
          "swappy123",
          "",
          {},
          {
            sinceLastCommand: {
              any: 0
            }
          }
        );

        expect(listener.isCoolingDown.called).to.eql(true);
        expect(listener.swap.called).to.eql(true);
        expect(listener.swap.calledWith("123")).to.eql(true);
      });

      it('should allow the first match to be the argument for swap', async () => {
        listener.swap = sinon.spy();

        listener.isCoolingDown = sinon.spy(() => false);

        await listener.onCommand(
          "fake_user",
          "swappy",
          null,
          {},
          {
            sinceLastCommand: {
              any: 0
            }
          }
        );

        expect(listener.isCoolingDown.called).to.eql(true);
        expect(listener.swap.called).to.eql(true);
        expect(listener.swap.calledWith(null)).to.eql(true);
      });

    });

    describe('list', () => {
      it('should list games on !list', () => {
        listener.list = sinon.spy();

        listener.isCoolingDown = sinon.spy(() => false);

        listener.onCommand(
          "fake_user",
          "list", // TODO
          "fake_message",
          {},
          {
            sinceLastCommand: {
              any: 0
            }
          }
        );

        // expect(listener.isCoolingDown.called).to.eql(true);
        expect(listener.list.called).to.eql(true);
        expect(listener.list.calledWith("fake_message")).to.eql(true);
      });
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

    it('should NOT swap on invalid', () => {
      listener.swap = sinon.spy();

      listener.isCoolingDown = sinon.spy(() => false);

      listener.onCommand(
        "fake_user",
        "invalid", // TODO
        "fake_message",
        {},
        {
          sinceLastCommand: {
            any: 0
          }
        }
      );

      expect(listener.isCoolingDown.called).to.eql(false);
      expect(listener.swap.called).to.eql(false);
      expect(listener.swap.calledWith("fake_message")).to.eql(false);
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

    it('should NOT swap on invalid swap redemption', () => {
      listener.swap = sinon.spy();

      listener.onReward(
        "fake_user",
        "__INVALID__", // TODO
        -1,
        "fake_message"
      );

      expect(listener.swap.called).to.eql(false);
      expect(listener.swap.calledWith("fake_message")).to.eql(false);
    });
  });

  describe('onCheer', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener({
        swapOnCheer: true,
        swapOnCheerMinimumBits: 100
      });
    });

    it('should swap on cheer', () => {
      listener.swap = sinon.spy();

      listener.onCheer(
        "fake_user",
        "fake_message",
        100,
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

    it('should NOT swap on cheer below minimum', () => {
      listener.swap = sinon.spy();

      listener.onCheer(
        "fake_user",
        "fake_message",
        99,
        {},
        {
          sinceLastCommand: {
            any: 0
          }
        }
      );

      expect(listener.swap.called).to.eql(false);
      expect(listener.swap.calledWith("fake_message")).to.eql(false);
    });
  });

  describe('onSub', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener({
        swapOnSub: true
      });
    })

    it('should swap on sub', () => {
      listener.swap = sinon.spy();

      listener.onSub(
        "fake_user",
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

  describe('onSubGift', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener({
        swapOnSubGift: true
      });
    })

    it('should swap on sub gift', () => {
      listener.swap = sinon.spy();

      listener.onSubGift(
        "fake_user",
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

  describe('onSubMysteryGift', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener({
        swapOnSubMysteryGift: true
      });
    })

    it('should swap on sub mystery gift', () => {
      listener.swap = sinon.spy();

      listener.onSubMysteryGift(
        "fake_user",
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

  describe('onSubGiftContinue', () => {
    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener({
        swapOnGiftSubContinue: true
      });
    })

    it('should swap on sub gift continue', () => {
      listener.swap = sinon.spy();

      listener.onSubGiftContinue(
        "fake_user",
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

  describe('onResub', () => {

    let listener;

    beforeEach(() => {
      listener = new TwitchShufflerListener({
        swapOnResub: true
      });
    });

    it('should swap on resub', () => {
      listener.swap = sinon.spy();

      listener.onResub(
        "fake_user",
        "fake_message",
        1,
        1,
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
