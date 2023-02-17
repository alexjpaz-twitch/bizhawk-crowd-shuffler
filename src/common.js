
exports.filterRomsFromPattern = (ignoreRomsPattern) => (rom) => {
    if(!ignoreRomsPattern) {
        return true;
    } else {
        const ignoreRomsRegExp = new RegExp(ignoreRomsPattern);
        return (ignoreRomsRegExp.test(rom) === false);
    }
}