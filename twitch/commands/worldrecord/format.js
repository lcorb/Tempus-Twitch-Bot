const utils = require(`../../../utils`);

/**
 * Formats authors into string.
 * @param {object} mapObj Map response object
 * @param {string} tf2Class Class identifier (both, solly, demo)
 * @return {string} Return string of authors
 */
function parseWR(mapObj, tf2Class = 'both') {
  const runs = [];
  if (tf2Class === `both`) {
    if (mapObj.demoman_runs[0] === undefined && mapObj.soldier_runs[0] === undefined) {
      return `No records have been set.`;
    } else {
        mapObj.demoman_runs[0] === undefined ? runs.push(`(D) No record currently set.`) :
        runs.push(`(D) ${mapObj.demoman_runs[0].name} - ${utils.timePrettifier(mapObj.demoman_runs[0].duration)}`);
      mapObj.soldier_runs[0] === undefined ? runs.push(`(S) No record currently set.`) :
        runs.push(`(S) ${mapObj.soldier_runs[0].name} - ${utils.timePrettifier(mapObj.soldier_runs[0].duration)}`);
    }
    return runs.join(` | `);
  } else {
    return (mapObj[tf2Class + `_runs`][0] === undefined ?
        `(${utils.classSymbol(tf2Class)}) No record currently set.` :
        (`(${utils.classSymbol(tf2Class)}) ${mapObj[tf2Class + `_runs`][0].name} - ${utils.timePrettifier(mapObj[tf2Class + `_runs`][0].duration)}`));
  }
}

module.exports = parseWR;
