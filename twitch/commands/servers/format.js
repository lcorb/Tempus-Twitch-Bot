/**
 * Formats server status into chat response.
 * @param {object} params Chat parameters.
 * @return {string} Chat response string.
 */
function parseServerStatus(params) {
  // Load late because reasons
  const {ad} = require('../../../client/init');
  if (!params.length) {
    return `Available servers (!join <server>): ${ad.regions.join(`, `)}`;
  } else {
    try {
      return ad.format(params[0].toUpperCase());
    } catch (e) {
      return `Couldn't find that server.`;
    }
  }
}

module.exports = parseServerStatus;
