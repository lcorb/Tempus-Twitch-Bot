/**
 * Formats map vids into string.
 * @param {object} mapObj Map response object
 * @return {string} Return string of videos if any
 */
function parseTiers(mapObj) {
  const tiers = [];
  tiers.push(`(S) Tier ` + mapObj.tier_info['demoman']);
  tiers.push(`(D) Tier ` + mapObj.tier_info['soldier']);
  return tiers.join(` | `);
};

module.export = parseTiers;

