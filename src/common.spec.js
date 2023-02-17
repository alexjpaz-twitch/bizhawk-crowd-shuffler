const { expect } = require('chai');

const common = require('./common');

describe('common', () => {
    describe('filterRomsFromPattern', () => {
        it('should filter roms based on patterns', () => {
            const roms =  [
                '1_Foo.nes',
                '2_Bar.bin',
            ];

            const pattern = "\.bin$";

            const result = roms.filter(common.filterRomsFromPattern(pattern));

            expect(result[0]).to.eql('1_Foo.nes');
            expect(result.length).to.eql(1);
        });

        it('should filter roms based on patterns', () => {
            const roms =  [
                '1_Foo.nes',
                '2_Bar.bin',
            ];

            const pattern = ".bin$";

            const result = roms.filter(common.filterRomsFromPattern(pattern));

            expect(result[0]).to.eql('1_Foo.nes');
            expect(result.length).to.eql(1);
        });


        it('should not filter if the pattern is null', () => {
            const roms =  [
                '1_Foo.nes',
                '2_Bar.bin',
            ];

            const pattern = null;

            const result = roms.filter(common.filterRomsFromPattern(pattern));

            expect(result.length).to.eql(2);
        });

        it('should keep roms based on patterns', () => {
            const roms =  [
                '1_Foo.nes',
                '2_Bar.bin',
            ];

            const pattern = "\.foo$";

            const result = roms.filter(common.filterRomsFromPattern(pattern));

            expect(result.length).to.eql(2);
        });
    });
});