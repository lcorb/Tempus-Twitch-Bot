

/**
 * Formats server status into chat response.
 * @param {string} serverObj Server status response object.
 * @param {object} params Chat parameters.
 * @return {string} Chat response string.
 */
function parseServerStatus(serverObj, params) {
  const {ad} = require('../../../client/init');
  ad.parseServerStatus(serverObj);
  if (!params) {
    console.log(JSON.stringify(ad.servers, null, 2));
    const shorts = ad.servers.map((v) => Object.keys(v)).join(``);
    console.log(shorts);
    return `Available servers (!join): ${shorts.join(`, `)}`;
  }
}

module.exports = parseServerStatus;
