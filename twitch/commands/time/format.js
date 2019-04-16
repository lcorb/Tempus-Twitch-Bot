const utils = require('../utils.js');

/**
 * Formats zone/class time into string.
 * @param {object} mapObj User who initiated command
 * @param {string} tf2Class String to determine which class to return time for (both, solly, demo)
 * @param {int} position Position of run to retrieve
 * @param {string} zone String to determine which zone type to return time for (map, bonus, course, trick)
 * @param {string} map Map name
 * @param {boolean} exact Determines whether to format/truncate time or print the exact time
 * @return {string} Return string detailing the requested time
 */
function parseTime(mapObj, tf2Class = 'both', position = 1, zone = 'map', map = null, exact = false) {
  return new Promise(function(resolve, reject) {
    position -= 1;
    if (tf2Class === 'both') {
      const demoRun = mapObj.results.demoman.length === 0 ? `No demoman run found`:
        `[# ${position}]` + (zone !== `map` ? `${utils.classSymbol(zone)}${mapObj.zone_info.zoneindex}` : ``) + `${map} -
         (D) ${mapObj.results.demoman[0].name} - ` +
         + (exact === true ? mapObj.results.demoman[0].duration + `s`: utils.timePrettifier(mapObj.results[tf2Class][0].duration));

      const soldierRun = mapObj.results.soldier.length === 0 ? `No soldier run found`:
         `(S) ${mapObj.results.soldier[0].name} - ` +
         + (exact === true ? mapObj.results.soldier[0].duration + `s`: utils.timePrettifier(mapObj.results[tf2Class][0].duration));

      resolve(demoRun + ` | ` + soldierRun);
    } else {
      resolve(`(${utils.classSymbol(tf2Class)}) ` +
        `${mapObj.results[tf2Class][0].name} is rank ${position+1} with `
          + (exact === true ? mapObj.results[tf2Class][0].duration + `s` : utils.timePrettifier(mapObj.results[tf2Class][0].duration)) + ` on ${map}`
          + (zone !== `map` ? ` ${utils.classSymbol(zone)}${mapObj.zone_info.zoneindex} ` : ``));
    }
  });
}

module.export = parseTime;
