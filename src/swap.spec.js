const config = require('./config');

const { expect } = require('chai');
const sinon  = require('sinon');

const { RomShuffler } = require('./swap');

describe('swap', () => {
  it('construct', () => {
    const shuffler = new RomShuffler();
  });

  it('should return the identity when the rom set is 1', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      'Foo.nes',
    ]);

    const rom = await shuffler.shuffle();

    expect(rom).to.eql('Foo.nes');

    expect(shuffler.fetchCurrentRoms.called).to.eql(true);
  });

  it('should return a rom that is not the current rom', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      'Foo.nes',
      'Bar.nes'
    ]);

    shuffler.state = {
      currentRom: 'Foo.nes'
    };

    const rom = await shuffler.shuffle();

    expect(rom).not.to.eql('Foo.nes');

    expect(shuffler.fetchCurrentRoms.called).to.eql(true);
  });

  it('should ignore certain files', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      'Foo.nes',
      'DeleteMe',
    ]);

    const rom = await shuffler.shuffle();

    expect(rom).not.to.eql('DeleteMe');

    expect(shuffler.fetchCurrentRoms.called).to.eql(true);
  });

  it('should return a specific rom if it matches a filter value', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      'Foo.nes',
      'Bar.nes'
    ]);

    const rom = await shuffler.shuffle('F');

    expect(rom).to.eql('Foo.nes');
  });

  it('should return a specific rom if it matches a filter value', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      'Foo.nes',
      'Bar.nes'
    ]);

    const rom = await shuffler.shuffle('Foo');

    expect(rom).to.eql('Foo.nes');
  });

  it('should return a specific rom if it matches a filter value', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      'Foo.nes',
      'Bar.nes'
    ]);

    const rom = await shuffler.shuffle('foo');

    expect(rom).to.eql('Foo.nes');
  });

  it('should return a specific rom if it matches a filter value', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '2_Bar.nes'
    ]);

    const rom = await shuffler.shuffle('1');

    expect(rom).to.eql('1_Foo.nes');
  });

  it('should return a specific rom if it matches a filter value (hack to fix the numeral code issue', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '11111_Bar.nes',
      '11_Bar.nes',
      '11_Bar.nes',
      '11111111_Bar.nes',
      '11_Bar.nes',
      '11_Bar.nes',
      '111_Bar.nes',
      '111_Bar.nes',
      '111_Bar.nes',
    ]);

    const rom = await shuffler.shuffle('1');

    expect(rom).to.eql('1_Foo.nes');
  });

  it('should return a specific rom if it matches a filter value (token separator parts)', async () => {

    const shuffler = new RomShuffler();

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '2_Bar.nes'
    ]);

    const rom = await shuffler.shuffle('Foo');

    expect(rom).to.eql('1_Foo.nes');
  });



  it('should be random on null', async () => {

    const shuffler = new RomShuffler();

    shuffler.state = {
      currentRom: '1_Foo.nes'
    };

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '2_Bar.nes'
    ]);

    const rom = await shuffler.shuffle(null);

    expect(rom).to.eql('2_Bar.nes');
  });


  it('should be random on empty', async () => {

    const shuffler = new RomShuffler();

    shuffler.state = {
      currentRom: '1_Foo.nes'
    };

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '2_Bar.nes'
    ]);

    const rom = await shuffler.shuffle('');

    expect(rom).to.eql('2_Bar.nes');
  });


  it('should be random on empty', async () => {

    const shuffler = new RomShuffler();

    shuffler.state = {
      currentRom: '1_Foo.nes'
    };

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '2_Bar.nes'
    ]);

    const rom = await shuffler.shuffle('   ');

    expect(rom).to.eql('2_Bar.nes');
  });

  it('should be random on "rng"', async () => {

    const shuffler = new RomShuffler();

    shuffler.state = {
      currentRom: '1_Foo.nes'
    };

    shuffler.fetchCurrentRoms = sinon.spy(() => [
      '1_Foo.nes',
      '2_Bar.nes'
    ]);

    const rng = "rng" // TODO

    const rom = await shuffler.shuffle(rng);

    expect(rom).to.eql('2_Bar.nes');
  });
});
