/**
 * Formats server status into chat response.
 * @param {string} serverObj Server status response object.
 * @param {object} params Chat parameters.
 * @return {string} Chat response string.
 */
function parseServerStatus(serverObj, params) {
  console.log(serverObj);
  const serverInfo = serverObj.map(() => {
    if (this.game_info) {
      return {
        name: this.server_info.name,
        region: this.server_info.shortname.replace(/[\D]/g, ''),
        connect: `${this.server_info.addr}${this.server_info.port}`,
        map: this.game_info.currentMap,
        maxPlayers: this.game_info.maxPlayers,
      };
    }
  }, this);
}

module.exports = parseServerStatus;
