const parseAuthors = require(`../authors/format`);
const parseTiers = require(`../tier/format`);

/**
 * Formats map information into string.
 * @param {object} mapObj User who initiated command.
 * @param {boolean} full Used to determine if command should return full list of authors
 * @return {string} Return string of map information
 */
function parseMap(mapObj) {
  return new Promise(function(resolve, reject) {
    try {
      const authors = parseAuthors(mapObj);
      const tiers = parseTiers(mapObj);
      resolve(`${tiers} | Created by: ${authors}`);
    } catch (e) {
      reject(e);
    };
  });
};

module.exports = parseMap;
