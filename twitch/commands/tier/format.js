/**
 * Formats map tiers into string.
 * @param {object} mapObj Map response object
 * @return {string} Return string of videos if any
 */
function parseTiers(mapObj) {
  const tiers = [];
  tiers.push(`(S) T` + mapObj.tier_info['soldier']);
  tiers.push(`(D) T` + mapObj.tier_info['demoman']);
  return tiers.join(` `);
};

module.exports = parseTiers;

