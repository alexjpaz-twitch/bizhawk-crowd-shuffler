const config = require('./config');
const { expect } = require('chai');

describe('config', () => {
  beforeEach(() => {
    config.resetConfig();
  });

  afterEach(() => {
    config.resetConfig();
  });

  it('should have a version', () => {
    expect(config.version).to.eql("1");
  });


  it('should order the config correctly', () => {
    let environmentConfig = {
      a: 1,
    };

    let userConfig = {
      b: 1,
    };

    let defaultConfig = {
      c: 1,
    };

    let sessionConfig = {
      d: 1,
    };

    expect(config).to.be.ok;

    let newConfig = config.resetConfig(
      () => defaultConfig,
      () => environmentConfig,
      () => userConfig,
      () => sessionConfig,
    );

    expect(newConfig.a).to.eql(1);
    expect(newConfig.b).to.eql(1);
    expect(newConfig.c).to.eql(1);
    expect(newConfig.a).to.eql(1);
  });

  it('should order the config correctly', () => {
    let defaultConfig = {
      a: 1,
      b: 1,
      c: 1,
    };

    let environmentConfig = {
      b: 2,
    };

    let userConfig = {
      c: 3,
    };

    expect(config).to.be.ok;

    let newConfig = config.resetConfig(
      () => defaultConfig,
      () => environmentConfig,
      () => userConfig,
    );

    expect(newConfig.a).to.eql(1);
    expect(newConfig.b).to.eql(2);
    expect(newConfig.c).to.eql(3);
  });

  it('should order the config correctly', () => {
    let defaultConfig = {
    };

    let environmentConfig = {
      b: 2,
    };

    let userConfig = {
      c: 3,
    };

    expect(config).to.be.ok;

    let newConfig = config.resetConfig(
      () => defaultConfig,
      () => environmentConfig,
      () => userConfig,
    );

    expect(newConfig.a).to.eql(undefined);
    expect(newConfig.b).to.eql(2);
    expect(newConfig.c).to.eql(3);
  });

  it('should load a session config from the folder', () => {
    let c = config.resetConfig(
      () => ({ session: "default" }),
      () => ({ session: "default" }),
      () => ({ session: "default" }),
    );

    expect(c.session).to.eql("default");
    expect(c.sessionName).to.eql("default");
  });
});
