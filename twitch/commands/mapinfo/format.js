const parseAuthors = require(`../authors/format`);
const parseTiers = require(`../tier/format`);

/**
 * Formats map information into string.
 * @param {object} mapObj Response map object
 * @return {string} Return string of map information
 */
function parseMap(mapObj) {
  return new Promise(function(resolve, reject) {
    try {
      const authors = parseAuthors(mapObj);
      const tiers = parseTiers(mapObj);
      const type = (mapObj.zone_counts.linear ? `Linear map ` + (mapObj.zone_counts.checkpoint ? `(${mapObj.zone_counts.checkpoint} checkpoint` +
      (mapObj.zone_counts.checkpoint > 1 ? `s)` : `)`) : ``): `${mapObj.zone_counts.course} courses`)
       + (mapObj.zone_counts.bonus ? ` with ${mapObj.zone_counts.bonus} bonus` + (mapObj.zone_counts.bonus > 1 ? `es` : ``) : ``);
      resolve(`${tiers} | Created by: ${authors} | ${type}`);
    } catch (e) {
      reject(e);
    };
  });
};

module.exports = parseMap;
