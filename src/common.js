
exports.filterRomsFromPattern = (ignoreRomsPattern) => (rom) => {
    if(!ignoreRomsPattern) {
        return true;
    } else {
        const ignoreRomsRegExp = new RegExp(ignoreRomsPattern);
        console.log(ignoreRomsRegExp.test(rom), rom)
        return (ignoreRomsRegExp.test(rom) === false);
    }
}