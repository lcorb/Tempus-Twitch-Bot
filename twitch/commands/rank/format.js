const utils = require(`../../../utils`);

/**
 * Formats authors into string.
 * @param {object} rankObj Rank response object.
 * @param {string} tf2Class Class identifier (both, solly, demo)
 * @return {string} Return string of authors
 */
async function parseRank(rankObj, tf2Class) {
  return new Promise(function(resolve, reject) {
    try {
      resolve(`${rankObj.players[0].name} is rank ${rankObj.players[0].rank}` +
      (tf2Class === `overall` ? ` overall` : (tf2Class === 3 ? ` as Soldier` : ` as Demoman`)) + ` with ${utils.formatPoints(rankObj.players[0].points)} points.`);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = parseRank;
